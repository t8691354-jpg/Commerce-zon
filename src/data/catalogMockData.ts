import { CategoryNode, ProductReviewItem, ProductQuestionAnswer } from '../types/domain';

export const MOCK_CATEGORY_TREE: CategoryNode[] = [
  {
    id: 'cat-01',
    name: 'Computing & Workstations',
    slug: 'computing-workstations',
    subcategories: [
      { id: 'sub-01a', name: 'Laptops & Mobile Workstations', slug: 'laptops-workstations' },
      { id: 'sub-01b', name: 'Enterprise Servers & Racks', slug: 'enterprise-servers' },
      { id: 'sub-01c', name: 'GPUs & AI Accelerators', slug: 'gpus-ai-accelerators' },
    ],
    collections: ['Prime AI Heavy Duty', 'Enterprise Spring Sale', 'Refurbished Certified'],
    productCount: 1420,
    isHidden: false,
    displayOrder: 1,
  },
  {
    id: 'cat-02',
    name: 'Robotics & Industrial Automation',
    slug: 'robotics-industrial-automation',
    subcategories: [
      { id: 'sub-02a', name: 'Collaborative Robots (Cobots)', slug: 'cobots' },
      { id: 'sub-02b', name: 'Industrial LiDAR & Vision Sensors', slug: 'lidar-vision' },
      { id: 'sub-02c', name: 'Pneumatic Actuators & Servos', slug: 'actuators-servos' },
    ],
    collections: ['Industry 4.0 Fleet', 'FBA Automation Tech'],
    productCount: 890,
    isHidden: false,
    displayOrder: 2,
  },
  {
    id: 'cat-03',
    name: 'Electronics & Audio Gear',
    slug: 'electronics-audio-gear',
    subcategories: [
      { id: 'sub-03a', name: 'Wireless Spatial Audio', slug: 'spatial-audio' },
      { id: 'sub-03b', name: 'Smart Wearables & Sensors', slug: 'smart-wearables' },
      { id: 'sub-03c', name: 'Power Units & UPS', slug: 'power-units' },
    ],
    collections: ['Audiophile High-Res', 'Prime Deals 2026'],
    productCount: 2150,
    isHidden: false,
    displayOrder: 3,
  },
];

export const MOCK_PRODUCT_REVIEWS: ProductReviewItem[] = [
  {
    id: 'rev-101',
    productId: 'prod-01',
    buyerName: 'Dr. Evelyn Vance (MIT AI Lab)',
    rating: 5,
    title: 'Outstanding Machine Learning Workstation!',
    comment: 'Compiling PyTorch models and LLM fine-tuning runs effortlessly on this Titan X9. Thermal management is superb even under 100% CUDA load.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
    ],
    isVerifiedPurchase: true,
    helpfulVotes: 42,
    sellerReply: {
      merchantName: 'CyberTech Enterprise Solutions',
      comment: 'Thank you Dr. Vance! We pre-install enterprise CUDA drivers on all Titan units.',
      repliedAt: '2026-07-20T10:00:00Z',
    },
    createdAt: '2026-07-18T14:20:00Z',
  },
  {
    id: 'rev-102',
    productId: 'prod-02',
    buyerName: 'Marcus Sterling (VP Operations)',
    rating: 5,
    title: 'Transformed our Warehouse Sorting Line',
    comment: 'The 6-axis precision on the Cobot Arm Alpha 5000 is unbelievable. Integrated seamlessly with our AWS IoT robotics setup.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
    ],
    isVerifiedPurchase: true,
    helpfulVotes: 29,
    createdAt: '2026-07-22T09:15:00Z',
  },
];

export const MOCK_PRODUCT_QA: ProductQuestionAnswer[] = [
  {
    id: 'qa-101',
    productId: 'prod-01',
    buyerName: 'Alexander Wright',
    question: 'Does this model support external eGPU enclosures over Thunderbolt 4?',
    upvotes: 18,
    answers: [
      {
        id: 'ans-101a',
        responderName: 'CyberTech Enterprise Support',
        responderRole: 'SELLER',
        answer: 'Yes! The Titan X9 features dual Thunderbolt 4 / USB4 ports with full PCIe 4.0 x4 external graphics support.',
        upvotes: 15,
        createdAt: '2026-07-15T11:30:00Z',
      },
    ],
    createdAt: '2026-07-14T16:00:00Z',
  },
  {
    id: 'qa-102',
    productId: 'prod-02',
    buyerName: 'Sanjay Patel',
    question: 'What is the IP rating for dust and washdown environments?',
    upvotes: 11,
    answers: [
      {
        id: 'ans-102a',
        responderName: 'Apex Robotics Technical Team',
        responderRole: 'SELLER',
        answer: 'The arm joints are IP65 sealed against dust and water jets, suitable for light industrial washdowns.',
        upvotes: 9,
        createdAt: '2026-07-21T08:45:00Z',
      },
    ],
    createdAt: '2026-07-20T19:10:00Z',
  },
];

export const MOCK_SYNONYM_DICTIONARY = [
  { term: 'laptop', synonyms: ['notebook', 'portable computer', 'workstation', 'macbook alternative'] },
  { term: 'robotics', synonyms: ['cobot', 'robotic arm', 'automation', 'mechatronics'] },
  { term: 'headphones', synonyms: ['earphones', 'headset', 'spatial audio', 'noise cancelling'] },
];

export const MOCK_SEARCH_SUGGESTIONS = [
  'Titan Workstation 64GB',
  'Autonomous Cobot Arm',
  'LiDAR Vision Sensor 4K',
  'Enterprise CUDA Accelerator',
  'Industrial Servo Drive',
];
