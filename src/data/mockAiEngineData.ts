import { 
  AiSystemMetrics, 
  TimeSeriesUsage, 
  ProductSearchResult, 
  PersonalizedCustomerProfile, 
  RankingWeights, 
  AiChatMessage, 
  ComparisonProductSpec, 
  AiComparisonSummary, 
  ReviewSentimentAnalysis, 
  FraudAlertItem, 
  DemandForecastItem, 
  PricingCompetitorItem, 
  AiMarketingOpportunity, 
  SellerAiInsight, 
  AiAdminModelConfig, 
  AiAuditLog 
} from '../types/aiEngine';

export const INITIAL_AI_METRICS: AiSystemMetrics = {
  totalSearchRequests: 4892150,
  totalRecommendationRequests: 12450800,
  avgAiResponseTimeMs: 42,
  searchSuccessRatePct: 98.6,
  clickThroughRatePct: 24.8,
  conversionRatePct: 7.9,
  personalizationScorePct: 94.2,
  recommendationAccuracyPct: 91.5,
  aiModelHealthPct: 99.9,
  userEngagementScore: 88,
  aiGeneratedRevenueUsd: 14850900,
  trendingSearches: [
    'RTX 4090 Gaming Laptops',
    'Noise Cancelling Headphones',
    'Marathon Running Shoes',
    'Smart Home Security Hub',
    'Mechanical Keyboards',
    'OLED Curved Monitors',
    'Air Fryer Dual Basket'
  ]
};

export const MOCK_DAILY_USAGE: TimeSeriesUsage[] = [
  { timeLabel: '00:00', searchRequests: 12000, recommendationRequests: 34000, conversionRate: 6.2, aiRevenue: 42000 },
  { timeLabel: '04:00', searchRequests: 8000, recommendationRequests: 21000, conversionRate: 5.8, aiRevenue: 28000 },
  { timeLabel: '08:00', searchRequests: 45000, recommendationRequests: 110000, conversionRate: 7.4, aiRevenue: 125000 },
  { timeLabel: '12:00', searchRequests: 82000, recommendationRequests: 210000, conversionRate: 8.5, aiRevenue: 240000 },
  { timeLabel: '16:00', searchRequests: 95000, recommendationRequests: 245000, conversionRate: 8.8, aiRevenue: 310000 },
  { timeLabel: '20:00', searchRequests: 110000, recommendationRequests: 280000, conversionRate: 9.1, aiRevenue: 380000 },
  { timeLabel: '23:59', searchRequests: 54000, recommendationRequests: 140000, conversionRate: 7.1, aiRevenue: 180000 }
];

export const MOCK_WEEKLY_USAGE: TimeSeriesUsage[] = [
  { timeLabel: 'Mon', searchRequests: 620000, recommendationRequests: 1540000, conversionRate: 7.2, aiRevenue: 1850000 },
  { timeLabel: 'Tue', searchRequests: 680000, recommendationRequests: 1680000, conversionRate: 7.6, aiRevenue: 2100000 },
  { timeLabel: 'Wed', searchRequests: 710000, recommendationRequests: 1750000, conversionRate: 7.8, aiRevenue: 2250000 },
  { timeLabel: 'Thu', searchRequests: 740000, recommendationRequests: 1820000, conversionRate: 8.0, aiRevenue: 2400000 },
  { timeLabel: 'Fri', searchRequests: 890000, recommendationRequests: 2150000, conversionRate: 8.7, aiRevenue: 2950000 },
  { timeLabel: 'Sat', searchRequests: 980000, recommendationRequests: 2420000, conversionRate: 9.2, aiRevenue: 3400000 },
  { timeLabel: 'Sun', searchRequests: 850000, recommendationRequests: 2100000, conversionRate: 8.4, aiRevenue: 2800000 }
];

