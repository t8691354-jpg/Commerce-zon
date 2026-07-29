import { 
  NotificationRole, 
  NotificationChannel, 
  NotificationItem, 
  NotificationTemplate, 
  Campaign, 
  ChannelControlConfig, 
  UserNotificationPreference,
  QueueStatusMetrics,
  AISendOptimizer
} from '../types/notifications';

export const ROLE_CATEGORIES: Record<NotificationRole, string[]> = {
  Buyer: [
    'Account Created',
    'Login Alert',
    'New Order',
    'Payment Successful',
    'Payment Failed',
    'Shipment Created',
    'Order Shipped',
    'Out for Delivery',
    'Delivered',
    'Refund Approved',
    'Refund Completed',
    'Return Approved',
    'Exchange Approved',
    'Wallet Updated',
    'Coupon Received',
    'Wishlist Price Drop'
  ],
  Seller: [
    'New Order',
    'Product Approved',
    'Product Rejected',
    'Low Inventory',
    'Out of Stock',
    'Wallet Credited',
    'Settlement Completed',
    'Subscription Renewal',
    'Subscription Expired',
    'Return Request',
    'Refund Request',
    'Performance Warning'
  ],
  Affiliate: [
    'Commission Earned',
    'Commission Approved',
    'Withdrawal Approved',
    'Withdrawal Rejected',
    'Bonus Earned',
    'Campaign Performance',
    'Referral Registered'
  ],
  Supplier: [
    'New Purchase Order',
    'Inventory Update Required',
    'Shipment Required',
    'Payment Sent',
    'Return Received'
  ],
  Warehouse: [
    'Inventory Received',
    'Picking Started',
    'Packing Required',
    'Shipment Ready',
    'Inventory Low'
  ],
  DeliveryPartner: [
    'Delivery Assigned',
    'Route Updated',
    'Delivery Completed',
    'Delivery Failed',
    'Return Pickup Assigned'
  ],
  Administrator: [
    'Security Alert',
    'Fraud Detection',
    'Payment Failure',
    'System Error',
    'High Server Load',
    'Database Backup Completed',
    'Failed Backup',
    'New Seller Registration',
    'New Supplier Registration'
  ]
};

