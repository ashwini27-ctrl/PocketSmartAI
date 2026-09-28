import React, { useState } from 'react';
import { PlanResult } from '../types';
import { formatINR, formatDate, getCategoryTheme } from '../utils/formatters';
import {
  Wallet,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Share2,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  ShoppingBag,
  Info,
  Coins,
  BookmarkCheck,
  PlusCircle,
  Copy
} from 'lucide-react';

interface PlanResultViewProps {
  plan: PlanResult;
  onBack: () => void;
  onNewPlan: (type?: string) => void;
}

export const PlanResultView: React.FC<PlanResultViewProps> = ({ plan, onBack, onNewPlan }) => {
  const [copied, setCopied] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>('Saved to your account');

  const theme = getCategoryTheme(plan.planType);
  const percentageUsed = Math.min(100, Math.round((plan.budgetUsed / plan.totalBudget) * 100));
  const percentageRemaining = Math.max(0, 100 - percentageUsed);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:py-0 print:px-0">
      {/* Top Back & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Plans / Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Link Copied!' : 'Share Plan'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={() => onNewPlan(plan.planType)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Plan Another</span>
          </button>
        </div>
      </div>

      {/* PLAN TITLE & HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${theme.badgeBg} ${theme.badgeText}`}>
              {theme.name}
            </span>
            <span className="text-xs text-slate-400">· Created {formatDate(plan.createdAt)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
            <BookmarkCheck className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            {plan.title}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed max-w-3xl">
            {plan.summary}
          </p>
        </div>

        {/* 11. BUDGET OVERVIEW */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Budget Overview
            </h3>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-slate-600">Used ({percentageUsed}%)</span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 ml-2" />
              <span className="text-orange-600 font-medium">Remaining Buffer ({percentageRemaining}%)</span>
            </div>
          </div>

          {/* 3 Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Budget</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display tabular-nums mt-1">
                {formatINR(plan.totalBudget)}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Entered hard ceiling</p>
            </div>

            <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200/80">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Budget Used</span>
              <div className="text-xl sm:text-2xl font-extrabold text-blue-700 font-display tabular-nums mt-1">
                {formatINR(plan.budgetUsed)}
              </div>
              <p className="text-[11px] text-blue-600/80 mt-0.5">Across {plan.budgetBreakdown.reduce((acc, c) => acc + c.items.length, 0)} items</p>
            </div>

            <div className="bg-orange-50/70 rounded-2xl p-4 border border-orange-200/80">
              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Remaining Buffer</span>
              <div className="text-xl sm:text-2xl font-extrabold text-orange-600 font-display tabular-nums mt-1">
                {formatINR(plan.budgetRemaining)}
              </div>
              <p className="text-[11px] text-orange-600/80 mt-0.5">Emergency cushion unspent</p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex p-0.5 gap-0.5">
              <div
                className="bg-blue-600 h-full rounded-xs transition-all duration-500"
                style={{ width: `${percentageUsed}%` }}
              />
              <div
                className="bg-orange-400 h-full rounded-xs transition-all duration-500"
                style={{ width: `${percentageRemaining}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>0%</span>
              <span>Spent: {percentageUsed}%</span>
              <span>100% Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* 12. BUDGET BREAKDOWN (TABLE & CARDS) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
            Category-wise Budget Allocation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Exact mathematical distribution across core subcategories.
          </p>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                <th className="py-3 px-4 rounded-l-xl">Category</th>
                <th className="py-3 px-4 text-right">Allocated Budget</th>
                <th className="py-3 px-4 text-right">Percentage</th>
                <th className="py-3 px-4 text-center rounded-r-xl">Item Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {plan.budgetBreakdown.map((cat, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {cat.category}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 tabular-nums">
                    {formatINR(cat.allocatedBudget)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 font-medium tabular-nums">
                    {cat.percentageOfBudget}%
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-500 text-xs">
                    {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 13. RECOMMENDED ITEMS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-display">
            Recommended Items & Live Shopping Links
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Every item fits within its category allocation. Click any marketplace link to purchase or check availability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {plan.budgetBreakdown.flatMap((cat) =>
            cat.items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Qty: <strong className="text-slate-700">{item.quantity}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {item.name}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-extrabold text-blue-600 font-display tabular-nums">
                      {formatINR(item.estimatedPrice)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-xs text-slate-400">
                        ({formatINR(item.totalPrice)} total)
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-700">Reason: </span>
                    "{item.reason}"
                  </p>
                </div>

                {/* 3 Dynamic Marketplace Search Links */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Find on Stores:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={item.shoppingLinks.google}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Google</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>

                    <a
                      href={item.shoppingLinks.amazon}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg text-center text-xs font-semibold text-amber-900 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Amazon</span>
                      <ExternalLink className="w-3 h-3 text-amber-600" />
                    </a>

                    <a
                      href={item.shoppingLinks.flipkart}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-center text-xs font-semibold text-blue-900 flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Flipkart</span>
                      <ExternalLink className="w-3 h-3 text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 14. AI TIPS */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-900">
          <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center">
            <Lightbulb className="w-4 h-4 text-amber-900" />
          </div>
          <h2 className="text-base sm:text-lg font-bold font-display">
            Smart Tips & Money-Saving Guidance
          </h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-amber-950">
          {plan.tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 bg-white/70 p-3 rounded-xl border border-amber-100">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 15. DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 text-xs flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Disclaimer:</strong> Prices and recommendations are estimates and may change based on availability, location, seller, and market conditions. Verify final prices before purchasing.
        </p>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 print:hidden">
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
        >
          ← Return to Dashboard
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNewPlan(plan.planType)}
            className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            Create Another Plan
          </button>
        </div>
      </div>
    </div>
  );
};
