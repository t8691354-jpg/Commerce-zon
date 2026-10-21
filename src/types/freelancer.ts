export type FreelancerCategory =
  | 'ai_ml'
  | 'web_frontend'
  | 'fullstack_backend'
  | 'mobile_apps'
  | 'ui_ux_design'
  | 'devops_cloud'
  | 'blockchain_web3';

export type MilestoneStatus =
  | 'PENDING'
  | 'ESCROW_FUNDED'
  | 'SUBMITTED'
  | 'RELEASED'
  | 'DISPUTED';

export interface FreelanceMilestone {
  id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  deliverableNote?: string;
  submittedAt?: string;
  releasedAt?: string;
}

export interface FreelanceJob {
  id: string;
  title: string;
  description: string;
  category: FreelancerCategory;
  categoryLabel: string;
  budget: number;
  budgetType: 'FIXED' | 'HOURLY';
  skills: string[];
  experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'EXPERT';
  duration: string;
  clientId: string;
  clientName: string;
  clientRating: number;
  clientTotalSpent: number;
  clientCountry: string;
  proposalsCount: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  milestones: FreelanceMilestone[];
  postedAt: string;
}

export interface FreelancerPortfolioItem {
  id: string;
  title: string;
  image: string;
  description: string;
  tag: string;
  link?: string;
}

export interface FreelancerProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  category: FreelancerCategory;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  earnings: number;
  bio: string;
  skills: string[];
  badges: string[];
  location: string;
  responseTime: string;
  isVerified: boolean;
  portfolio: FreelancerPortfolioItem[];
}

export interface FreelanceProposal {
  id: string;
  jobId: string;
  jobTitle: string;
  freelancerId: string;
  freelancerName: string;
  bidAmount: number;
  deliveryDays: number;
  coverLetter: string;
  milestonesProposed: Array<{ title: string; amount: number }>;
  submittedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
