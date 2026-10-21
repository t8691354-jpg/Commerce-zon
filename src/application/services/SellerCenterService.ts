import { MOCK_MERCHANTS, MOCK_PRODUCTS } from '../../data/mockData';
import { ProductRepository } from '../../infrastructure/repositories/ProductRepository';
import { OrderRepository } from '../../infrastructure/repositories/OrderRepository';
import { notificationService } from './NotificationService';
import { auditService } from './AuditService';
import {
  SellerApplication,
  SellerApplicationStatus,
  SellerOrderFulfillmentRecord,
  SellerProductCreateRequest,
  SellerProductUpdateRequest,
  SellerStaffInvitation,
  SellerStaffMember,
  SellerStaffPermission,
  SellerStaffRole,
  SellerStatusHistoryEntry,
  SellerStoreProfile,
} from '../../types/sellerCenter';
import { Merchant, MerchantTier, Product, ProductApprovalStatus } from '../../types/domain';

export class SellerCenterService {
  private static instance: SellerCenterService;

  private productRepo = new ProductRepository();
  private orderRepo = new OrderRepository();

  // In-memory data structures
  private applications: Map<string, SellerApplication> = new Map();
  private stores: Map<string, SellerStoreProfile> = new Map();
  private staffMembers: Map<string, SellerStaffMember[]> = new Map(); // merchantId -> staff
  private invitations: Map<string, SellerStaffInvitation> = new Map(); // token -> invitation
  private fulfillments: Map<string, SellerOrderFulfillmentRecord[]> = new Map(); // merchantId -> fulfillments

  private constructor() {
    this.seedInitialData();
  }

  public static getInstance(): SellerCenterService {
    if (!SellerCenterService.instance) {
      SellerCenterService.instance = new SellerCenterService();
    }
    return SellerCenterService.instance;
  }

