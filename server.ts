import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PRODUCTS, MOCK_WAREHOUSES, MOCK_ORDERS, MOCK_AUDIT_LOGS } from './src/data/mockData.js';
import { MASTER_ROADMAP } from './src/data/roadmapData.js';
import { Product, Order, AuditLog } from './src/types/domain.js';
import { eventBus } from './src/lib/eventBus.js';
import { stockAllocationEngine } from './src/lib/stockAllocator.js';
import { logger } from './src/infrastructure/logging/Logger.js';
import { appConfig } from './src/infrastructure/config/appConfig.js';
import { productService } from './src/application/services/ProductService.js';
import { orderService } from './src/application/services/OrderService.js';
import { warehouseService } from './src/application/services/WarehouseService.js';
import { auditService } from './src/application/services/AuditService.js';
import { aiService } from './src/application/services/AIService.js';
import { authService } from './src/application/services/AuthService.js';
import { iamService } from './src/application/services/IAMService.js';
import { performanceService } from './src/application/services/PerformanceService.js';
import { RedisCacheManager } from './src/infrastructure/cache/RedisCacheManager.js';
import { QueueEngine } from './src/infrastructure/jobs/QueueEngine.js';
import { PerformanceMonitor } from './src/infrastructure/performance/PerformanceMonitor.js';
import { AuditEngine } from './src/infrastructure/performance/AuditEngine.js';
import { LoadTester } from './src/infrastructure/performance/LoadTester.js';
import { SecurityMiddleware } from './src/infrastructure/security/SecurityMiddleware.js';
import { authRepository } from './src/infrastructure/repositories/AuthRepository.js';
import { aiGateway } from './src/infrastructure/ai/gateway/AIGateway.js';
import { ModelRegistry } from './src/infrastructure/ai/models/ModelRegistry.js';
import { PromptEngine } from './src/infrastructure/ai/prompts/PromptEngine.js';
import { AIAnalyticsTracker } from './src/infrastructure/ai/analytics/AIAnalyticsTracker.js';
import { AISystemHealth } from './src/infrastructure/ai/health/AISystemHealth.js';
import { AICostEngine } from './src/infrastructure/ai/cost/AICostEngine.js';
import { AICacheManager } from './src/infrastructure/ai/cache/AICacheManager.js';
import { AIToolExecutor } from './src/infrastructure/ai/tools/AIToolExecutor.js';
import { getAIPlatformConfig } from './src/infrastructure/ai/config/aiConfig.js';
import { MarketplaceService } from './src/application/services/MarketplaceService.js';
import { financialService } from './src/application/services/FinancialService.js';
import { logisticsService } from './src/application/services/LogisticsService.js';
import { notificationService } from './src/application/services/NotificationService.js';
import { PromotionEngine } from './src/domain/financial/PromotionEngine.js';
import { searchEngineService } from './src/application/services/SearchEngineService.js';
import { recommendationService } from './src/application/services/RecommendationService.js';
import { sellerAnalyticsService } from './src/application/services/SellerAnalyticsService.js';
import { sellerCenterService } from './src/application/services/SellerCenterService.js';
import { trustSafetyService } from './src/application/services/TrustSafetyService.js';
import { localizationService } from './src/application/services/LocalizationService.js';
import { shippingFulfillmentService } from './src/application/services/ShippingFulfillmentService.js';
import { afterSalesService } from './src/application/services/AfterSalesService.js';
import { supportTicketingService } from './src/application/services/SupportTicketingService.js';
import { digitalMarketplaceService } from './src/application/services/DigitalMarketplaceService.js';
import { freelanceService } from './src/application/services/FreelanceService.js';

const marketplaceService = new MarketplaceService();

// In-memory state for development mock database
let products: Product[] = [...MOCK_PRODUCTS];
let warehouses = [...MOCK_WAREHOUSES];
let orders: Order[] = [...MOCK_ORDERS];

// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-commercezon',
        },
      },
    });
  }
  return aiClient;
}

// Audit logger helper
function logAuditEvent(
  actorType: 'SYSTEM' | 'MOCK_USER' | 'MOCK_MERCHANT' | 'AI_ENGINE',
  actorId: string,
  action: string,
  domain: 'CATALOG' | 'INVENTORY' | 'ORDER' | 'AI_SERVICE' | 'SECURITY' | 'PAYMENT' | 'LOGISTICS' | 'COMMUNICATION',
  details: string
) {
  auditService.recordEvent(actorType, actorId, action, domain, details);
}