export const INITIAL_CHANNELS: ChannelControlConfig[] = [
  {
    id: 'in_app',
    name: 'In-App Notifications',
    enabled: true,
    provider: 'Internal WebSocket Engine',
    dailyLimit: 500000,
    dailySentToday: 184200,
    throughputPerSec: 2500,
    retryMaxCount: 3,
    backoffDelayMs: 1000,
    status: 'operational'
  },
  {
    id: 'email',
    name: 'Email Notifications',
    enabled: true,
    provider: 'AWS SES Enterprise (Dedicated IP)',
    dailyLimit: 1000000,
    dailySentToday: 412500,
    throughputPerSec: 1200,
    retryMaxCount: 5,
    backoffDelayMs: 2000,
    status: 'operational'
  },
  {
    id: 'sms',
    name: 'SMS Notifications',
    enabled: true,
    provider: 'Twilio High-Volume Messaging Service',
    dailyLimit: 250000,
    dailySentToday: 89300,
    throughputPerSec: 400,
    retryMaxCount: 3,
    backoffDelayMs: 5000,
    status: 'operational'
  },
  {
    id: 'push_android',
    name: 'Push (Android FCM)',
    enabled: true,
    provider: 'Google Firebase Cloud Messaging (FCM v1)',
    dailyLimit: 2000000,
    dailySentToday: 680400,
    throughputPerSec: 5000,
    retryMaxCount: 3,
    backoffDelayMs: 1500,
    status: 'operational'
  },
  {
    id: 'push_ios',
    name: 'Push (iOS APNs)',
    enabled: true,
    provider: 'Apple Push Notification service (APNs HTTP/2)',
    dailyLimit: 2000000,
    dailySentToday: 590100,
    throughputPerSec: 4500,
    retryMaxCount: 3,
    backoffDelayMs: 1500,
    status: 'operational'
  },
  {
    id: 'push_web',
    name: 'Browser Push',
    enabled: true,
    provider: 'WebPush Standard / VAPID Keys Protocol',
    dailyLimit: 500000,
    dailySentToday: 124000,
    throughputPerSec: 1500,
    retryMaxCount: 2,
    backoffDelayMs: 2000,
    status: 'operational'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    enabled: true,
    provider: 'Meta WhatsApp Business Cloud API',
    dailyLimit: 100000,
    dailySentToday: 32100,
    throughputPerSec: 150,
    retryMaxCount: 4,
    backoffDelayMs: 3000,
    status: 'operational'
  },
  {
    id: 'telegram',
    name: 'Telegram Bot API',
    enabled: false,
    provider: 'Telegram Bot Platform Gateway',
    dailyLimit: 50000,
    dailySentToday: 0,
    throughputPerSec: 100,
    retryMaxCount: 3,
    backoffDelayMs: 2000,
    status: 'disabled'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NTF-9021',
    recipientId: 'USR-8821',
    recipientName: 'Alexander Wright',
    recipientEmail: 'alex.wright@example.com',
    recipientPhone: '+1 (555) 234-5678',
    role: 'Buyer',
    category: 'Out for Delivery',
    channel: 'sms',
    title: 'Package Out for Delivery',
    body: 'Your Amazon order #AMZ-99201 is out for delivery with driver Carlos M. Track live in app.',
    status: 'delivered',
    priority: 'high',
    timestamp: '2026-07-28 09:14:02',
    deliveredAt: '2026-07-28 09:14:04',
    readAt: '2026-07-28 09:16:30',
    clickedAt: '2026-07-28 09:16:35',
    read: true,
    clicked: true,
    retryAttempts: 0,
    maxRetries: 3,
    metadata: { orderId: 'AMZ-99201', carrier: 'Amazon Logistics', trackingNo: 'TBA9821039821' }
  },
  {
    id: 'NTF-9022',
    recipientId: 'SEL-4029',
    recipientName: 'Apex Audio Ltd (John Sterling)',
    recipientEmail: 'support@apexaudio.com',
    recipientPhone: '+1 (555) 987-1234',
    role: 'Seller',
    category: 'New Order',
    channel: 'email',
    title: 'New High-Value Order Received (#ORD-88319)',
    body: 'You received a new order for 5x Studio Monitor Speakers total value $1,249.50. Prepare for fulfillment.',
    status: 'delivered',
    priority: 'high',
    timestamp: '2026-07-28 08:45:10',
    deliveredAt: '2026-07-28 08:45:12',
    readAt: '2026-07-28 08:50:00',
    clicked: false,
    read: true,
    retryAttempts: 0,
    maxRetries: 5,
    metadata: { orderId: 'ORD-88319', itemCount: 5, totalAmount: 1249.50 }
  },
  {
    id: 'NTF-9023',
    recipientId: 'ADM-0001',
    recipientName: 'Security Ops Team',
    recipientEmail: 'sec-ops@marketplace-admin.com',
    role: 'Administrator',
    category: 'Security Alert',
    channel: 'push_web',
    title: 'CRITICAL: Multiple Failed Login Attempts',
    body: 'IP 185.220.101.5 attempted 45 rapid invalid logins on account seller_prime_99. Rate limit applied.',
    status: 'delivered',
    priority: 'critical',
    timestamp: '2026-07-28 08:30:00',
    deliveredAt: '2026-07-28 08:30:01',
    readAt: '2026-07-28 08:31:12',
    clickedAt: '2026-07-28 08:31:15',
    read: true,
    clicked: true,
    retryAttempts: 0,
    maxRetries: 3
  },
  {
    id: 'NTF-9024',
    recipientId: 'AFF-3310',
    recipientName: 'TechReviews Daily (Samantha Chen)',
    recipientEmail: 'sam@techreviewsdaily.com',
    role: 'Affiliate',
    category: 'Commission Earned',
    channel: 'in_app',
    title: 'Commission Credited: $142.80',
    body: 'Congratulations! Your referral link generated $1,785.00 sales for Electronics Prime Event.',
    status: 'delivered',
    priority: 'normal',
    timestamp: '2026-07-28 07:12:45',
    deliveredAt: '2026-07-28 07:12:45',
    readAt: '2026-07-28 07:30:00',
    clicked: false,
    read: true,
    retryAttempts: 0,
    maxRetries: 3
  },
  {
    id: 'NTF-9025',
    recipientId: 'DLV-1092',
    recipientName: 'Carlos Mendoza (Driver #440)',
    recipientEmail: 'carlos.m@courier-fleet.com',
    recipientPhone: '+1 (555) 441-2091',
    role: 'DeliveryPartner',
    category: 'Delivery Assigned',
    channel: 'push_android',
    title: 'New Route Dispatch: 24 Stops Assigned',
    body: 'Route #R-402 in Seattle Downtown is ready for pickup at Hub SEA-1. Estimated total time 4h 15m.',
    status: 'delivered',
    priority: 'high',
    timestamp: '2026-07-28 06:45:00',
    deliveredAt: '2026-07-28 06:45:02',
    readAt: '2026-07-28 06:46:10',
    clickedAt: '2026-07-28 06:46:12',
    read: true,
    clicked: true,
    retryAttempts: 0,
    maxRetries: 3
  },
  {
    id: 'NTF-9026',
    recipientId: 'WRH-0021',
    recipientName: 'FBA Fulfillment Center ONT8 Staff',
    recipientEmail: 'ont8-picking@fulfillment.com',
    role: 'Warehouse',
    category: 'Packing Required',
    channel: 'in_app',
    title: 'Priority Same-Day Batch Pick Alert',
    body: '35 Urgent orders in Aisle B-14 require picking before 10:00 AM cutoff.',
    status: 'delivered',
    priority: 'high',
    timestamp: '2026-07-28 06:30:00',
    deliveredAt: '2026-07-28 06:30:00',
    readAt: '2026-07-28 06:31:00',
    clicked: false,
    read: true,
    retryAttempts: 0,
    maxRetries: 3
  },
  {
    id: 'NTF-9027',
    recipientId: 'SUP-5501',
    recipientName: 'Shenzhen Microchip Electronics',
    recipientEmail: 'orders@szmicrochip.cn',
    role: 'Supplier',
    category: 'New Purchase Order',
    channel: 'email',
    title: 'PO #PO-9812 Issued by Marketplace Direct',
    body: 'Purchase Order PO-9812 for 10,000 units Type-C Controllers ($45,000) confirmed. Delivery requested by Aug 15.',
    status: 'delivered',
    priority: 'normal',
    timestamp: '2026-07-27 23:10:11',
    deliveredAt: '2026-07-27 23:10:15',
    readAt: '2026-07-28 02:00:10',
    clicked: false,
    read: true,
    retryAttempts: 0,
    maxRetries: 5
  },
  {
    id: 'NTF-9028',
    recipientId: 'USR-3190',
    recipientName: 'Emily Davis',
    recipientEmail: 'emily.davis@example.com',
    recipientPhone: '+1 (555) 776-3200',
    role: 'Buyer',
    category: 'Payment Failed',
    channel: 'email',
    title: 'Payment Action Required for Order #AMZ-77102',
    body: 'Your card ending in 4092 was declined by your bank. Please update payment method to avoid order cancellation.',
    status: 'failed',
    priority: 'critical',
    timestamp: '2026-07-27 21:05:00',
    retryAttempts: 3,
    maxRetries: 3,
    errorLog: 'AWS SES SMTP Error 554 5.2.0: Recipient mailbox quota exceeded / Temporarily unreachable.',
    read: false,
    clicked: false
  },
  {
    id: 'NTF-9029',
    recipientId: 'SEL-8812',
    recipientName: 'Nordic Home Goods',
    recipientEmail: 'contact@nordichome.com',
    role: 'Seller',
    category: 'Low Inventory',
    channel: 'whatsapp',
    title: 'Inventory Alert: Bamboo Ergonomic Pillow',
    body: 'Stock alert: Bamboo Ergonomic Pillow has reached 12 units remaining in FBA Warehouse LGB3. Replenish now.',
    status: 'delivered',
    priority: 'high',
    timestamp: '2026-07-27 20:15:30',
    deliveredAt: '2026-07-27 20:15:33',
    readAt: '2026-07-27 20:20:00',
    clickedAt: '2026-07-27 20:20:05',
    read: true,
    clicked: true,
    retryAttempts: 0,
    maxRetries: 4
  },
  {
    id: 'NTF-9030',
    recipientId: 'USR-9002',
    recipientName: 'Marcus Vance',
    recipientEmail: 'mvance@example.com',
    role: 'Buyer',
    category: 'Wishlist Price Drop',
    channel: 'push_ios',
    title: 'Price Drop Alert! Wireless Noise-Canceling Headphones',
    body: 'Great news! Wireless Noise-Canceling Headphones on your wishlist dropped by 25% to $149.99.',
    status: 'delivered',
    priority: 'normal',
    timestamp: '2026-07-27 18:00:00',
    deliveredAt: '2026-07-27 18:00:02',
    readAt: '2026-07-27 18:15:00',
    clickedAt: '2026-07-27 18:15:05',
    read: true,
    clicked: true,
    retryAttempts: 0,
    maxRetries: 3
  },
  {
    id: 'NTF-9031',
    recipientId: 'ADM-0002',
    recipientName: 'Database Ops Admin',
    recipientEmail: 'db-admin@marketplace.com',
    role: 'Administrator',
    category: 'Database Backup Completed',
    channel: 'email',
    title: 'PostgreSQL Automated Snapshot Success',
    body: 'Daily full cluster snapshot (284 GB) completed successfully in 18 minutes. Encrypted & archived to S3 bucket.',
    status: 'delivered',
    priority: 'low',
    timestamp: '2026-07-27 04:00:00',
    deliveredAt: '2026-07-27 04:00:05',
    readAt: '2026-07-27 08:00:00',
    read: true,
    clicked: false,
    retryAttempts: 0,
    maxRetries: 5
  },
  {
    id: 'NTF-9032',
    recipientId: 'USR-1102',
    recipientName: 'Sophia Martinez',
    recipientEmail: 'sophia.m@example.com',
    role: 'Buyer',
    category: 'Coupon Received',
    channel: 'in_app',
    title: 'Special $20 Prime Day Coupon Credited',
    body: 'You received a $20 discount voucher valid on all Electronics & Home items for the next 48 hours.',
    status: 'delivered',
    priority: 'normal',
    timestamp: '2026-07-27 01:20:00',
    deliveredAt: '2026-07-27 01:20:00',
    readAt: '2026-07-27 09:30:00',
    clickedAt: '2026-07-27 09:31:00',
    read: true,
    clicked: true,
    retryAttempts: 0,
    maxRetries: 3
  }
];