export const MOCK_PRODUCTS: ProductSearchResult[] = [
  {
    id: 'PROD-AI-101',
    title: 'ROG Strix Scar 18 Gaming Laptop (Intel i9-14900HX, RTX 4090, 32GB RAM, 2TB SSD, 240Hz Nebula HDR)',
    category: 'Laptops & Computers',
    brand: 'ASUS ROG',
    price: 3499.99,
    originalPrice: 3799.99,
    rating: 4.9,
    reviewCount: 1420,
    verifiedReviewsCount: 1350,
    sellerName: 'Apex Electronics Store',
    sellerRating: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    relevanceScore: 98,
    aiMatchReason: 'Matches budget gaming laptop intent with RTX 4090 GPU and top seller rank.',
    deliverySpeedDays: 1,
    inStockCount: 42,
    semanticTags: ['gaming', 'rtx4090', 'intel-i9', 'high-performance', 'nebula-display'],
    conversionRatePct: 12.4,
    satisfactionScorePct: 98
  },
  {
    id: 'PROD-AI-102',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones (30h Battery, Ultra Clear Mic, Multipoint)',
    category: 'Audio & Headphones',
    brand: 'Sony',
    price: 398.00,
    originalPrice: 449.99,
    rating: 4.8,
    reviewCount: 8920,
    verifiedReviewsCount: 8400,
    sellerName: 'Sony Official Store',
    sellerRating: 4.98,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    relevanceScore: 96,
    aiMatchReason: '#1 Recommended noise-cancelling headset based on sound fidelity & 30-hour battery life.',
    deliverySpeedDays: 1,
    inStockCount: 210,
    semanticTags: ['black', 'wireless', 'headphones', 'noise-cancelling', 'bluetooth'],
    conversionRatePct: 14.8,
    satisfactionScorePct: 96
  },
  {
    id: 'PROD-AI-103',
    title: 'Nike Air Zoom Pegasus 40 Beginner Running Shoes (Lightweight Cushioning, Breathable Mesh)',
    category: 'Footwear & Athletics',
    brand: 'Nike',
    price: 129.99,
    originalPrice: 140.00,
    rating: 4.7,
    reviewCount: 3120,
    verifiedReviewsCount: 2980,
    sellerName: 'Nike Retail Hub',
    sellerRating: 4.90,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    relevanceScore: 95,
    aiMatchReason: 'Perfect entry-level shoe for beginner runners with high Arch Support rating.',
    deliverySpeedDays: 2,
    inStockCount: 180,
    semanticTags: ['running-shoes', 'beginners', 'lightweight', 'marathon', 'nike-pegasus'],
    conversionRatePct: 11.2,
    satisfactionScorePct: 94
  },
  {
    id: 'PROD-AI-104',
    title: 'Apple MacBook Pro 16-inch M3 Max (36GB Unified Memory, 1TB SSD, Liquid Retina XDR Display)',
    category: 'Laptops & Computers',
    brand: 'Apple',
    price: 3499.00,
    originalPrice: 3699.00,
    rating: 4.9,
    reviewCount: 2150,
    verifiedReviewsCount: 2100,
    sellerName: 'Apple Store Direct',
    sellerRating: 4.99,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    relevanceScore: 92,
    aiMatchReason: 'Top recommendation for creative professionals needing maximum M3 Max GPU render power.',
    deliverySpeedDays: 1,
    inStockCount: 35,
    semanticTags: ['macbook', 'apple-m3', 'creator-laptop', 'retina-xdr', 'premium'],
    conversionRatePct: 10.8,
    satisfactionScorePct: 99
  },
  {
    id: 'PROD-AI-105',
    title: 'Bose QuietComfort Ultra Wireless Earbuds (Spatial Audio, CustomTune, IPX4 Sweat Resistant)',
    category: 'Audio & Headphones',
    brand: 'Bose',
    price: 299.00,
    originalPrice: 329.00,
    rating: 4.6,
    reviewCount: 1840,
    verifiedReviewsCount: 1750,
    sellerName: 'AudioWorld Direct',
    sellerRating: 4.88,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    relevanceScore: 90,
    aiMatchReason: 'Matches active lifestyle & acoustic noise reduction search intent.',
    deliverySpeedDays: 1,
    inStockCount: 95,
    semanticTags: ['earbuds', 'bose', 'spatial-audio', 'noise-cancelling', 'ipx4'],
    conversionRatePct: 9.8,
    satisfactionScorePct: 92
  },
  {
    id: 'PROD-AI-106',
    title: 'Samsung 49-inch Odyssey OLED G9 Curved Gaming Monitor (240Hz, 0.03ms, Dual QHD)',
    category: 'Gaming & Monitors',
    brand: 'Samsung',
    price: 1399.99,
    originalPrice: 1799.99,
    rating: 4.8,
    reviewCount: 940,
    verifiedReviewsCount: 910,
    sellerName: 'Samsung Direct',
    sellerRating: 4.92,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    relevanceScore: 89,
    aiMatchReason: 'Ultimate ultrawide curved monitor choice for immersive simulator gaming.',
    deliverySpeedDays: 2,
    inStockCount: 22,
    semanticTags: ['curved-monitor', 'oled', 'samsung-g9', '240hz', 'ultrawide'],
    conversionRatePct: 8.4,
    satisfactionScorePct: 95
  }
];

