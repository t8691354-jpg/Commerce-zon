import React, { useState } from 'react';
import { ProductReviewItem, ProductQuestionAnswer } from '../../types/domain';
import { MOCK_PRODUCT_REVIEWS, MOCK_PRODUCT_QA } from '../../data/catalogMockData';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  ThumbsUp,
  Flag,
  Reply,
  Plus,
  HelpCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const ProductReviewsQAView: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReviewItem[]>(MOCK_PRODUCT_REVIEWS);
  const [qaList, setQaList] = useState<ProductQuestionAnswer[]>(MOCK_PRODUCT_QA);

  const [activeTab, setActiveTab] = useState<'reviews' | 'qa'>('reviews');

  // New Question Form
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [newQuestionBuyer, setNewQuestionBuyer] = useState('');

  // Seller Reply
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const handleUpvoteReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
  };

  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    const newQa: ProductQuestionAnswer = {
      id: `qa-${Date.now()}`,
      productId: 'prod-01',
      buyerName: newQuestionBuyer.trim() || 'Verified Commerce Zon Buyer',
      question: newQuestionInput.trim(),
      upvotes: 0,
      answers: [],
      createdAt: new Date().toISOString(),
    };
    setQaList((prev) => [newQa, ...prev]);
    setNewQuestionInput('');
    setNewQuestionBuyer('');
  };

  const handleAddAnswer = (qaId: string) => {
    const text = replyTextMap[qaId];
    if (!text || !text.trim()) return;

    setQaList((prev) =>
      prev.map((q) => {
        if (q.id === qaId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: `ans-${Date.now()}`,
                responderName: 'Official Merchant Support',
                responderRole: 'SELLER',
                answer: text.trim(),
                upvotes: 0,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }
        return q;
      })
    );

    setReplyTextMap((prev) => ({ ...prev, [qaId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-[#febd69]" />
            <span>Product Reviews, Ratings & Customer Q&A Portal</span>
          </h2>
          <p className="text-xs text-slate-400">
            Verified Purchase Reviews, Photo/Video Attachments, Helpful Upvotes, and Merchant Answers
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'reviews'
                ? 'bg-[#febd69] text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Product Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'qa'
                ? 'bg-[#febd69] text-slate-950 font-black shadow'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            Questions & Answers ({qaList.length})
          </button>
        </div>
      </div>

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-xs">{rev.buyerName}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Purchase</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="font-bold text-white text-xs">{rev.title}</h4>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

              {/* Photo Media */}
              {rev.mediaUrls && rev.mediaUrls.length > 0 && (
                <div className="flex items-center space-x-2 pt-1">
                  {rev.mediaUrls.map((m, i) => (
                    <img
                      key={i}
                      src={m}
                      alt="Customer review upload"
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl border border-slate-800"
                    />
                  ))}
                </div>
              )}

              {/* Seller Reply */}
              {rev.sellerReply && (
                <div className="bg-slate-950 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-1 text-xs">
                  <div className="font-bold text-amber-400 flex items-center space-x-1">
                    <Reply className="w-3.5 h-3.5" />
                    <span>Merchant Response ({rev.sellerReply.merchantName}):</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{rev.sellerReply.comment}</p>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <button
                  onClick={() => handleUpvoteReview(rev.id)}
                  className="hover:text-amber-300 flex items-center space-x-1 font-bold transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulVotes})</span>
                </button>

                <button className="hover:text-rose-400 flex items-center space-x-1">
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report Abuse</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QA TAB */}
      {activeTab === 'qa' && (
        <div className="space-y-6">
          {/* Ask Question Form */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
            <h3 className="text-xs font-black text-white uppercase flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-[#febd69]" />
              <span>Ask a Product Question</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={newQuestionBuyer}
                onChange={(e) => setNewQuestionBuyer(e.target.value)}
                className="bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none"
              />
              <input
                type="text"
                placeholder="Ask about specs, compatibility, warranty..."
                value={newQuestionInput}
                onChange={(e) => setNewQuestionInput(e.target.value)}
                className="sm:col-span-2 bg-slate-950 text-white p-2.5 rounded-xl border border-slate-800 text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleAddQuestion}
              className="px-5 py-2 bg-[#febd69] hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition shadow flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Question</span>
            </button>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {qaList.map((qa) => (
              <div
                key={qa.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500">
                      Asked by {qa.buyerName}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">Q: {qa.question}</h4>
                  </div>

                  <span className="text-xs text-amber-400 font-bold font-mono">
                    ▲ {qa.upvotes} upvotes
                  </span>
                </div>

                {/* Answers */}
                <div className="space-y-2 border-t border-slate-800 pt-3">
                  {qa.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">{ans.responderName}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(ans.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-200">A: {ans.answer}</p>
                    </div>
                  ))}
                </div>

                {/* Answer Box for Merchant */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="Reply to this buyer question..."
                    value={replyTextMap[qa.id] || ''}
                    onChange={(e) =>
                      setReplyTextMap({ ...replyTextMap, [qa.id]: e.target.value })
                    }
                    className="flex-1 bg-slate-950 text-white p-2 rounded-xl border border-slate-800 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddAnswer(qa.id)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs transition"
                  >
                    Post Answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
