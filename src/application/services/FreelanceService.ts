import {
  FreelanceJob,
  FreelancerProfile,
  FreelanceProposal,
  FreelanceMilestone,
  FreelancerCategory
} from '../../types/freelancer';
import { SEEDED_FREELANCE_JOBS, SEEDED_FREELANCERS, INITIAL_PROPOSALS } from '../../data/freelanceData';
import { eventBus } from '../../lib/eventBus';
import { logger } from '../../infrastructure/logging/Logger';

export class FreelanceService {
  private jobs: FreelanceJob[] = [...SEEDED_FREELANCE_JOBS];
  private freelancers: FreelancerProfile[] = [...SEEDED_FREELANCERS];
  private proposals: FreelanceProposal[] = [...INITIAL_PROPOSALS];

  constructor() {
    logger.info('FreelanceService initialized with milestone escrow engine.', 'FreelanceMarketplace');
  }

  public getJobs(params?: {
    category?: string;
    query?: string;
    experienceLevel?: string;
  }): FreelanceJob[] {
    let result = [...this.jobs];

    if (params?.category && params.category !== 'all') {
      result = result.filter(j => j.category === params.category);
    }

    if (params?.experienceLevel && params.experienceLevel !== 'all') {
      result = result.filter(j => j.experienceLevel === params.experienceLevel);
    }

    if (params?.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.skills.some(s => s.toLowerCase().includes(q)) ||
          j.clientName.toLowerCase().includes(q)
      );
    }