export const MOCK_CUSTOMER_PROFILES: PersonalizedCustomerProfile[] = [
  {
    id: 'CUST-301',
    name: 'Alexander Wright',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    personaTitle: 'Pro Gaming & Tech Enthusiast',
    favoriteCategories: ['Laptops & Computers', 'Gaming & Monitors', 'Audio & Headphones'],
    favoriteBrands: ['ASUS ROG', 'Apple', 'Sony', 'Razer'],
    browsingHistory: ['ROG Strix Scar 18', 'RTX 4090 Benchmarks', '4K OLED Ultrawide', 'Mechanical Keyboards'],
    searchHistory: ['best gaming laptop under my budget', 'black wireless headphones', 'mechanical switch tester'],
    purchaseHistory: ['Sony WH-1000XM5 Headphones', 'Ergonomic Mesh Chair Pro'],
    wishlist: ['ROG Strix Scar 18', 'Samsung Odyssey OLED G9'],
    cartActivity: ['ROG Strix Scar 18 (Qty: 1)'],
    deviceType: 'Desktop (macOS)',
    country: 'United States',
    language: 'en-US',
    vectorEmbeddingsSummary: 'High propensity for premium tech electronics, high basket value ($1000+), fast delivery speed sensitivity.'
  },
  {
    id: 'CUST-302',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    personaTitle: 'Fitness, Wellness & Marathon Runner',
    favoriteCategories: ['Footwear & Athletics', 'Wearables & Smartwatches', 'Nutrition & Fitness'],
    favoriteBrands: ['Nike', 'Garmin', 'Under Armour', 'Bose'],
    browsingHistory: ['Nike Pegasus 40', 'Garmin Forerunner 965', 'Hydration Vest', 'Electrolyte Powder'],
    searchHistory: ['running shoes for beginners', 'gps smartwatch for marathon', 'lightweight windbreaker'],
    purchaseHistory: ['Garmin HRM-Pro Heart Rate Monitor', 'Nike Dri-FIT Shorts'],
    wishlist: ['Nike Air Zoom Pegasus 40', 'Bose QC Ultra Earbuds'],
    cartActivity: ['Nike Air Zoom Pegasus 40 (Size 8)'],
    deviceType: 'Mobile (iOS App)',
    country: 'Canada',
    language: 'en-CA',
    vectorEmbeddingsSummary: 'Strong brand affinity for Nike and Garmin, high repeat runner product velocity.'
  },
  {
    id: 'CUST-303',
    name: 'Marcus Thorne',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    personaTitle: 'Smart Home & Automation Specialist',
    favoriteCategories: ['Smart Home Security', 'Home Appliances', 'Networking & IoT'],
    favoriteBrands: ['Philips Hue', 'Ring', 'Ecobee', 'Anker'],
    browsingHistory: ['Matter Smart Hub', 'Outdoor Security Camera solar', 'Smart Thermostat Premium'],
    searchHistory: ['smart home hub matter enabled', 'dual basket air fryer stainless steel'],
    purchaseHistory: ['Philips Hue Gradient Lightstrip', 'Ring Video Doorbell Pro 2'],
    wishlist: ['Ecobee Smart Thermostat Premium'],
    cartActivity: [],
    deviceType: 'Tablet (Android)',
    country: 'United Kingdom',
    language: 'en-GB',
    vectorEmbeddingsSummary: 'Smart home IoT installer behavior, sensitive to Matter/Zigbee protocol compatibility.'
  }
];

export const INITIAL_RANKING_WEIGHTS: RankingWeights = {
  relevance: 35,
  rating: 15,
  verifiedReviews: 10,
  sellerPerformance: 10,
  popularity: 10,
  inventoryAvailability: 5,
  deliverySpeed: 5,
  conversionRate: 5,
  customerSatisfaction: 5
};

export const INITIAL_CHAT_MESSAGES: AiChatMessage[] = [
  {
    id: 'MSG-1',
    sender: 'assistant',
    text: 'Hello Alexander! I am your AI Shopping Assistant powered by Gemini 3.6. I can help you find products, compare specs, check orders, recommend accessories or answer marketplace questions. How can I assist you today?',
    timestamp: '09:30 AM',
    actionButtons: [
      { label: 'Find Gaming Laptops under $3500', actionQuery: 'Best gaming laptop under $3500' },
      { label: 'Compare Sony WH-1000XM5 vs Bose QC Ultra', actionQuery: 'Compare Sony XM5 vs Bose QC Ultra' },
      { label: 'Check Order #AMZ-99201 Status', actionQuery: 'Where is my order #AMZ-99201?' }
    ]
  }
];

