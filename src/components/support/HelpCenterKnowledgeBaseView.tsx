import React, { useState } from 'react';
import { KnowledgeArticle, HelpCenterCategory } from '../../types/support';
import { MOCK_KNOWLEDGE_ARTICLES } from '../../data/supportMockData';
import {
  Search,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Tag,
  ChevronRight,
  UserCheck,
  Send,
  MessageSquare,
  Sparkles,
  HelpCircle,
  FileText,
  ShieldCheck,
  Truck,
  CreditCard,
  RotateCcw,
  Store,
  Package,
} from 'lucide-react';

export const HelpCenterKnowledgeBaseView: React.FC = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>(MOCK_KNOWLEDGE_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<HelpCenterCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(MOCK_KNOWLEDGE_ARTICLES[0].articleId);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [votedArticles, setVotedArticles] = useState<Record<string, 'UP' | 'DOWN'>>({});

  const categoriesNav: { id: HelpCenterCategory | 'ALL'; label: string; icon: React.ElementType }[] = [
    { id: 'ALL', label: 'All Articles', icon: BookOpen },
    { id: 'BUYER_GUIDES', label: 'Buyer Guides', icon: FileText },
    { id: 'SELLER_GUIDES', label: 'Seller Guides', icon: Store },
    { id: 'RETURNS_REFUND_GUIDES', label: 'Returns & Refunds', icon: RotateCcw },
    { id: 'SHIPPING_GUIDES', label: 'Shipping & Delivery', icon: Truck },
    { id: 'PAYMENT_GUIDES', label: 'Payments & Escrow', icon: CreditCard },
    { id: 'FBA_GUIDES', label: 'FBA Logistics', icon: Package },
    { id: 'ACCOUNT_SECURITY_GUIDES', label: 'Account Security', icon: ShieldCheck },
  ];

  const filtered = articles.filter((a) => {
    const matchesCategory = selectedCategory === 'ALL' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const selectedArticle = articles.find((a) => a.articleId === activeArticleId) || articles[0];

  const handleVote = (articleId: string, vote: 'UP' | 'DOWN') => {
    if (votedArticles[articleId]) return;

    setArticles((prev) =>
      prev.map((a) => {
        if (a.articleId === articleId) {
          return {
            ...a,
            helpfulYes: vote === 'UP' ? a.helpfulYes + 1 : a.helpfulYes,
            helpfulNo: vote === 'DOWN' ? a.helpfulNo + 1 : a.helpfulNo,
          };
        }
        return a;
      })
    );
    setVotedArticles((prev) => ({ ...prev, [articleId]: vote }));
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;
    alert('Thank you! Your article feedback has been logged for our Documentation Quality team.');
    setFeedbackComment('');
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#1e293b] border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-[#febd69]" />
            <span>How can we help you today?</span>
          </h2>
          <p className="text-xs text-slate-400">
            Search our self-service Knowledge Base, Amazon buyer guides, merchant FBA policies, and payment security procedures.
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search help articles (e.g., 'Track order', 'Return RMA', 'FBA barcode')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#febd69] shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 scrollbar-thin">
          {categoriesNav.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#febd69] text-slate-950 shadow font-black'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-[#febd69]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Article Cards Sidebar List */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-[#febd69] uppercase tracking-wider">
              Articles ({filtered.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Self-Service Portal</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((art) => {
              const isSelected = activeArticleId === art.articleId;
              return (
                <div
                  key={art.articleId}
                  onClick={() => setActiveArticleId(art.articleId)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-[#febd69] ring-1 ring-[#febd69]/30 shadow-md'
                      : 'bg-slate-950 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-[10px] font-bold text-[#febd69]">{art.articleId}</span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{art.readTimeMinutes} min read</span>
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-2">{art.title}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{art.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Article Reading View */}
        {selectedArticle ? (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="px-2.5 py-0.5 bg-[#febd69]/20 text-[#febd69] rounded border border-[#febd69]/30 font-bold uppercase text-[10px]">
                  {selectedArticle.category.replace('_', ' ')}
                </span>
                <span className="font-mono text-[11px]">Updated {new Date(selectedArticle.lastUpdated).toLocaleDateString()}</span>
              </div>
              <h1 className="text-xl font-extrabold text-white">{selectedArticle.title}</h1>
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Author: {selectedArticle.author}</span>
                </span>
                <span className="flex items-center space-x-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedArticle.readTimeMinutes} min read</span>
                </span>
              </div>
            </div>

            {/* Markdown/Content Body Container */}
            <div className="prose prose-invert prose-xs max-w-none text-slate-300 space-y-4 leading-relaxed bg-slate-950 p-5 rounded-xl border border-slate-800 whitespace-pre-line font-sans">
              {selectedArticle.content}
            </div>

            {/* Article Tags */}
            <div className="flex items-center space-x-2 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <div className="flex flex-wrap gap-1.5">
                {selectedArticle.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded border border-slate-700">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Was this article helpful? Interactive Rating */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs">
                <span className="font-bold text-white block">Was this article helpful?</span>
                <span className="text-[10px] text-slate-400">
                  {selectedArticle.helpfulYes} buyers found this useful
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleVote(selectedArticle.articleId, 'UP')}
                  disabled={!!votedArticles[selectedArticle.articleId]}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    votedArticles[selectedArticle.articleId] === 'UP'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/50'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Yes ({selectedArticle.helpfulYes})</span>
                </button>

                <button
                  onClick={() => handleVote(selectedArticle.articleId, 'DOWN')}
                  disabled={!!votedArticles[selectedArticle.articleId]}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    votedArticles[selectedArticle.articleId] === 'DOWN'
                      ? 'bg-rose-500 text-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-rose-500/50'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>No ({selectedArticle.helpfulNo})</span>
                </button>
              </div>
            </div>

            {/* Article Feedback Submission */}
            <form onSubmit={handleFeedbackSubmit} className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Provide feedback to improve this documentation article:
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="What details were missing or unclear?"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#febd69]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-black text-xs rounded-xl flex items-center space-x-1 shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
            Select an article from the list to view instructions.
          </div>
        )}
      </div>
    </div>
  );
};
