import React, { useState } from 'react';
import { Product, ProductVariant, ProductCategory, ProductApprovalStatus } from '../../types/domain';
import {
  X,
  Plus,
  Trash2,
  Image,
  Video,
  Eye,
  Check,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  FileText,
  Tag,
  ShieldCheck,
  Globe,
  Sliders,
  Barcode,
  Boxes,
  Code2,
} from 'lucide-react';

interface ProductListingEditorModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProduct: Product) => void;
}

export const ProductListingEditorModal: React.FC<ProductListingEditorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<
    'basic' | 'media' | 'specs' | 'pricing' | 'inventory' | 'variants' | 'seo'
  >('basic');

  // Form State
  const [title, setTitle] = useState(product?.title || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [barcode, setBarcode] = useState(product?.barcode || '012345678901');
  const [gtin, setGtin] = useState(product?.gtin || 'GTIN-889021');
  const [upc, setUpc] = useState(product?.upc || 'UPC-772109');
  const [isbn, setIsbn] = useState(product?.isbn || '');
  const [brand, setBrand] = useState(product?.brand || 'Apex Enterprise');
  const [manufacturer, setManufacturer] = useState(product?.manufacturer || 'Apex Corp');
  const [modelNumber, setModelNumber] = useState(product?.modelNumber || 'MOD-2026-X');
  const [category, setCategory] = useState<ProductCategory>(product?.category || 'computing');
  const [subcategory, setSubcategory] = useState(product?.subcategory || 'Laptops & Workstations');

  const [description, setDescription] = useState(product?.description || '');
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription || 'Enterprise hardware engineered for mission-critical reliability.'
  );
  const [features, setFeatures] = useState<string[]>(
    product?.features || ['Military-Grade Durability', 'AI Acceleration Engine', '18-Hour Battery Life']
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');

  const [techSpecs, setTechSpecs] = useState<Record<string, string>>(
    product?.technicalSpecs || {
      Processor: 'Intel Xeon / Apple M3 Max Equivalent',
      Memory: '64GB DDR5 ECC',
      Storage: '2TB PCIe Gen4 NVMe SSD',
      Weight: '2.1 kg',
    }
  );
  const [specKeyInput, setSpecKeyInput] = useState('');
  const [specValInput, setSpecValInput] = useState('');

  const [warranty, setWarranty] = useState(product?.warranty || '3-Year On-Site Enterprise Warranty');
  const [returnPolicy, setReturnPolicy] = useState(
    product?.returnPolicy || '30-Day Hassle-Free Money-Back Guarantee'
  );
  const [countryOfOrigin, setCountryOfOrigin] = useState(product?.countryOfOrigin || 'United States');

  // Media
  const [images, setImages] = useState<string[]>(
    product?.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80']
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrl, setVideoUrl] = useState(product?.mediaDetails?.videoUrl || 'https://youtube.com/watch?v=sample');
  const [view360Url, setView360Url] = useState(product?.mediaDetails?.view360Url || '');

  // Pricing
  const [regularPrice, setRegularPrice] = useState(product?.pricingDetails?.regularPrice || product?.price.amount || 2899.99);
  const [salePrice, setSalePrice] = useState(product?.pricingDetails?.salePrice || 2699.99);
  const [costPrice, setCostPrice] = useState(product?.pricingDetails?.costPrice || 1800.00);
  const [wholesalePrice, setWholesalePrice] = useState(product?.pricingDetails?.wholesalePrice || 2200.00);
  const [bulkQty, setBulkQty] = useState(10);
  const [bulkPrice, setBulkPrice] = useState(2400.00);

  // Inventory & Variants
  const [totalStock, setTotalStock] = useState(product?.totalStock || 50);
  const [reorderLevel, setReorderLevel] = useState(product?.inventoryDetails?.reorderLevel || 10);
  const [batchNumber, setBatchNumber] = useState(product?.inventoryDetails?.batchNumber || 'BATCH-2026-Q3');
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [
      {
        id: 'var-1',
        sku: `${sku || 'PROD'}-64GB`,
        name: '64GB RAM / 2TB SSD',
        attributes: { RAM: '64GB', Storage: '2TB' },
        price: { amount: regularPrice, currency: 'USD' },
        stock: 30,
      },
    ]
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState(product?.seoDetails?.title || `${title} | Commerce Zon Prime Official`);
  const [metaDesc, setMetaDesc] = useState(
    product?.seoDetails?.metaDescription || shortDescription
  );
  const [keywords, setKeywords] = useState<string[]>(
    product?.seoDetails?.keywords || ['laptop', 'enterprise', 'high performance']
  );

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFeatures((prev) => [...prev, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddTechSpec = () => {
    if (!specKeyInput.trim() || !specValInput.trim()) return;
    setTechSpecs((prev) => ({ ...prev, [specKeyInput.trim()]: specValInput.trim() }));
    setSpecKeyInput('');
    setSpecValInput('');
  };

  const handleRemoveTechSpec = (key: string) => {
    setTechSpecs((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveListing = () => {
    const updatedProd: Product = {
      id: product?.id || `prod-${Date.now()}`,
      title: title || 'Untitled Product Listing',
      slug: slug || (title || 'product').toLowerCase().replace(/\s+/g, '-'),
      sku: sku || `SKU-${Date.now()}`,
      barcode,
      gtin,
      upc,
      isbn,
      brand,
      manufacturer,
      modelNumber,
      description,
      shortDescription,
      category,
      subcategory,
      features,
      technicalSpecs: techSpecs,
      warranty,
      returnPolicy,
      countryOfOrigin,
      tags: keywords,
      price: { amount: salePrice || regularPrice, currency: 'USD' },
      pricingDetails: {
        regularPrice,
        salePrice,
        costPrice,
        wholesalePrice,
        bulkPricing: [{ minQty: bulkQty, price: bulkPrice }],
      },
      merchant: product?.merchant || {
        id: 'merch-01',
        name: 'Apex Enterprise Vendor',
        code: 'APEX',
        tier: 'flagship',
        rating: 4.9,
        reviewCount: 310,
        isVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
      images,
      mediaDetails: {
        images,
        videoUrl,
        view360Url,
      },
      rating: product?.rating || 4.8,
      reviewCount: product?.reviewCount || 45,
      variants,
      warehouseStock: product?.warehouseStock || [
        {
          warehouseId: 'wh-01',
          warehouseName: 'New York Metro Fulfillment Hub',
          code: 'WH-US-EAST',
          quantity: Math.floor(totalStock * 0.6),
          reserved: 2,
          reorderLevel,
        },
      ],
      inventoryDetails: {
        liveStock: totalStock,
        reservedStock: 2,
        incomingStock: 20,
        reorderLevel,
        batchNumber,
      },
      totalStock,
      approvalStatus: product?.approvalStatus || 'APPROVED',
      seoDetails: {
        title: seoTitle || title,
        metaDescription: metaDesc,
        keywords,
      },
      analyticsDetails: product?.analyticsDetails || {
        views: 1240,
        clicks: 890,
        salesCount: 142,
        conversionRatePct: 15.9,
        revenue: 411788,
        returnRatePct: 0.8,
        wishlistCount: 230,
        cartAdditionsCount: 310,
        searchRank: 2,
      },
      isArchived: false,
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedProd);
    onClose();
  };

  const jsonLdSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: title,
    image: images,
    description: shortDescription || description,
    sku,
    gtin13: gtin,
    brand: { '@type': 'Brand', name: brand },
    offers: {
      '@type': 'Offer',
      url: `https://marketplace.commercezon.com/dp/${sku}`,
      priceCurrency: 'USD',
      price: salePrice || regularPrice,
      itemCondition: 'https://schema.org/NewCondition',
      availability: totalStock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full p-6 shadow-2xl relative max-h-[92vh] flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#febd69] text-slate-950 rounded-xl font-black">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                {product ? `Edit Product: ${product.title}` : 'Create Commerce Zon Level Product Listing'}
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Catalog & SKU Management Studio (Module 8)
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 py-3 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'basic' ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. Basic & Identifiers</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'media' ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>2. Media Gallery</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'specs' ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Specs & Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'pricing' ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>4. Pricing Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'inventory' ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>5. Inventory & Stock</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 ${
              activeTab === 'seo' ? 'bg-[#febd69] text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>6. SEO & Schema</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="py-4 overflow-y-auto flex-1 space-y-4 text-xs pr-2">
          {/* TAB 1: BASIC & IDENTIFIERS */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-slate-300 font-bold block mb-1">Product Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Titan Workstation X9 Heavy Duty Laptop"
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">SEO URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. titan-workstation-x9"
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Primary SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. TW-X9-64GB-2TB"
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Model Number</label>
                  <input
                    type="text"
                    value={modelNumber}
                    onChange={(e) => setModelNumber(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Department / Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800 font-bold"
                  >
                    <option value="computing">Computing & Laptops</option>
                    <option value="robotics">Robotics & Automation</option>
                    <option value="electronics">Electronics & Audio</option>
                    <option value="industrial">Industrial Equipment</option>
                  </select>
                </div>
              </div>

              {/* Barcode & Identifiers Box */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                  <Barcode className="w-4 h-4" />
                  <span>Global Barcode & Identifier Standards</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-slate-400 text-[11px] block">GTIN-13</label>
                    <input
                      type="text"
                      value={gtin}
                      onChange={(e) => setGtin(e.target.value)}
                      className="w-full bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block">UPC Barcode</label>
                    <input
                      type="text"
                      value={upc}
                      onChange={(e) => setUpc(e.target.value)}
                      className="w-full bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block">ISBN Code</label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      className="w-full bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 text-[11px] block">EAN / Barcode</label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="w-full bg-slate-900 text-white p-1.5 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-slate-300 font-bold block">Add High-Res Product Image URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                  <button
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-[#febd69] text-slate-950 font-bold rounded-xl flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative group bg-slate-950 border border-slate-800 rounded-xl p-2 flex items-center justify-center h-32"
                  >
                    <img
                      src={imgUrl}
                      alt={`Product media ${i}`}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1.5 rounded">
                        MAIN COVER
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Product Video Embed / URL</label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">360° Interactive Viewer URL</label>
                  <input
                    type="text"
                    value={view360Url}
                    onChange={(e) => setView360Url(e.target.value)}
                    placeholder="https://3d-viewer.com/embed/..."
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECS & POLICY */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Short Bullet Summary</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Full Detailed Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              {/* Bullet Features */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label className="text-slate-300 font-bold block">Key Features Bullet Points</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    placeholder="e.g. IP67 Waterproof Enclosure"
                    className="flex-1 bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                  <button
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-[#febd69] text-slate-950 font-bold rounded-xl"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-1">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                    >
                      <span>• {feat}</span>
                      <button onClick={() => handleRemoveFeature(idx)} className="text-rose-400 hover:text-rose-300">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications Map */}
              <div className="space-y-2 border-t border-slate-800 pt-3">
                <label className="text-slate-300 font-bold block">Technical Specifications Table</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. RAM)"
                    value={specKeyInput}
                    onChange={(e) => setSpecKeyInput(e.target.value)}
                    className="bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Spec Value (e.g. 64GB DDR5)"
                    value={specValInput}
                    onChange={(e) => setSpecValInput(e.target.value)}
                    className="bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                  <button
                    onClick={handleAddTechSpec}
                    className="bg-amber-500 text-slate-950 font-bold py-2 rounded-xl"
                  >
                    Set Spec
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {Object.entries(techSpecs).map(([k, v]) => (
                    <div
                      key={k}
                      className="p-2 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-amber-300">{k}: </span>
                        <span className="text-slate-300">{v}</span>
                      </div>
                      <button onClick={() => handleRemoveTechSpec(k)} className="text-rose-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Warranty Period</label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Return Policy</label>
                  <input
                    type="text"
                    value={returnPolicy}
                    onChange={(e) => setReturnPolicy(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Country of Origin</label>
                  <input
                    type="text"
                    value={countryOfOrigin}
                    onChange={(e) => setCountryOfOrigin(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2 rounded-xl border border-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRICING MATRIX */}
          {activeTab === 'pricing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="text-slate-400 font-bold block mb-1">MSRP / Regular Price ($)</label>
                  <input
                    type="number"
                    value={regularPrice}
                    onChange={(e) => setRegularPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 text-white p-2 rounded-lg font-mono font-bold border border-slate-800"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="text-emerald-400 font-bold block mb-1">Commerce Zon Sale Price ($)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 text-emerald-300 p-2 rounded-lg font-mono font-bold border border-slate-800"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="text-slate-400 font-bold block mb-1">Merchant Cost Price ($)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 text-white p-2 rounded-lg font-mono border border-slate-800"
                  />
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="text-amber-400 font-bold block mb-1">Wholesale Tier ($)</label>
                  <input
                    type="number"
                    value={wholesalePrice}
                    onChange={(e) => setWholesalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 text-amber-300 p-2 rounded-lg font-mono border border-slate-800"
                  />
                </div>
              </div>

              {/* Bulk Pricing Tier */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="font-bold text-white">B2B Bulk Discount Schedule</div>
                <div className="flex items-center space-x-3">
                  <div>
                    <label className="text-slate-400 text-[11px] block">Min Quantity</label>
                    <input
                      type="number"
                      value={bulkQty}
                      onChange={(e) => setBulkQty(parseInt(e.target.value) || 1)}
                      className="bg-slate-900 text-white p-2 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[11px] block">Discounted Unit Price ($)</label>
                    <input
                      type="number"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(parseFloat(e.target.value) || 0)}
                      className="bg-slate-900 text-white p-2 rounded-lg border border-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INVENTORY & VARIANTS */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Total Live Units in Stock</label>
                  <input
                    type="number"
                    value={totalStock}
                    onChange={(e) => setTotalStock(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Low Stock Alert Threshold</label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={(e) => setReorderLevel(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Fulfillment Batch #</label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SEO & SCHEMA */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Meta SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Meta SEO Description</label>
                <textarea
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              {/* JSON-LD Structured Data Preview */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                  <Code2 className="w-4 h-4" />
                  <span>Google / Schema.org JSON-LD Structured Data Preview</span>
                </div>
                <pre className="bg-slate-900 p-3 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto">
                  {JSON.stringify(jsonLdSchema, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Status: <span className="text-emerald-400 font-bold">READY TO SAVE</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveListing}
              className="px-6 py-2.5 bg-gradient-to-r from-[#febd69] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
