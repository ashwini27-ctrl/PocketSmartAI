import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlanResult } from '../types';
import { formatINR, formatDate, getCategoryTheme } from '../utils/formatters';
import {
  History,
  Search,
  Eye,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

interface HistoryPageProps {
  onSelectPlan: (plan: PlanResult) => void;
  onNavigate: (view: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectPlan, onNavigate }) => {
  const { token } = useAuth();
  const [plans, setPlans] = useState<PlanResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('/api/plans', { headers });
      const data = await res.json();
      if (data.plans) setPlans(data.plans);
    } catch (e) {
      console.error('Failed to load history', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this saved plan?')) return;
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(`/api/plans/${planId}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        setPlans(plans.filter((p) => p.id !== planId));
      }
    } catch (e) {
      console.error('Delete plan error', e);
    }
  };

  // Filtering
  const filteredPlans = plans.filter((plan) => {
    const matchesCategory = selectedCategory === 'all' || plan.planType === selectedCategory;
    const matchesQuery =
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              My Plan History
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm">
            All your AI-generated budget roadmaps and shopping allocations in one place.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home-planner')}
          className="px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>New Budget Plan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="inline-flex p-1 bg-slate-200/70 rounded-xl text-xs font-medium overflow-x-auto">
          {[
            { id: 'all', label: 'All Plans' },
            { id: 'home', label: 'Home Plans' },
            { id: 'party', label: 'Party Plans' },
            { id: 'jewelry', label: 'Jewelry Plans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title or style..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Plan list or Empty State */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading your saved plans...</div>
      ) : filteredPlans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">No plans yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Create your first smart budget plan and it will appear here.
            </p>
          </div>
          <button
            onClick={() => onNavigate('home-planner')}
            className="px-5 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Create a Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPlans.map((plan) => {
            const theme = getCategoryTheme(plan.planType);
            const percentageUsed = Math.min(100, Math.round((plan.budgetUsed / plan.totalBudget) * 100));

            return (
              <div
                key={plan.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${theme.badgeBg} ${theme.badgeText}`}>
                      {theme.name}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(plan.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-display line-clamp-1">
                    {plan.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {plan.summary}
                  </p>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <div className="text-[10px] text-slate-400 font-medium">Budget</div>
                      <div className="text-xs font-bold text-slate-800 tabular-nums">{formatINR(plan.totalBudget)}</div>
                    </div>
                    <div className="bg-blue-50/70 p-2 rounded-lg">
                      <div className="text-[10px] text-blue-600 font-medium">Spent</div>
                      <div className="text-xs font-bold text-blue-700 tabular-nums">{formatINR(plan.budgetUsed)}</div>
                    </div>
                    <div className="bg-orange-50/70 p-2 rounded-lg">
                      <div className="text-[10px] text-orange-600 font-medium">Left</div>
                      <div className="text-xs font-bold text-orange-600 tabular-nums">{formatINR(plan.budgetRemaining)}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {percentageUsed}% allocated
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(plan.id)}
                      title="Delete plan"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectPlan(plan)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Plan</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