export const INITIAL_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'TPL-EMAIL-ORDER-SHIP',
    name: 'Order Shipped Customer Email',
    role: 'Buyer',
    category: 'Order Shipped',
    channel: 'email',
    subject: 'Good news! Your Amazon order #{{order_id}} has shipped',
    bodyText: 'Hi {{user_name}},\n\nYour order #{{order_id}} containing {{product_name}} has been shipped via {{carrier}}.\nTracking Number: {{tracking_number}}\nEstimated Delivery: {{estimated_delivery}}.\n\nThank you for shopping with us!',
    bodyHtml: `<div style="font-family: Arial, sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 8px;">
      <h2 style="color: #febd69; margin-top: 0;">Your Amazon Order Has Shipped!</h2>
      <p>Hi <strong>{{user_name}}</strong>,</p>
      <p>Great news! Your package is on its way.</p>
      <div style="background: #1e293b; padding: 16px; border-left: 4px solid #febd69; border-radius: 4px; margin: 16px 0;">
        <p style="margin: 4px 0;"><strong>Order ID:</strong> {{order_id}}</p>
        <p style="margin: 4px 0;"><strong>Item:</strong> {{product_name}}</p>
        <p style="margin: 4px 0;"><strong>Carrier:</strong> {{carrier}}</p>
        <p style="margin: 4px 0;"><strong>Tracking Number:</strong> <a href="#" style="color: #38bdf8;">{{tracking_number}}</a></p>
      </div>
      <p>Estimated Delivery Date: <strong>{{estimated_delivery}}</strong></p>
      <a href="#" style="display: inline-block; background: #febd69; color: #090d16; padding: 10px 20px; font-weight: bold; text-decoration: none; border-radius: 6px; margin-top: 12px;">Track Your Package</a>
    </div>`,
    variables: ['user_name', 'order_id', 'product_name', 'carrier', 'tracking_number', 'estimated_delivery'],
    language: 'en-US',
    version: 3,
    updatedAt: '2026-07-20 14:30:00',
    updatedBy: 'Lead Copywriter',
    history: [
      { version: 1, updatedAt: '2026-01-10', updatedBy: 'System', changesSummary: 'Initial template creation' },
      { version: 2, updatedAt: '2026-04-15', updatedBy: 'UX Designer', changesSummary: 'Added dark mode email styling' },
      { version: 3, updatedAt: '2026-07-20', updatedBy: 'Lead Copywriter', changesSummary: 'Added track package CTA button' }
    ]
  },
  {
    id: 'TPL-SMS-DELIVERY-OUT',
    name: 'Out for Delivery SMS Alert',
    role: 'Buyer',
    category: 'Out for Delivery',
    channel: 'sms',
    bodyText: 'Amazon Alert: Order #{{order_id}} is out for delivery today with driver {{driver_name}}. Track driver location: {{track_link}}',
    variables: ['order_id', 'driver_name', 'track_link'],
    language: 'en-US',
    version: 1,
    updatedAt: '2026-06-01 10:00:00',
    updatedBy: 'Operations Manager'
  },
  {
    id: 'TPL-PUSH-LOW-STOCK',
    name: 'Seller Low Inventory Mobile Push',
    role: 'Seller',
    category: 'Low Inventory',
    channel: 'push_android',
    bodyText: '⚠️ Low Stock Warning: SKU {{sku_code}} ({{product_name}}) has only {{units_left}} units remaining in {{warehouse_code}}. Restock now.',
    variables: ['sku_code', 'product_name', 'units_left', 'warehouse_code'],
    language: 'en-US',
    version: 2,
    updatedAt: '2026-07-10 11:20:00',
    updatedBy: 'Inventory Lead'
  },
  {
    id: 'TPL-INAPP-COMMISSION',
    name: 'Affiliate Commission Credited In-App',
    role: 'Affiliate',
    category: 'Commission Earned',
    channel: 'in_app',
    bodyText: '🎉 You earned {{commission_amount}} commission from referral order #{{order_id}}. Total current wallet balance: {{wallet_balance}}.',
    variables: ['commission_amount', 'order_id', 'wallet_balance'],
    language: 'en-US',
    version: 1,
    updatedAt: '2026-05-18 09:15:00',
    updatedBy: 'Affiliate Manager'
  },
  {
    id: 'TPL-WHATSAPP-SUPPLIER-PO',
    name: 'Supplier New Purchase Order WhatsApp',
    role: 'Supplier',
    category: 'New Purchase Order',
    channel: 'whatsapp',
    bodyText: '🏢 Marketplace Supply Chain: Purchase Order #{{po_number}} for {{quantity}} units ({{product_name}}) worth {{total_val}} has been placed. Accept PO in portal: {{portal_url}}',
    variables: ['po_number', 'quantity', 'product_name', 'total_val', 'portal_url'],
    language: 'en-US',
    version: 1,
    updatedAt: '2026-07-02 16:00:00',
    updatedBy: 'Procurement Specialist'
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'CMP-2026-001',
    title: 'Mid-Year Electronics Mega Flash Sale',
    type: 'flash_sale',
    channel: 'push_android',
    sendMode: 'scheduled',
    status: 'running',
    targetRole: 'Buyer',
    segmentFilter: {
      membership: 'Prime',
      minSpent: 100,
      country: 'US'
    },
    templateId: 'TPL-PUSH-FLASH-SALE',
    scheduledAt: '2026-07-28 12:00:00',
    totalRecipients: 450000,
    sentCount: 312000,
    deliveredCount: 308500,
    failedCount: 3500,
    openCount: 128400,
    clickCount: 64200,
    convertedCount: 14200,
    revenueGenerated: 894500,
    createdAt: '2026-07-25 10:00:00'
  },
  {
    id: 'CMP-2026-002',
    title: 'Seller Fulfillment & FBA Promotion 2026',
    type: 'announcement',
    channel: 'email',
    sendMode: 'immediate',
    status: 'completed',
    targetRole: 'Seller',
    segmentFilter: {
      sellerPlan: 'Professional',
      country: 'All'
    },
    templateId: 'TPL-EMAIL-SELLER-PROMO',
    totalRecipients: 85000,
    sentCount: 85000,
    deliveredCount: 83900,
    failedCount: 1100,
    openCount: 42300,
    clickCount: 18900,
    convertedCount: 3400,
    revenueGenerated: 210000,
    createdAt: '2026-07-15 08:00:00'
  },
  {
    id: 'CMP-2026-003',
    title: 'Weekly Affiliate Top Tier Commission Bonus',
    type: 'promotional',
    channel: 'in_app',
    sendMode: 'recurring',
    recurrencePattern: 'weekly',
    status: 'running',
    targetRole: 'Affiliate',
    segmentFilter: {
      minSpent: 500
    },
    templateId: 'TPL-INAPP-AFFILIATE-WEEKLY',
    totalRecipients: 12000,
    sentCount: 12000,
    deliveredCount: 12000,
    failedCount: 0,
    openCount: 9800,
    clickCount: 5400,
    convertedCount: 1200,
    revenueGenerated: 145000,
    createdAt: '2026-06-01 00:00:00'
  }
];