export const MOCK_COMPARISON_SPECS: ComparisonProductSpec[] = [
  {
    productId: 'PROD-AI-101',
    title: 'ROG Strix Scar 18',
    price: 3499.99,
    rating: 4.9,
    reviews: 1420,
    sellerRating: 4.95,
    deliveryDays: 1,
    warranty: '2 Year ASUS Global Premium Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=300&q=80',
    keySpecs: {
      Processor: 'Intel Core i9-14900HX (24 Cores)',
      GPU: 'NVIDIA GeForce RTX 4090 16GB (175W TGP)',
      RAM: '32GB DDR5-5600MHz (Upgradable to 64GB)',
      Storage: '2TB PCIe 4.0 NVMe SSD (RAID 0 Support)',
      Display: '18" QHD+ 240Hz 1100-nits Mini-LED Nebula',
      Weight: '3.10 kg (6.83 lbs)',
      Battery: '90Wh Battery + 330W Fast Charging'
    }
  },
  {
    productId: 'PROD-AI-104',
    title: 'MacBook Pro 16" M3 Max',
    price: 3499.00,
    rating: 4.9,
    reviews: 2150,
    sellerRating: 4.99,
    deliveryDays: 1,
    warranty: '1 Year AppleCare Limited Warranty',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
    keySpecs: {
      Processor: 'Apple M3 Max (16-Core CPU)',
      GPU: '40-Core Apple Silicon Integrated GPU',
      RAM: '36GB Unified Memory (300GB/s Bandwidth)',
      Storage: '1TB Ultra-fast NVMe SSD',
      Display: '16.2" Liquid Retina XDR 120Hz ProMotion',
      Weight: '2.16 kg (4.80 lbs)',
      Battery: '100Wh Battery (Up to 22 Hours Battery)'
    }
  }
];

export const MOCK_COMPARISON_SUMMARY: AiComparisonSummary = {
  verdict: 'Choose ROG Strix Scar 18 for AAA 4K gaming & raw ray-tracing FPS. Choose MacBook Pro 16 M3 Max for battery life, silent thermals & 8K video editing workflows.',
  bestOverallProductId: 'PROD-AI-101',
  bestValueProductId: 'PROD-AI-104',
  featureMatrix: [
    { featureName: 'Gaming Performance', values: { 'PROD-AI-101': '10/10 (Ultra High 4K FPS)', 'PROD-AI-104': '7.5/10 (macOS Limited)' } },
    { featureName: 'Content Creation & Video', values: { 'PROD-AI-101': '9/10 (Blazing CUDA)', 'PROD-AI-104': '10/10 (ProRes Engine)' } },
    { featureName: 'Battery Endurance', values: { 'PROD-AI-101': '3.5 Hours', 'PROD-AI-104': '22 Hours' } },
    { featureName: 'Portability & Weight', values: { 'PROD-AI-101': 'Heavy (3.1 kg)', 'PROD-AI-104': 'Sleek (2.16 kg)' } }
  ],
  prosCons: {
    'PROD-AI-101': {
      pros: ['Unbeatable RTX 4090 175W graphics', '240Hz Nebula HDR Mini-LED screen', 'Dual NVMe SSD upgrade slots'],
      cons: ['Shorter battery life under full load', 'Bulky power adapter']
    },
    'PROD-AI-104': {
      pros: ['Incredible 22-hour battery life', 'Whitemouth silent thermals', 'Studio quality 6-speaker array'],
      cons: ['Not optimized for Windows-native AAA games', 'RAM non-upgradable after purchase']
    }
  }
};

export const MOCK_REVIEW_ANALYSIS: ReviewSentimentAnalysis = {
  productId: 'PROD-AI-102',
  productTitle: 'Sony WH-1000XM5 Headphones',
  totalReviews: 8920,
  positiveSentimentPct: 91,
  neutralSentimentPct: 5,
  negativeSentimentPct: 4,
  fakeReviewRiskPct: 1.2,
  spamCount: 14,
  duplicateCount: 3,
  frequentlyMentionedFeatures: [
    { feature: 'Active Noise Cancellation', sentiment: 'positive', count: 4120 },
    { feature: 'Comfort & Ear Cups', sentiment: 'positive', count: 3200 },
    { feature: 'Battery Life (30h)', sentiment: 'positive', count: 2890 },
    { feature: 'Non-Folding Hinge Design', sentiment: 'negative', count: 340 }
  ],
  commonComplaints: [
    'Carrying case is slightly larger than XM4 predecessor',
    'Auto-NC optimizer can occasionally adjust too frequently in quiet rooms'
  ],
  aiReviewSummary: 'The Sony WH-1000XM5 receives overwhelmingly glowing reviews (91% positive) for class-leading active noise cancellation and crystal clear mic clarity. Customers praise the lightweight build for long flights. Minor complaints focus on the non-foldable headband design.'
};

