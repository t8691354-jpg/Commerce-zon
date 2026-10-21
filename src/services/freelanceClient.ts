import {
  FreelanceJob,
  FreelancerProfile,
  FreelanceProposal,
  FreelanceMilestone
} from '../types/freelancer';

export const freelanceClient = {
  async getJobs(params?: { category?: string; q?: string; experienceLevel?: string }): Promise<{ jobs: FreelanceJob[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.q) query.set('q', params.q);
    if (params?.experienceLevel) query.set('experienceLevel', params.experienceLevel);

    const res = await fetch(`/api/freelance/jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch freelance jobs');
    return res.json();
  },

  async getJobById(id: string): Promise<FreelanceJob> {
    const res = await fetch(`/api/freelance/jobs/${id}`);
    if (!res.ok) throw new Error('Failed to fetch job details');
    const data = await res.json();
    return data.job;
  },

  async getFreelancers(params?: { category?: string; q?: string }): Promise<{ freelancers: FreelancerProfile[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.q) query.set('q', params.q);

    const res = await fetch(`/api/freelance/talent?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch talent');
    return res.json();
  },

  async postJob(payload: any): Promise<{ success: boolean; job: FreelanceJob }> {
    const res = await fetch('/api/freelance/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to post job');
    return data;
  },

  async submitProposal(payload: any): Promise<{ success: boolean; proposal: FreelanceProposal }> {
    const res = await fetch('/api/freelance/proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit proposal');
    return data;
  },

  async fundMilestone(jobId: string, milestoneId: string): Promise<{ success: boolean; milestone: FreelanceMilestone }> {
    const res = await fetch(`/api/freelance/jobs/${jobId}/milestones/${milestoneId}/fund`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fund milestone');
    return data;
  },

  async submitDeliverable(jobId: string, milestoneId: string, deliverableNote: string): Promise<{ success: boolean; milestone: FreelanceMilestone }> {
    const res = await fetch(`/api/freelance/jobs/${jobId}/milestones/${milestoneId}/deliver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliverableNote })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit deliverable');
    return data;
  },

  async releaseEscrow(jobId: string, milestoneId: string): Promise<{ success: boolean; milestone: FreelanceMilestone }> {
    const res = await fetch(`/api/freelance/jobs/${jobId}/milestones/${milestoneId}/release`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to release escrow');
    return data;
  },

  async getMetrics(): Promise<{ metrics: any }> {
    const res = await fetch('/api/freelance/metrics');
    if (!res.ok) throw new Error('Failed to fetch freelance metrics');
    return res.json();
  }
};