export const INITIAL_USER_PREFERENCES: UserNotificationPreference = {
  userId: 'USR-8821',
  userName: 'Alexander Wright',
  role: 'Buyer',
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '07:00',
    timezone: 'PST'
  },
  channels: {
    in_app: true,
    email: true,
    sms: true,
    push_android: true,
    push_ios: true,
    push_web: false,
    whatsapp: true,
    telegram: false
  },
  categories: {
    'Out for Delivery': { email: true, sms: true, push: true, in_app: true },
    'Delivered': { email: true, sms: true, push: true, in_app: true },
    'Payment Failed': { email: true, sms: true, push: true, in_app: true },
    'Wishlist Price Drop': { email: true, sms: false, push: true, in_app: true },
    'Coupon Received': { email: false, sms: false, push: true, in_app: true },
    'Login Alert': { email: true, sms: true, push: true, in_app: true }
  },
  marketingOptIn: true,
  frequencyCapPerDay: 8
};

export const INITIAL_QUEUE_METRICS: QueueStatusMetrics[] = [
  {
    queueName: 'notifications.high_priority.fifo',
    pendingJobs: 14,
    processingWorkers: 32,
    avgLatencyMs: 42,
    deadLetterCount: 2,
    throughputPerSec: 1850,
    health: 'healthy'
  },
  {
    queueName: 'notifications.email.bulk',
    pendingJobs: 420,
    processingWorkers: 16,
    avgLatencyMs: 180,
    deadLetterCount: 12,
    throughputPerSec: 890,
    health: 'healthy'
  },
  {
    queueName: 'notifications.sms.critical',
    pendingJobs: 3,
    processingWorkers: 8,
    avgLatencyMs: 28,
    deadLetterCount: 0,
    throughputPerSec: 320,
    health: 'healthy'
  },
  {
    queueName: 'notifications.push.fcm_apns',
    pendingJobs: 88,
    processingWorkers: 24,
    avgLatencyMs: 65,
    deadLetterCount: 5,
    throughputPerSec: 3200,
    health: 'healthy'
  },
  {
    queueName: 'notifications.whatsapp.webhook',
    pendingJobs: 2,
    processingWorkers: 4,
    avgLatencyMs: 110,
    deadLetterCount: 1,
    throughputPerSec: 120,
    health: 'healthy'
  }
];

