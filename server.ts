import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PRODUCTS, MOCK_WAREHOUSES, MOCK_ORDERS, MOCK_AUDIT_LOGS, MOCK_MERCHANTS } from './src/data/mockData.js';
import { MASTER_ROADMAP } from './src/data/roadmapData.js';
import { Product, Order, AuditLog, DomainEvent } from './src/types/domain.js';
import { eventBus } from './src/lib/eventBus.js';
import { stockAllocationEngine } from './src/lib/stockAllocator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory state for development mock database
let products: Product[] = [...MOCK_PRODUCTS];
let warehouses = [...MOCK_WAREHOUSES];
let orders: Order[] = [...MOCK_ORDERS];
let auditLogs: AuditLog[] = [...MOCK_AUDIT_LOGS];

// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
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
  domain: 'CATALOG' | 'INVENTORY' | 'ORDER' | 'AI_SERVICE' | 'SECURITY',
  details: string
) {
  const newLog: AuditLog = {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    actorType,
    actorId,
    action,
    domain,
    details,
  };
  auditLogs.unshift(newLog);
  // Keep audit logs capped at 100 entries for memory optimization
  if (auditLogs.length > 100) auditLogs.pop();
  return newLog;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Request logger middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API ${req.method}] ${req.url}`);
    }
    next();
  });

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Enterprise AI Marketplace Platform API',
      version: '1.0.0-m1.1',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      capabilities: {
        aiPoweredSearch: true,
        multiWarehouseStock: true,
        auditTrailEnabled: true,
        authenticationState: 'DEFERRED_BY_INTENT',
      },
    });
  });

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
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, merchantId, maxPrice } = req.query;

    let filtered = [...products];

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

  // Get Product by ID
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  });

  // Warehouses & Stock Matrix
  app.get('/api/warehouses', (req: Request, res: Response) => {
    res.json({
      warehouses,
      totalUnitsUtilized: warehouses.reduce((acc, w) => acc + w.utilizedUnits, 0),
      totalCapacity: warehouses.reduce((acc, w) => acc + w.capacityUnits, 0),
    });
  });

  // Get Orders
  app.get('/api/orders', (req: Request, res: Response) => {
    res.json({ orders });
  });

  // Create Order (Simulated checkout & stock update)
  app.post('/api/orders', (req: Request, res: Response) => {
    const { items, customerName, customerEmail, shippingAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    let subtotalAmount = 0;
    const orderItems = items.map((item: any, index: number) => {
      const product = products.find((p) => p.id === item.productId);
      const unitPrice = product ? product.price.amount : 100;
      const totalItemPrice = unitPrice * (item.quantity || 1);
      subtotalAmount += totalItemPrice;

      // Reserve stock in first warehouse
      if (product && product.warehouseStock.length > 0) {
        product.warehouseStock[0].reserved += item.quantity || 1;
        product.totalStock = Math.max(0, product.totalStock - (item.quantity || 1));
      }

      return {
        id: `item-${Date.now()}-${index}`,
        productId: item.productId,
        productTitle: product ? product.title : item.productTitle || 'Marketplace Product',
        sku: product ? product.sku : 'SKU-UNKNOWN',
        merchantId: product ? product.merchant.id : 'merch-01',
        merchantName: product ? product.merchant.name : 'Apex Merchants',
        warehouseId: product && product.warehouseStock[0] ? product.warehouseStock[0].warehouseId : 'wh-01',
        unitPrice: { amount: unitPrice, currency: 'USD' as const },
        quantity: item.quantity || 1,
        totalPrice: { amount: totalItemPrice, currency: 'USD' as const },
      };
    });

    const taxFeeAmount = Math.round(subtotalAmount * 0.08 * 100) / 100;
    const shippingFeeAmount = 25.0;
    const totalAmount = Math.round((subtotalAmount + taxFeeAmount + shippingFeeAmount) * 100) / 100;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'usr-mock-buyer-01',
      customerName: customerName || 'Enterprise Buyer (Mock User)',
      customerEmail: customerEmail || 'buyer@enterprise.mock',
      items: orderItems,
      subtotal: { amount: subtotalAmount, currency: 'USD' },
      shippingFee: { amount: shippingFeeAmount, currency: 'USD' },
      taxFee: { amount: taxFeeAmount, currency: 'USD' },
      total: { amount: totalAmount, currency: 'USD' },
      status: 'placed',
      shippingAddress: shippingAddress || {
        address: '100 Enterprise Way',
        city: 'Austin',
        state: 'TX',
        country: 'USA',
        latitude: 30.2672,
        longitude: -97.7431,
      },
      fraudRiskScore: Math.floor(Math.random() * 15), // Low risk baseline
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);

    logAuditEvent(
      'MOCK_USER',
      'usr-mock-buyer-01',
      'ORDER_PLACED',
      'ORDER',
      `Placed order ${newOrder.orderNumber} for total $${newOrder.total.amount}`
    );

    // Publish Decoupled Domain Event
    eventBus.publish({
      id: `evt-${Date.now()}`,
      eventType: 'ORDER_PLACED',
      domain: 'ORDER',
      aggregateId: newOrder.id,
      timestamp: new Date().toISOString(),
      payload: {
        orderNumber: newOrder.orderNumber,
        itemCount: newOrder.items.length,
        totalAmount: newOrder.total.amount,
        customerName: newOrder.customerName,
      },
      actor: { type: 'MOCK_USER', id: 'usr-mock-buyer-01' },
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
    });
  });

  // Get Audit Logs & Event Bus Stream
  app.get('/api/audit-logs', (req: Request, res: Response) => {
    res.json({ auditLogs: eventBus.getAuditTrail() });
  });

  app.get('/api/events', (req: Request, res: Response) => {
    res.json({ events: eventBus.getEventHistory() });
  });

  // Multi-Warehouse Inventory Allocation Endpoint (Task 1.2.1)
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

  // --- AI Service Endpoints (Server-side Gemini AI Integration) ---

  // AI Semantic Search
  app.post('/api/ai/search', async (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Search prompt required' });
    }

    const ai = getAIClient();

    if (!ai) {
      // Fallback keyword search if Gemini API key is not configured
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
        model: 'gemini-3.6-flash',
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
        'gemini-3.6-flash',
        'AI_SEARCH_SUCCESS',
        'AI_SERVICE',
        `Gemini semantic search processed for query "${prompt}" -> found ${matchedProducts.length} matches.`
      );

      eventBus.publish({
        id: `evt-${Date.now()}`,
        eventType: 'AI_SEARCH_EXECUTED',
        domain: 'AI_SERVICE',
        aggregateId: 'gemini-3.6-flash',
        timestamp: new Date().toISOString(),
        payload: { prompt, matchedCount: matchedProducts.length },
        actor: { type: 'AI_ENGINE', id: 'gemini-3.6-flash' },
      });

      return res.json({
        query: prompt,
        aiExplanation: parsed.reasoning || 'Gemini semantic match completed.',
        matchedProducts: matchedProducts.length > 0 ? matchedProducts : products,
        suggestedCategories: parsed.suggestedFilters || [],
      });
    } catch (err: any) {
      console.error('Gemini search error:', err);
      logAuditEvent('AI_ENGINE', 'gemini-3.6-flash', 'AI_SEARCH_ERROR', 'AI_SERVICE', err?.message || 'Error running AI search');
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
        model: 'gemini-3.6-flash',
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
        'gemini-3.6-flash',
        'AI_PRODUCT_GENERATE',
        'AI_SERVICE',
        `Generated product listing draft for "${roughTitle}"`
      );

      return res.json({
        ...parsed,
        note: 'Generated dynamically by Gemini 3.6 Flash AI Engine.',
      });
    } catch (err: any) {
      console.error('Gemini product generation error:', err);
      return res.status(500).json({ error: 'Failed to generate product via AI' });
    }
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
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise Marketplace Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