export const MOCK_FRAUD_ALERTS: FraudAlertItem[] = [
  {
    id: 'FRD-9001',
    entityType: 'Review',
    entityName: 'Bulk 5-Star Reviews on Brand-X Wireless Pods',
    fraudType: 'Review Manipulation',
    riskScore: 94,
    severity: 'Critical',
    detectedAt: '2026-07-28 01:15 UTC',
    details: 'Cluster of 180 verified purchase reviews posted within 8 minutes from identical IP subnet in Hanoi.',
    status: 'Open'
  },
  {
    id: 'FRD-9002',
    entityType: 'Buyer',
    entityName: 'User #88219 (Carding Pattern)',
    fraudType: 'Suspicious Payments',
    riskScore: 88,
    severity: 'High',
    detectedAt: '2026-07-28 00:42 UTC',
    details: '12 failed credit card BIN verification attempts in 3 minutes across 5 high-value Apple MacBooks.',
    status: 'Investigating'
  },
  {
    id: 'FRD-9003',
    entityType: 'Return',
    entityName: 'Seller Return Request #RET-4091',
    fraudType: 'Return Fraud',
    riskScore: 76,
    severity: 'Medium',
    detectedAt: '2026-07-27 22:10 UTC',
    details: 'Weight discrepancy detected at FBA warehouse scan (Expected 3.1kg, Actual scanned 0.4kg box with clay).',
    status: 'Open'
  }
];

export const MOCK_DEMAND_FORECASTS: DemandForecastItem[] = [
  {
    productId: 'PROD-AI-101',
    productTitle: 'ROG Strix Scar 18 Gaming Laptop',
    category: 'Laptops',
    currentStock: 42,
    predicted30DayDemand: 180,
    stockoutRiskDate: '2026-08-05 (8 days left)',
    fastSellingStatus: 'Fast Seller',
    recommendedReorderQty: 200,
    seasonalTrendFactor: '+45% Surge expected due to Back-to-School season'
  },
  {
    productId: 'PROD-AI-102',
    productTitle: 'Sony WH-1000XM5 Headphones',
    category: 'Audio',
    currentStock: 210,
    predicted30DayDemand: 450,
    stockoutRiskDate: '2026-08-14 (17 days left)',
    fastSellingStatus: 'Fast Seller',
    recommendedReorderQty: 500,
    seasonalTrendFactor: '+20% Summer travel audio gear spike'
  },
  {
    productId: 'PROD-AI-103',
    productTitle: 'Nike Air Zoom Pegasus 40',
    category: 'Footwear',
    currentStock: 180,
    predicted30DayDemand: 220,
    stockoutRiskDate: '2026-08-22 (25 days left)',
    fastSellingStatus: 'Steady',
    recommendedReorderQty: 150,
    seasonalTrendFactor: '+10% Fall marathon training kick-off'
  }
];

export const MOCK_PRICING_COMPETITORS: PricingCompetitorItem[] = [
  {
    productId: 'PROD-AI-101',
    productTitle: 'ROG Strix Scar 18 Gaming Laptop',
    currentPrice: 3499.99,
    competitorMinPrice: 3449.00,
    competitorMaxPrice: 3699.00,
    competitorAvgPrice: 3580.00,
    recommendedDynamicPrice: 3489.99,
    predictedMarginPct: 28.5,
    demandSurgeMultiplier: 1.05,
    priceRuleApplied: 'Beat Best Competitor by $10 while preserving >25% Gross Margin'
  },
  {
    productId: 'PROD-AI-102',
    productTitle: 'Sony WH-1000XM5 Headphones',
    currentPrice: 398.00,
    competitorMinPrice: 388.00,
    competitorMaxPrice: 429.00,
    competitorAvgPrice: 405.00,
    recommendedDynamicPrice: 394.99,
    predictedMarginPct: 34.0,
    demandSurgeMultiplier: 1.02,
    priceRuleApplied: 'Match Prime Shipping Advantage & Target Top Buy Box'
  }
];

