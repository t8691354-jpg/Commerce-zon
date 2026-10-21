/**
 * Commerce Zon Marketplace - Part 18 Validation Test Suite
 * Returns, Refunds, Cancellations & After-Sales Service Engine
 */

import { afterSalesService } from '../src/application/services/AfterSalesService';
import { CategoryReturnPolicy, ReturnReason } from '../src/types/returns';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runReturnsAndRefundsTests() {
  console.log('================================================================');
  console.log('COMMERCE ZON RETURNS & AFTER-SALES ENGINE - PART 18 VALIDATION');
  console.log('================================================================');

  // --- Test 1: Category Policy Evaluation & Return Window ---
  console.log('\n--- Test 1: Category Return Policy & Window Check ---');
  const policy = afterSalesService.getCategoryPolicy('computing');
  assert(policy !== null, 'Returns policy for computing category is available');
  assert(policy.returnWindowDays > 0, `Computing policy return window is ${policy.returnWindowDays} days`);

  const recentDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const validCheck = afterSalesService.checkReturnEligibility({
    category: 'computing',
    purchaseDate: recentDate,
    itemPriceUSD: 249.99,
    orderStatus: 'DELIVERED',
  });
  assert(validCheck.isEligible === true, 'Recent purchase is eligible for return within window');
  assert(validCheck.daysRemaining > 0, `Days remaining is positive: ${validCheck.daysRemaining}`);

  const expiredDate = new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString();
  const expiredCheck = afterSalesService.checkReturnEligibility({
    category: 'computing',
    purchaseDate: expiredDate,
    itemPriceUSD: 249.99,
    orderStatus: 'DELIVERED',
  });
  assert(expiredCheck.isEligible === false, 'Expired purchase is strictly marked ineligible');
  assert(expiredCheck.reason !== undefined, 'Provides clear explanation for window expiration');

  // --- Test 2: Non-Returnable Goods Enforcement ---
  console.log('\n--- Test 2: Non-Returnable Product Category Guard ---');
  const nonReturnablePolicy: CategoryReturnPolicy = {
    category: 'Digital Software & Gift Cards',
    returnWindowDays: 0,
    isReturnable: false,
    requiresInspection: false,
    restockingFeePercent: 0,
    allowAutoApproval: false,
    autoApprovalMaxUSD: 0,
  };
  afterSalesService.updatePolicy(nonReturnablePolicy, 'admin-root');

  const digitalCheck = afterSalesService.checkReturnEligibility({
    category: 'Digital Software & Gift Cards',
    purchaseDate: recentDate,
    itemPriceUSD: 50.0,
    orderStatus: 'DELIVERED',
  });
  assert(digitalCheck.isEligible === false, 'Digital goods are rejected as non-returnable');
  assert(digitalCheck.reason?.includes('non-returnable') === true, 'Clear reason given for non-returnable goods');

  // --- Test 3: Buyer Return Request Submission (RMA) ---
  console.log('\n--- Test 3: Return Request Creation (RMA Generation) ---');
  const returnReq = await afterSalesService.submitReturnRequest({
    orderId: 'ORD-TEST-18-001',
    buyerId: 'buyer-test-18',
    buyerName: 'Samantha Green',
    buyerEmail: 'samantha.g@example.com',
    sellerId: 'merch-01',
    sellerName: 'TechGizmo Electronics Ltd',
    item: {
      sku: 'SKU-LOGI-MX3',
      name: 'Logitech MX Master 3S',
      category: 'computing',
      quantity: 1,
      unitPriceUSD: 99.99,
    },
    reason: 'DEFECTIVE',
    comments: 'Scroll wheel does not register clicks properly after 2 days.',
    proofImages: ['https://example.com/evidence/mouse-defect.jpg'],
    purchaseDate: recentDate,
  });

  assert(returnReq.returnId.startsWith('RMA-'), `Generated valid RMA number: ${returnReq.returnId}`);
  assert(returnReq.status === 'SELLER_REVIEW', 'Initial status set to SELLER_REVIEW');
  assert(returnReq.proofImages.length === 1, 'Proof evidence images preserved');
  assert(returnReq.buyerId === 'buyer-test-18', 'Buyer ID recorded correctly');

  // Duplicate submission prevention
  let dupFailed = false;
  try {
    await afterSalesService.submitReturnRequest({
      orderId: 'ORD-TEST-18-001',
      buyerId: 'buyer-test-18',
      buyerName: 'Samantha Green',
      buyerEmail: 'samantha.g@example.com',
      sellerId: 'merch-01',
      sellerName: 'TechGizmo Electronics Ltd',
      item: {
        sku: 'SKU-LOGI-MX3',
        name: 'Logitech MX Master 3S',
        category: 'computing',
        quantity: 1,
        unitPriceUSD: 99.99,
      },
      reason: 'DEFECTIVE',
      comments: 'Duplicate attempt',
      proofImages: [],
      purchaseDate: recentDate,
    });
  } catch (err: any) {
    dupFailed = true;
    assert(err.message.includes('Duplicate Return Request'), 'Rejects duplicate return request for same item');
  }
  assert(dupFailed, 'Duplicate return prevented');

  // --- Test 4: Seller Ownership Enforcement ---
  console.log('\n--- Test 4: Seller Ownership & Multi-Vendor Protection ---');
  let unauthorizedApproved = false;
  try {
    await afterSalesService.sellerApproveReturn({
      returnId: returnReq.returnId,
      sellerId: 'merch-unauthorized-99', // Different merchant
      returnAddress: 'Fake Street 123',
      instructions: 'Send here',
    });
    unauthorizedApproved = true;
  } catch (err: any) {
    assert(err.message.includes('Forbidden'), 'Rejects approval from unauthorized merchant');
  }
  assert(!unauthorizedApproved, 'Unauthorized merchant blocked from approving return');

  // --- Test 5: Seller Approval & Prepaid Return Label ---
  console.log('\n--- Test 5: Seller Approval & RMA Shipping Label Generation ---');
  const approved = await afterSalesService.sellerApproveReturn({
    returnId: returnReq.returnId,
    sellerId: 'merch-01',
    returnAddress: 'TechGizmo RMA Warehouse, 100 Innovation Blvd, Austin TX 78701',
    instructions: 'Ship in original bubble mailer with RMA label on the outside.',
    returnCarrier: 'FedEx Return Services',
  });
  assert(approved.status === 'APPROVED', 'Return status updated to APPROVED');
  assert(approved.shippingLabel !== undefined, 'Generated return shipping label record');
  assert(approved.shippingLabel?.trackingNumber.startsWith('RET-TRK-') === true, 'Generated return tracking number');
  assert(approved.shippingLabel?.carrier === 'FedEx Return Services', 'Return carrier matches requested provider');

  // --- Test 6: Warehouse Inspection & Inventory Restocking ---
  console.log('\n--- Test 6: Warehouse Inspection & Quality Assessment ---');
  const inspectionRes = await afterSalesService.recordWarehouseReceiptAndInspection({
    returnId: returnReq.returnId,
    inspectorId: 'INSP-QA-4',
    inspectorName: 'Marcus Vance (QA Lead)',
    condition: 'RESELLABLE_OPEN_BOX',
    packagingCondition: 'INTACT',
    notes: 'Item verified defective scroll wheel. Hardware defect confirmed, routed to refurbished depot.',
    inspectionResult: 'APPROVED_FOR_FULL_REFUND',
    restockingFeeUSD: 0,
  });

  assert(inspectionRes.returnRequest.status === 'QUALITY_INSPECTED', 'Status moved to QUALITY_INSPECTED');
  assert(inspectionRes.returnRequest.inspection?.inspectorName === 'Marcus Vance (QA Lead)', 'Inspector name logged');
  assert(inspectionRes.returnRequest.inspection?.productCondition === 'RESELLABLE_OPEN_BOX', 'Product condition recorded');
  assert(inspectionRes.inventoryRestored === true, 'Inventory restock flag confirmed');

  // --- Test 7: Safe Pre-Dispatch Cancellation & Restock ---
  console.log('\n--- Test 7: Pre-Dispatch Order Cancellation & Automatic Refund ---');
  const cancelResult = await afterSalesService.cancelOrder({
    orderId: 'ORD-TEST-CANCEL-001',
    orderNumber: 'CZ-ORD-2026-9901',
    customerId: 'buyer-test-18',
    customerName: 'Samantha Green',
    cancelledBy: 'BUYER',
    actorId: 'buyer-test-18',
    reason: 'Ordered by mistake',
    orderStatus: 'PROCESSING',
    orderTotalUSD: 149.5,
  });

  assert(cancelResult.status === 'COMPLETED', 'Cancellation status is COMPLETED');
  assert(cancelResult.inventoryRestored === true, 'Inventory reservation released back to catalog');
  assert(cancelResult.refundAmountUSD === 149.5, 'Full order value scheduled for refund');

  // Disallow cancellation of already shipped orders
  let shippedCancelFailed = false;
  try {
    await afterSalesService.cancelOrder({
      orderId: 'ORD-SHIPPED-001',
      orderNumber: 'CZ-ORD-2026-9902',
      customerId: 'buyer-test-18',
      customerName: 'Samantha Green',
      cancelledBy: 'BUYER',
      actorId: 'buyer-test-18',
      reason: 'No longer needed',
      orderStatus: 'SHIPPED', // Already shipped!
      orderTotalUSD: 200.0,
    });
  } catch (err: any) {
    shippedCancelFailed = true;
    assert(err.message.includes('cannot be cancelled'), 'Pre-dispatch rule: Shipped orders cannot be cancelled');
  }
  assert(shippedCancelFailed, 'Cancellation of shipped order safely blocked');

  // --- Test 8: Cumulative Refund Financial Safeguard ---
  console.log('\n--- Test 8: Cumulative Refund Ceiling Safeguard ---');
  const refund1 = await afterSalesService.executeRefund({
    orderId: 'ORD-CUMULATIVE-001',
    orderNumber: 'CZ-ORD-2026-5555',
    buyerId: 'buyer-01',
    sellerId: 'merch-01',
    amountUSD: 60.0,
    reason: 'Partial return item 1',
    refundMethod: 'ORIGINAL_PAYMENT',
    actorRole: 'ADMIN',
    actorId: 'admin-root',
  });
  assert(refund1.status === 'PROCESSED', 'First partial refund of $60 processed successfully');

  let ceilingBreached = false;
  try {
    // Attempting to refund $600 on an order whose value was recorded as lower
    await afterSalesService.executeRefund({
      orderId: 'ORD-CUMULATIVE-001',
      orderNumber: 'CZ-ORD-2026-5555',
      buyerId: 'buyer-01',
      sellerId: 'merch-01',
      amountUSD: 50000.0, // Absurdly large refund
      reason: 'Excessive refund attempt',
      refundMethod: 'ORIGINAL_PAYMENT',
      actorRole: 'ADMIN',
      actorId: 'admin-root',
    });
  } catch (err: any) {
    ceilingBreached = true;
    assert(err.message.includes('exceeds cumulative') || err.message.includes('Refund amount'), 'Financial safeguard prevents excessive refund');
  }
  assert(ceilingBreached, 'Excessive refund ceiling correctly enforced');

  // --- Test 9: Dispute Escalation ---
  console.log('\n--- Test 9: Dispute Escalation Workflow ---');
  const escalation = await afterSalesService.escalateToDispute(
    returnReq.returnId,
    'BUYER',
    'buyer-test-18',
    'Samantha Green',
    'Merchant not issuing timely refund after return receipt'
  );
  assert(escalation.returnRequest.status === 'ESCALATED', 'Return status flagged as ESCALATED');
  assert(
    escalation.disputeId.startsWith('DSP-') || escalation.disputeId.startsWith('DISP-'),
    `Created linked arbitration dispute ${escalation.disputeId}`
  );

  console.log('================================================================');
  console.log(`PART 18 TEST RESULTS: ${passedTests} PASSED, 0 FAILED`);
  console.log('================================================================');
}

runReturnsAndRefundsTests().catch((err) => {
  console.error('[TEST SUITE CRASHED]', err);
  process.exit(1);
});
