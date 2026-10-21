/**
 * Commerce Zon Marketplace - Part 19 Validation Test Suite
 * Customer Support, Help Center, Ticketing & Customer Communication System
 */

import { supportTicketingService } from '../src/application/services/SupportTicketingService';

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

async function runSupportTicketingTests() {
  console.log('================================================================');
  console.log('COMMERCE ZON CUSTOMER SUPPORT & TICKETING - PART 19 VALIDATION');
  console.log('================================================================');

  // --- Test 1: Help Center Knowledge Base Search & Feedback ---
  console.log('\n--- Test 1: Help Center Knowledge Base Search & Feedback ---');
  const allArticles = supportTicketingService.searchArticles({});
  assert(allArticles.length > 0, `Knowledge base has seeded articles (count: ${allArticles.length})`);

  const returnArticles = supportTicketingService.searchArticles({ query: 'return' });
  assert(returnArticles.length > 0, 'Found articles matching query "return"');
  assert(
    returnArticles.some((a) => a.title.toLowerCase().includes('return') || a.tags.includes('returns')),
    'Returned relevant articles matching topic'
  );

  const targetArticle = allArticles[0];
  const initialHelpful = targetArticle.helpfulYes;
  const voted = supportTicketingService.voteArticleHelpful(targetArticle.articleId, true);
  assert(voted.helpfulYes === initialHelpful + 1, 'Helpful vote increments helpfulYes counter');

  // Admin Article Creation
  const newArticle = supportTicketingService.createArticle(
    {
      title: 'How to Track Global International Freight Shipments',
      category: 'SHIPPING_GUIDES',
      summary: 'Step-by-step instructions for tracking cross-border customs packages.',
      content: 'Detailed explanation of customs inspection, carrier handoff, and tracking portals.',
      tags: ['shipping', 'customs', 'international', 'tracking'],
      readTimeMinutes: 3,
      author: 'Commerce Zon Logistics Ops',
      relatedArticleIds: [],
    },
    'admin-root'
  );
  assert(newArticle.articleId.startsWith('KB-'), `Article created with identifier: ${newArticle.articleId}`);
  assert(newArticle.helpfulYes === 0, 'New article initialized with zero votes');

  // --- Test 2: Ticket Creation & SLA Due Date Calculation ---
  console.log('\n--- Test 2: Support Ticket Creation & SLA Calculation ---');
  const urgentTicket = await supportTicketingService.createTicket({
    userRole: 'BUYER',
    userId: 'buyer-cust-19',
    userName: 'Daniel Roberts',
    userEmail: 'daniel.r@example.com',
    category: 'PAYMENTS',
    priority: 'URGENT_CRITICAL',
    subject: 'Double charge on international checkout order #9910',
    description: 'My card was charged twice for the same cart items during high latency.',
    orderId: 'ORD-INT-9910',
  });

  assert(urgentTicket.ticketId.startsWith('TICK-2026-'), `Generated unique ticket ID: ${urgentTicket.ticketId}`);
  assert(urgentTicket.status === 'CREATED', 'Ticket initialized with status CREATED');
  assert(urgentTicket.priority === 'URGENT_CRITICAL', 'Priority preserved as URGENT_CRITICAL');
  assert(urgentTicket.department === 'Billing & Finance', 'Auto-routed to Billing & Finance department');

  const slaResponseTime = new Date(urgentTicket.slaFirstResponseDueDate).getTime();
  const nowTime = Date.now();
  const slaResponseHours = (slaResponseTime - nowTime) / 3600000;
  assert(slaResponseHours <= 1.1 && slaResponseHours >= 0.9, 'Urgent critical SLA first response set to 1 hour');

  // Validation: Missing fields rejection
  let missingFieldFailed = false;
  try {
    await supportTicketingService.createTicket({
      userRole: 'BUYER',
      userId: '',
      userName: '',
      userEmail: '',
      category: 'OTHER',
      subject: '',
      description: '',
    });
  } catch (err: any) {
    missingFieldFailed = true;
    assert(err.message.includes('required'), 'Rejects ticket submission with missing mandatory fields');
  }
  assert(missingFieldFailed, 'Mandatory fields validated on ticket submission');

  // --- Test 3: Internal Notes Isolation & Security ---
  console.log('\n--- Test 3: Private Internal Notes Isolation & Security ---');
  // Attempt to post internal note as Buyer -> MUST BE BLOCKED
  let buyerNoteBlocked = false;
  try {
    await supportTicketingService.addTicketMessage({
      ticketId: urgentTicket.ticketId,
      senderRole: 'BUYER',
      senderName: 'Daniel Roberts',
      senderId: 'buyer-cust-19',
      message: 'Attempting to inject internal note',
      isInternalNote: true, // Forbidden!
    });
  } catch (err: any) {
    buyerNoteBlocked = true;
    assert(err.message.includes('Security Violation'), 'Strictly blocks buyer from posting internal notes');
  }
  assert(buyerNoteBlocked, 'Buyer internal note attempt rejected');

  // Support Agent posts legitimate internal note
  const agentNote = await supportTicketingService.addTicketMessage({
    ticketId: urgentTicket.ticketId,
    senderRole: 'AGENT',
    senderName: 'Sarah Jenkins (Senior Tier 2)',
    senderId: 'agent-sarah-02',
    message: 'Confirmed with Stripe payment gateway logs: secondary transaction is an uncaptured authorization hold. Will void hold.',
    isInternalNote: true,
  });
  assert(agentNote.isInternalNote === true, 'Agent internal note flagged successfully');

  // Agent posts customer-facing reply
  const customerReply = await supportTicketingService.addTicketMessage({
    ticketId: urgentTicket.ticketId,
    senderRole: 'AGENT',
    senderName: 'Sarah Jenkins (Senior Tier 2)',
    senderId: 'agent-sarah-02',
    message: 'Hello Daniel, we reviewed your payment. The second charge was a temporary pre-authorization hold that has been voided. No funds left your account.',
    isInternalNote: false,
  });
  assert(customerReply.isInternalNote === false, 'Public message flagged as non-internal');

  // Sanitized view verification: Buyer MUST NOT see the internal note!
  const buyerView = supportTicketingService.getTicketForUser(urgentTicket.ticketId, 'buyer-cust-19', 'BUYER');
  assert(
    !buyerView.messages.some((m) => m.isInternalNote === true),
    'Buyer view completely filters out private internal staff notes'
  );
  assert(buyerView.internalNotesCount === 0, 'Internal notes count sanitized to 0 for customer');

  // Admin view: MUST see all messages including internal notes
  const adminView = supportTicketingService.getTicketForUser(urgentTicket.ticketId, 'admin-root', 'ADMIN');
  assert(
    adminView.messages.some((m) => m.isInternalNote === true),
    'Admin/Support staff view retains confidential internal notes'
  );

  // --- Test 4: Role-Based Ticket Isolation & Privacy ---
  console.log('\n--- Test 4: Role-Based Ticket Isolation & Privacy ---');
  let unauthorizedAccessBlocked = false;
  try {
    // Unrelated customer tries to read Daniel's ticket
    supportTicketingService.getTicketForUser(urgentTicket.ticketId, 'buyer-impostor-99', 'BUYER');
  } catch (err: any) {
    unauthorizedAccessBlocked = true;
    assert(err.message.includes('Forbidden'), 'Blocks unauthorized user from viewing private ticket');
  }
  assert(unauthorizedAccessBlocked, 'Customer ticket privacy verified');

  // Seller ticket creation
  const sellerTicket = await supportTicketingService.createTicket({
    userRole: 'SELLER',
    userId: 'merch-01',
    userName: 'TechGizmo Electronics Ltd',
    userEmail: 'support@techgizmo.com',
    category: 'SELLER_ISSUES',
    priority: 'HIGH',
    subject: 'Batch inventory CSV upload timeout error code 504',
    description: 'When uploading 2,000 SKUs via bulk inventory import, system timed out.',
  });
  assert(sellerTicket.userRole === 'SELLER', 'Created seller support ticket');

  const sellerTickets = supportTicketingService.getSellerTickets('merch-01');
  assert(sellerTickets.some((t) => t.ticketId === sellerTicket.ticketId), 'Seller can view their own tickets');

  const otherSellerTickets = supportTicketingService.getSellerTickets('merch-unrelated-88');
  assert(
    !otherSellerTickets.some((t) => t.ticketId === sellerTicket.ticketId),
    'Other sellers cannot see this seller ticket'
  );

  // --- Test 5: Status Transitions & Metrics ---
  console.log('\n--- Test 5: Status State Machine Transitions & SLA Metrics ---');
  // Assign Agent
  const assigned = await supportTicketingService.assignAgent(
    urgentTicket.ticketId,
    'agent-sarah-02',
    'Sarah Jenkins',
    'admin-root'
  );
  assert(assigned.status === 'ASSIGNED', 'Ticket moved to ASSIGNED status');
  assert(assigned.assignedAgentName === 'Sarah Jenkins', 'Agent assignment recorded');

  // Resolve Ticket
  const resolved = await supportTicketingService.updateTicketStatus(
    urgentTicket.ticketId,
    'RESOLVED',
    'agent-sarah-02',
    'Void confirmed with bank.'
  );
  assert(resolved.status === 'RESOLVED', 'Ticket status updated to RESOLVED');
  assert(resolved.resolutionDate !== undefined, 'Resolution date recorded on resolution');

  // Metrics Check
  const metrics = supportTicketingService.getMetrics();
  assert(metrics.totalTickets > 0, `Support metrics total tickets: ${metrics.totalTickets}`);
  assert(metrics.resolvedTickets > 0, `Support metrics resolved tickets: ${metrics.resolvedTickets}`);

  console.log('================================================================');
  console.log(`PART 19 TEST RESULTS: ${passedTests} PASSED, 0 FAILED`);
  console.log('================================================================');
}

runSupportTicketingTests().catch((err) => {
  console.error('[TEST SUITE CRASHED]', err);
  process.exit(1);
});
