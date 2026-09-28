import React from 'react';
import { X, Sparkles, Home, PartyPopper, Gem, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlanner: (type: string) => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenPlanner }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>Smart Recommendation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              About PocketSmart AI
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              PocketSmart AI is a smart budgeting and recommendation platform designed to help users make better spending decisions based on their available budget and personal requirements.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2 text-xs text-blue-900">
            <div className="font-semibold flex items-center gap-1.5 text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>The PocketSmart Promise: Zero Overspending</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Whenever you generate a plan, our intelligence checks total item costs against your specified budget limit. If the initial estimates exceed your budget, the engine automatically rebalances quantities and categories so the final plan always stays within your limit.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Three Specialized Planners
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div
                onClick={() => {
                  onClose();
                  onOpenPlanner('home-planner');
                }}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                  <Home className="w-3.5 h-3.5" />
                  <span>Home Planning</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Living rooms, dining, furniture, lighting, and fans allocated with style.
                </p>
              </div>

              <div
                onClick={() => {
                  onClose();
                  onOpenPlanner('party-planner');
                }}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-violet-300 hover:bg-violet-50/30 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-1.5 text-violet-700 font-bold text-xs">
                  <PartyPopper className="w-3.5 h-3.5" />
                  <span>Party Planning</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Birthdays & events with food, cake, venue, and balloon decor.
                </p>
              </div>

              <div
                onClick={() => {
                  onClose();
                  onOpenPlanner('jewelry-planner');
                }}
                className="p-3.5 rounded-2xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer space-y-1"
              >
                <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                  <Gem className="w-3.5 h-3.5" />
                  <span>Jewelry Planning</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Hallmarked gold & silver sets with making charges and care boxes.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-blue-600 transition-colors"
            >
              Got it, close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