  private seedInitialData() {
    // 1. Seed Store Profiles from existing MOCK_MERCHANTS
    MOCK_MERCHANTS.forEach((m) => {
      const profile: SellerStoreProfile = {
        merchantId: m.id,
        userId: `usr-${m.id}`,
        name: m.name,
        code: m.code,
        slug: m.code.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Official verified marketplace storefront for ${m.name}. Leading enterprise industrial and technology solutions with FBA Prime nationwide distribution.`,
        logoUrl: m.logoUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80',
        bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
        contactEmail: `support@${m.code.toLowerCase()}.commercezon.io`,
        contactPhone: '+1 (800) 555-0199',
        country: 'USA',
        city: 'Newark',
        address: '100 Industrial Parkway, Suite 400',
        tier: m.tier,
        rating: m.rating,
        reviewCount: m.reviewCount,
        isVerified: m.isVerified,
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        policies: {
          shippingPolicy: 'Dispatched within 24 hours via Commerce Zon FBA Prime network with end-to-end tracking.',
          returnPolicy: '30-day standard enterprise return policy with zero restocking fees for verified hardware.',
          warrantyPolicy: '1-year comprehensive manufacturer warranty and 24/7 technical engineering support.',
          privacyPolicyAccepted: true,
          termsAcceptedDate: '2024-01-15T00:00:00Z',
        },
        createdAt: m.createdAt,
        updatedAt: new Date().toISOString(),
      };
      this.stores.set(m.id, profile);

      // Seed Staff for this store
      this.staffMembers.set(m.id, [
        {
          id: `staff-${m.id}-1`,
          merchantId: m.id,
          userId: `usr-${m.id}`,
          name: `${m.name} General Manager`,
          email: `admin@${m.code.toLowerCase()}.commercezon.io`,
          role: 'STORE_OWNER',
          permissions: {
            canManageProducts: true,
            canManageOrders: true,
            canViewFinancials: true,
            canManageTeam: true,
            canEditStoreSettings: true,
          },
          status: 'ACTIVE',
          invitedAt: m.createdAt,
          joinedAt: m.createdAt,
        },
        {
          id: `staff-${m.id}-2`,
          merchantId: m.id,
          name: 'Fulfillment Lead',
          email: `logistics@${m.code.toLowerCase()}.commercezon.io`,
          role: 'ORDER_MANAGER',
          permissions: {
            canManageProducts: false,
            canManageOrders: true,
            canViewFinancials: false,
            canManageTeam: false,
            canEditStoreSettings: false,
          },
          status: 'ACTIVE',
          invitedAt: m.createdAt,
          joinedAt: m.createdAt,
        },
      ]);
    });

    // 2. Seed Mock Applications
    const appApproved: SellerApplication = {
      id: 'app-001',
      userId: 'usr-merch-01',
      applicantName: 'Marcus Sterling',
      storeName: 'Apex Robotics & Industrial',
      storeSlug: 'apex-robotics',
      storeDescription: 'Pioneering AI-driven industrial robotics, automated cobots, and high-precision servos.',
      category: 'robotics',
      plan: 'PROFESSIONAL',
      logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=400&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      business: {
        businessName: 'Apex Global Robotics LLC',
        businessType: 'LLC',
        registrationNumber: 'US-DE-892104-B',
        taxIdVat: 'XX-XXXXX8901',
        country: 'USA',
        stateProvince: 'Delaware',
        city: 'Wilmington',
        addressLine1: '1209 Orange Street',
        postalCode: '19801',
        businessPhone: '+1 (302) 555-0144',
        businessEmail: 'corporate@apexrobotics.io',
        websiteUrl: 'https://apexrobotics.example.com',
      },
      policies: {
        shippingPolicy: 'Same-day dispatch on stock units with temperature and shock-controlled transit packaging.',
        returnPolicy: '30-day money-back guarantee with authorized return merchandise tag (RMA).',
        warrantyPolicy: '3-year enterprise manufacturer parts and labor warranty.',
        privacyPolicyAccepted: true,
        termsAcceptedDate: '2024-01-10T12:00:00Z',
      },
      status: 'APPROVED',
      reviewedByAdminId: 'admin-01',
      reviewedByAdminName: 'Super Admin',
      reviewedAt: '2024-01-15T00:00:00Z',
      submittedAt: '2024-01-10T12:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      history: [
        {
          id: 'hist-1',
          fromStatus: 'DRAFT',
          toStatus: 'SUBMITTED',
          reason: 'Initial application submitted by Marcus Sterling.',
          timestamp: '2024-01-10T12:00:00Z',
        },
        {
          id: 'hist-2',
          fromStatus: 'SUBMITTED',
          toStatus: 'UNDER_REVIEW',
          reason: 'KYC and Delaware corporate registration verified.',
          adminId: 'admin-01',
          adminName: 'Super Admin',
          timestamp: '2024-01-12T09:30:00Z',
        },
        {
          id: 'hist-3',
          fromStatus: 'UNDER_REVIEW',
          toStatus: 'APPROVED',
          reason: 'All documentation verified. Flagship tier approved.',
          adminId: 'admin-01',
          adminName: 'Super Admin',
          timestamp: '2024-01-15T00:00:00Z',
        },
      ],
    };

    const appUnderReview: SellerApplication = {
      id: 'app-002',
      userId: 'usr-applicant-02',
      applicantName: 'Elena Chen',
      storeName: 'Quantum Precision Optics',
      storeSlug: 'quantum-precision-optics',
      storeDescription: 'High-power optical components, industrial LiDAR receivers, and aerospace laser lenses.',
      category: 'industrial',
      plan: 'PROFESSIONAL',
      logoUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=400&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
      business: {
        businessName: 'Quantum Optics Technologies Corp',
        businessType: 'CORPORATION',
        registrationNumber: 'US-CA-449102-C',
        taxIdVat: 'XX-XXXXX4412',
        country: 'USA',
        stateProvince: 'California',
        city: 'San Jose',
        addressLine1: '400 Technology Drive, Suite 12',
        postalCode: '95110',
        businessPhone: '+1 (408) 555-8910',
        businessEmail: 'contact@quantumoptics.example.com',
        websiteUrl: 'https://quantumoptics.example.com',
      },
      policies: {
        shippingPolicy: 'Shipped via insured courier with certified anti-vibration packaging.',
        returnPolicy: '14-day inspection window with cleanroom inspection prior to refund issuance.',
        warrantyPolicy: '2-year optical calibration warranty.',
        privacyPolicyAccepted: true,
        termsAcceptedDate: '2026-07-20T10:00:00Z',
      },
      status: 'UNDER_REVIEW',
      reviewNotes: 'Validating California optics license and cleanroom standard documentation.',
      reviewedByAdminId: 'admin-01',
      reviewedByAdminName: 'Super Admin',
      submittedAt: '2026-07-20T10:00:00Z',
      updatedAt: '2026-07-22T14:15:00Z',
      history: [
        {
          id: 'hist-201',
          fromStatus: 'DRAFT',
          toStatus: 'SUBMITTED',
          reason: 'Application submitted for admin review.',
          timestamp: '2026-07-20T10:00:00Z',
        },
        {
          id: 'hist-202',
          fromStatus: 'SUBMITTED',
          toStatus: 'UNDER_REVIEW',
          reason: 'Assigned to compliance officer for certification audit.',
          adminId: 'admin-01',
          adminName: 'Super Admin',
          timestamp: '2026-07-22T14:15:00Z',
        },
      ],
    };

    const appChangesRequested: SellerApplication = {
      id: 'app-003',
      userId: 'usr-applicant-03',
      applicantName: 'David K. Vance',
      storeName: 'Titan Battery Systems',
      storeSlug: 'titan-battery-systems',
      storeDescription: 'High-density lithium ferro-phosphate packs for off-grid robotics and data backup.',
      category: 'electronics',
      plan: 'INDIVIDUAL',
      business: {
        businessName: 'Titan Power Works LLC',
        businessType: 'LLC',
        registrationNumber: 'US-TX-990112',
        taxIdVat: 'XX-XXXXX9910',
        country: 'USA',
        stateProvince: 'Texas',
        city: 'Austin',
        addressLine1: '890 Energy Way',
        postalCode: '78701',
        businessPhone: '+1 (512) 555-3211',
        businessEmail: 'david@titanpower.example.com',
      },
      policies: {
        shippingPolicy: 'Ground freight only due to hazardous battery transportation regulations.',
        returnPolicy: 'Returns only accepted in original UN3480 certified packaging.',
        warrantyPolicy: '5-year capacity retention guarantee (min 80% original capacity).',
        privacyPolicyAccepted: true,
        termsAcceptedDate: '2026-07-23T09:00:00Z',
      },
      status: 'CHANGES_REQUESTED',
      reviewNotes: 'Please provide proof of UN 38.3 lithium battery transport certification and update your high-resolution store logo.',
      requestedChanges: [
        'Attach or provide UN 38.3 transport test certificate number.',
        'Upload square 400x400 store logo image.',
        'Clarify hazardous return shipping guidelines in return policy.',
      ],
      reviewedByAdminId: 'admin-01',
      reviewedByAdminName: 'Super Admin',
      reviewedAt: '2026-07-24T16:00:00Z',
      submittedAt: '2026-07-23T09:00:00Z',
      updatedAt: '2026-07-24T16:00:00Z',
      history: [
        {
          id: 'hist-301',
          fromStatus: 'DRAFT',
          toStatus: 'SUBMITTED',
          reason: 'Application submitted.',
          timestamp: '2026-07-23T09:00:00Z',
        },
        {
          id: 'hist-302',
          fromStatus: 'SUBMITTED',
          toStatus: 'CHANGES_REQUESTED',
          reason: 'Missing safety documentation for hazardous materials handling.',
          adminId: 'admin-01',
          adminName: 'Super Admin',
          timestamp: '2026-07-24T16:00:00Z',
        },
      ],
    };

    this.applications.set(appApproved.id, appApproved);
    this.applications.set(appUnderReview.id, appUnderReview);
    this.applications.set(appChangesRequested.id, appChangesRequested);
  }

  // ==========================================
  // PHASE 2 & 3: SELLER ONBOARDING & STATUS LIFECYCLE
  // ==========================================

  /**
   * Submit or register a new seller application
   */
  async submitApplication(userId: string, data: Partial<SellerApplication>): Promise<SellerApplication> {
    if (!data.storeName || data.storeName.trim().length < 3) {
      throw new Error('Store name must be at least 3 characters long.');
    }

    const slug = (data.storeSlug || data.storeName)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check unique store name and slug against existing approved stores and pending applications
    const existingStore = Array.from(this.stores.values()).find(
      (s) => s.slug === slug || s.name.toLowerCase() === data.storeName?.toLowerCase()
    );
    if (existingStore) {
      throw new Error(`Store name or slug "${slug}" is already taken by an active merchant.`);
    }

    const existingApp = Array.from(this.applications.values()).find(
      (a) => a.userId === userId && a.status !== 'REJECTED'
    );
    if (existingApp && existingApp.status !== 'CHANGES_REQUESTED' && existingApp.status !== 'DRAFT') {
      throw new Error(`You already have an active application in status: ${existingApp.status}`);
    }

    const appId = existingApp ? existingApp.id : `app-${Date.now()}`;
    const now = new Date().toISOString();

    const application: SellerApplication = {
      id: appId,
      userId,
      applicantName: data.applicantName || 'Applicant',
      storeName: data.storeName.trim(),
      storeSlug: slug,
      storeDescription: data.storeDescription || 'Marketplace merchant store.',
      category: data.category || 'computing',
      plan: data.plan || 'PROFESSIONAL',
      logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80',
      bannerUrl: data.bannerUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
      business: {
        businessName: data.business?.businessName || data.storeName,
        businessType: data.business?.businessType || 'LLC',
        registrationNumber: data.business?.registrationNumber || `REG-${Date.now().toString().slice(-6)}`,
        taxIdVat: data.business?.taxIdVat || 'XX-XXXXX0000',
        country: data.business?.country || 'USA',
        stateProvince: data.business?.stateProvince || 'California',
        city: data.business?.city || 'San Francisco',
        addressLine1: data.business?.addressLine1 || 'Marketplace Plaza',
        postalCode: data.business?.postalCode || '94105',
        businessPhone: data.business?.businessPhone || '+1 (555) 000-0000',
        businessEmail: data.business?.businessEmail || `${slug}@commercezon.io`,
        websiteUrl: data.business?.websiteUrl,
      },
      policies: {
        shippingPolicy: data.policies?.shippingPolicy || 'Standard 3-5 day insured courier shipping with tracking.',
        returnPolicy: data.policies?.returnPolicy || '30-day money back guarantee for unopened items.',
        warrantyPolicy: data.policies?.warrantyPolicy || '1-year standard warranty coverage.',
        privacyPolicyAccepted: true,
        termsAcceptedDate: now,
      },
      status: 'SUBMITTED',
      submittedAt: now,
      updatedAt: now,
      history: existingApp
        ? [
            ...existingApp.history,
            {
              id: `hist-${Date.now()}`,
              fromStatus: existingApp.status,
              toStatus: 'SUBMITTED',
              reason: 'Application submitted/resubmitted by seller.',
              timestamp: now,
            },
          ]
        : [
            {
              id: `hist-${Date.now()}`,
              fromStatus: 'DRAFT',
              toStatus: 'SUBMITTED',
              reason: 'Initial application submitted for administrative review.',
              timestamp: now,
            },
          ],
    };

    this.applications.set(appId, application);

    // Audit and notify
    auditService.recordEvent('MOCK_USER', userId, 'SELLER_APPLICATION_SUBMITTED', 'SECURITY', `Submitted seller application for "${application.storeName}" (${application.id})`);

    await notificationService.sendNotification({
      recipientId: userId,
      channel: 'in_app',
      category: 'Account',
      title: 'Seller Application Received',
      body: `Your application to open "${application.storeName}" has been submitted for review. Our administrative team typically reviews applications within 24-48 business hours.`,
      priority: 'high',
    });

    return application;
  }

  /**
   * Resubmit after changes were requested
   */
  async resubmitApplication(
    applicationId: string,
    userId: string,
    updates: Partial<SellerApplication>
  ): Promise<SellerApplication> {
    const app = this.applications.get(applicationId);
    if (!app) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    if (app.userId !== userId) {
      throw new Error('Unauthorized to modify this application.');
    }

    if (app.status !== 'CHANGES_REQUESTED' && app.status !== 'DRAFT') {
      throw new Error(`Cannot resubmit application in status "${app.status}". Only applications with changes requested can be resubmitted.`);
    }

    const now = new Date().toISOString();
    const updated: SellerApplication = {
      ...app,
      ...updates,
      id: app.id,
      userId: app.userId,
      status: 'SUBMITTED',
      requestedChanges: undefined,
      reviewNotes: undefined,
      updatedAt: now,
      history: [
        ...app.history,
        {
          id: `hist-${Date.now()}`,
          fromStatus: app.status,
          toStatus: 'SUBMITTED',
          reason: 'Seller resolved requested changes and resubmitted application for verification.',
          timestamp: now,
        },
      ],
    };

    this.applications.set(applicationId, updated);

    auditService.recordEvent('MOCK_USER', userId, 'SELLER_APPLICATION_RESUBMITTED', 'SECURITY', `Resubmitted seller application "${app.storeName}" after requested changes.`);

    await notificationService.sendNotification({
      recipientId: userId,
      channel: 'in_app',
      category: 'Account',
      title: 'Application Resubmitted Successfully',
      body: `Your updated application for "${app.storeName}" has been re-queued for administrative review.`,
      priority: 'normal',
    });

    return updated;
  }

  /**
   * Get application by user ID
   */
  getApplicationByUserId(userId: string): SellerApplication | null {
    const apps = Array.from(this.applications.values()).filter((a) => a.userId === userId);
    if (apps.length === 0) return null;
    // Return latest
    return apps.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  }

  /**
   * List all applications for Admin view
   */
  listApplications(filterStatus?: SellerApplicationStatus): SellerApplication[] {
    const list = Array.from(this.applications.values());
    if (filterStatus) {
      return list.filter((a) => a.status === filterStatus);
    }
    return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  /**
   * Admin reviews application: Approve, Reject, or Request Changes
   */
  async reviewApplication(
    applicationId: string,
    adminId: string,
    adminName: string,
    decision: 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES',
    params: {
      notes?: string;
      requestedChanges?: string[];
      rejectionReason?: string;
      tier?: MerchantTier;
    }
  ): Promise<SellerApplication> {
    const app = this.applications.get(applicationId);
    if (!app) {
      throw new Error(`Application ${applicationId} not found.`);
    }

    const now = new Date().toISOString();
    let toStatus: SellerApplicationStatus;

    if (decision === 'APPROVE') {
      toStatus = 'APPROVED';
    } else if (decision === 'REJECT') {
      if (!params.rejectionReason) {
        throw new Error('A detailed rejection reason is required to reject a seller application.');
      }
      toStatus = 'REJECTED';
    } else if (decision === 'REQUEST_CHANGES') {
      if (!params.requestedChanges || params.requestedChanges.length === 0) {
        throw new Error('At least one specific item must be specified in requested changes.');
      }
      toStatus = 'CHANGES_REQUESTED';
    } else {
      throw new Error(`Invalid decision ${decision}`);
    }

    const updated: SellerApplication = {
      ...app,
      status: toStatus,
      reviewNotes: params.notes || app.reviewNotes,
      requestedChanges: decision === 'REQUEST_CHANGES' ? params.requestedChanges : undefined,
      rejectionReason: decision === 'REJECT' ? params.rejectionReason : undefined,
      reviewedByAdminId: adminId,
      reviewedByAdminName: adminName,
      reviewedAt: now,
      updatedAt: now,
      history: [
        ...app.history,
        {
          id: `hist-${Date.now()}`,
          fromStatus: app.status,
          toStatus,
          reason: params.notes || (decision === 'APPROVE' ? 'Application approved by Admin' : params.rejectionReason || 'Changes requested by Admin'),
          adminId,
          adminName,
          timestamp: now,
        },
      ],
    };

    this.applications.set(applicationId, updated);

    // If APPROVED, instantiate or activate Store Profile and owner team member!
    if (decision === 'APPROVE') {
      const merchantId = `merch-${app.storeSlug}`;
      const storeProfile: SellerStoreProfile = {
        merchantId,
        userId: app.userId,
        name: app.storeName,
        code: app.storeSlug.toUpperCase(),
        slug: app.storeSlug,
        description: app.storeDescription,
        logoUrl: app.logoUrl,
        bannerUrl: app.bannerUrl,
        contactEmail: app.business.businessEmail,
        contactPhone: app.business.businessPhone,
        country: app.business.country,
        city: app.business.city,
        address: `${app.business.addressLine1}, ${app.business.city}, ${app.business.stateProvince}`,
        tier: params.tier || (app.plan === 'PROFESSIONAL' ? 'enterprise' : 'standard'),
        rating: 5.0,
        reviewCount: 0,
        isVerified: true,
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        policies: app.policies,
        createdAt: now,
        updatedAt: now,
      };

      this.stores.set(merchantId, storeProfile);

      // Create owner staff member
      this.staffMembers.set(merchantId, [
        {
          id: `staff-${merchantId}-owner`,
          merchantId,
          userId: app.userId,
          name: app.applicantName,
          email: app.business.businessEmail,
          role: 'STORE_OWNER',
          permissions: {
            canManageProducts: true,
            canManageOrders: true,
            canViewFinancials: true,
            canManageTeam: true,
            canEditStoreSettings: true,
          },
          status: 'ACTIVE',
          invitedAt: now,
          joinedAt: now,
        },
      ]);

      auditService.recordEvent('SYSTEM', adminId, 'SELLER_APPLICATION_APPROVED', 'SECURITY', `Approved seller application "${app.storeName}" (${merchantId}) with tier "${storeProfile.tier}"`);

      await notificationService.sendNotification({
        recipientId: app.userId,
        channel: 'in_app',
        category: 'Account',
        title: '🎉 Welcome to Commerce Zon! Store Approved',
        body: `Congratulations! Your seller application for "${app.storeName}" has been approved. You can now access your Seller Center, list products, and fulfill orders.`,
        priority: 'high',
      });
    } else if (decision === 'REJECT') {
      auditService.recordEvent('SYSTEM', adminId, 'SELLER_APPLICATION_REJECTED', 'SECURITY', `Rejected seller application "${app.storeName}". Reason: ${params.rejectionReason}`);

      await notificationService.sendNotification({
        recipientId: app.userId,
        channel: 'in_app',
        category: 'Account',
        title: 'Seller Application Decision',
        body: `Your seller application for "${app.storeName}" was not approved at this time. Reason: ${params.rejectionReason}`,
        priority: 'high',
      });
    } else if (decision === 'REQUEST_CHANGES') {
      auditService.recordEvent('SYSTEM', adminId, 'SELLER_APPLICATION_CHANGES_REQUESTED', 'SECURITY', `Requested changes for application "${app.storeName}".`);

      await notificationService.sendNotification({
        recipientId: app.userId,
        channel: 'in_app',
        category: 'Account',
        title: 'Action Required: Seller Application Revisions',
        body: `The administrative team requested revisions to your seller application for "${app.storeName}". Please review the notes and resubmit from your Seller Center.`,
        priority: 'high',
      });
    }

    return updated;
  }

  // ==========================================
  // PHASE 4: SELLER STORE MANAGEMENT
  // ==========================================

  /**
   * Get store profile by merchantId
   */
  getStoreProfile(merchantId: string): SellerStoreProfile | null {
    return this.stores.get(merchantId) || null;
  }

  /**
   * Get all active stores
   */
  getAllStores(): SellerStoreProfile[] {
    return Array.from(this.stores.values());
  }

  /**
   * Update store profile by owner or manager
   */
  async updateStoreProfile(
    merchantId: string,
    updaterUserId: string,
    updates: Partial<SellerStoreProfile>
  ): Promise<SellerStoreProfile> {
    const store = this.stores.get(merchantId);
    if (!store) {
      throw new Error(`Store with merchantId "${merchantId}" not found.`);
    }

    // Check staff permissions
    const staff = this.staffMembers.get(merchantId) || [];
    const isOwner = store.userId === updaterUserId;
    const staffMember = staff.find((s) => s.userId === updaterUserId && s.status === 'ACTIVE');
    const canEdit = isOwner || (staffMember && staffMember.permissions.canEditStoreSettings);

    if (!canEdit) {
      throw new Error('Forbidden: You do not have permission to edit this store profile.');
    }

    // Prevent changing administrative fields
    const safeUpdates: Partial<SellerStoreProfile> = {
      name: updates.name ? updates.name.trim() : store.name,
      description: updates.description !== undefined ? updates.description : store.description,
      logoUrl: updates.logoUrl || store.logoUrl,
      bannerUrl: updates.bannerUrl || store.bannerUrl,
      contactEmail: updates.contactEmail || store.contactEmail,
      contactPhone: updates.contactPhone || store.contactPhone,
      city: updates.city || store.city,
      country: updates.country || store.country,
      address: updates.address || store.address,
      visibility: updates.visibility || store.visibility,
      policies: updates.policies
        ? {
            ...store.policies,
            ...updates.policies,
          }
        : store.policies,
      updatedAt: new Date().toISOString(),
    };

    const updatedStore = {
      ...store,
      ...safeUpdates,
    };

    this.stores.set(merchantId, updatedStore);

    auditService.recordEvent('MOCK_MERCHANT', merchantId, 'STORE_PROFILE_UPDATED', 'CATALOG', `Store profile updated for "${updatedStore.name}".`);

    return updatedStore;
  }

  /**
   * Admin sets store status: ACTIVE or SUSPENDED
   */
  async setStoreStatusByAdmin(
    merchantId: string,
    adminId: string,
    status: 'ACTIVE' | 'SUSPENDED',
    reason?: string
  ): Promise<SellerStoreProfile> {
    const store = this.stores.get(merchantId);
    if (!store) {
      throw new Error(`Store ${merchantId} not found.`);
    }

    if (status === 'SUSPENDED' && !reason) {
      throw new Error('A suspension reason is mandatory when suspending a merchant.');
    }

    store.status = status;
    store.suspensionReason = status === 'SUSPENDED' ? reason : undefined;
    store.updatedAt = new Date().toISOString();

    this.stores.set(merchantId, store);

    auditService.recordEvent('SYSTEM', adminId, status === 'SUSPENDED' ? 'MERCHANT_SUSPENDED' : 'MERCHANT_REINSTATED', 'SECURITY', `${status} merchant "${store.name}". Reason: ${reason || 'Admin action'}`);

    await notificationService.sendNotification({
      recipientId: store.userId,
      channel: 'in_app',
      category: 'Security',
      title: status === 'SUSPENDED' ? '⚠️ Store Suspended by Platform Admin' : '✅ Store Reinstated',
      body: status === 'SUSPENDED'
        ? `Your store "${store.name}" has been suspended. Reason: ${reason}. Product listings are temporarily hidden from search.`
        : `Your store "${store.name}" has been reinstated and listings are now live.`,
      priority: 'high',
    });

    return store;
  }

  /**
   * Admin sets merchant tier
   */
  setStoreTierByAdmin(merchantId: string, adminId: string, tier: MerchantTier): SellerStoreProfile {
    const store = this.stores.get(merchantId);
    if (!store) throw new Error(`Store ${merchantId} not found.`);
    store.tier = tier;
    store.updatedAt = new Date().toISOString();
    this.stores.set(merchantId, store);
    auditService.recordEvent('SYSTEM', adminId, 'MERCHANT_TIER_UPDATED', 'SECURITY', `Updated tier for "${store.name}" to ${tier}`);
    return store;
  }

  // ==========================================
  // PHASE 5: SELLER TEAM AND PERMISSIONS
  // ==========================================

  /**
   * Get team members for a merchant store
   */
  getStoreTeam(merchantId: string): SellerStaffMember[] {
    return this.staffMembers.get(merchantId) || [];
  }

  /**
   * Invite team member
   */
  async inviteTeamMember(
    merchantId: string,
    inviterUserId: string,
    email: string,
    name: string,
    role: SellerStaffRole,
    customPermissions?: Partial<SellerStaffPermission>
  ): Promise<SellerStaffInvitation> {
    const store = this.stores.get(merchantId);
    if (!store) throw new Error(`Store ${merchantId} not found.`);

    // Verify permission
    const staff = this.staffMembers.get(merchantId) || [];
    const isOwner = store.userId === inviterUserId;
    const member = staff.find((s) => s.userId === inviterUserId);
    if (!isOwner && (!member || !member.permissions.canManageTeam)) {
      throw new Error('Forbidden: You do not have permission to invite team members.');
    }

    // Role default permissions
    const permissions: SellerStaffPermission = {
      canManageProducts: role === 'STORE_OWNER' || role === 'STORE_MANAGER' || role === 'PRODUCT_MANAGER',
      canManageOrders: role === 'STORE_OWNER' || role === 'STORE_MANAGER' || role === 'ORDER_MANAGER',
      canViewFinancials: role === 'STORE_OWNER' || role === 'STORE_MANAGER',
      canManageTeam: role === 'STORE_OWNER',
      canEditStoreSettings: role === 'STORE_OWNER' || role === 'STORE_MANAGER',
      ...customPermissions,
    };

    const token = `inv-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const invitation: SellerStaffInvitation = {
      id: `inv-id-${Date.now()}`,
      merchantId,
      storeName: store.name,
      email: email.toLowerCase().trim(),
      role,
      permissions,
      token,
      expiresAt,
      status: 'PENDING',
      invitedBy: inviterUserId,
      createdAt: new Date().toISOString(),
    };

    this.invitations.set(token, invitation);

    // Also create invited staff entry
    const newStaff: SellerStaffMember = {
      id: `staff-${Date.now()}`,
      merchantId,
      name,
      email: email.toLowerCase().trim(),
      role,
      permissions,
      status: 'INVITED',
      invitedAt: new Date().toISOString(),
    };

    this.staffMembers.set(merchantId, [...staff, newStaff]);

    auditService.recordEvent('MOCK_MERCHANT', merchantId, 'STAFF_INVITED', 'SECURITY', `Invited ${email} as ${role} for store ${store.name}`);

    return invitation;
  }

  /**
   * Accept an invitation
   */
  acceptInvitation(token: string, userId: string, userName: string): SellerStaffMember {
    const inv = this.invitations.get(token);
    if (!inv) throw new Error('Invalid or non-existent invitation token.');
    if (inv.status !== 'PENDING') throw new Error(`Invitation is already ${inv.status}.`);
    if (new Date() > new Date(inv.expiresAt)) {
      inv.status = 'EXPIRED';
      throw new Error('Invitation token has expired.');
    }

    inv.status = 'ACCEPTED';

    const staffList = this.staffMembers.get(inv.merchantId) || [];
    const staffMember = staffList.find((s) => s.email.toLowerCase() === inv.email.toLowerCase());

    if (staffMember) {
      staffMember.status = 'ACTIVE';
      staffMember.userId = userId;
      staffMember.name = userName || staffMember.name;
      staffMember.joinedAt = new Date().toISOString();
    }

    return staffMember!;
  }

  /**
   * Remove team member
   */
  removeTeamMember(merchantId: string, memberId: string, requestingUserId: string): void {
    const store = this.stores.get(merchantId);
    if (!store) throw new Error('Store not found.');

    const staffList = this.staffMembers.get(merchantId) || [];
    const target = staffList.find((s) => s.id === memberId);
    if (!target) throw new Error('Staff member not found.');

    if (target.role === 'STORE_OWNER') {
      throw new Error('Cannot remove the primary Store Owner.');
    }

    const isOwner = store.userId === requestingUserId;
    const reqMember = staffList.find((s) => s.userId === requestingUserId);
    if (!isOwner && (!reqMember || !reqMember.permissions.canManageTeam)) {
      throw new Error('Forbidden: Insufficient privileges to remove team members.');
    }

    this.staffMembers.set(
      merchantId,
      staffList.filter((s) => s.id !== memberId)
    );

    auditService.recordEvent('MOCK_MERCHANT', merchantId, 'STAFF_REMOVED', 'SECURITY', `Removed staff member ${target.email} from store ${store.name}`);
  }

  // ==========================================
  // PHASE 6: SELLER PRODUCT OPERATIONS
  // ==========================================

  /**
   * Get products for a specific seller
   */
  async getSellerProducts(merchantId: string): Promise<Product[]> {
    const all = await this.productRepo.findAll();
    return all.filter((p) => p.merchant.id === merchantId);
  }

  /**
   * Create product as seller
   */
  async createProduct(
    merchantId: string,
    userId: string,
    data: SellerProductCreateRequest
  ): Promise<Product> {
    const store = this.stores.get(merchantId);
    if (!store) throw new Error(`Store ${merchantId} not found.`);
    if (store.status === 'SUSPENDED') {
      throw new Error('Cannot create new products while your merchant store is suspended.');
    }

    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Product title must be at least 3 characters.');
    }
    if (!data.sku || data.sku.trim().length < 2) {
      throw new Error('SKU is required.');
    }
    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new Error('Price must be greater than zero.');
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: `prod-cz-${Date.now()}`,
      title: data.title.trim(),
      slug: data.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku: data.sku.toUpperCase().trim(),
      description: data.description || 'Enterprise catalog product.',
      shortDescription: data.shortDescription,
      category: data.category,
      price: { amount: Number(data.price), currency: (data.currency as any) || 'USD' },
      merchant: {
        id: store.merchantId,
        name: store.name,
        code: store.code,
        tier: store.tier,
        rating: store.rating,
        reviewCount: store.reviewCount,
        isVerified: store.isVerified,
        createdAt: store.createdAt,
      },
      images: data.images && data.images.length > 0
        ? data.images
        : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'],
      totalStock: data.totalStock || 0,
      approvalStatus: data.status === 'DRAFT' ? 'DRAFT' : 'SUBMITTED',
      rating: 5.0,
      reviewCount: 0,
      variants: [],
      warehouseStock: [
        {
          warehouseId: 'wh-01',
          warehouseName: 'New York Metro Fulfillment Hub',
          code: 'WH-US-EAST',
          quantity: data.totalStock || 0,
          reserved: 0,
          reorderLevel: data.reorderLevel || 10,
        },
      ],
      tags: data.tags || [data.category, store.name.toLowerCase()],
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    await this.productRepo.create(newProduct);

    auditService.recordEvent('MOCK_MERCHANT', merchantId, 'PRODUCT_CREATED', 'CATALOG', `Listed product "${newProduct.title}" (${newProduct.sku}) in status ${newProduct.approvalStatus}`);

    await notificationService.sendNotification({
      recipientId: store.userId,
      channel: 'in_app',
      category: 'Catalog',
      title: 'Product Submitted For Review',
      body: `"${newProduct.title}" (${newProduct.sku}) has been successfully submitted and queued for moderation.`,
      priority: 'normal',
    });

    return newProduct;
  }

  /**
   * Update product owned by seller
   */
  async updateProduct(
    productId: string,
    merchantId: string,
    userId: string,
    data: SellerProductUpdateRequest
  ): Promise<Product> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error(`Product ${productId} not found.`);

    if (product.merchant.id !== merchantId) {
      throw new Error('Forbidden: You can only edit products belonging to your store.');
    }

    const updated: Product = {
      ...product,
      title: data.title !== undefined ? data.title.trim() : product.title,
      description: data.description !== undefined ? data.description : product.description,
      price: data.price !== undefined ? { amount: Number(data.price), currency: (data.currency as any) || product.price.currency || 'USD' } : product.price,
      category: data.category || product.category,
      totalStock: data.totalStock !== undefined ? data.totalStock : product.totalStock,
      images: data.images && data.images.length > 0 ? data.images : product.images,
      approvalStatus: data.approvalStatus || product.approvalStatus,
      updatedAt: new Date().toISOString(),
    };

    await this.productRepo.update(productId, updated);

    auditService.recordEvent('MOCK_MERCHANT', merchantId, 'PRODUCT_UPDATED', 'CATALOG', `Updated product "${updated.title}" (${updated.sku})`);

    return updated;
  }

  /**
   * Admin moderate product: approve or reject
   */
  async moderateProduct(
    productId: string,
    adminId: string,
    decision: 'APPROVE' | 'REJECT',
    reason?: string
  ): Promise<Product> {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error(`Product ${productId} not found.`);

    const newStatus: ProductApprovalStatus = decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    const updated: Product = {
      ...product,
      approvalStatus: newStatus,
      flagReason: decision === 'REJECT' ? reason : undefined,
      updatedAt: new Date().toISOString(),
    };

    await this.productRepo.update(productId, updated);

    auditService.recordEvent('SYSTEM', adminId, decision === 'APPROVE' ? 'PRODUCT_APPROVED' : 'PRODUCT_REJECTED', 'CATALOG', `${decision} product "${product.title}" (${product.sku})`);

    const store = this.stores.get(product.merchant.id);
    if (store) {
      await notificationService.sendNotification({
        recipientId: store.userId,
        channel: 'in_app',
        category: 'Catalog',
        title: decision === 'APPROVE' ? 'Product Approved & Live!' : 'Product Rejected by Moderation',
        body: decision === 'APPROVE'
          ? `Your product "${product.title}" has been approved and is now discoverable in the marketplace.`
          : `Your product "${product.title}" was rejected. Reason: ${reason || 'Does not adhere to catalog guidelines.'}`,
        priority: 'high',
      });
    }

    return updated;
  }

  // ==========================================
  // PHASE 7: SELLER ORDER OPERATIONS & FULFILLMENT
  // ==========================================

  /**
   * Get orders containing items belonging to this merchant
   */
  async getSellerOrders(merchantId: string) {
    const allOrders = await this.orderRepo.findAll();
    const sellerOrders = allOrders
      .filter((o) => o.items.some((item) => item.merchantId === merchantId))
      .map((o) => {
        const merchantItems = o.items.filter((item) => item.merchantId === merchantId);
        const sellerGrossAmount = merchantItems.reduce((acc, item) => acc + item.totalPrice.amount, 0);
        const commissionDeduction = sellerGrossAmount * 0.10; // 10% standard marketplace take
        const sellerNetPayout = sellerGrossAmount - commissionDeduction;

        const fulfillmentRecord = (this.fulfillments.get(merchantId) || []).find((f) => f.orderId === o.id);

        return {
          orderId: o.id,
          orderNumber: o.orderNumber,
          customerName: o.customerName || 'Valued Buyer',
          customerCity: o.shippingAddress?.city || 'New York',
          customerCountry: o.shippingAddress?.country || 'USA',
          date: o.createdAt,
          overallStatus: o.status,
          merchantItems,
          sellerGrossAmount,
          commissionDeduction,
          sellerNetPayout,
          fulfillment: fulfillmentRecord || null,
        };
      });

    return sellerOrders;
  }

  /**
   * Fulfill order item with carrier and tracking
   */
  async fulfillOrder(
    merchantId: string,
    orderId: string,
    data: {
      carrier: string;
      trackingNumber: string;
      dispatchNotes?: string;
    }
  ): Promise<SellerOrderFulfillmentRecord> {
    if (!data.carrier || !data.trackingNumber) {
      throw new Error('Carrier name and tracking number are required for order dispatch.');
    }

    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found.`);

    const hasMerchantItems = order.items.some((i) => i.merchantId === merchantId);
    if (!hasMerchantItems) {
      throw new Error('Forbidden: This order does not contain products from your store.');
    }

    const record: SellerOrderFulfillmentRecord = {
      orderId,
      orderNumber: order.orderNumber,
      merchantId,
      carrier: data.carrier.trim(),
      trackingNumber: data.trackingNumber.trim(),
      trackingUrl: `https://track.commercezon.io/${encodeURIComponent(data.carrier)}/${encodeURIComponent(data.trackingNumber)}`,
      dispatchNotes: data.dispatchNotes,
      shippedAt: new Date().toISOString(),
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      fulfillmentStatus: 'DISPATCHED',
    };

    const existing = this.fulfillments.get(merchantId) || [];
    this.fulfillments.set(
      merchantId,
      [...existing.filter((f) => f.orderId !== orderId), record]
    );

    auditService.recordEvent('MOCK_MERCHANT', merchantId, 'ORDER_DISPATCHED', 'LOGISTICS', `Dispatched Order ${order.orderNumber} via ${data.carrier} Tracking: ${data.trackingNumber}`);

    // Notify customer
    await notificationService.sendNotification({
      recipientId: order.customerId || 'usr-03',
      channel: 'in_app',
      category: 'Order',
      title: `📦 Order Dispatched (${order.orderNumber})`,
      body: `Items in order ${order.orderNumber} have been dispatched by merchant via ${data.carrier}. Tracking: ${data.trackingNumber}`,
      priority: 'high',
    });

    return record;
  }

