import React, { useState } from 'react';
import {
  MOCK_RETURN_REQUESTS,
  MOCK_RETURN_MESSAGES,
} from '../../data/returnsMockData';
import {
  ReturnRequest,
  ReturnStatus,
  InspectionCondition,
  RefundMethod,
  ReturnMessage,
} from '../../types/returns';

import { ReturnsDashboardOverview } from './ReturnsDashboardOverview';
import { ReturnEligibilityEngineView } from './ReturnEligibilityEngineView';
import { ReturnRequestPortalView } from './ReturnRequestPortalView';
import { ReturnWorkflowManagerView } from './ReturnWorkflowManagerView';
import { WarehouseInspectionView } from './WarehouseInspectionView';
import { RefundManagementView } from './RefundManagementView';
import { ExchangeManagementView } from './ExchangeManagementView';
import { ReturnShippingView } from './ReturnShippingView';
import { SellerReturnConsoleView } from './SellerReturnConsoleView';
import { CustomerMessagingView } from './CustomerMessagingView';
import { FraudDetectionView } from './FraudDetectionView';
import { ReturnPolicyAdminView } from './ReturnPolicyAdminView';
import { ReturnReportsView } from './ReturnReportsView';

import {
  RotateCcw,
  Calculator,
  Package,
  Clock,
  PackageCheck,
  DollarSign,
  RefreshCw,
  Truck,
  Store,
  MessageSquare,
  ShieldAlert,
  Sliders,
  FileText,
  Layers,
  Activity,
} from 'lucide-react';

type SubTab =
  | 'overview'
  | 'eligibility'
  | 'portal'
  | 'workflow'
  | 'inspection'
  | 'refunds'
  | 'exchanges'
  | 'shipping'
  | 'seller'
  | 'messaging'
  | 'fraud'
  | 'policy'
  | 'reports';