async function startServer() {
  const app = express();
  const PORT = appConfig.port;

  app.use(express.json({ limit: '10mb' }));

  // Part 5: Enterprise Gzip Response Compression
  app.use(compression());

  // Part 5: Enterprise API Latency & Headers Tracking Middleware
  app.use((req, res, next) => {
    const start = Date.now();
    res.setHeader('X-CommerceZon-Performance-Tier', 'PART-5-AMAZON-GRADE');
    res.setHeader('Cache-Control', 'no-cache, private');

    res.on('finish', () => {
      const duration = Date.now() - start;
      if (req.url.startsWith('/api')) {
        PerformanceMonitor.recordLatency(duration, res.statusCode >= 400);
      }
    });
    next();
  });

  // Global Security & Sanitization Middlewares
  app.use(SecurityMiddleware.securityHeaders);
  app.use(SecurityMiddleware.sanitizeInput);
  app.use('/api', SecurityMiddleware.rateLimiter(150, 60000));

  // Request logger middleware using enterprise logger
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      logger.info(`[API ${req.method}] ${req.url}`, 'Server');
    }
    next();
  });

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: `${appConfig.appName} Enterprise IAM & Security Gateway`,
      version: appConfig.version,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      capabilities: {
        aiPoweredSearch: appConfig.features.aiSearchEnabled,
        multiWarehouseStock: appConfig.features.multiWarehouseStockEnabled,
        auditTrailEnabled: appConfig.features.auditTrailEnabled,
        authenticationState: 'ENTERPRISE_JWT_IAM_ACTIVE',
        zeroTrustRBAC: true,
        mfaSupport: true,
      },
    });
  });

  // --- ENTERPRISE IAM & AUTHENTICATION ENDPOINTS ---

  // Register
  app.post('/api/auth/register', SecurityMiddleware.rateLimiter(10, 60000), async (req: Request, res: Response) => {
    try {
      const { username, email, password, fullName, role, phone } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
      const userAgent = req.headers['user-agent'] || 'Unknown Browser';

      const result = await authService.register(
        { username, email, password, fullName, role, phone },
        ipAddress,
        userAgent
      );
      res.status(201).json(result);
    } catch (err: any) {
      res.status(400).json({ error: 'Registration Failed', message: err.message || String(err) });
    }
  });

  // Login
  app.post('/api/auth/login', SecurityMiddleware.rateLimiter(15, 60000), async (req: Request, res: Response) => {
    try {
      const { loginIdentifier, password } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
      const userAgent = req.headers['user-agent'] || 'Unknown Browser';

      const result = await authService.login({
        loginIdentifier,
        password,
        ipAddress,
        userAgent,
      });

      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: 'Authentication Failed', message: err.message || String(err) });
    }
  });

  // Verify MFA Challenge
  app.post('/api/auth/verify-mfa', async (req: Request, res: Response) => {
    try {
      const { challengeToken, code } = req.body;
      const ipAddress = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') as string;
      const userAgent = req.headers['user-agent'] || 'Unknown Browser';

      const result = await authService.verifyMFAChallenge(challengeToken, code, ipAddress, userAgent);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: 'MFA Verification Failed', message: err.message || String(err) });
    }
  });

  // Refresh Token (Token Rotation)
  app.post('/api/auth/refresh', async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (err: any) {
      res.status(401).json({ error: 'Token Refresh Failed', message: err.message || String(err) });
    }
  });

  // Logout (Protected)
  app.post('/api/auth/logout', SecurityMiddleware.authenticateJWT as any, async (req: any, res: Response) => {
    try {
      const { logoutAll } = req.body;
      await authService.logout(req.sessionId, Boolean(logoutAll));
      res.json({ message: 'Successfully logged out' });
    } catch (err: any) {
      res.status(500).json({ error: 'Logout Failed', message: err.message || String(err) });
    }
  });

  // Current User Security Context (Protected)
  app.get('/api/auth/me', SecurityMiddleware.authenticateJWT as any, async (req: any, res: Response) => {
    try {
      const user = await iamService.getUserById(req.user.sub);
      if (!user) return res.status(404).json({ error: 'User identity not found' });

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          permissions: user.customPermissions,
          status: user.status,
          mfaConfig: {
            isEnabled: user.mfaConfig.isEnabled,
            mfaType: user.mfaConfig.mfaType,
          },
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt,
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch identity profile' });
    }
  });

  // Active User Sessions (Protected)
  app.get('/api/auth/sessions', SecurityMiddleware.authenticateJWT as any, async (req: any, res: Response) => {
    try {
      const activeSessions = await authRepository.findActiveSessionsByUserId(req.user.sub);
      const formatted = activeSessions.map((s) => ({
        ...s,
        isCurrentSession: s.sessionId === req.sessionId,
      }));
      res.json({ sessions: formatted });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve active sessions' });
    }
  });

  // Revoke Specific Session (Protected)
  app.delete('/api/auth/sessions/:sessionId', SecurityMiddleware.authenticateJWT as any, async (req: any, res: Response) => {
    try {
      await authRepository.revokeSession(req.params.sessionId);
      res.json({ message: `Session ${req.params.sessionId} terminated successfully` });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to terminate session' });
    }
  });

  // --- IAM & ZERO TRUST MANAGEMENT (Admin Protected) ---

  // List All User Identities
  app.get(
    '/api/iam/users',
    SecurityMiddleware.authenticateJWT as any,
    SecurityMiddleware.requireRoles('SUPER_ADMIN', 'ADMIN') as any,
    async (req: Request, res: Response) => {
      try {
        const users = await iamService.getAllUsers();
        res.json({ users });
      } catch (err: any) {
        res.status(500).json({ error: 'Failed to list IAM users' });
      }
    }
  );

  // Update User Role (Super Admin Only)
  app.patch(
    '/api/iam/users/:id/role',
    SecurityMiddleware.authenticateJWT as any,
    SecurityMiddleware.requireRoles('SUPER_ADMIN') as any,
    async (req: any, res: Response) => {
      try {
        const { role } = req.body;
        const updated = await iamService.updateUserRole(req.user.sub, req.params.id, role, req.ipAddress);
        res.json({ message: 'User role updated successfully', user: updated });
      } catch (err: any) {
        res.status(400).json({ error: 'Failed to update user role', message: err.message || String(err) });
      }
    }
  );

  // Security Audit Logs
  app.get(
    '/api/iam/audit-logs',
    SecurityMiddleware.authenticateJWT as any,
    SecurityMiddleware.requireRoles('SUPER_ADMIN', 'ADMIN') as any,
    async (req: Request, res: Response) => {
      try {
        const logs = await iamService.getAuditLogs();
        res.json({ logs });
      } catch (err: any) {
        res.status(500).json({ error: 'Failed to fetch security audit logs' });
      }
    }
  );

  // Security Anomaly Alerts
  app.get(
    '/api/iam/security-alerts',
    SecurityMiddleware.authenticateJWT as any,
    SecurityMiddleware.requireRoles('SUPER_ADMIN', 'ADMIN') as any,
    async (req: Request, res: Response) => {
      try {
        const alerts = await iamService.getSecurityAlerts();
        res.json({ alerts });
      } catch (err: any) {
        res.status(500).json({ error: 'Failed to fetch security alerts' });
      }
    }
  );

  // Master Roadmap Governance
  app.get('/api/roadmap', (req: Request, res: Response) => {
    res.json({
      roadmap: MASTER_ROADMAP,
      currentTask: {
        phase: 'PHASE-1',
        milestone: 'M1.1',
        taskId: 'Task 1.1.1',
        title: 'Core Domain Models, Express API Server & Roadmap Governance Viewer',
        status: 'completed',
      },
      stats: {
        totalPhases: MASTER_ROADMAP.length,
        totalMilestones: MASTER_ROADMAP.reduce((acc, p) => acc + p.milestones.length, 0),
        totalTasks: MASTER_ROADMAP.reduce(
          (acc, p) => acc + p.milestones.reduce((mAcc, m) => mAcc + m.tasks.length, 0),
          0
        ),
      },
    });
  });

  // Get Products (with filter & query support)
  app.get('/api/products', async (req: Request, res: Response) => {
    const { category, search, merchantId, maxPrice } = req.query;

    let filtered = await productService.getAllProducts();

    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (merchantId) {
      filtered = filtered.filter((p) => p.merchant.id === merchantId);
    }

    if (maxPrice) {
      const numericMax = parseFloat(maxPrice as string);
      if (!isNaN(numericMax)) {
        filtered = filtered.filter((p) => p.price.amount <= numericMax);
      }
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    res.json({
      total: filtered.length,
      products: filtered,
    });
  });

  // ==========================================
  // PART 11: ADVANCED SEARCH & PRODUCT DISCOVERY ENGINE
  // ==========================================

  // Autocomplete Suggestions (MUST be registered before /:id)
  app.get('/api/products/search/autocomplete', async (req: Request, res: Response) => {
    try {
      const q = String(req.query.q || '');
      const result = await searchEngineService.getAutocomplete(q);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching autocomplete suggestions', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to generate autocomplete suggestions' });
    }
  });

  // Advanced Search with Multi-Signal Ranking, Faceted Filtering, Sorting & Pagination
  app.get('/api/products/search', async (req: Request, res: Response) => {
    try {
      const {
        q,
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        sortBy,
        page,
        limit,
      } = req.query;

      const result = await searchEngineService.executeSearch({
        q: q !== undefined ? String(q) : undefined,
        category: category !== undefined ? String(category) : undefined,
        brand: brand ? (Array.isArray(brand) ? (brand as string[]) : String(brand)) : undefined,
        minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
        maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
        minRating: minRating !== undefined ? Number(minRating) : undefined,
        inStock: inStock !== undefined ? String(inStock) === 'true' : undefined,
        sortBy: sortBy as any,
        page: page !== undefined ? Number(page) : undefined,
        limit: limit !== undefined ? Number(limit) : undefined,
      });

      res.json(result);
    } catch (err: any) {
      logger.error('Error executing advanced product search', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to execute search', message: err.message || 'Internal error' });
    }
  });

  // AI-Assisted Query Understanding Layer
  app.post('/api/products/search/ai-intent', async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required for AI search intent extraction' });
      }

      const intent = await searchEngineService.parseAIQueryIntent(prompt);
      res.json(intent);
    } catch (err: any) {
      logger.error('Error extracting AI query intent', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to process AI query intent' });
    }
  });

  // Search Analytics (Admin Explorer)
  app.get('/api/search/analytics', async (req: Request, res: Response) => {
    try {
      const summary = searchEngineService.getAnalyticsSummary();
      res.json(summary);
    } catch (err: any) {
      logger.error('Error fetching search analytics', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to fetch search analytics' });
    }
  });

  // Clear Search Analytics
  app.post('/api/search/analytics/clear', async (req: Request, res: Response) => {
    try {
      searchEngineService.clearAnalytics();
      res.json({ message: 'Search analytics reset successfully' });
    } catch (err: any) {
      logger.error('Error resetting search analytics', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to reset search analytics' });
    }
  });

  // ==========================================
  // PART 12: AI-POWERED RECOMMENDATIONS & PERSONALIZATION ENGINE
  // ==========================================

  // 1. Personalized "Recommended For You"
  app.get('/api/recommendations/for-you', async (req: Request, res: Response) => {
    try {
      const userId = String(req.query.userId || 'usr-03');
      const limit = Number(req.query.limit) || 6;
      const explicitInterests = req.query.interests
        ? String(req.query.interests).split(',').map((s) => s.trim())
        : undefined;

      const result = await recommendationService.getRecommendedForYou(userId, limit, explicitInterests);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching for-you recommendations', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to generate recommendations', message: err.message });
    }
  });

  // 2. Similar Products
  app.get('/api/recommendations/similar/:productId', async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const limit = Number(req.query.limit) || 4;
      const result = await recommendationService.getSimilarProducts(productId, limit);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching similar products', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to find similar products' });
    }
  });

  // 3. Frequently Viewed Together
  app.get('/api/recommendations/frequently-viewed-together/:productId', async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const limit = Number(req.query.limit) || 3;
      const result = await recommendationService.getFrequentlyViewedTogether(productId, limit);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching frequently viewed products', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to find frequently viewed products' });
    }
  });

  // 4. Frequently Bought Together (Bundles)
  app.get('/api/recommendations/frequently-bought-together/:productId', async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const limit = Number(req.query.limit) || 2;
      const result = await recommendationService.getFrequentlyBoughtTogether(productId, limit);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching bought together recommendations', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to generate bundle recommendations' });
    }
  });

  // 5. Complementary Add-ons (Cart & Checkout Cross-Sells)
  app.get('/api/recommendations/complementary', async (req: Request, res: Response) => {
    try {
      const productIdsParam = String(req.query.productIds || req.query.productId || '');
      const productIds = productIdsParam ? productIdsParam.split(',').map((id) => id.trim()) : [];
      const limit = Number(req.query.limit) || 4;

      const result = await recommendationService.getComplementaryProducts(productIds, limit);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching complementary products', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to find complementary products' });
    }
  });

  // 6. Popular / Trending
  app.get('/api/recommendations/popular', async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 6;
      const category = req.query.category ? String(req.query.category) : undefined;
      const result = await recommendationService.getPopularProducts(limit, category);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching popular products', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to fetch popular products' });
    }
  });

  // 7. New Arrivals
  app.get('/api/recommendations/new-arrivals', async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 6;
      const category = req.query.category ? String(req.query.category) : undefined;
      const result = await recommendationService.getNewArrivals(limit, category);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching new arrivals', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to fetch new arrivals' });
    }
  });

  // 8. Recently Viewed Resolver
  app.get('/api/recommendations/recently-viewed', async (req: Request, res: Response) => {
    try {
      const productIdsParam = String(req.query.productIds || '');
      const productIds = productIdsParam ? productIdsParam.split(',').map((id) => id.trim()) : [];
      const result = await recommendationService.getRecentlyViewed(productIds);
      res.json(result);
    } catch (err: any) {
      logger.error('Error fetching recently viewed products', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to resolve recently viewed products' });
    }
  });

  // 9. AI-Assisted Recommendation Layer (Gemini + Deterministic Fallback)
  app.post('/api/recommendations/ai-match', async (req: Request, res: Response) => {
    try {
      const { prompt, interests, currentProductId, cartProductIds, category, budgetMax, limit } = req.body;
      const result = await recommendationService.getAIMatchedRecommendations({
        prompt,
        interests,
        currentProductId,
        cartProductIds,
        category,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        limit: limit ? Number(limit) : 4,
      });
      res.json(result);
    } catch (err: any) {
      logger.error('Error executing AI match recommendations', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to process AI recommendations', message: err.message });
    }
  });

  // 10. Personalization Profile Management
  app.get('/api/personalization/profile/:userId', (req: Request, res: Response) => {
    try {
      const profile = recommendationService.getOrCreateProfile(req.params.userId);
      res.json({ profile });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  });

  app.post('/api/personalization/interactions', (req: Request, res: Response) => {
    try {
      const event = req.body;
      if (!event.userId || !event.productId || !event.interactionType) {
        return res.status(400).json({ error: 'Missing required interaction fields' });
      }
      const updatedProfile = recommendationService.recordInteraction({
        userId: event.userId,
        productId: event.productId,
        interactionType: event.interactionType,
        category: event.category,
        brand: event.brand,
        tags: event.tags,
        timestamp: new Date().toISOString(),
      });
      res.json({ success: true, profile: updatedProfile });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record interaction' });
    }
  });

  app.post('/api/personalization/interests', (req: Request, res: Response) => {
    try {
      const { userId, interests } = req.body;
      if (!userId || !Array.isArray(interests)) {
        return res.status(400).json({ error: 'Invalid userId or interests' });
      }
      const profile = recommendationService.updateExplicitInterests(userId, interests);
      res.json({ success: true, profile });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update interests' });
    }
  });

  app.post('/api/personalization/clear-history', (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
      }
      const profile = recommendationService.clearUserHistory(userId);
      res.json({ success: true, message: 'History cleared', profile });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to clear user history' });
    }
  });

  // ==========================================
  // PART 13: SELLER INTELLIGENCE & MARKETPLACE ANALYTICS
  // ==========================================

  // 1. Seller Intelligence Analytics Report
  app.get('/api/seller/analytics/:merchantId', async (req: Request, res: Response) => {
    try {
      const merchantId = req.params.merchantId;
      const range = (req.query.range as any) || '7d';
      const startDate = req.query.startDate ? String(req.query.startDate) : undefined;
      const endDate = req.query.endDate ? String(req.query.endDate) : undefined;
      const currency = req.query.currency ? String(req.query.currency) : 'USD';

      const report = await sellerAnalyticsService.getSellerAnalyticsReport(
        merchantId,
        range,
        startDate,
        endDate,
        currency
      );

      res.json({ report });
    } catch (err: any) {
      logger.error('Failed to generate seller analytics report', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to generate seller analytics report', message: err.message });
    }
  });

  // 2. Export Seller Analytics (CSV or JSON)
  app.get('/api/seller/analytics/:merchantId/export', async (req: Request, res: Response) => {
    try {
      const merchantId = req.params.merchantId;
      const format = (req.query.format as string) || 'csv';
      const exportType = (req.query.type as any) || 'products';
      const range = (req.query.range as any) || '7d';
      const startDate = req.query.startDate ? String(req.query.startDate) : undefined;
      const endDate = req.query.endDate ? String(req.query.endDate) : undefined;
      const currency = req.query.currency ? String(req.query.currency) : 'USD';

      const report = await sellerAnalyticsService.getSellerAnalyticsReport(
        merchantId,
        range,
        startDate,
        endDate,
        currency
      );

      if (format === 'json') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${merchantId}_analytics_${range}.json"`);
        return res.json(report);
      }

      const csvContent = sellerAnalyticsService.generateCSVReport(report, exportType);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${merchantId}_${exportType}_${range}.csv"`);
      return res.send(csvContent);
    } catch (err: any) {
      logger.error('Failed to export seller analytics report', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to export seller analytics', message: err.message });
    }
  });

  // 3. Analytics Event Tracking (Views, Clicks, Impressions, Add to Cart)
  app.post('/api/analytics/events', (req: Request, res: Response) => {
    try {
      const { eventType, productId, merchantId, source, sessionId, searchQuery, metadata } = req.body;
      if (!eventType || !productId) {
        return res.status(400).json({ error: 'Missing required eventType or productId' });
      }

      const result = sellerAnalyticsService.recordEvent({
        eventType,
        productId,
        merchantId,
        source,
        sessionId,
        searchQuery,
        metadata,
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record analytics event' });
    }
  });

  // 4. Platform-Wide Marketplace Analytics (Admin / Executive Dashboard)
  app.get('/api/admin/marketplace-analytics', async (_req: Request, res: Response) => {
    try {
      const analytics = await sellerAnalyticsService.getMarketplaceWideAnalytics();
      res.json({ analytics });
    } catch (err: any) {
      logger.error('Failed to generate marketplace analytics', 'Server', { error: String(err) });
      res.status(500).json({ error: 'Failed to generate marketplace analytics', message: err.message });
    }
  });

  // ==========================================
  // PART 14: SELLER CENTER & MULTI-SELLER MANAGEMENT
  // ==========================================

  // 1. Submit Seller Onboarding Application
  app.post('/api/seller/onboarding/apply', async (req: Request, res: Response) => {
    try {
      const { userId, ...data } = req.body;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      const application = await sellerCenterService.submitApplication(userId, data);
      res.status(201).json({ application });
    } catch (err: any) {
      logger.error('Failed to submit seller application', 'Server', { error: String(err) });
      res.status(400).json({ error: err.message || 'Failed to submit application' });
    }
  });

  // 2. Get Seller Application Status
  app.get('/api/seller/onboarding/status/:userId', (req: Request, res: Response) => {
    try {
      const application = sellerCenterService.getApplicationByUserId(req.params.userId);
      res.json({ application });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve application status' });
    }
  });

  // 3. Resubmit Application After Changes Requested
  app.post('/api/seller/onboarding/:applicationId/resubmit', async (req: Request, res: Response) => {
    try {
      const { applicationId } = req.params;
      const { userId, ...updates } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const application = await sellerCenterService.resubmitApplication(applicationId, userId, updates);
      res.json({ application });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to resubmit application' });
    }
  });

  // 4. Store Profile Get & Put
  app.get('/api/seller/store/:merchantId', (req: Request, res: Response) => {
    try {
      const store = sellerCenterService.getStoreProfile(req.params.merchantId);
      if (!store) return res.status(404).json({ error: 'Store not found' });
      res.json({ store });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch store profile' });
    }
  });

  app.put('/api/seller/store/:merchantId', async (req: Request, res: Response) => {
    try {
      const { userId, ...updates } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required for store modification' });
      const store = await sellerCenterService.updateStoreProfile(req.params.merchantId, userId, updates);
      res.json({ store });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update store profile' });
    }
  });

  // 5. Seller Team & Permissions
  app.get('/api/seller/team/:merchantId', (req: Request, res: Response) => {
    try {
      const team = sellerCenterService.getStoreTeam(req.params.merchantId);
      res.json({ team });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch team members' });
    }
  });

  app.post('/api/seller/team/:merchantId/invite', async (req: Request, res: Response) => {
    try {
      const { merchantId } = req.params;
      const { inviterUserId, email, name, role, customPermissions } = req.body;
      if (!inviterUserId || !email || !name || !role) {
        return res.status(400).json({ error: 'Missing required invitation fields (inviterUserId, email, name, role)' });
      }
      const invitation = await sellerCenterService.inviteTeamMember(
        merchantId,
        inviterUserId,
        email,
        name,
        role,
        customPermissions
      );
      res.status(201).json({ invitation });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to invite team member' });
    }
  });

  app.delete('/api/seller/team/:merchantId/member/:memberId', (req: Request, res: Response) => {
    try {
      const { merchantId, memberId } = req.params;
      const { requestingUserId } = req.body;
      if (!requestingUserId) return res.status(400).json({ error: 'requestingUserId is required' });
      sellerCenterService.removeTeamMember(merchantId, memberId, requestingUserId);
      res.json({ success: true, message: 'Team member removed' });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to remove member' });
    }
  });

  app.post('/api/seller/team/invitation/:token/accept', (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { userId, userName } = req.body;
      const member = sellerCenterService.acceptInvitation(token, userId, userName);
      res.json({ success: true, member });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to accept invitation' });
    }
  });

  // 6. Seller Product Operations
  app.get('/api/seller/products/:merchantId', async (req: Request, res: Response) => {
    try {
      const sellerProducts = await sellerCenterService.getSellerProducts(req.params.merchantId);
      res.json({ products: sellerProducts });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch seller products' });
    }
  });

  app.post('/api/seller/products/:merchantId', async (req: Request, res: Response) => {
    try {
      const { merchantId } = req.params;
      const { userId, ...data } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const product = await sellerCenterService.createProduct(merchantId, userId, data);
      res.status(201).json({ product });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create product' });
    }
  });

  app.put('/api/seller/products/:merchantId/:productId', async (req: Request, res: Response) => {
    try {
      const { merchantId, productId } = req.params;
      const { userId, ...data } = req.body;
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      const product = await sellerCenterService.updateProduct(productId, merchantId, userId, data);
      res.json({ product });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update product' });
    }
  });

  // 7. Seller Order Operations & Fulfillment
  app.get('/api/seller/orders/:merchantId', async (req: Request, res: Response) => {
    try {
      const sellerOrders = await sellerCenterService.getSellerOrders(req.params.merchantId);
      res.json({ orders: sellerOrders });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch seller orders' });
    }
  });

  app.post('/api/seller/orders/:merchantId/:orderId/fulfill', async (req: Request, res: Response) => {
    try {
      const { merchantId, orderId } = req.params;
      const { carrier, trackingNumber, dispatchNotes } = req.body;
      const record = await sellerCenterService.fulfillOrder(merchantId, orderId, {
        carrier,
        trackingNumber,
        dispatchNotes,
      });
      res.json({ success: true, record });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to fulfill order' });
    }
  });

  // 8. Admin Vendor Operations
  app.get('/api/admin/sellers/applications', (req: Request, res: Response) => {
    try {
      const status = req.query.status as any;
      const applications = sellerCenterService.listApplications(status);
      res.json({ applications });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list seller applications' });
    }
  });

  app.post('/api/admin/sellers/applications/:id/decision', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { adminId, adminName, decision, notes, requestedChanges, rejectionReason, tier } = req.body;
      const application = await sellerCenterService.reviewApplication(
        id,
        adminId || 'admin-01',
        adminName || 'Super Admin',
        decision,
        { notes, requestedChanges, rejectionReason, tier }
      );
      res.json({ success: true, application });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to review application' });
    }
  });

  app.get('/api/admin/sellers/merchants', (_req: Request, res: Response) => {
    try {
      const stores = sellerCenterService.getAllStores();
      res.json({ stores });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list merchant stores' });
    }
  });

  app.post('/api/admin/sellers/merchants/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { adminId, status, reason } = req.body;
      const store = await sellerCenterService.setStoreStatusByAdmin(id, adminId || 'admin-01', status, reason);
      res.json({ success: true, store });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update store status' });
    }
  });

  app.post('/api/admin/sellers/merchants/:id/tier', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { adminId, tier } = req.body;
      const store = sellerCenterService.setStoreTierByAdmin(id, adminId || 'admin-01', tier);
      res.json({ success: true, store });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update store tier' });
    }
  });

  app.post('/api/admin/sellers/products/:id/moderation', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { adminId, decision, reason } = req.body;
      const product = await sellerCenterService.moderateProduct(id, adminId || 'admin-01', decision, reason);
      res.json({ success: true, product });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to moderate product' });
    }
  });

  app.get('/api/admin/sellers/metrics', async (_req: Request, res: Response) => {
    try {
      const metrics = await sellerCenterService.getVendorOperationsMetrics();
      res.json({ metrics });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get vendor operations metrics' });
    }
  });

  // ==========================================
  // PART 15: TRUST, SAFETY, FRAUD & DISPUTE RESOLUTION
  // ==========================================

  // 1. List Disputes
  app.get('/api/trust-safety/disputes', (req: Request, res: Response) => {
    try {
      const { sellerId, buyerId, status, category } = req.query;
      const list = trustSafetyService.listDisputes({
        sellerId: sellerId ? String(sellerId) : undefined,
        buyerId: buyerId ? String(buyerId) : undefined,
        status: status as any,
        category: category as any,
      });
      res.json({ disputes: list });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list disputes', message: err.message });
    }
  });

  // 2. Get Dispute by ID
  app.get('/api/trust-safety/disputes/:id', (req: Request, res: Response) => {
    try {
      const dispute = trustSafetyService.getDisputeById(req.params.id);
      if (!dispute) return res.status(404).json({ error: 'Dispute case not found' });
      res.json({ dispute });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve dispute', message: err.message });
    }
  });

  // 3. Create Dispute
  app.post('/api/trust-safety/disputes', (req: Request, res: Response) => {
    try {
      const dispute = trustSafetyService.createDispute(req.body);
      res.status(201).json({ dispute });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create dispute' });
    }
  });

  // 4. Add Message to Dispute
  app.post('/api/trust-safety/disputes/:id/messages', (req: Request, res: Response) => {
    try {
      const updated = trustSafetyService.addMessage(req.params.id, req.body);
      res.json({ dispute: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to add message' });
    }
  });

  // 5. Add Evidence to Dispute
  app.post('/api/trust-safety/disputes/:id/evidence', (req: Request, res: Response) => {
    try {
      const updated = trustSafetyService.addEvidence(req.params.id, req.body);
      res.json({ dispute: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to add evidence' });
    }
  });

  // 6. Propose Resolution
  app.post('/api/trust-safety/disputes/:id/propose-resolution', (req: Request, res: Response) => {
    try {
      const { actor, proposal } = req.body;
      if (!actor || !proposal) return res.status(400).json({ error: 'actor and proposal objects required' });
      const updated = trustSafetyService.proposeResolution(req.params.id, actor, proposal);
      res.json({ dispute: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to propose resolution' });
    }
  });

  // 7. Accept Resolution
  app.post('/api/trust-safety/disputes/:id/accept-resolution', (req: Request, res: Response) => {
    try {
      const { buyerId, buyerName } = req.body;
      const updated = trustSafetyService.acceptResolution(req.params.id, buyerId, buyerName);
      res.json({ dispute: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to accept resolution' });
    }
  });

  // 8. Reject Resolution
  app.post('/api/trust-safety/disputes/:id/reject-resolution', (req: Request, res: Response) => {
    try {
      const { buyerId, reason } = req.body;
      const updated = trustSafetyService.rejectResolution(req.params.id, buyerId, reason || 'Disagreed with proposal');
      res.json({ dispute: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to reject resolution' });
    }
  });

  // 9. Escalate to Admin
  app.post('/api/trust-safety/disputes/:id/escalate', (req: Request, res: Response) => {
    try {
      const { actor, reason } = req.body;
      const updated = trustSafetyService.escalateToAdmin(req.params.id, actor, reason || 'Escalated to arbitrator');
      res.json({ dispute: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to escalate dispute' });
    }
  });

  // 10. Arbitrate Dispute (Admin Binding Judgment)
  app.post('/api/trust-safety/disputes/:id/arbitrate', (req: Request, res: Response) => {
    try {
      const { adminId, adminName, decision, rationale, refundAmount } = req.body;
      if (!adminId || !decision || !rationale) {
        return res.status(400).json({ error: 'adminId, decision, and rationale are required' });
      }
      const updated = trustSafetyService.arbitrateDispute(
        req.params.id,
        adminId,
        adminName || 'Marketplace Arbitrator',
        decision,
        rationale,
        refundAmount
      );
      res.json({ dispute: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to arbitrate dispute' });
    }
  });

  // 11. Marketplace Reports (List & Create)
  app.get('/api/trust-safety/reports', (req: Request, res: Response) => {
    try {
      const { status, severity, targetType } = req.query;
      const list = trustSafetyService.listReports({
        status: status as any,
        severity: severity as any,
        targetType: targetType as any,
      });
      res.json({ reports: list });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list reports' });
    }
  });

  app.post('/api/trust-safety/reports', (req: Request, res: Response) => {
    try {
      const report = trustSafetyService.createReport(req.body);
      res.status(201).json({ report });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create report' });
    }
  });

  // 12. Triage Report (Admin)
  app.post('/api/trust-safety/reports/:id/triage', (req: Request, res: Response) => {
    try {
      const { adminId, status, actionTaken, resolutionNotes } = req.body;
      const report = trustSafetyService.triageReport(
        req.params.id,
        adminId || 'admin-01',
        status,
        actionTaken,
        resolutionNotes
      );
      res.json({ report });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to triage report' });
    }
  });

  // 13. Fraud Assessments & Rule Engine
  app.get('/api/trust-safety/fraud/evaluations', (_req: Request, res: Response) => {
    try {
      const evaluations = trustSafetyService.listFraudAssessments();
      res.json({ evaluations });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list fraud evaluations' });
    }
  });

  app.post('/api/trust-safety/fraud/evaluate-order', (req: Request, res: Response) => {
    try {
      const assessment = trustSafetyService.evaluateOrderRisk(req.body);
      res.json({ assessment });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to evaluate order risk' });
    }
  });

  app.post('/api/trust-safety/fraud/:id/override', (req: Request, res: Response) => {
    try {
      const { decision, notes } = req.body;
      const updated = trustSafetyService.overrideFraudDecision(req.params.id, decision, notes);
      res.json({ assessment: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to override fraud decision' });
    }
  });

  // 14. Listing Moderation & Anti-Counterfeit IP Queue
  app.get('/api/trust-safety/moderation/listings', (req: Request, res: Response) => {
    try {
      const { status, sellerId } = req.query;
      const listings = trustSafetyService.listModeratedListings({
        status: status as any,
        sellerId: sellerId ? String(sellerId) : undefined,
      });
      res.json({ listings });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to list moderated listings' });
    }
  });

  app.post('/api/trust-safety/moderation/listings/:id/action', (req: Request, res: Response) => {
    try {
      const { adminId, action, evidenceNotes, issueStrike } = req.body;
      const listing = trustSafetyService.actionListing(
        req.params.id,
        adminId || 'admin-01',
        action,
        evidenceNotes,
        Boolean(issueStrike)
      );
      res.json({ listing });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to action listing' });
    }
  });

  app.post('/api/trust-safety/moderation/listings/:id/appeal', (req: Request, res: Response) => {
    try {
      const { sellerId, statement, documentUrls } = req.body;
      const listing = trustSafetyService.submitSellerAppeal(req.params.id, sellerId, statement, documentUrls || []);
      res.json({ listing });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to submit appeal' });
    }
  });

  app.post('/api/trust-safety/moderation/listings/:id/appeal/review', (req: Request, res: Response) => {
    try {
      const { adminId, decision, reviewNotes } = req.body;
      const listing = trustSafetyService.reviewAppeal(
        req.params.id,
        adminId || 'admin-01',
        decision,
        reviewNotes
      );
      res.json({ listing });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to review appeal' });
    }
  });

  // 15. Seller Trust & Reputation Leaderboard
  app.get('/api/trust-safety/reputation', (_req: Request, res: Response) => {
    try {
      const reputations = trustSafetyService.getAllSellerReputations();
      res.json({ reputations });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch seller reputations' });
    }
  });

  app.get('/api/trust-safety/reputation/:merchantId', (req: Request, res: Response) => {
    try {
      const reputation = trustSafetyService.getSellerReputation(req.params.merchantId);
      if (!reputation) return res.status(404).json({ error: 'Seller reputation record not found' });
      res.json({ reputation });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch seller reputation' });
    }
  });

  app.post('/api/trust-safety/reputation/:merchantId/toggle-hold', (req: Request, res: Response) => {
    try {
      const { holdStatus, reason } = req.body;
      const rep = trustSafetyService.togglePayoutHold(req.params.merchantId, Boolean(holdStatus), reason || 'Admin risk hold');
      res.json({ reputation: rep });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to toggle payout hold' });
    }
  });

  // 16. Unified Trust & Safety KPIs
  app.get('/api/trust-safety/metrics', (_req: Request, res: Response) => {
    try {
      const metrics = trustSafetyService.getTrustSafetyMetrics();
      res.json({ metrics });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get trust & safety metrics' });
    }
  });

  // ==========================================
  // PART 16: GLOBAL MARKETPLACE LOCALIZATION, MULTI-CURRENCY & i18n
  // ==========================================

  // 1. Get Localization Config (Languages, Currencies, Countries, Exchange Rates)
  app.get('/api/localization/config', (_req: Request, res: Response) => {
    try {
      const config = localizationService.getLocalizationConfig();
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to retrieve localization config', message: err.message });
    }
  });

  // 2. Get Exchange Rates Table
  app.get('/api/localization/rates', (_req: Request, res: Response) => {
    try {
      const rates = localizationService.getExchangeRates();
      res.json(rates);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch exchange rates', message: err.message });
    }
  });

  // 3. Currency Conversion Calculation API
  app.post('/api/localization/convert', (req: Request, res: Response) => {
    try {
      const { amount, fromCurrency, toCurrency } = req.body;
      if (amount === undefined || !fromCurrency || !toCurrency) {
        return res.status(400).json({ error: 'amount, fromCurrency, and toCurrency are required' });
      }
      const result = localizationService.convertCurrency(
        Number(amount),
        fromCurrency as any,
        toCurrency as any
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Currency conversion failed' });
    }
  });

  // 4. Admin: Override Specific Exchange Rate
  app.post('/api/localization/rates/override', (req: Request, res: Response) => {
    try {
      const { currency, newRate, adminId } = req.body;
      if (!currency || newRate === undefined) {
        return res.status(400).json({ error: 'currency and newRate are required' });
      }
      const updated = localizationService.overrideExchangeRate(
        currency as any,
        Number(newRate),
        adminId || 'admin-01'
      );
      res.json({ success: true, rates: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to override exchange rate' });
    }
  });

  // 5. Admin: Update Localization Settings
  app.put('/api/localization/admin/settings', (req: Request, res: Response) => {
    try {
      const updated = localizationService.updateAdminSettings(req.body);
      res.json({ success: true, settings: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update localization settings' });
    }
  });

  // 6. Validate Checkout Transaction Currency vs Display Currency
  app.post('/api/localization/validate-checkout', (req: Request, res: Response) => {
    try {
      const { sellerListingCurrency, buyerCheckoutCurrency, orderTotalOriginal } = req.body;
      if (!sellerListingCurrency || !buyerCheckoutCurrency || orderTotalOriginal === undefined) {
        return res.status(400).json({
          error: 'sellerListingCurrency, buyerCheckoutCurrency, and orderTotalOriginal are required',
        });
      }
      const validation = localizationService.validateTransactionCurrency(
        sellerListingCurrency as any,
        buyerCheckoutCurrency as any,
        Number(orderTotalOriginal)
      );
      res.json(validation);
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Validation failed' });
    }
  });

  // Get Product by ID
  app.get('/api/products/:id', async (req: Request, res: Response) => {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  });

  // Warehouses & Stock Matrix
  app.get('/api/warehouses', async (req: Request, res: Response) => {
    const list = await warehouseService.getAllWarehouses();
    res.json({
      warehouses: list,
      totalUnitsUtilized: list.reduce((acc, w) => acc + w.utilizedUnits, 0),
      totalCapacity: list.reduce((acc, w) => acc + w.capacityUnits, 0),
    });
  });

  // Get Orders (Legacy compatibility)
  app.get('/api/orders', async (req: Request, res: Response) => {
    const list = await orderService.getAllOrders();
    res.json({ orders: list });
  });

  // Enterprise OMS: Get OMS Orders with rich filtering
  app.get('/api/orders/oms', async (req: Request, res: Response) => {
    try {
      const { status, query, sellerId, warehouseId, customerId } = req.query;
      const filter = {
        status: status ? (status as any) : undefined,
        query: query ? String(query) : undefined,
        sellerId: sellerId ? String(sellerId) : undefined,
        warehouseId: warehouseId ? String(warehouseId) : undefined,
        customerId: customerId ? String(customerId) : undefined,
      };
      const list = await orderService.getAllOMSOrders(filter);
      res.json({ orders: list, count: list.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch OMS orders' });
    }
  });

  // Enterprise OMS: Get OMS Analytics Metrics
  app.get('/api/orders/analytics', async (req: Request, res: Response) => {
    try {
      const metrics = await orderService.getOMSAnalyticsMetrics();
      res.json({ analytics: metrics });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch OMS analytics' });
    }
  });

  // Enterprise OMS: Get Single OMS Order Detail
  app.get('/api/orders/oms/:id', async (req: Request, res: Response) => {
    try {
      const order = await orderService.getOMSOrderById(req.params.id);
      if (!order) return res.status(404).json({ error: `OMS Order ${req.params.id} not found` });
      res.json({ order });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Enterprise OMS: Checkout Engine Endpoint
  app.post('/api/orders/checkout', async (req: Request, res: Response) => {
    try {
      const result = await orderService.processCheckout(req.body);
      res.status(201).json({
        message: 'Order placed successfully via Enterprise Checkout Engine',
        order: result.order,
        warnings: result.warnings,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Checkout failed' });
    }
  });

  // Legacy Create Order Route
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const { items, customerName, customerEmail, shippingAddress, paymentMethod } = req.body;
      const result = await orderService.processCheckout({
        items: items || [],
        customerName: customerName || 'Enterprise Customer',
        customerEmail: customerEmail || 'buyer@enterprise.mock',
        shippingAddress,
        paymentMethod: paymentMethod || 'COMMERCE_ZON_PAY',
      });
      res.status(201).json({
        message: 'Order created successfully',
        order: result.order,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Enterprise OMS: Update Order Lifecycle Status
  app.patch('/api/orders/oms/:id/status', async (req: Request, res: Response) => {
    try {
      const { status, actorName, actorRole, note } = req.body;
      const updated = await orderService.transitionOrderStatus(
        req.params.id,
        status,
        actorName || 'Admin Operator',
        actorRole || 'ADMIN',
        note || 'Status updated via API'
      );
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      res.json({ message: 'Order status updated successfully', order: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update order status' });
    }
  });

  // Enterprise OMS: RMA Returns List & Create
  app.get('/api/orders/returns', async (req: Request, res: Response) => {
    try {
      const returns = await orderService.getAllReturns();
      res.json({ returns });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders/returns', async (req: Request, res: Response) => {
    try {
      const returnReq = await orderService.requestReturn(req.body);
      res.status(201).json({ message: 'Return request submitted successfully', returnRequest: returnReq });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.patch('/api/orders/returns/:id/status', async (req: Request, res: Response) => {
    try {
      const { status, note } = req.body;
      const updated = await orderService.updateReturnStatus(req.params.id, status, note);
      if (!updated) return res.status(404).json({ error: 'Return request not found' });
      res.json({ message: 'Return status updated', returnRequest: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Enterprise OMS: Refunds List & Execute
  app.get('/api/orders/refunds', async (req: Request, res: Response) => {
    try {
      const refunds = await orderService.getAllRefunds();
      res.json({ refunds });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/orders/refunds', async (req: Request, res: Response) => {
    try {
      const refund = await orderService.processRefund(req.body);
      res.status(201).json({ message: 'Refund processed successfully', refund });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Enterprise OMS: Live Shipping Quote Calculator
  app.post('/api/orders/shipping-quote', async (req: Request, res: Response) => {
    try {
      const { destination, weightKg } = req.body;
      const options = orderService.getShippingOptions(destination, weightKg);
      res.json({ shippingOptions: options });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // ==========================================
  // PART 8: ENTERPRISE FINANCIAL PLATFORM API
  // ==========================================

  // Process Payment (Idempotent, Fraud Check, Tax Calc, Adapter Execution, Double-Entry Ledger)
  app.post('/api/financial/payments/process', async (req: Request, res: Response) => {
    try {
      const result = await financialService.processPayment(req.body);
      res.status(201).json({
        message: 'Payment processed successfully',
        payment: result.payment,
        fraudEvaluation: result.fraudEvaluation,
        tax: result.tax,
        coupon: result.coupon,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Get Multi-Bucket Wallet
  app.get('/api/financial/wallet/:entityId', async (req: Request, res: Response) => {
    try {
      const wallet = await financialService.getWallet(req.params.entityId);
      res.json({ wallet });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Wallet Top-up
  app.post('/api/financial/wallet/topup', async (req: Request, res: Response) => {
    try {
      const { entityId, amount } = req.body;
      const wallet = await financialService.topUpWallet(entityId, amount);
      res.json({ message: 'Wallet topped up successfully', wallet });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Double-Entry Ledger Journal Explorer & Integrity Verification
  app.get('/api/financial/ledger', async (req: Request, res: Response) => {
    try {
      const journals = await financialService.getAllLedgerJournals({ query: req.query.q as string });
      res.json({ journals });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/financial/ledger/verify', async (req: Request, res: Response) => {
    try {
      const integrity = await financialService.verifyLedgerIntegrity();
      res.json({ integrity });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Seller Settlements & Payouts
  app.get('/api/financial/payouts', async (req: Request, res: Response) => {
    try {
      const payouts = await financialService.getAllPayouts();
      res.json({ payouts });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/financial/payouts/request', async (req: Request, res: Response) => {
    try {
      const { sellerId, amount, payoutMethod, accountDetails } = req.body;
      const payout = await financialService.requestSellerPayout(sellerId, amount, payoutMethod, accountDetails);
      res.status(201).json({ message: 'Payout requested successfully', payout });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post('/api/financial/payouts/:id/approve', async (req: Request, res: Response) => {
    try {
      const payout = await financialService.approveSellerPayout(req.params.id, req.body.adminName);
      res.json({ message: 'Payout approved and disbursed successfully', payout });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Refunds with Reversal Ledger Journal
  app.post('/api/financial/refunds', async (req: Request, res: Response) => {
    try {
      const refund = await financialService.processRefund(req.body);
      res.status(201).json({ message: 'Refund executed with ledger reversal', refund });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Coupon Validation
  app.post('/api/financial/coupons/validate', async (req: Request, res: Response) => {
    try {
      const { code, subtotal } = req.body;
      const result = PromotionEngine.validateCoupon(code, subtotal);
      res.json({ couponResult: result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Financial Reports Aggregation
  app.get('/api/financial/reports', async (req: Request, res: Response) => {
    try {
      const summary = await financialService.getFinancialReportsSummary();
      res.json({ reports: summary });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Audit Logs & Event Bus Stream
  app.get('/api/audit-logs', async (req: Request, res: Response) => {
    res.json({ auditLogs: await auditService.getAllLogs() });
  });

  app.get('/api/events', (req: Request, res: Response) => {
    res.json({ events: eventBus.getEventHistory() });
  });

  // Multi-Warehouse Inventory Allocation Endpoint
  app.post('/api/inventory/allocate', (req: Request, res: Response) => {
    const { items, customerLocation } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required for allocation' });
    }

    const defaultLoc = customerLocation || {
      latitude: 37.7749,
      longitude: -122.4194,
      regionName: 'San Francisco, CA (Default)',
    };

    const plan = stockAllocationEngine.allocateOrderStock(items, defaultLoc, products, warehouses);

    logAuditEvent(
      'SYSTEM',
      'stock-allocation-engine',
      'STOCK_ALLOCATION_PLAN_GENERATED',
      'INVENTORY',
      `Calculated allocation route for ${items.length} item types. Multi-warehouse split: ${plan.isMultiWarehouseSplit}`
    );

    res.json({ plan });
  });

  // --- ENTERPRISE AI GATEWAY & MULTI-MODEL PLATFORM ENDPOINTS (Part 4) ---

  // Unified AI Gateway Process
  app.post('/api/ai/gateway/chat', async (req: Request, res: Response) => {
    try {
      const response = await aiGateway.processRequest(req.body);
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ error: 'AI Gateway Error', message: err.message || String(err) });
    }
  });

  // List Models in Registry
  app.get('/api/ai/gateway/models', (req: Request, res: Response) => {
    res.json({ models: ModelRegistry.getAllModels() });
  });

  // Get AI Provider Configurations
  app.get('/api/ai/gateway/providers', (req: Request, res: Response) => {
    res.json({ config: getAIPlatformConfig() });
  });

  // Get Prompt Engine Templates
  app.get('/api/ai/gateway/templates', (req: Request, res: Response) => {
    res.json({ templates: PromptEngine.getTemplates() });
  });

  // Get AI Analytics & Cost Summary
  app.get('/api/ai/gateway/analytics', (req: Request, res: Response) => {
    res.json({
      analytics: AIAnalyticsTracker.getAnalyticsSummary(),
      costs: AICostEngine.getCostSummary(),
      cacheStats: AICacheManager.getStats(),
    });
  });

  // Get AI Providers Health Status
  app.get('/api/ai/gateway/health', (req: Request, res: Response) => {
    res.json({ health: AISystemHealth.getSystemHealth() });
  });

  // Execute AI Tool Directly
  app.post('/api/ai/gateway/tools/execute', async (req: Request, res: Response) => {
    try {
      const { toolName, args } = req.body;
      const result = await AIToolExecutor.executeTool(toolName, args || {});
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: 'Tool Execution Failed', message: err.message || String(err) });
    }
  });

  // Clear AI Cache
  app.post('/api/ai/gateway/cache/clear', (req: Request, res: Response) => {
    AICacheManager.clear();
    res.json({ message: 'AI Response Cache cleared successfully' });
  });

  // --- PART 5: ENTERPRISE PERFORMANCE & SCALABILITY ENDPOINTS ---

  // Get Live Performance & Telemetry Snapshot
  app.get('/api/performance/metrics', (req: Request, res: Response) => {
    res.json(performanceService.getMetricsSnapshot());
  });

  // Run Automated Performance Audit
  app.get('/api/performance/audit', (req: Request, res: Response) => {
    res.json(performanceService.executeAudit());
  });

  // Purge or Invalidate Redis Cache
  app.post('/api/performance/cache/purge', (req: Request, res: Response) => {
    const { tag, prefix } = req.body;
    const result = performanceService.purgeCache(tag, prefix);
    res.json(result);
  });

  // Dispatch Background Job to Queue Engine
  app.post('/api/performance/jobs/dispatch', (req: Request, res: Response) => {
    const { name, queueName, data, priority } = req.body;
    if (!name || !queueName) {
      return res.status(400).json({ error: 'Job name and queueName required' });
    }
    const job = performanceService.dispatchJob(name, queueName, data || {}, priority || 'NORMAL');
    res.json({ message: 'Job dispatched successfully', job });
  });

  // Get Queue Jobs & Worker Pool Stats
  app.get('/api/performance/jobs/queue', (req: Request, res: Response) => {
    res.json({
      jobs: QueueEngine.getAllJobs(),
      stats: QueueEngine.getStats(),
    });
  });

  // Retry Dead Letter Queue Job
  app.post('/api/performance/jobs/retry-dlq', (req: Request, res: Response) => {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId required' });
    const success = performanceService.retryDlqJob(jobId);
    res.json({ success, message: success ? 'Job requeued successfully' : 'DLQ Job not found' });
  });

  // Simulate Load Test Scenario (1k, 10k, 100k, 1M users)
  app.post('/api/performance/load-test/simulate', (req: Request, res: Response) => {
    const { concurrentUsers, durationSeconds, requestsPerUserPerSec } = req.body;
    const scenario = {
      concurrentUsers: concurrentUsers || 1000000,
      durationSeconds: durationSeconds || 60,
      requestsPerUserPerSec: requestsPerUserPerSec || 5,
    };
    const result = performanceService.runLoadTest(scenario as any);
    res.json(result);
  });

  // Deep Infrastructure Health Check
  app.get('/api/health/deep', (req: Request, res: Response) => {
    res.json(PerformanceMonitor.getSystemHealth());
  });

  // --- PART 6: ENTERPRISE MARKETPLACE CORE ENDPOINTS ---

  // Get All Products
  app.get('/api/marketplace/products', async (req: Request, res: Response) => {
    try {
      const allProducts = await marketplaceService.getAllProducts();
      res.json({ products: allProducts });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch products', message: err.message });
    }
  });

  // Get Single Product
  app.get('/api/marketplace/products/:id', async (req: Request, res: Response) => {
    try {
      const prod = await marketplaceService.getProductById(req.params.id);
      if (!prod) return res.status(404).json({ error: 'Product not found' });
      res.json({ product: prod });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch product', message: err.message });
    }
  });

  // Update Product Status (Lifecycle State Machine)
  app.put('/api/marketplace/products/:id/status', async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const result = await marketplaceService.updateProductStatus(req.params.id, status);
      if (!result.success) return res.status(400).json({ error: result.error });
      res.json({ product: result.product });
    } catch (err: any) {
      res.status(500).json({ error: 'Status update failed', message: err.message });
    }
  });

  // Get Taxonomy Categories Hierarchy
  app.get('/api/marketplace/categories', async (req: Request, res: Response) => {
    try {
      const categories = await marketplaceService.getCategoryHierarchy();
      res.json({ categories });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch categories', message: err.message });
    }
  });

  // Get Brand Directory
  app.get('/api/marketplace/brands', async (req: Request, res: Response) => {
    try {
      const brands = await marketplaceService.getBrandDirectory();
      res.json({ brands });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch brands', message: err.message });
    }
  });

  // Get Product Reviews & Submit Review (with AI Shield)
  app.get('/api/marketplace/products/:id/reviews', async (req: Request, res: Response) => {
    try {
      const reviews = await marketplaceService.getProductReviews(req.params.id);
      res.json({ reviews });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch reviews', message: err.message });
    }
  });

  app.post('/api/marketplace/products/:id/reviews', async (req: Request, res: Response) => {
    try {
      const { authorName, rating, title, comment } = req.body;
      const result = await marketplaceService.submitProductReview(
        req.params.id,
        authorName || 'Verified Corporate Buyer',
        Number(rating || 5),
        title || 'Enterprise Review',
        comment || ''
      );
      if (!result.success) return res.status(400).json({ error: result.error });
      res.json({ review: result.review });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to submit review', message: err.message });
    }
  });

  // Compare Multiple Products
  app.get('/api/marketplace/compare', async (req: Request, res: Response) => {
    try {
      const ids = (req.query.ids as string || '').split(',').filter(Boolean);
      const matrix = await marketplaceService.buildComparisonMatrix(ids);
      res.json({ comparisonMatrix: matrix });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to build comparison matrix', message: err.message });
    }
  });

  // Get Recommendations
  app.get('/api/marketplace/products/:id/recommendations', async (req: Request, res: Response) => {
    try {
      const recs = await marketplaceService.getProductRecommendations(req.params.id);
      res.json({ recommendations: recs });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch recommendations', message: err.message });
    }
  });

  // Bulk CSV / JSON Import
  app.post('/api/marketplace/import', async (req: Request, res: Response) => {
    try {
      const { rows } = req.body;
      if (!rows || !Array.isArray(rows)) {
        return res.status(400).json({ error: 'Rows array required for import' });
      }
      const result = await marketplaceService.processBatchImport(rows);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Import failed', message: err.message });
    }
  });

  // --- AI Service Endpoints (Server-side Gemini AI Integration) ---

  // AI Semantic Search
  app.post('/api/ai/search', async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Search prompt required' });
    }

    const ai = getAIClient();

    if (!ai) {
      const q = prompt.toLowerCase();
      const matched = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );

      logAuditEvent(
        'AI_ENGINE',
        'fallback-search',
        'AI_SEARCH_FALLBACK',
        'AI_SERVICE',
        `Executed keyword search fallback for query: "${prompt}"`
      );

      return res.json({
        query: prompt,
        aiExplanation: 'Keyword match fallback active (Configure GEMINI_API_KEY in Secrets for live Gemini semantic analysis).',
        matchedProducts: matched,
        suggestedCategories: ['computing', 'robotics'],
      });
    }

    try {
      const catalogSummary = products
        .map(
          (p) =>
            `ID: ${p.id} | Title: ${p.title} | Category: ${p.category} | Price: $${p.price.amount} | Tags: ${p.tags.join(', ')} | Desc: ${p.description.substring(0, 100)}`
        )
        .join('\n');

      const response = await ai.models.generateContent({
        model: appConfig.geminiModel,
        contents: `You are an enterprise marketplace AI search assistant.
Catalog Products:
${catalogSummary}

User Intent Query: "${prompt}"

Task: Analyze user intent and return a JSON object with:
1. "matchedIds": string array of product IDs from the catalog that best match user intent.
2. "reasoning": concise 1-2 sentence explanation of why these products fit the query.
3. "suggestedFilters": array of strings for suggested category or tag filters.

Return ONLY valid JSON matching this schema:
{"matchedIds": ["prod-01"], "reasoning": "...", "suggestedFilters": ["..."]}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const matchedIds: string[] = parsed.matchedIds || [];
      const matchedProducts = products.filter((p) => matchedIds.includes(p.id));

      logAuditEvent(
        'AI_ENGINE',
        appConfig.geminiModel,
        'AI_SEARCH_SUCCESS',
        'AI_SERVICE',
        `Gemini semantic search processed for query "${prompt}" -> found ${matchedProducts.length} matches.`
      );

      eventBus.publish({
        id: `evt-${Date.now()}`,
        eventType: 'AI_SEARCH_EXECUTED',
        domain: 'AI_SERVICE',
        aggregateId: appConfig.geminiModel,
        timestamp: new Date().toISOString(),
        payload: { prompt, matchedCount: matchedProducts.length },
        actor: { type: 'AI_ENGINE', id: appConfig.geminiModel },
      });

      return res.json({
        query: prompt,
        aiExplanation: parsed.reasoning || 'Gemini semantic match completed.',
        matchedProducts: matchedProducts.length > 0 ? matchedProducts : products,
        suggestedCategories: parsed.suggestedFilters || [],
      });
    } catch (err: any) {
      logger.error('Gemini search error', 'Server', { error: String(err) });
      logAuditEvent('AI_ENGINE', appConfig.geminiModel, 'AI_SEARCH_ERROR', 'AI_SERVICE', err?.message || 'Error running AI search');
      return res.json({
        query: prompt,
        aiExplanation: 'Semantic search fallback engaged due to temporary API response.',
        matchedProducts: products,
        suggestedCategories: ['electronics'],
      });
    }
  });

  // AI Merchant Listing Draft Generator
  app.post('/api/ai/generate-product', async (req: Request, res: Response) => {
    const { roughTitle, targetCategory } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        title: roughTitle || 'Enterprise Hardware Component X',
        description: `High-reliability ${targetCategory || 'industrial'} system engineered for enterprise deployment, low operational latency, and scalable architecture.`,
        suggestedPrice: 1250.0,
        tags: [targetCategory || 'industrial', 'enterprise', 'high-performance', 'ai-ready'],
        suggestedSKU: `SKU-${Date.now().toString().slice(-6)}`,
        note: 'Fallback draft generated (Provide GEMINI_API_KEY in Secrets panel for dynamic Gemini generation).',
      });
    }

    try {
      const response = await ai.models.generateContent({
        model: appConfig.geminiModel,
        contents: `Generate a professional enterprise marketplace listing draft for:
Rough Concept: "${roughTitle || 'Enterprise Industrial Server'}"
Category: "${targetCategory || 'computing'}"

Return ONLY valid JSON matching this structure:
{
  "title": "Optimized Product Title",
  "description": "Rich 2-3 sentence enterprise product description highlighting key specs and value proposition.",
  "suggestedPrice": 1499.00,
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "suggestedSKU": "ENTERPRISE-SKU-CODE"
}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      logAuditEvent(
        'AI_ENGINE',
        appConfig.geminiModel,
        'AI_PRODUCT_GENERATE',
        'AI_SERVICE',
        `Generated product listing draft for "${roughTitle}"`
      );

      return res.json({
        ...parsed,
        note: `Generated dynamically by ${appConfig.geminiModel} AI Engine.`,
      });
    } catch (err: any) {
      logger.error('Gemini product generation error', 'Server', { error: String(err) });
      return res.status(500).json({ error: 'Failed to generate product via AI' });
    }
  });

  // ==========================================
  // ENTERPRISE LOGISTICS & SHIPPING API ENDPOINTS
  // ==========================================

  // Search & List Shipments
  app.get('/api/logistics/shipments', async (req: Request, res: Response) => {
    try {
      const { query, status, carrierId, shippingMethod, page, limit } = req.query;
      const result = await logisticsService.searchShipments({
        query: query ? String(query) : undefined,
        status: status ? String(status) : undefined,
        carrierId: carrierId ? String(carrierId) : undefined,
        shippingMethod: shippingMethod ? String(shippingMethod) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      return res.json(result);
    } catch (err: any) {
      logger.error('Error searching logistics shipments', 'Server', { error: String(err) });
      return res.status(500).json({ error: 'Failed to search shipments' });
    }
  });

  // Get Shipment by ID or Tracking
  app.get('/api/logistics/shipments/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let shipment = await logisticsService.getShipmentById(id);
      if (!shipment) {
        shipment = await logisticsService.getShipmentByTrackingNumber(id);
      }
      if (!shipment) {
        return res.status(404).json({ error: 'Shipment not found' });
      }
      return res.json(shipment);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch shipment' });
    }
  });

  // Calculate Shipping Rates
  app.post('/api/logistics/rates/calculate', async (req: Request, res: Response) => {
    try {
      const { originAddress, destinationAddress, items, shippingMethod, subtotalUSD, promoCode } = req.body;
      const rateResult = logisticsService.calculateRates({
        originAddress,
        destinationAddress,
        items,
        shippingMethod: shippingMethod || 'STANDARD',
        subtotalUSD: subtotalUSD || 0,
        promoCode,
      });
      return res.json(rateResult);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to calculate shipping rate' });
    }
  });

  // Create Order Shipments (With Split Shipment Logic)
  app.post('/api/logistics/shipments/create', async (req: Request, res: Response) => {
    try {
      const { orderId, orderNumber, items, originAddress, destinationAddress, shippingMethod, carrierId } = req.body;
      const shipments = await logisticsService.createOrderShipments({
        orderId,
        orderNumber: orderNumber || `ORD-${orderId}`,
        items,
        originAddress,
        destinationAddress,
        shippingMethod: shippingMethod || 'STANDARD',
        carrierId,
      });
      logAuditEvent('SYSTEM', 'SERVER', 'CREATE_ORDER_SHIPMENTS', 'LOGISTICS', `Created ${shipments.length} shipment(s) for order ${orderId}`);
      return res.status(201).json({ shipments });
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || 'Failed to create shipment') });
    }
  });

  // Dispatch Shipment via Courier Adapter
  app.post('/api/logistics/shipments/:id/dispatch', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const dispatched = await logisticsService.dispatchShipment(id);
      logAuditEvent('SYSTEM', 'SERVER', 'DISPATCH_SHIPMENT', 'LOGISTICS', `Dispatched shipment ${id}`);
      return res.json(dispatched);
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || 'Failed to dispatch shipment') });
    }
  });

  // Confirm Delivery & Record Proof of Delivery
  app.post('/api/logistics/shipments/:id/confirm-delivery', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { recipientName, driverNotes } = req.body;
      const delivered = await logisticsService.confirmDelivery(id, recipientName || 'Customer', driverNotes);
      logAuditEvent('MOCK_USER', 'DRIVER-01', 'CONFIRM_DELIVERY', 'LOGISTICS', `Delivered shipment ${id} to ${recipientName}`);
      return res.json(delivered);
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || 'Failed to confirm delivery') });
    }
  });

  // Generate Shipping Label & Packing Slip
  app.get('/api/logistics/labels/:shipmentId', async (req: Request, res: Response) => {
    try {
      const { shipmentId } = req.params;
      const labelDoc = await logisticsService.generateLabelAndPackingSlip(shipmentId);
      return res.json(labelDoc);
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || 'Failed to generate shipping label') });
    }
  });

  // Request Return Logistics
  app.post('/api/logistics/returns/request', async (req: Request, res: Response) => {
    try {
      const { originalShipmentId, orderId, customerId, pickupAddress, items, reason, notes } = req.body;
      const returnRecord = await logisticsService.requestReturn({
        originalShipmentId,
        orderId,
        customerId: customerId || 'CUST-MOCK-001',
        pickupAddress,
        items,
        reason: reason || 'DEFECTIVE_PRODUCT',
        notes,
      });
      logAuditEvent('MOCK_USER', customerId || 'CUST-MOCK-001', 'REQUEST_RETURN', 'LOGISTICS', `Requested return ${returnRecord.returnId} for shipment ${originalShipmentId}`);
      return res.status(201).json(returnRecord);
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || 'Failed to request return') });
    }
  });

  // Get Carriers & Shipping Methods
  app.get('/api/logistics/carriers', async (req: Request, res: Response) => {
    try {
      const carriers = await logisticsService.getCarriers();
      const methods = await logisticsService.getShippingMethods();
      const zones = await logisticsService.getDeliveryZones();
      const drivers = await logisticsService.getDrivers();
      return res.json({ carriers, methods, zones, drivers });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch logistics metadata' });
    }
  });

  // ==========================================
  // PART 17: GLOBAL SHIPPING, LOGISTICS & ORDER FULFILLMENT ENGINE
  // ==========================================

  // 1. Calculate Shipping Quotes & Availability
  app.post('/api/fulfillment/rates/quotes', (req: Request, res: Response) => {
    try {
      const { destinationCountry, originCountry, totalWeightKg, subtotalUSD, isPrime } = req.body;
      const result = shippingFulfillmentService.calculateShippingQuotes({
        destinationCountry,
        originCountry,
        totalWeightKg: Number(totalWeightKg) || 1.0,
        subtotalUSD: Number(subtotalUSD) || 0,
        isPrime: Boolean(isPrime),
      });
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to calculate shipping quotes' });
    }
  });

  // 2. Get Seller Fulfillment Queue & Shipments
  app.get('/api/fulfillment/seller/:sellerId/shipments', (req: Request, res: Response) => {
    try {
      const { sellerId } = req.params;
      const shipments = shippingFulfillmentService.getSellerShipments(sellerId);
      return res.json({ sellerId, count: shipments.length, shipments });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch seller shipments' });
    }
  });

  // 3. Seller Creates Shipment for Order Line Items
  app.post('/api/fulfillment/seller/shipments/create', async (req: Request, res: Response) => {
    try {
      const shipment = await shippingFulfillmentService.createShipment(req.body);
      return res.status(201).json({ success: true, shipment });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to create shipment' });
    }
  });

  // 4. Update Shipment Status (State Machine Enforcement)
  app.put('/api/fulfillment/shipments/:id/status', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { actor, newStatus, location, description, exceptionType, exceptionReason } = req.body;
      if (!actor || !newStatus) {
        return res.status(400).json({ error: 'actor and newStatus are required.' });
      }

      const updated = await shippingFulfillmentService.updateShipmentStatus({
        shipmentId: id,
        actor,
        newStatus,
        location,
        description,
        exceptionType,
        exceptionReason,
      });

      return res.json({ success: true, shipment: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update shipment status' });
    }
  });

  // 5. Get Shipment Details with Tracking Events
  app.get('/api/fulfillment/shipments/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const shipment = shippingFulfillmentService.getShipmentById(id);
      if (!shipment) {
        return res.status(404).json({ error: `Shipment '${id}' not found` });
      }
      return res.json(shipment);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve shipment' });
    }
  });

  // 6. Generate Packing Slip & Warehouse Checklist Document
  app.get('/api/fulfillment/shipments/:id/packing-slip', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const sellerId = req.query.sellerId ? String(req.query.sellerId) : undefined;
      const packingSlip = shippingFulfillmentService.generatePackingSlip(id, sellerId);
      return res.json(packingSlip);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to generate packing slip' });
    }
  });

  // 7. Buyer Package Tracking Timeline
  app.get('/api/fulfillment/buyer/orders/:orderId/tracking', (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      const shipments = shippingFulfillmentService.getBuyerShipments(orderId);
      return res.json({ orderId, count: shipments.length, shipments });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve buyer tracking information' });
    }
  });

  // 8. Admin Global Shipments Overview
  app.get('/api/fulfillment/admin/shipments', (req: Request, res: Response) => {
    try {
      const { status, sellerId, exceptionOnly } = req.query;
      const shipments = shippingFulfillmentService.getAllShipments({
        status: status ? String(status) : undefined,
        sellerId: sellerId ? String(sellerId) : undefined,
        exceptionOnly: exceptionOnly === 'true',
      });
      return res.json({ count: shipments.length, shipments });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve admin shipments' });
    }
  });

  // 9. Admin Shipping & Logistics Configuration
  app.get('/api/fulfillment/admin/config', (_req: Request, res: Response) => {
    try {
      const config = shippingFulfillmentService.getAdminConfig();
      return res.json(config);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve shipping configuration' });
    }
  });

  app.put('/api/fulfillment/admin/config', (req: Request, res: Response) => {
    try {
      const adminId = req.body.adminId || 'SUPER_ADMIN_ROOT';
      const updated = shippingFulfillmentService.updateAdminConfig(req.body, adminId);
      return res.json({ success: true, config: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update shipping config' });
    }
  });

  // ==========================================
  // ENTERPRISE NOTIFICATION & MESSAGING API ENDPOINTS
  // ==========================================

  // List & Search Notifications
  app.get('/api/notifications', async (req: Request, res: Response) => {
    try {
      const { recipientId, role, category, channel, status, unreadOnly, query, page, limit } = req.query;
      const result = await notificationService.searchNotifications({
        recipientId: recipientId ? String(recipientId) : undefined,
        role: role ? (String(role) as any) : undefined,
        category: category ? String(category) : undefined,
        channel: channel ? (String(channel) as any) : undefined,
        status: status ? (String(status) as any) : undefined,
        unreadOnly: unreadOnly === 'true',
        query: query ? String(query) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      return res.json(result);
    } catch (err: any) {
      logger.error('Error searching notifications', 'Server', { error: String(err) });
      return res.status(500).json({ error: 'Failed to search notifications' });
    }
  });

  // Unread Count for User
  app.get('/api/notifications/unread-count/:recipientId', async (req: Request, res: Response) => {
    try {
      const { recipientId } = req.params;
      const count = await notificationService.getUnreadCount(recipientId);
      return res.json({ recipientId, unreadCount: count });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch unread count' });
    }
  });

  // Send Single Notification
  app.post('/api/notifications/send', async (req: Request, res: Response) => {
    try {
      const { recipientId, recipientName, recipientEmail, recipientPhone, role, category, channel, title, body, htmlBody, priority, metadata } = req.body;
      if (!recipientId || !title || !body) {
        return res.status(400).json({ error: 'recipientId, title, and body are required' });
      }

      const notif = await notificationService.sendNotification({
        recipientId,
        recipientName,
        recipientEmail,
        recipientPhone,
        role: role || 'Buyer',
        category: category || 'General',
        channel: channel || 'in_app',
        title,
        body,
        htmlBody,
        priority: priority || 'normal',
        metadata,
      });

      logAuditEvent('SYSTEM', 'SERVER', 'SEND_NOTIFICATION', 'COMMUNICATION', `Sent ${channel || 'in_app'} notification ${notif.id} to ${recipientId}`);
      return res.status(201).json(notif);
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || 'Failed to send notification') });
    }
  });

  // Admin Broadcast
  app.post('/api/notifications/broadcast', async (req: Request, res: Response) => {
    try {
      const { title, body, htmlBody, targetRole, category, channel, priority, adminId } = req.body;
      if (!title || !body) {
        return res.status(400).json({ error: 'title and body are required' });
      }

      const result = await notificationService.sendAdminBroadcast({
        title,
        body,
        htmlBody,
        targetRole: targetRole || 'All',
        category: category || 'System Announcement',
        channel: channel || 'in_app',
        priority: priority || 'high',
        adminId: adminId || 'ADM-0001',
      });

      logAuditEvent('SYSTEM', adminId || 'ADM-0001', 'ADMIN_BROADCAST', 'COMMUNICATION', `Dispatched broadcast ${result.broadcastId} to target role ${targetRole || 'All'}`);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: String(err.message || 'Failed to dispatch broadcast') });
    }
  });

  // Mark Single Notification Read
  app.post('/api/notifications/:id/read', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updated = await notificationService.markAsRead(id);
      if (!updated) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // Mark All Notifications Read for User
  app.post('/api/notifications/read-all', async (req: Request, res: Response) => {
    try {
      const { recipientId } = req.body;
      if (!recipientId) {
        return res.status(400).json({ error: 'recipientId is required' });
      }

      const count = await notificationService.markAllAsRead(recipientId);
      return res.json({ recipientId, markedReadCount: count });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to mark all as read' });
    }
  });

  // User Notification Preferences
  app.get('/api/notifications/preferences/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const pref = await notificationService.getUserPreferences(userId);
      return res.json(pref || { userId, defaultApplied: true });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch user preferences' });
    }
  });

  app.post('/api/notifications/preferences/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const prefData = req.body;
      const saved = await notificationService.saveUserPreferences({
        userId,
        ...prefData,
      });
      logAuditEvent('MOCK_USER', userId, 'UPDATE_PREFERENCES', 'COMMUNICATION', `Updated notification preferences for ${userId}`);
      return res.json(saved);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to save preferences' });
    }
  });

  // Templates
  app.get('/api/notifications/templates', async (req: Request, res: Response) => {
    try {
      const templates = await notificationService.getTemplates();
      return res.json(templates);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch templates' });
    }
  });

  app.post('/api/notifications/templates', async (req: Request, res: Response) => {
    try {
      const templateData = req.body;
      const saved = await notificationService.saveTemplate(templateData);
      return res.status(201).json(saved);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to save template' });
    }
  });

  app.post('/api/notifications/templates/render', async (req: Request, res: Response) => {
    try {
      const { templateId, variables } = req.body;
      const template = await notificationService.getTemplateById(templateId);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }

      const rendered = notificationService.renderTemplate(template, variables || {});
      return res.json(rendered);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to render template' });
    }
  });

  // Campaigns
  app.get('/api/notifications/campaigns', async (req: Request, res: Response) => {
    try {
      const campaigns = await notificationService.getCampaigns();
      return res.json(campaigns);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
  });

  app.post('/api/notifications/campaigns', async (req: Request, res: Response) => {
    try {
      const campaignData = req.body;
      const created = await notificationService.createCampaign(campaignData);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create campaign' });
    }
  });

  // Channel Controls & Metrics
  app.get('/api/notifications/channels', async (req: Request, res: Response) => {
    try {
      const channels = await notificationService.getChannelConfigs();
      const metrics = await notificationService.getQueueMetrics();
      return res.json({ channels, metrics });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch channel status' });
    }
  });

  app.patch('/api/notifications/channels/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await notificationService.updateChannelConfig(id as any, updates);
      if (!updated) {
        return res.status(404).json({ error: 'Channel config not found' });
      }
      logAuditEvent('SYSTEM', 'SERVER', 'UPDATE_CHANNEL_CONFIG', 'COMMUNICATION', `Updated channel ${id} status/settings`);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update channel config' });
    }
  });

  // AI Optimizer Recommendations
  app.post('/api/notifications/ai-optimize', async (req: Request, res: Response) => {
    try {
      const { role, category, bodyText } = req.body;
      const result = notificationService.getAIOptimization(role || 'Buyer', category || 'General', bodyText || '');
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to compute AI notification optimization' });
    }
  });

  // =========================================================================
  // PART 18: RETURNS, REFUNDS, CANCELLATIONS & AFTER-SALES SERVICE ENGINE API
  // =========================================================================

  // Fetch returns with optional role filtering
  app.get('/api/after-sales/returns', async (req: Request, res: Response) => {
    try {
      const returns = afterSalesService.getAllReturns();
      return res.json({ count: returns.length, returns });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch returns' });
    }
  });

  app.get('/api/after-sales/returns/buyer/:buyerId', async (req: Request, res: Response) => {
    try {
      const returns = afterSalesService.getBuyerReturns(req.params.buyerId);
      return res.json({ count: returns.length, returns });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch buyer returns' });
    }
  });

  app.get('/api/after-sales/returns/seller/:sellerId', async (req: Request, res: Response) => {
    try {
      const returns = afterSalesService.getSellerReturns(req.params.sellerId);
      return res.json({ count: returns.length, returns });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch seller returns' });
    }
  });

  app.get('/api/after-sales/returns/:id', async (req: Request, res: Response) => {
    try {
      const returnReq = afterSalesService.getReturnById(req.params.id);
      if (!returnReq) return res.status(404).json({ error: 'Return request not found' });
      const messages = afterSalesService.getReturnMessages(req.params.id);
      return res.json({ returnRequest: returnReq, messages });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch return details' });
    }
  });

  app.post('/api/after-sales/returns/request', async (req: Request, res: Response) => {
    try {
      const created = await afterSalesService.submitReturnRequest(req.body);
      return res.status(201).json({ success: true, returnRequest: created });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to submit return request' });
    }
  });

  app.post('/api/after-sales/returns/:id/approve', async (req: Request, res: Response) => {
    try {
      const { sellerId, returnAddress, instructions, returnCarrier } = req.body;
      const updated = await afterSalesService.sellerApproveReturn({
        returnId: req.params.id,
        sellerId,
        returnAddress,
        instructions,
        returnCarrier,
      });
      return res.json({ success: true, returnRequest: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to approve return' });
    }
  });

  app.post('/api/after-sales/returns/:id/reject', async (req: Request, res: Response) => {
    try {
      const { sellerId, reason } = req.body;
      const updated = await afterSalesService.sellerRejectReturn({
        returnId: req.params.id,
        sellerId,
        reason,
      });
      return res.json({ success: true, returnRequest: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to reject return' });
    }
  });

  app.post('/api/after-sales/returns/:id/inspect', async (req: Request, res: Response) => {
    try {
      const result = await afterSalesService.recordWarehouseReceiptAndInspection({
        returnId: req.params.id,
        ...req.body,
      });
      return res.json({ success: true, ...result });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to record quality inspection' });
    }
  });

  app.post('/api/after-sales/returns/:id/messages', async (req: Request, res: Response) => {
    try {
      const { senderRole, senderName, message, attachments } = req.body;
      const newMsg = afterSalesService.addReturnMessage(
        req.params.id,
        senderRole,
        senderName,
        message,
        attachments
      );
      return res.status(201).json({ success: true, message: newMsg });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to post message' });
    }
  });

  app.post('/api/after-sales/returns/:id/escalate', async (req: Request, res: Response) => {
    try {
      const { actorRole, actorId, actorName, reason } = req.body;
      const result = await afterSalesService.escalateToDispute(
        req.params.id,
        actorRole,
        actorId,
        actorName,
        reason
      );
      return res.json({ success: true, ...result });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to escalate to dispute' });
    }
  });

  app.post('/api/after-sales/cancellations/request', async (req: Request, res: Response) => {
    try {
      const result = await afterSalesService.cancelOrder(req.body);
      return res.status(201).json({ success: true, cancellation: result });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to cancel order' });
    }
  });

  app.get('/api/after-sales/cancellations', async (req: Request, res: Response) => {
    try {
      const cancellations = afterSalesService.getAllCancellations();
      return res.json({ count: cancellations.length, cancellations });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch cancellations' });
    }
  });

  app.post('/api/after-sales/refunds/execute', async (req: Request, res: Response) => {
    try {
      const refund = await afterSalesService.executeRefund(req.body);
      return res.status(201).json({ success: true, refund });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to execute refund' });
    }
  });

  app.get('/api/after-sales/refunds', async (req: Request, res: Response) => {
    try {
      const refunds = afterSalesService.getAllRefunds();
      return res.json({ count: refunds.length, refunds });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch refunds' });
    }
  });

  app.get('/api/after-sales/policies', async (req: Request, res: Response) => {
    try {
      const policies = afterSalesService.getAllPolicies();
      return res.json({ count: policies.length, policies });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch return policies' });
    }
  });

  app.put('/api/after-sales/policies', async (req: Request, res: Response) => {
    try {
      const { policy, adminId } = req.body;
      const updated = afterSalesService.updatePolicy(policy, adminId || 'admin-root');
      return res.json({ success: true, policy: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update policy' });
    }
  });

  // =========================================================================
  // PART 19: CUSTOMER SUPPORT, HELP CENTER & TICKETING API
  // =========================================================================

  app.get('/api/support/articles', async (req: Request, res: Response) => {
    try {
      const { query, category, tag } = req.query as { query?: string; category?: any; tag?: string };
      const articles = supportTicketingService.searchArticles({ query, category, tag });
      return res.json({ count: articles.length, articles });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to search articles' });
    }
  });

  app.get('/api/support/articles/:id', async (req: Request, res: Response) => {
    try {
      const article = supportTicketingService.getArticleById(req.params.id);
      if (!article) return res.status(404).json({ error: 'Article not found' });
      return res.json({ article });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch article' });
    }
  });

  app.post('/api/support/articles/:id/vote', async (req: Request, res: Response) => {
    try {
      const { isHelpful } = req.body;
      const updated = supportTicketingService.voteArticleHelpful(req.params.id, Boolean(isHelpful));
      return res.json({ success: true, article: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to vote on article' });
    }
  });

  app.post('/api/support/articles', async (req: Request, res: Response) => {
    try {
      const { article, adminId } = req.body;
      const created = supportTicketingService.createArticle(article, adminId || 'admin-root');
      return res.status(201).json({ success: true, article: created });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to create article' });
    }
  });

  app.get('/api/support/tickets', async (req: Request, res: Response) => {
    try {
      const { role, userId, status, category, priority, assignedAgentId } = req.query as any;
      let tickets;
      if (role === 'BUYER' && userId) {
        tickets = supportTicketingService.getBuyerTickets(userId);
      } else if (role === 'SELLER' && userId) {
        tickets = supportTicketingService.getSellerTickets(userId);
      } else {
        // Admin or support agent view
        tickets = supportTicketingService.getAllTicketsForAdmin({
          status,
          category,
          priority,
          assignedAgentId,
        });
      }
      return res.json({ count: tickets.length, tickets });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch tickets' });
    }
  });

  app.get('/api/support/tickets/:id', async (req: Request, res: Response) => {
    try {
      const { userId, role } = req.query as { userId: string; role: any };
      const ticket = supportTicketingService.getTicketForUser(
        req.params.id,
        userId || 'admin-root',
        role || 'ADMIN'
      );
      return res.json({ ticket });
    } catch (err: any) {
      return res.status(403).json({ error: err.message || 'Access denied' });
    }
  });

  app.post('/api/support/tickets', async (req: Request, res: Response) => {
    try {
      const ticket = await supportTicketingService.createTicket(req.body);
      return res.status(201).json({ success: true, ticket });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to create ticket' });
    }
  });

  app.post('/api/support/tickets/:id/messages', async (req: Request, res: Response) => {
    try {
      const msg = await supportTicketingService.addTicketMessage({
        ticketId: req.params.id,
        ...req.body,
      });
      return res.status(201).json({ success: true, message: msg });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to post message' });
    }
  });

  app.patch('/api/support/tickets/:id/status', async (req: Request, res: Response) => {
    try {
      const { status, actorId, notes } = req.body;
      const updated = await supportTicketingService.updateTicketStatus(
        req.params.id,
        status,
        actorId || 'admin-root',
        notes
      );
      return res.json({ success: true, ticket: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to update ticket status' });
    }
  });

  app.post('/api/support/tickets/:id/assign', async (req: Request, res: Response) => {
    try {
      const { agentId, agentName, adminId } = req.body;
      const updated = await supportTicketingService.assignAgent(
        req.params.id,
        agentId,
        agentName,
        adminId || 'admin-root'
      );
      return res.json({ success: true, ticket: updated });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to assign agent' });
    }
  });

  app.get('/api/support/metrics', async (req: Request, res: Response) => {
    try {
      const metrics = supportTicketingService.getMetrics();
      return res.json({ metrics });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch support metrics' });
    }
  });

  // ==========================================
  // DIGITAL MARKETPLACE API ENDPOINTS
  // ==========================================

  app.get('/api/digital/products', (req: Request, res: Response) => {
    try {
      const { category, q, licenseType, minPrice, maxPrice, sortBy } = req.query;
      const products = digitalMarketplaceService.getProducts({
        category: category as string,
        query: q as string,
        licenseType: licenseType as any,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sortBy as any
      });
      return res.json({ products, count: products.length });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to list digital products' });
    }
  });

  app.get('/api/digital/products/:id', (req: Request, res: Response) => {
    try {
      const product = digitalMarketplaceService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Digital product not found' });
      }
      return res.json({ product });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to get digital product' });
    }
  });

  app.post('/api/digital/orders/checkout', (req: Request, res: Response) => {
    try {
      const { productId, licenseType, buyerId, buyerEmail, paymentMethod } = req.body;
      if (!productId || !licenseType) {
        return res.status(400).json({ error: 'productId and licenseType are required' });
      }
      const result = digitalMarketplaceService.checkoutDigitalProduct({
        productId,
        licenseType,
        buyerId: buyerId || 'current-user',
        buyerEmail,
        paymentMethod: paymentMethod || 'WALLET'
      });
      return res.json({ success: true, ...result });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Digital checkout failed' });
    }
  });

  app.get('/api/digital/vault', (req: Request, res: Response) => {
    try {
      const items = digitalMarketplaceService.getUserVault();
      return res.json({ items, count: items.length });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch vault items' });
    }
  });

  app.post('/api/digital/licenses/verify', (req: Request, res: Response) => {
    try {
      const { licenseKey, productId } = req.body;
      if (!licenseKey) {
        return res.status(400).json({ error: 'licenseKey is required' });
      }
      const verification = digitalMarketplaceService.verifyLicense(licenseKey, productId);
      return res.json(verification);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'License verification failed' });
    }
  });

  app.post('/api/digital/licenses/activate', (req: Request, res: Response) => {
    try {
      const { licenseKey, domainOrDeviceId } = req.body;
      if (!licenseKey || !domainOrDeviceId) {
        return res.status(400).json({ error: 'licenseKey and domainOrDeviceId are required' });
      }
      const activation = digitalMarketplaceService.activateLicense(licenseKey, domainOrDeviceId);
      return res.json(activation);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'License activation failed' });
    }
  });

  app.delete('/api/digital/vault/:vaultItemId/activations/:activationId', (req: Request, res: Response) => {
    try {
      const { vaultItemId, activationId } = req.params;
      const success = digitalMarketplaceService.revokeActivation(vaultItemId, activationId);
      if (!success) {
        return res.status(404).json({ error: 'Activation or vault item not found' });
      }
      return res.json({ success: true, message: 'Seat revoked successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to revoke activation' });
    }
  });

  app.post('/api/digital/vault/:vaultItemId/refresh-token', (req: Request, res: Response) => {
    try {
      const { vaultItemId } = req.params;
      const refreshed = digitalMarketplaceService.refreshToken(vaultItemId);
      return res.json({ success: true, ...refreshed });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to refresh token' });
    }
  });

  app.post('/api/digital/products', (req: Request, res: Response) => {
    try {
      const {
        title,
        shortDescription,
        description,
        category,
        fileFormat,
        fileSize,
        standardPrice,
        commercialPrice,
        extendedPrice,
        techStack,
        authorName,
        previewUrl
      } = req.body;

      if (!title || !shortDescription || !standardPrice) {
        return res.status(400).json({ error: 'title, shortDescription, and standardPrice are required' });
      }

      const product = digitalMarketplaceService.publishProduct({
        title,
        shortDescription,
        description: description || shortDescription,
        category: category || 'developer_tools',
        fileFormat: fileFormat || 'ZIP (.ts, .json)',
        fileSize: fileSize || '25 MB',
        standardPrice: Number(standardPrice),
        commercialPrice: Number(commercialPrice || standardPrice * 2),
        extendedPrice: Number(extendedPrice || standardPrice * 5),
        techStack: Array.isArray(techStack) ? techStack : ['TypeScript'],
        authorName,
        previewUrl
      });

      return res.json({ success: true, product });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to publish digital product' });
    }
  });

  app.post('/api/digital/products/:id/versions', (req: Request, res: Response) => {
    try {
      const { version, changes } = req.body;
      if (!version || !Array.isArray(changes)) {
        return res.status(400).json({ error: 'version and changes array are required' });
      }
      const success = digitalMarketplaceService.releaseVersionUpdate(req.params.id, version, changes);
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json({ success: true, message: `Version ${version} published successfully.` });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to release version' });
    }
  });

  app.get('/api/digital/metrics', (req: Request, res: Response) => {
    try {
      const metrics = digitalMarketplaceService.getMetrics();
      return res.json({ metrics });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to get digital metrics' });
    }
  });

  // ==========================================
  // FREELANCER MARKETPLACE & ESCROW API
  // ==========================================

  app.get('/api/freelance/jobs', (req: Request, res: Response) => {
    try {
      const { category, q, experienceLevel } = req.query;
      const jobs = freelanceService.getJobs({
        category: category as string,
        query: q as string,
        experienceLevel: experienceLevel as string
      });
      return res.json({ jobs, count: jobs.length });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch freelance jobs' });
    }
  });

  app.get('/api/freelance/jobs/:id', (req: Request, res: Response) => {
    try {
      const job = freelanceService.getJobById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Job not found' });
      return res.json({ job });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch job' });
    }
  });

  app.get('/api/freelance/talent', (req: Request, res: Response) => {
    try {
      const { category, q } = req.query;
      const freelancers = freelanceService.getFreelancers({
        category: category as string,
        query: q as string
      });
      return res.json({ freelancers, count: freelancers.length });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch talent' });
    }
  });

  app.get('/api/freelance/talent/:id', (req: Request, res: Response) => {
    try {
      const freelancer = freelanceService.getFreelancerById(req.params.id);
      if (!freelancer) return res.status(404).json({ error: 'Freelancer profile not found' });
      return res.json({ freelancer });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch talent details' });
    }
  });

  app.post('/api/freelance/jobs', (req: Request, res: Response) => {
    try {
      const { title, description, category, budget, budgetType, skills, experienceLevel, duration, clientName, milestones } = req.body;
      if (!title || !description || !budget) {
        return res.status(400).json({ error: 'title, description, and budget are required' });
      }
      const job = freelanceService.postJob({
        title,
        description,
        category: category || 'web_frontend',
        budget: Number(budget),
        budgetType: budgetType || 'FIXED',
        skills: Array.isArray(skills) ? skills : ['TypeScript', 'React'],
        experienceLevel: experienceLevel || 'INTERMEDIATE',
        duration: duration || '2-4 weeks',
        clientName,
        milestones: Array.isArray(milestones) && milestones.length ? milestones : [
          { title: 'Phase 1: Project Setup & Initial Deliverables', amount: Math.round(budget * 0.5), dueDate: '2026-11-15' },
          { title: 'Phase 2: Final Delivery & Testing Sign-Off', amount: Math.round(budget * 0.5), dueDate: '2026-11-30' }
        ]
      });
      return res.json({ success: true, job });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to post freelance job' });
    }
  });

  app.post('/api/freelance/proposals', (req: Request, res: Response) => {
    try {
      const { jobId, bidAmount, deliveryDays, coverLetter, freelancerName, milestonesProposed } = req.body;
      if (!jobId || !bidAmount || !coverLetter) {
        return res.status(400).json({ error: 'jobId, bidAmount, and coverLetter are required' });
      }
      const proposal = freelanceService.submitProposal({
        jobId,
        bidAmount: Number(bidAmount),
        deliveryDays: Number(deliveryDays || 14),
        coverLetter,
        freelancerName,
        milestonesProposed: milestonesProposed || [{ title: 'Full Project Milestone', amount: Number(bidAmount) }]
      });
      return res.json({ success: true, proposal });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to submit proposal' });
    }
  });

  app.post('/api/freelance/jobs/:jobId/milestones/:milestoneId/fund', (req: Request, res: Response) => {
    try {
      const result = freelanceService.fundMilestone(req.params.jobId, req.params.milestoneId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to fund milestone escrow' });
    }
  });

  app.post('/api/freelance/jobs/:jobId/milestones/:milestoneId/deliver', (req: Request, res: Response) => {
    try {
      const { deliverableNote } = req.body;
      const result = freelanceService.submitMilestoneDeliverable(
        req.params.jobId,
        req.params.milestoneId,
        deliverableNote || 'Deliverable uploaded and ready for client inspection.'
      );
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to submit milestone deliverable' });
    }
  });

  app.post('/api/freelance/jobs/:jobId/milestones/:milestoneId/release', (req: Request, res: Response) => {
    try {
      const result = freelanceService.releaseMilestoneEscrow(req.params.jobId, req.params.milestoneId);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to release escrow' });
    }
  });

  app.get('/api/freelance/metrics', (req: Request, res: Response) => {
    try {
      const metrics = freelanceService.getMetrics();
      return res.json({ metrics });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch freelance metrics' });
    }
  });

  // Global Process Error Handlers to prevent Cloud Run connection drops
  process.on('uncaughtException', (err) => {
    logger.error(`[Process] Uncaught Exception: ${err.message}`, 'Server', { stack: err.stack });
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`[Process] Unhandled Rejection: ${String(reason)}`, 'Server');
  });

  // Serve Vite in dev mode, or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req: Request, res: Response) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ error: 'Production asset dist/index.html not found' });
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`${appConfig.appName} Enterprise Platform API Server running on http://0.0.0.0:${PORT}`, 'Server');
  });

  const gracefulShutdown = (signal: string) => {
    logger.info(`[Server] Received ${signal}. Shutting down gracefully...`, 'Server');
    server.close(() => {
      logger.info('[Server] HTTP server closed.', 'Server');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer();

