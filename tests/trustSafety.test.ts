/**
 * Trust, Safety, Fraud Prevention & Dispute Resolution Test Suite
 * Commerce Zon Marketplace - Part 15
 */

import { trustSafetyService } from '../src/application/services/TrustSafetyService.js';

async function runTestSuite() {
  console.log('================================================================');
  console.log('COMMERCE ZON TRUST, SAFETY & DISPUTES - PART 15 VALIDATION SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition: boolean, testName: string, extraInfo: string = '') {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`[FAIL] ${testName} - ${extraInfo}`);
      failedTests++;
    }
  }

  try {
    // -------------------------------------------------------------
    // 1. Dispute Lifecycle & Multi-Seller Isolation
    // -------------------------------------------------------------
    console.log('--- Test 1: Dispute Creation & Lifecycle ---');
    const newDispute = trustSafetyService.createDispute({
      orderId: 'ord-test-901',
      orderNumber: 'CZ-TEST-901',
      productId: 'prod-01',
      productTitle: 'AeroBook Pro M3 Max Workstation',
      buyerId: 'usr-buyer-test',
      buyerName: 'Jordan Buyer',
      buyerEmail: 'jordan@testcompany.org',
      sellerId: 'merch-01',
      sellerName: 'AeroTech Electronics Global',
      category: 'DAMAGED_OR_DEFECTIVE',
      claimedAmount: 2499.0,
      currency: 'USD',
      description: 'Display has hairline crack upon courier arrival.',
      desiredOutcome: 'REPLACEMENT',
      initialEvidence: {
        title: 'Damaged screen photo',
        type: 'PHOTO',
        notes: 'Cracked glass upper left corner',
      },
    });

    assert(Boolean(newDispute.id), `Dispute created with valid ID: ${newDispute.id}`);
    assert(newDispute.status === 'AWAITING_SELLER_RESPONSE', 'Initial dispute status is AWAITING_SELLER_RESPONSE');
    assert(newDispute.evidence.length === 1, 'Initial evidence is recorded on case');
    assert(newDispute.messages.length === 1, 'Initial claim description logged as first message');

    // Duplicate prevention
    console.log('\n--- Test 2: Dispute Duplicate Prevention ---');
    let duplicateCaught = false;
    try {
      trustSafetyService.createDispute({
        orderId: 'ord-test-901',
        orderNumber: 'CZ-TEST-901',
        productId: 'prod-01',
        productTitle: 'AeroBook Pro M3 Max Workstation',
        buyerId: 'usr-buyer-test',
        buyerName: 'Jordan Buyer',
        buyerEmail: 'jordan@testcompany.org',
        sellerId: 'merch-01',
        sellerName: 'AeroTech Electronics Global',
        category: 'DAMAGED_OR_DEFECTIVE',
        claimedAmount: 2499.0,
        currency: 'USD',
        description: 'Second claim on same item',
        desiredOutcome: 'FULL_REFUND',
      });
    } catch (e: any) {
      duplicateCaught = true;
    }
    assert(duplicateCaught, 'Prevents opening duplicate open disputes on same order item');

    // Message exchange & turn-taking
    console.log('\n--- Test 3: Dispute Communication Thread ---');
    const updatedWithSellerMsg = trustSafetyService.addMessage(newDispute.id, {
      senderRole: 'SELLER',
      senderName: 'AeroTech Support',
      content: 'We can ship a replacement immediately if you confirm serial number.',
    });
    assert(updatedWithSellerMsg.messages.length === 2, 'Seller message added to timeline');
    assert(
      updatedWithSellerMsg.status === 'AWAITING_BUYER_RESPONSE',
      'Status transitions to AWAITING_BUYER_RESPONSE after seller turn'
    );

    // Evidence submission
    console.log('\n--- Test 4: Evidence Vault Submission ---');
    const updatedWithEvidence = trustSafetyService.addEvidence(newDispute.id, {
      uploadedBy: 'SELLER',
      uploaderName: 'AeroTech Logistics',
      type: 'TRACKING_PROOF',
      title: 'FedEx Signed POD Receipt',
      referenceNumber: 'POD-884920',
      notes: 'Clean delivery signature recorded',
    });
    assert(updatedWithEvidence.evidence.length === 2, 'Seller tracking evidence stored in case vault');

    // Proposal & Settlement
    console.log('\n--- Test 5: Resolution Proposal & Settlement ---');
    const proposed = trustSafetyService.proposeResolution(
      newDispute.id,
      { role: 'SELLER', name: 'AeroTech Support' },
      {
        type: 'REPLACEMENT',
        amount: 0,
        explanation: 'Expediting replacement workstation unit under warranty.',
      }
    );
    assert(proposed.status === 'RESOLUTION_PROPOSED', 'Status becomes RESOLUTION_PROPOSED');
    assert(proposed.proposedResolution?.status === 'PENDING', 'Proposal state is PENDING');

    const accepted = trustSafetyService.acceptResolution(newDispute.id, 'usr-buyer-test', 'Jordan Buyer');
    assert(accepted.status === 'RESOLVED', 'Dispute transitions to RESOLVED upon acceptance');
    assert(Boolean(accepted.resolvedAt), 'Resolved timestamp is recorded');

    // Escalation & Platform Arbitration
    console.log('\n--- Test 6: Arbitration & Binding Judgments ---');
    const dispute2 = trustSafetyService.createDispute({
      orderId: 'ord-test-902',
      orderNumber: 'CZ-TEST-902',
      productId: 'prod-02',
      productTitle: 'Titan Sensor Hub',
      buyerId: 'usr-buyer-02',
      buyerName: 'Dr. Elena Rostova',
      buyerEmail: 'elena@lab.org',
      sellerId: 'merch-03',
      sellerName: 'Apex Industrial',
      category: 'ITEM_NOT_RECEIVED',
      claimedAmount: 649.5,
      currency: 'USD',
      description: 'Carrier delivered to wrong state.',
      desiredOutcome: 'FULL_REFUND',
    });

    const escalated = trustSafetyService.escalateToAdmin(
      dispute2.id,
      { role: 'BUYER', name: 'Dr. Elena Rostova' },
      'Seller refuses to respond within 48h SLA'
    );
    assert(escalated.status === 'ESCALATED', 'Case escalated to platform admin');
    assert(escalated.escalatedToAdmin, 'Flag escalatedToAdmin set to true');

    const arbitrated = trustSafetyService.arbitrateDispute(
      dispute2.id,
      'admin-sec-01',
      'Chief Arbitrator',
      'REFUND_BUYER_FULL',
      'Courier tracking confirms misdelivery to wrong postal code. 100% refund awarded.',
      649.5
    );
    assert(arbitrated.status === 'RESOLVED', 'Arbitrated case status is RESOLVED');
    assert(arbitrated.bindingDecision?.decision === 'REFUND_BUYER_FULL', 'Binding decision recorded');
    assert(arbitrated.bindingDecision?.arbitratorName === 'Chief Arbitrator', 'Arbitrator identity recorded');

    // -------------------------------------------------------------
    // 2. Customer and Seller Reporting
    // -------------------------------------------------------------
    console.log('\n--- Test 7: Marketplace Reports & Anti-Abuse Rate Limiting ---');
    const newReport = trustSafetyService.createReport({
      reporterId: 'usr-reporter-101',
      reporterName: 'Clara Oswald',
      reporterRole: 'BUYER',
      targetType: 'PRODUCT_LISTING',
      targetId: 'prod-scam-01',
      targetName: 'Suspicious 100TB USB Thumb Drive ($4.99)',
      category: 'MISLEADING_SPECIFICATION',
      severity: 'HIGH',
      description: 'Capacity is spoofed via hacked firmware controller.',
    });
    assert(Boolean(newReport.referenceNumber), `Report reference generated: ${newReport.referenceNumber}`);
    assert(newReport.status === 'SUBMITTED', 'Initial report status is SUBMITTED');

    // Duplicate report prevention
    let dupReportCaught = false;
    try {
      trustSafetyService.createReport({
        reporterId: 'usr-reporter-101',
        reporterName: 'Clara Oswald',
        reporterRole: 'BUYER',
        targetType: 'PRODUCT_LISTING',
        targetId: 'prod-scam-01',
        targetName: 'Suspicious 100TB USB Thumb Drive ($4.99)',
        category: 'MISLEADING_SPECIFICATION',
        severity: 'HIGH',
        description: 'Duplicate attempt to submit report',
      });
    } catch (e) {
      dupReportCaught = true;
    }
    assert(dupReportCaught, 'Duplicate report on same item and category prevented');

    // Admin Triage
    const triaged = trustSafetyService.triageReport(
      newReport.id,
      'admin-mod-01',
      'ACTION_TAKEN',
      'LISTING_REMOVED',
      'Verified hacked firmware controller memory spoof. Listing permanently delisted.'
    );
    assert(triaged.status === 'ACTION_TAKEN', 'Report status updated to ACTION_TAKEN');
    assert(triaged.actionTaken === 'LISTING_REMOVED', 'Action recorded as LISTING_REMOVED');

    // -------------------------------------------------------------
    // 3. AI Fraud Detection & Risk Scoring
    // -------------------------------------------------------------
    console.log('\n--- Test 8: Fraud Risk Engine Evaluation ---');
    // Normal transaction
    const lowRiskOrder = trustSafetyService.evaluateOrderRisk({
      orderId: 'ord-norm-01',
      orderAmount: 120.0,
      buyerId: 'usr-legit-01',
      buyerEmail: 'verified.buyer@company.com',
      shippingCountry: 'US',
      billingCountry: 'US',
      itemsCount: 2,
    });
    assert(lowRiskOrder.riskTier === 'LOW', `Normal order evaluated as LOW risk (${lowRiskOrder.riskScore}/100)`);
    assert(lowRiskOrder.automatedDecision === 'APPROVE', 'Decision is APPROVE');

    // High risk transaction
    const highRiskOrder = trustSafetyService.evaluateOrderRisk({
      orderId: 'ord-fraud-01',
      orderAmount: 4500.0,
      buyerId: 'usr-suspicious-01',
      buyerEmail: 'attacker@tempmail.com',
      shippingCountry: 'NG',
      billingCountry: 'BR',
      itemsCount: 22,
    });
    assert(
      highRiskOrder.riskTier === 'CRITICAL' || highRiskOrder.riskTier === 'HIGH',
      `Anomalous order scored high/critical (${highRiskOrder.riskScore}/100)`
    );
    assert(highRiskOrder.signals.length >= 3, `Multiple risk signals triggered (${highRiskOrder.signals.length} signals)`);

    // Override
    const overridden = trustSafetyService.overrideFraudDecision(
      highRiskOrder.id,
      'MANUALLY_BLOCKED',
      'Confirmed stolen credit card BIN attack'
    );
    assert(overridden.overrideDecision === 'MANUALLY_BLOCKED', 'Security admin override recorded');

    // -------------------------------------------------------------
    // 4. Listing Moderation & Seller Appeals
    // -------------------------------------------------------------
    console.log('\n--- Test 9: Anti-Counterfeit Moderation & Appeals ---');
    const flaggedListings = trustSafetyService.listModeratedListings();
    assert(flaggedListings.length > 0, `Moderation queue contains ${flaggedListings.length} listings`);

    const targetMod = flaggedListings[0];
    const appealSubmitted = trustSafetyService.submitSellerAppeal(
      targetMod.id,
      targetMod.sellerId,
      'We are an authorized OEM distributor with verified proof of authenticity.',
      ['https://example.com/docs/oem-license.pdf']
    );
    assert(appealSubmitted.status === 'UNDER_APPEAL', 'Listing status changes to UNDER_APPEAL');
    assert(appealSubmitted.appeal?.status === 'PENDING', 'Appeal status is PENDING');

    const appealReviewed = trustSafetyService.reviewAppeal(
      targetMod.id,
      'admin-ip-01',
      'APPROVED',
      'Distributor authorization certificate confirmed with brand owner.'
    );
    assert(appealReviewed.status === 'CLEARED', 'Listing cleared following approved appeal');

    // -------------------------------------------------------------
    // 5. Seller Trust & Reputation
    // -------------------------------------------------------------
    console.log('\n--- Test 10: Seller Trust Scores & Payout Holds ---');
    const rep = trustSafetyService.getSellerReputation('merch-01');
    assert(Boolean(rep), 'Seller reputation profile found for merch-01');
    assert(rep!.trustScore >= 80, `Merchant trust score is high (${rep!.trustScore}/100)`);

    const heldRep = trustSafetyService.togglePayoutHold('merch-01', true, 'Risk audit escrow hold');
    assert(heldRep.payoutHoldStatus === true, 'Merchant payout escrow successfully held');

    const releasedRep = trustSafetyService.togglePayoutHold('merch-01', false, 'Audit cleared');
    assert(releasedRep.payoutHoldStatus === false, 'Merchant payout escrow released');

    // -------------------------------------------------------------
    // 6. Platform Trust & Safety Metrics
    // -------------------------------------------------------------
    console.log('\n--- Test 11: Unified Trust & Safety KPIs ---');
    const metrics = trustSafetyService.getTrustSafetyMetrics();
    assert(metrics.totalActiveDisputes >= 0, `Total active disputes: ${metrics.totalActiveDisputes}`);
    assert(metrics.preventedFraudLossUsd > 0, `Prevented fraud loss tracked: $${metrics.preventedFraudLossUsd}`);
    assert(metrics.disputeRateMarketplacePct < 2.0, `Dispute rate healthy: ${metrics.disputeRateMarketplacePct}%`);

    console.log('\n================================================================');
    console.log(`TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
    console.log('================================================================\n');

    if (failedTests > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Unhandled test suite failure:', error);
    process.exit(1);
  }
}

runTestSuite();