  // ==========================================
  // PHASE 8: ADMIN VENDOR OPERATIONS OVERVIEW
  // ==========================================

  /**
   * Get vendor operations overview statistics for Admin
   */
  async getVendorOperationsMetrics() {
    const apps = Array.from(this.applications.values());
    const stores = Array.from(this.stores.values());
    const allProducts = await this.productRepo.findAll();

    const pendingApplications = apps.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;
    const approvedApplications = apps.filter((a) => a.status === 'APPROVED').length;
    const changesRequested = apps.filter((a) => a.status === 'CHANGES_REQUESTED').length;
    const rejectedApplications = apps.filter((a) => a.status === 'REJECTED').length;

    const activeStores = stores.filter((s) => s.status === 'ACTIVE').length;
    const suspendedStores = stores.filter((s) => s.status === 'SUSPENDED').length;

    const pendingProductModeration = allProducts.filter((p) => p.approvalStatus === 'SUBMITTED' || p.approvalStatus === 'UNDER_REVIEW').length;

    return {
      pendingApplications,
      approvedApplications,
      changesRequested,
      rejectedApplications,
      activeStores,
      suspendedStores,
      totalStores: stores.length,
      pendingProductModeration,
    };
  }
}

export const sellerCenterService = SellerCenterService.getInstance();