export const ReturnsMasterModule: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');

  // Master State
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>(MOCK_RETURN_REQUESTS);
  const [messages, setMessages] = useState<ReturnMessage[]>(MOCK_RETURN_MESSAGES);

  // Handlers
  const handleNewReturnSubmitted = (newReturn: ReturnRequest) => {
    setReturnRequests((prev) => [newReturn, ...prev]);
  };

  const handleUpdateStatus = (returnId: string, status: ReturnStatus) => {
    setReturnRequests((prev) =>
      prev.map((r) => (r.returnId === returnId ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );
  };

  const handleSaveInspection = (
    returnId: string,
    condition: InspectionCondition,
    result: any,
    notes: string,
    restockingFeeUSD: number
  ) => {
    setReturnRequests((prev) =>
      prev.map((r) => {
        if (r.returnId === returnId) {
          return {
            ...r,
            status: 'QUALITY_INSPECTED',
            updatedAt: new Date().toISOString(),
            inspection: {
              inspectorId: 'INSP-QA-4',
              inspectorName: 'Marcus Vance (QA Lead)',
              inspectionDate: new Date().toISOString(),
              productCondition: condition,
              packagingCondition: 'INTACT',
              missingAccessories: [],
              damagePhotosUrl: [],
              notes,
              inspectionResult: result,
              restockingFeeUSD,
            },
          };
        }
        return r;
      })
    );
  };

  const handleExecuteRefund = (returnId: string, amountUSD: number, method: RefundMethod) => {
    setReturnRequests((prev) =>
      prev.map((r) => {
        if (r.returnId === returnId) {
          return {
            ...r,
            status: 'REFUND_PROCESSED',
            refundAmountUSD: amountUSD,
            refundMethod: method,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  const handleDispatchExchange = (returnId: string, trackingNum: string) => {
    setReturnRequests((prev) =>
      prev.map((r) => {
        if (r.returnId === returnId) {
          return {
            ...r,
            status: 'EXCHANGE_DISPATCHED',
            replacementTrackingNumber: trackingNum,
            updatedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
  };

  const handleSendMessage = (returnId: string, text: string, role: 'BUYER' | 'SELLER' | 'ADMIN') => {
    const newMsg: ReturnMessage = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      returnId,
      senderRole: role,
      senderName: role === 'BUYER' ? 'David Miller' : role === 'SELLER' ? 'Merchant Support' : 'Marketplace Admin',
      message: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleApproveBySeller = (returnId: string) => {
    handleUpdateStatus(returnId, 'APPROVED');
  };

  const handleRejectBySeller = (returnId: string, reason: string) => {
    setReturnRequests((prev) =>
      prev.map((r) =>
        r.returnId === returnId
          ? {
              ...r,
              status: 'REJECTED',
              sellerNotes: reason,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const tabsNav: { id: SubTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'eligibility', label: 'Eligibility Engine', icon: Calculator },
    { id: 'portal', label: 'Buyer RMA Portal', icon: Package },
    { id: 'workflow', label: 'Workflow Manager', icon: Clock, count: returnRequests.length },
    { id: 'inspection', label: 'Warehouse QA', icon: PackageCheck },
    { id: 'refunds', label: 'Refund Engine', icon: DollarSign },
    { id: 'exchanges', label: 'Exchanges & Swaps', icon: RefreshCw },
    { id: 'shipping', label: 'Reverse Logistics', icon: Truck },
    { id: 'seller', label: 'Seller Console', icon: Store },
    { id: 'messaging', label: 'Messaging', icon: MessageSquare, count: messages.length },
    { id: 'fraud', label: 'AI Fraud Engine', icon: ShieldAlert, count: returnRequests.filter((r) => r.fraudDetails.fraudRiskScore >= 60).length },
    { id: 'policy', label: 'Policy Rules Admin', icon: Sliders },
    { id: 'reports', label: 'Audit Reports', icon: FileText },
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Master Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-[#131921] border border-slate-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <RotateCcw className="w-80 h-80 text-[#febd69]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-[#febd69] text-slate-950 font-black text-[10px] uppercase tracking-wider rounded">
                MODULE 14
              </span>
              <span className="text-xs text-[#febd69] font-mono font-bold uppercase tracking-wider flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5" />
                <span>Enterprise RMA & Returns Suite</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
              <span>Returns, Refunds & Exchange Management System</span>
            </h1>
            <p className="text-xs text-slate-400 max-w-3xl">
              End-to-end Commerce Zon reverse commerce engine: Automated return eligibility checks, buyer RMA portal, FC quality inspections, instant wallet refunds, variant exchanges, and AI abuse prevention.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Active RMA Claims</div>
              <div className="text-lg font-black text-[#febd69]">{returnRequests.length} Requests</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-right font-mono">
              <div className="text-[10px] text-slate-400 uppercase">Return CSAT</div>
              <div className="text-lg font-black text-emerald-400">4.82 / 5.0</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {tabsNav.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#febd69] text-slate-950 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-[#febd69]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                      isActive ? 'bg-slate-950 text-[#febd69]' : 'bg-[#febd69] text-slate-950'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Sub View Render */}
      <div className="transition-all duration-200">
        {activeSubTab === 'overview' && (
          <ReturnsDashboardOverview returnRequests={returnRequests} />
        )}

        {activeSubTab === 'eligibility' && <ReturnEligibilityEngineView />}

        {activeSubTab === 'portal' && (
          <ReturnRequestPortalView onRequestSubmitted={handleNewReturnSubmitted} />
        )}

        {activeSubTab === 'workflow' && (
          <ReturnWorkflowManagerView
            returnRequests={returnRequests}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeSubTab === 'inspection' && (
          <WarehouseInspectionView
            returnRequests={returnRequests}
            onSaveInspection={handleSaveInspection}
          />
        )}

        {activeSubTab === 'refunds' && (
          <RefundManagementView
            returnRequests={returnRequests}
            onExecuteRefund={handleExecuteRefund}
          />
        )}

        {activeSubTab === 'exchanges' && (
          <ExchangeManagementView
            returnRequests={returnRequests}
            onDispatchExchange={handleDispatchExchange}
          />
        )}

        {activeSubTab === 'shipping' && (
          <ReturnShippingView returnRequests={returnRequests} />
        )}

        {activeSubTab === 'seller' && (
          <SellerReturnConsoleView
            returnRequests={returnRequests}
            onApproveBySeller={handleApproveBySeller}
            onRejectBySeller={handleRejectBySeller}
          />
        )}

        {activeSubTab === 'messaging' && (
          <CustomerMessagingView
            messages={messages}
            returnRequests={returnRequests}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeSubTab === 'fraud' && <FraudDetectionView />}

        {activeSubTab === 'policy' && <ReturnPolicyAdminView />}

        {activeSubTab === 'reports' && (
          <ReturnReportsView returnRequests={returnRequests} />
        )}
      </div>
    </div>
  );
};