export const INITIAL_AI_OPTIMIZERS: AISendOptimizer[] = [
  {
    userSegment: 'Prime Power Buyers (US West Coast)',
    predictedOptimalHour: 19, // 7 PM
    predictedOpenRatePct: 48.2,
    priorityScore: 92,
    fatigueRisk: 'Low',
    recommendedChannel: 'push_ios',
    recommendedTone: 'Friendly'
  },
  {
    userSegment: 'High-Volume FBA Sellers (Global)',
    predictedOptimalHour: 9, // 9 AM
    predictedOpenRatePct: 74.5,
    priorityScore: 98,
    fatigueRisk: 'Low',
    recommendedChannel: 'email',
    recommendedTone: 'Professional'
  },
  {
    userSegment: 'Affiliate Content Creators',
    predictedOptimalHour: 14, // 2 PM
    predictedOpenRatePct: 56.0,
    priorityScore: 84,
    fatigueRisk: 'Medium',
    recommendedChannel: 'in_app',
    recommendedTone: 'Promotional'
  },
  {
    userSegment: 'Delivery Logistics Fleet Drivers',
    predictedOptimalHour: 6, // 6 AM
    predictedOpenRatePct: 91.0,
    priorityScore: 99,
    fatigueRisk: 'Low',
    recommendedChannel: 'push_android',
    recommendedTone: 'Urgent'
  }
];