export const MOCK_MARKETING_OPPORTUNITIES: AiMarketingOpportunity[] = [
  {
    id: 'MKT-101',
    customerGroup: 'Gaming Laptop Buyers ($2000+ spenders)',
    campaignType: 'Cross-Sell',
    title: 'Bundle ROG Laptop with Razer Basilisk V3 Mouse at 15% off',
    suggestedDiscount: '15% Off Accessory',
    recommendedProduct: 'Razer Basilisk V3 Pro Mouse',
    estimatedRevenueImpactUsd: 142000,
    conversionProbabilityPct: 32.4,
    status: 'Active'
  },
  {
    id: 'MKT-102',
    customerGroup: 'Marathon Runners & Joggers',
    campaignType: 'Upsell',
    title: 'Recommend Garmin Forerunner 965 GPS Watch to Pegasus Buyers',
    suggestedDiscount: '10% Coupon Code RUNNER10',
    recommendedProduct: 'Garmin Forerunner 965',
    estimatedRevenueImpactUsd: 285000,
    conversionProbabilityPct: 24.8,
    status: 'Active'
  }
];

export const MOCK_SELLER_INSIGHTS: SellerAiInsight[] = [
  {
    sellerId: 'SEL-801',
    sellerName: 'Apex Electronics Store',
    topPerformingProduct: 'ROG Strix Scar 18 (142 Units Sold / $496K Revenue)',
    underperformingProduct: 'Legacy RGB Mousepad XL (2 Units Sold / $38 Stock Hold)',
    recommendedPriceAdjustments: 'Adjust RTX 4090 Gaming Laptop to $3,489.99 to capture 8% higher Buy Box win rate.',
    inventoryAlert: 'Reorder 200 units of ROG Strix Scar 18 by Aug 5 to avoid stockout during Back-to-School.',
    salesForecastNextMonthUsd: 680000,
    customerSatisfactionTrend: '98.5% Positive Rating (Up 1.2% this month)'
  }
];

export const MOCK_ADMIN_MODELS: AiAdminModelConfig[] = [
  {
    modelName: 'Gemini 3.6 Flash (Primary Reasoning Engine)',
    provider: 'Google Gemini',
    status: 'Active',
    enabled: true,
    latencyMs: 38,
    lastTrainedAt: 'Continuous Grounding'
  },
  {
    modelName: 'Elasticsearch 8.12 Vector Search Cluster',
    provider: 'Elasticsearch',
    status: 'Active',
    enabled: true,
    latencyMs: 12,
    lastTrainedAt: '2026-07-28 00:00 UTC'
  },
  {
    modelName: 'pgvector Hybrid Neural Ranker (2048 Dim Embeddings)',
    provider: 'pgvector',
    status: 'Active',
    enabled: true,
    latencyMs: 18,
    lastTrainedAt: '2026-07-27 18:00 UTC'
  },
  {
    modelName: 'FraudNet XGBoost & Graph Neural Network',
    provider: 'Local PyTorch',
    status: 'Active',
    enabled: true,
    latencyMs: 24,
    lastTrainedAt: '2026-07-28 02:00 UTC'
  }
];

export const MOCK_AI_AUDIT_LOGS: AiAuditLog[] = [
  {
    id: 'LOG-4001',
    timestamp: '2026-07-28 02:20:14',
    event: 'Semantic Vector Re-Ranking Executed',
    actor: 'SearchGateway-Svc',
    modelUsed: 'pgvector + Gemini 3.6',
    latencyMs: 41,
    status: 'Success',
    details: 'Query "Best gaming laptop under my budget" matched 42 SKUs with 98% relevance score.'
  },
  {
    id: 'LOG-4002',
    timestamp: '2026-07-28 02:18:50',
    event: 'Review Sentiment Analysis & Spam Mitigation',
    actor: 'FraudNet-Worker',
    modelUsed: 'FraudNet XGBoost',
    latencyMs: 19,
    status: 'Success',
    details: 'Flagged 180 review cluster on Brand-X Pods with 94% confidence risk score.'
  },
  {
    id: 'LOG-4003',
    timestamp: '2026-07-28 02:15:02',
    event: 'Dynamic Price Optimization Triggered',
    actor: 'PricingIntelligence-Cron',
    modelUsed: 'Gemini 3.6 Flash',
    latencyMs: 55,
    status: 'Success',
    details: 'Updated price for ROG Strix Scar 18 to $3489.99 to capture Buy Box.'
  }
];