    return result;
  }

  public getJobById(id: string): FreelanceJob | null {
    return this.jobs.find(j => j.id === id) || null;
  }

  public getFreelancers(params?: { category?: string; query?: string }): FreelancerProfile[] {
    let result = [...this.freelancers];

    if (params?.category && params.category !== 'all') {
      result = result.filter(f => f.category === params.category);
    }

    if (params?.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        f =>
          f.name.toLowerCase().includes(q) ||
          f.title.toLowerCase().includes(q) ||
          f.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    return result;
  }

  public getFreelancerById(id: string): FreelancerProfile | null {
    return this.freelancers.find(f => f.id === id) || null;
  }

  public postJob(payload: {
    title: string;
    description: string;
    category: FreelancerCategory;
    budget: number;
    budgetType: 'FIXED' | 'HOURLY';
    skills: string[];
    experienceLevel: 'ENTRY' | 'INTERMEDIATE' | 'EXPERT';
    duration: string;
    clientName?: string;
    milestones: Array<{ title: string; amount: number; dueDate: string }>;
  }): FreelanceJob {
    const id = `JOB-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newJob: FreelanceJob = {
      id,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      categoryLabel: payload.category.replace(/_/g, ' ').toUpperCase(),
      budget: payload.budget,
      budgetType: payload.budgetType,
      skills: payload.skills,
      experienceLevel: payload.experienceLevel,
      duration: payload.duration,
      clientId: 'CLIENT-CURRENT-USER',
      clientName: payload.clientName || 'Commerce Zone Enterprise Client',
      clientRating: 5.0,
      clientTotalSpent: 12000,
      clientCountry: 'United States',
      proposalsCount: 0,
      status: 'OPEN',
      milestones: payload.milestones.map((m, idx) => ({
        id: `M-${Date.now().toString(36)}-${idx}`,
        title: m.title,
        amount: m.amount,
        status: idx === 0 ? 'ESCROW_FUNDED' : 'PENDING',
        dueDate: m.dueDate
      })),
      postedAt: new Date().toISOString()
    };

    this.jobs.unshift(newJob);
    logger.info(`New freelance contract job posted: "${newJob.title}" (Budget: $${newJob.budget})`, 'FreelanceMarketplace');
    return newJob;
  }

  public submitProposal(payload: {
    jobId: string;
    bidAmount: number;
    deliveryDays: number;
    coverLetter: string;
    freelancerId?: string;
    freelancerName?: string;
    milestonesProposed: Array<{ title: string; amount: number }>;
  }): FreelanceProposal {
    const job = this.getJobById(payload.jobId);
    if (!job) throw new Error('Job not found');

    const proposal: FreelanceProposal = {
      id: `PROP-${Date.now().toString(36).toUpperCase()}`,
      jobId: job.id,
      jobTitle: job.title,
      freelancerId: payload.freelancerId || 'FL-CURRENT-USER',
      freelancerName: payload.freelancerName || 'Verified Elite Consultant',
      bidAmount: payload.bidAmount,
      deliveryDays: payload.deliveryDays,
      coverLetter: payload.coverLetter,
      milestonesProposed: payload.milestonesProposed,
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };

    this.proposals.unshift(proposal);
    job.proposalsCount += 1;

    logger.info(`New proposal submitted for job "${job.title}" by ${proposal.freelancerName}`, 'FreelanceMarketplace');
    return proposal;
  }

  public getProposalsForJob(jobId: string): FreelanceProposal[] {
    return this.proposals.filter(p => p.jobId === jobId);
  }

  public fundMilestone(jobId: string, milestoneId: string): { success: boolean; milestone: FreelanceMilestone } {
    const job = this.getJobById(jobId);
    if (!job) throw new Error('Job not found');

    const milestone = job.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    milestone.status = 'ESCROW_FUNDED';
    job.status = 'IN_PROGRESS';

    logger.info(`Milestone "${milestone.title}" funded into escrow ($${milestone.amount})`, 'FreelanceMarketplace');
    return { success: true, milestone };
  }

  public submitMilestoneDeliverable(
    jobId: string,
    milestoneId: string,
    deliverableNote: string
  ): { success: boolean; milestone: FreelanceMilestone } {
    const job = this.getJobById(jobId);
    if (!job) throw new Error('Job not found');

    const milestone = job.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    milestone.status = 'SUBMITTED';
    milestone.deliverableNote = deliverableNote;
    milestone.submittedAt = new Date().toISOString();

    logger.info(`Deliverable submitted for milestone "${milestone.title}" on job ${job.id}`, 'FreelanceMarketplace');
    return { success: true, milestone };
  }

  public releaseMilestoneEscrow(jobId: string, milestoneId: string): { success: boolean; milestone: FreelanceMilestone } {
    const job = this.getJobById(jobId);
    if (!job) throw new Error('Job not found');

    const milestone = job.milestones.find(m => m.id === milestoneId);
    if (!milestone) throw new Error('Milestone not found');

    milestone.status = 'RELEASED';
    milestone.releasedAt = new Date().toISOString();

    const allReleased = job.milestones.every(m => m.status === 'RELEASED');
    if (allReleased) {
      job.status = 'COMPLETED';
    }

    eventBus.publish({
      id: `evt-${Date.now()}`,
      eventType: 'ESCROW_MILESTONE_RELEASED',
      domain: 'PAYMENT',
      aggregateId: milestone.id,
      timestamp: new Date().toISOString(),
      payload: {
        jobId: job.id,
        milestoneId: milestone.id,
        amount: milestone.amount,
        title: milestone.title
      },
      actor: {
        type: 'SYSTEM',
        id: 'escrow-engine'
      }
    });

    logger.info(`Escrow funds ($${milestone.amount}) released for milestone "${milestone.title}"`, 'FreelanceMarketplace');
    return { success: true, milestone };
  }

  public getMetrics() {
    const totalJobs = this.jobs.length;
    const activeContracts = this.jobs.filter(j => j.status === 'IN_PROGRESS').length;
    const totalEscrowLocked = this.jobs.reduce((acc, job) => {
      const funded = job.milestones.filter(m => m.status === 'ESCROW_FUNDED' || m.status === 'SUBMITTED');
      return acc + funded.reduce((sum, m) => sum + m.amount, 0);
    }, 0);
    const totalPaidOut = this.jobs.reduce((acc, job) => {
      const released = job.milestones.filter(m => m.status === 'RELEASED');
      return acc + released.reduce((sum, m) => sum + m.amount, 0);
    }, 18400);

    return {
      totalJobs,
      activeContracts,
      totalFreelancers: this.freelancers.length,
      totalEscrowLockedUSD: totalEscrowLocked,
      totalPaidOutUSD: totalPaidOut,
      disputeRatePct: 0.05
    };
  }
}

export const freelanceService = new FreelanceService();
