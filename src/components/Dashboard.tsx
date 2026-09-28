import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlanResult } from '../types';
import { formatINR, formatDate, getCategoryTheme } from '../utils/formatters';
import {
  Wallet,
  Home,
  PartyPopper,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  Eye,
  Plus,
  Coins,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
  onSelectPlan: (plan: PlanResult) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectPlan }) => {
  const { user, token } = useAuth();
  const [plans, setPlans] = useState<PlanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, [token]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/plans', { headers });
      const data = await res.json();
      if (data.plans) {
        setPlans(data.plans);
      }
    } catch (e) {
      console.error('Error fetching plans', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculations for summary cards
  const totalPlansCount = plans.length;
  const recentPlan = plans[0] || null;
  const totalBudgetPlanned = plans.reduce((acc, p) => acc + (p.totalBudget || 0), 0);
  const remainingBudget = recentPlan ? recentPlan.budgetRemaining : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>AI Budget Intelligence Active</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight">
            Welcome, {user?.name || 'Smart Planner'}!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-normal">
            Let's plan your spending smarter today.
          </p>
        </div>

        {/* Action quick shortcut in header */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('home-planner')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ New Home Plan</span>
          </button>
          <button
            onClick={() => onNavigate('party-planner')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <PartyPopper className="w-3.5 h-3.5 text-violet-400" />
            <span>+ New Party Plan</span>
          </button>
          <button
            onClick={() => onNavigate('jewelry-planner')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium backdrop-blur transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+ New Jewelry Plan</span>
          </button>
        </div>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Plans */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Plans</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1 tabular-nums">
              {totalPlansCount}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Saved spending roadmaps</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* Recent Plan */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Plan</p>
            <h3 className="text-base font-bold text-slate-900 font-display mt-1 truncate max-w-[150px]">
              {recentPlan ? recentPlan.title : 'None yet'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              {recentPlan ? formatDate(recentPlan.createdAt) : 'Create your first'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Budget Planned */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget Planned</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1 tabular-nums">
              {formatINR(totalBudgetPlanned)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Total across your plans</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Remaining Budget (Orange Accent for important budget info) */}
        <div className="bg-white rounded-2xl p-5 border border-orange-200 shadow-xs flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Remaining Buffer</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-orange-600 font-display mt-1 tabular-nums">
              {formatINR(remainingBudget)}
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Savings in recent plan</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MAIN PLANNER SECTION: What would you like to plan today? */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              What would you like to plan today?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a specialized planner tailored to your spending goals.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Home Planner Card */}
          <div
            onClick={() => onNavigate('home-planner')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-emerald-700 transition-colors">
                  Home Budget Planner
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Plan your home purchases based on your available budget.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100">Furniture</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Lighting</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Fans</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Decor</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>Generate Home Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Party Planner Card */}
          <div
            onClick={() => onNavigate('party-planner')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-violet-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-violet-700 transition-colors">
                  Party Budget Planner
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Create a complete party plan without exceeding your budget.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100">Food & Cake</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Venue</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Balloons</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Music</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-700">
              <span>Generate Party Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Jewelry Planner Card */}
          <div
            onClick={() => onNavigate('jewelry-planner')}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display group-hover:text-amber-700 transition-colors">
                  Jewelry Budget Planner
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Find suitable jewelry combinations within your budget.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100">Gold 22KT</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Necklaces</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Earrings</span>
                <span className="px-2 py-0.5 rounded bg-slate-100">Care Box</span>
              </div>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Generate Jewelry Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT PLANS FEED */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Recent Budget Plans
            </h3>
            <p className="text-xs text-slate-500">
              Browse previously generated recommendations or create new ones.
            </p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <span>View All History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading your plans...</div>
        ) : plans.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">No plans yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create your first smart budget plan and it will appear here.
            </p>
            <button
              onClick={() => onNavigate('home-planner')}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-medium shadow transition-colors"
            >
              Create a Plan
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {plans.slice(0, 5).map((plan) => {
              const theme = getCategoryTheme(plan.planType);
              const percentageUsed = Math.min(100, Math.round((plan.budgetUsed / plan.totalBudget) * 100));

              return (
                <div
                  key={plan.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${theme.badgeBg} ${theme.badgeText}`}>
                        {theme.name}
                      </span>
                      <span className="text-xs text-slate-400">· {formatDate(plan.createdAt)}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {plan.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>Budget: <strong className="text-slate-800 tabular-nums">{formatINR(plan.totalBudget)}</strong></span>
                      <span>Used: <strong className="text-slate-800 tabular-nums">{formatINR(plan.budgetUsed)}</strong></span>
                      <span>Left: <strong className="text-orange-600 tabular-nums">{formatINR(plan.budgetRemaining)}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Small progress meter */}
                    <div className="hidden md:block w-28 text-right">
                      <div className="text-[10px] text-slate-400 font-medium mb-1">{percentageUsed}% used</div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${percentageUsed}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectPlan(plan)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Plan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
