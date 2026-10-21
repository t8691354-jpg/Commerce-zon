/**
 * Commerce Zon Marketplace - Part 17 Validation Suite
 * Global Shipping, Logistics & Order Fulfillment Engine
 */

import {
  shippingFulfillmentService,
  ShippingFulfillmentService,
  DEFAULT_ADMIN_SHIPPING_CONFIG,
} from '../src/application/services/ShippingFulfillmentService';
import {
  VALID_STATUS_TRANSITIONS,
  FulfillmentStatus,
} from '../src/types/shippingFulfillment';
import { CarrierRegistry } from '../src/domain/logistics/CarrierProviderFramework';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('COMMERCE ZON GLOBAL SHIPPING & FULFILLMENT - PART 17 VALIDATION');
  console.log('================================================================');

  const service = new ShippingFulfillmentService();

  // -------------------------------------------------------------
  // Test 1: Shipping Rate Calculations (Domestic & Weight-Based)
  // -------------------------------------------------------------
  console.log('\n--- Test 1: Shipping Rate Calculations ---');
  const domesticQuotes = service.calculateShippingQuotes({
    originCountry: 'US',
    destinationCountry: 'US',
    totalWeightKg: 2.0,
    subtotalUSD: 45.0, // under free shipping threshold ($99)
    isPrime: false,
  });

  assert(domesticQuotes.isSupportedDestination === true, 'Domestic destination (US) is supported');
  assert(domesticQuotes.quotes.length >= 2, 'Returns Standard, Express, and Local Delivery quotes');

  const standardQuote = domesticQuotes.quotes.find((q) => q.method === 'STANDARD');
  assert(standardQuote !== undefined, 'Standard shipping method quote is present');
  // Domestic flat ($4.99) + weight (2 * 1.50) = 7.99
  assert(standardQuote?.costUSD === 7.99, `Calculates standard rate correctly: expected $7.99, got $${standardQuote?.costUSD}`);
  assert(standardQuote?.isFree === false, 'Standard shipping is not free when below threshold');

  // Prime or threshold qualifier
  const freeQuotes = service.calculateShippingQuotes({
    originCountry: 'US',
    destinationCountry: 'US',
    totalWeightKg: 5.0,
    subtotalUSD: 120.0, // >= $99 threshold
    isPrime: false,
  });
  const freeStandard = freeQuotes.quotes.find((q) => q.method === 'STANDARD');
  assert(freeStandard?.costUSD === 0 && freeStandard?.isFree === true, 'Free shipping granted when order subtotal exceeds threshold ($99)');

  // -------------------------------------------------------------
  // Test 2: Unsupported Destination Handling
  // -------------------------------------------------------------
  console.log('\n--- Test 2: Unsupported Destination Validation ---');
  const unsupportedQuotes = service.calculateShippingQuotes({
    originCountry: 'US',
    destinationCountry: 'XX', // invalid / unsupported ISO code
    totalWeightKg: 1.0,
    subtotalUSD: 50.0,
  });
  assert(unsupportedQuotes.isSupportedDestination === false, 'Detects unsupported destination country (XX)');
  assert(unsupportedQuotes.quotes.length === 0, 'Does not emit fake quotes for unsupported countries');
  assert(typeof unsupportedQuotes.unsupportedReason === 'string' && unsupportedQuotes.unsupportedReason.includes('XX'), 'Provides clear explanatory unsupported reason');

  // -------------------------------------------------------------
  // Test 3: Missing Product Shipping Information Fallback
  // -------------------------------------------------------------
  console.log('\n--- Test 3: Missing Product Shipping Information Fallback ---');
  // Pass 0 or undefined weight; service must fall back safely without NaN
  const fallbackWeightQuote = service.calculateShippingQuotes({
    destinationCountry: 'US',
    totalWeightKg: 0,
    subtotalUSD: 20.0,
  });
  assert(fallbackWeightQuote.isSupportedDestination === true, 'Handles zero weight safely');
  const fallbackStandard = fallbackWeightQuote.quotes.find((q) => q.method === 'STANDARD');
  assert(fallbackStandard !== undefined && !isNaN(fallbackStandard.costUSD) && fallbackStandard.costUSD > 0, 'Falls back to minimal baseline weight charge without NaN');

  // -------------------------------------------------------------
  // Test 4: Seller Ownership & Multi-Seller Fulfillment Isolation
  // -------------------------------------------------------------
  console.log('\n--- Test 4: Seller Ownership & Multi-Seller Fulfillment Separation ---');
  let multiSellerErrorCaught = false;
  try {
    await service.createShipment({
      sellerId: 'merch-01',
      sellerName: 'Titan Robotics USA',
      orderId: 'ord-multi-101',
      orderNumber: 'CZ-ORD-MULTI-101',
      buyerId: 'buyer-01',
      buyerName: 'Jane Doe',
      carrierName: 'FedEx Priority Global',
      shippingMethod: 'STANDARD',
      originAddress: {
        fullName: 'Titan Robotics',
        streetLine1: '850 Tech Park',
        city: 'Newark',
        stateOrProvince: 'NJ',
        postalCode: '07102',
        countryCode: 'US',
      },
      destinationAddress: {
        fullName: 'Jane Doe',
        streetLine1: '123 Main St',
        city: 'Austin',
        stateOrProvince: 'TX',
        postalCode: '78701',
        countryCode: 'US',
      },
      items: [
        {
          sku: 'TITAN-X',
          name: 'Titan Pro Arm',
          quantity: 1,
          unitPriceUSD: 200,
          unitWeightKg: 1.5,
          sellerId: 'merch-01', // authorized
        },
        {
          sku: 'COMPETITOR-GEAR',
          name: 'Competitor Drone',
          quantity: 1,
          unitPriceUSD: 150,
          unitWeightKg: 1.0,
          sellerId: 'merch-02', // unauthorized merchant violation
        },
      ],
    });
  } catch (err: any) {
    multiSellerErrorCaught = true;
    assert(err.message.includes('Multi-seller isolation violation'), 'Rejects shipment creation containing items of another merchant');
  }
  assert(multiSellerErrorCaught, 'Enforces multi-seller fulfillment separation strictly');

  // -------------------------------------------------------------
  // Test 5: Successful Valid Shipment Creation
  // -------------------------------------------------------------
  console.log('\n--- Test 5: Valid Shipment Creation & Identification ---');
  const validShipment = await service.createShipment({
    sellerId: 'merch-01',
    sellerName: 'Titan Robotics USA',
    orderId: 'ord-test-202',
    orderNumber: 'CZ-ORD-2026-202',
    buyerId: 'buyer-02',
    buyerName: 'Alice Cooper',
    carrierName: 'FedEx Priority Global',
    trackingNumber: '794918239012',
    shippingMethod: 'EXPRESS',
    originAddress: {
      fullName: 'Titan Warehouse',
      streetLine1: '850 Tech Way',
      city: 'Newark',
      stateOrProvince: 'NJ',
      postalCode: '07102',
      countryCode: 'US',
    },
    destinationAddress: {
      fullName: 'Alice Cooper',
      streetLine1: '400 Congress Ave',
      city: 'Austin',
      stateOrProvince: 'TX',
      postalCode: '78701',
      countryCode: 'US',
    },
    items: [
      {
        sku: 'TITAN-KIT-01',
        name: 'Robotics Micro Sensor Kit',
        quantity: 2,
        unitPriceUSD: 79.99,
        unitWeightKg: 0.8,
        sellerId: 'merch-01',
      },
    ],
  });

  assert(validShipment.shipmentId.startsWith('SHP-2026-'), 'Generated unique shipment identifier (SHP-2026-XXXX)');
  assert(validShipment.status === 'PROCESSING', 'Initial shipment status is PROCESSING');
  assert(validShipment.trackingNumber === '794918239012', 'Preserves provided carrier tracking number');
  assert(typeof validShipment.trackingUrl === 'string' && validShipment.trackingUrl.includes('794918239012'), 'Generates verified courier tracking link for FedEx');
  assert(validShipment.statusHistory.length === 1, 'Records initial PROCESSING event in tracking event history');

  // -------------------------------------------------------------
  // Test 6: Duplicate Shipment Creation Prevention
  // -------------------------------------------------------------
  console.log('\n--- Test 6: Duplicate Shipment Prevention ---');
  let duplicateCaught = false;
  try {
    await service.createShipment({
      sellerId: 'merch-01',
      sellerName: 'Titan Robotics USA',
      orderId: 'ord-test-202',
      orderNumber: 'CZ-ORD-2026-202',
      buyerId: 'buyer-02',
      buyerName: 'Alice Cooper',
      carrierName: 'FedEx Priority Global',
      items: [
        {
          sku: 'TITAN-KIT-01',
          name: 'Robotics Micro Sensor Kit',
          quantity: 2,
          unitPriceUSD: 79.99,
          unitWeightKg: 0.8,
          sellerId: 'merch-01',
        },
      ],
      originAddress: validShipment.originAddress,
      destinationAddress: validShipment.destinationAddress,
    });
  } catch (err: any) {
    duplicateCaught = true;
    assert(err.message.includes('Duplicate shipment prevention'), 'Throws duplicate shipment prevention error');
  }
  assert(duplicateCaught, 'Blocks duplicate shipment for identical order and item SKUs');

  // -------------------------------------------------------------
  // Test 7: Valid & Invalid Shipment Status Transitions (State Machine)
  // -------------------------------------------------------------
  console.log('\n--- Test 7: Shipment Status State Machine Transitions ---');
  // Transition PROCESSING -> PACKED
  const packed = await service.updateShipmentStatus({
    shipmentId: validShipment.id,
    actor: { id: 'merch-01', role: 'SELLER' },
    newStatus: 'PACKED',
    description: 'Item enclosed in padded protective packaging',
  });
  assert(packed.status === 'PACKED', 'Advances validly from PROCESSING to PACKED');

  // Transition PACKED -> READY_FOR_DISPATCH
  const ready = await service.updateShipmentStatus({
    shipmentId: validShipment.id,
    actor: { id: 'merch-01', role: 'SELLER' },
    newStatus: 'READY_FOR_DISPATCH',
  });
  assert(ready.status === 'READY_FOR_DISPATCH', 'Advances validly to READY_FOR_DISPATCH');

  // Invalid transition: Try jumping directly from READY_FOR_DISPATCH to DELIVERED as Seller
  let invalidJumpCaught = false;
  try {
    await service.updateShipmentStatus({
      shipmentId: validShipment.id,
      actor: { id: 'merch-01', role: 'SELLER' },
      newStatus: 'DELIVERED',
    });
  } catch (err: any) {
    invalidJumpCaught = true;
    assert(err.message.includes('Permission Denied') || err.message.includes('Invalid Status Transition'), 'Prevents seller from falsely marking package DELIVERED');
  }
  assert(invalidJumpCaught, 'State machine strictly blocks unauthorized delivery jumps');

  // Advance READY_FOR_DISPATCH -> SHIPPED
  const shipped = await service.updateShipmentStatus({
    shipmentId: validShipment.id,
    actor: { id: 'merch-01', role: 'SELLER' },
    newStatus: 'SHIPPED',
    description: 'Courier picked up package at loading dock',
  });
  assert(shipped.status === 'SHIPPED', 'Advances validly to SHIPPED');
  assert(typeof shipped.dispatchedAt === 'string', 'Records dispatchedAt timestamp');

  // Carrier or Admin advances SHIPPED -> IN_TRANSIT -> OUT_FOR_DELIVERY -> DELIVERED
  await service.updateShipmentStatus({
    shipmentId: validShipment.id,
    actor: { id: 'carrier-fedex', role: 'CARRIER' },
    newStatus: 'IN_TRANSIT',
    location: 'Memphis Sorting Center',
  });

  await service.updateShipmentStatus({
    shipmentId: validShipment.id,
    actor: { id: 'carrier-fedex', role: 'CARRIER' },
    newStatus: 'OUT_FOR_DELIVERY',
    location: 'Austin Local Depot',
  });

  const delivered = await service.updateShipmentStatus({
    shipmentId: validShipment.id,
    actor: { id: 'carrier-fedex', role: 'CARRIER' },
    newStatus: 'DELIVERED',
    location: 'Austin, TX',
    description: 'Package handed to recipient with signature confirmation',
  });
  assert(delivered.status === 'DELIVERED', 'Carrier confirms final DELIVERED stage');
  assert(typeof delivered.deliveredAt === 'string', 'Records deliveredAt timestamp');

  // -------------------------------------------------------------
  // Test 8: Tracking Event History Integrity
  // -------------------------------------------------------------
  console.log('\n--- Test 8: Tracking Event History Recording ---');
  assert(delivered.statusHistory.length >= 5, `Complete tracking history preserved: ${delivered.statusHistory.length} events logged`);
  const stages = delivered.statusHistory.map((e) => e.stage);
  assert(stages.includes('PROCESSING') && stages.includes('PACKED') && stages.includes('SHIPPED') && stages.includes('DELIVERED'), 'All lifecycle milestones exist in statusHistory');
  assert(delivered.statusHistory.every((e) => e.timestamp && e.stage && e.actorRole), 'Every event contains immutable timestamp, stage, and actor role');

  // -------------------------------------------------------------
  // Test 9: Buyer Tracking Access & Querying
  // -------------------------------------------------------------
  console.log('\n--- Test 9: Buyer Tracking Access ---');
  const buyerShipments = service.getBuyerShipments('ord-test-202');
  assert(buyerShipments.length === 1, 'Buyer can retrieve shipments by orderId');
  assert(buyerShipments[0].trackingNumber === '794918239012', 'Shipment tracking number matches order');

  // Unauthorized actor (Buyer role) cannot alter status
  let buyerTamperCaught = false;
  try {
    await service.updateShipmentStatus({
      shipmentId: validShipment.id,
      actor: { id: 'buyer-02', role: 'BUYER' },
      newStatus: 'CANCELLED',
    });
  } catch (err: any) {
    buyerTamperCaught = true;
    assert(err.message.includes('Buyers cannot modify'), 'Blocks buyers from tampering with fulfillment records');
  }
  assert(buyerTamperCaught, 'Buyer role write permission check succeeds');

  // -------------------------------------------------------------
  // Test 10: Official Warehouse Packing Slip Generation (Requirement 8)
  // -------------------------------------------------------------
  console.log('\n--- Test 10: Warehouse Packing Slip Generation & Disclaimer ---');
  const packingSlip = service.generatePackingSlip(validShipment.id, 'merch-01');
  assert(packingSlip.packingSlipNumber.startsWith('PKSLP-'), 'Generated packing slip identifier PKSLP-XXXX');
  assert(packingSlip.items.length === 1 && packingSlip.totalItems === 2, 'Packing slip contains exact line item checklist');
  assert(packingSlip.isOfficialCarrierLabel === false, 'Strictly flags isOfficialCarrierLabel as false');
  assert(packingSlip.disclaimer.includes('NOT A PREPAID POSTAGE CARRIER SHIPPING LABEL'), 'Displays prominent disclaimer distinguishing packing slip from prepaid postage carrier label');

  // Another merchant cannot access this merchant packing slip
  let crossMerchantPackingSlipCaught = false;
  try {
    service.generatePackingSlip(validShipment.id, 'unauthorized-merchant-99');
  } catch (err: any) {
    crossMerchantPackingSlipCaught = true;
    assert(err.message.includes('Forbidden'), 'Blocks unauthorized merchant from reading packing slip');
  }
  assert(crossMerchantPackingSlipCaught, 'Packing slip privacy enforced across merchants');

  // -------------------------------------------------------------
  // Test 11: Unavailable & Configured Carrier Registry
  // -------------------------------------------------------------
  console.log('\n--- Test 11: Carrier Provider Registry & Unknown Courier Handling ---');
  const fedexProvider = CarrierRegistry.getCarrier('FEDEX');
  assert(fedexProvider !== null && fedexProvider.metadata.carrierCode === 'FEDEX', 'Resolves registered FedEx provider');
  assert(fedexProvider?.validateTrackingNumber('794918239012') === true, 'Validates valid carrier tracking number format');
  assert(fedexProvider?.validateTrackingNumber('12') === false, 'Rejects malformed short tracking numbers');

  const unknownProvider = CarrierRegistry.getCarrier('Custom Acme Van Fleet');
  assert(unknownProvider !== null, 'Falls back to standard safe provider for custom couriers without crashing');
  assert(unknownProvider?.metadata.requiresManualDispatch === true, 'Flags custom courier as requiring manual dispatch');

  // -------------------------------------------------------------
  // Test 12: Admin Logistics Configuration & Override Interventions
  // -------------------------------------------------------------
  console.log('\n--- Test 12: Admin Permissions & Rates Configuration Updates ---');
  const initialConfig = service.getAdminConfig();
  assert(initialConfig.freeShippingThresholdUSD === 99.0, 'Initial free shipping threshold is $99');

  const updatedConfig = service.updateAdminConfig(
    {
      freeShippingThresholdUSD: 75.0,
      domesticFlatRateUSD: 5.49,
    },
    'admin-root'
  );
  assert(updatedConfig.freeShippingThresholdUSD === 75.0, 'Admin can update free shipping threshold');
  assert(updatedConfig.domesticFlatRateUSD === 5.49, 'Admin can adjust domestic flat rates');

  // Admin status override (Admin has permission to intervene or reactivate)
  const adminIntervention = await service.updateShipmentStatus({
    shipmentId: validShipment.id,
    actor: { id: 'admin-root', role: 'ADMIN' },
    newStatus: 'DELAYED',
    description: 'Admin recorded weather delay across Midwest hub',
    exceptionReason: 'Blizzard warning impacting flights',
  });
  assert(adminIntervention.status === 'DELAYED', 'Administrator successfully intervenes on shipment status');
  assert(adminIntervention.exceptionReason === 'Blizzard warning impacting flights', 'Records exception reason for buyer and customer support');

  console.log('\n================================================================');
  console.log(`PART 17 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
