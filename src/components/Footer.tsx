import React from 'react';
import { Wallet, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenContact: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenContact, onOpenAbout }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-20 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow">
                <Wallet className="w-5 h-5 text-orange-300" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                PocketSmart <span className="text-orange-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Your Smart Budget & Recommendation Assistant. Set your spending ceiling, state your priorities, and let AI allocate every rupee with discipline.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Strict Budget Ceiling Guarantee</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('home-planner')} className="hover:text-white transition-colors">
                  Home Budget Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('party-planner')} className="hover:text-white transition-colors">
                  Party Budget Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('jewelry-planner')} className="hover:text-white transition-colors">
                  Jewelry Budget Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Platform & Support */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">About & Help</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={onOpenAbout} className="hover:text-white transition-colors text-left">
                  About PocketSmart AI
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-white transition-colors text-left">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-white transition-colors text-left">
                  Saved Plan History
                </button>
              </li>
              <li>
                <span className="text-slate-400">Privacy & Terms</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer and copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 PocketSmart AI. All rights reserved.</p>
          <p className="text-center sm:text-right text-slate-400 max-w-md">
            Prices and recommendations are estimates and may change based on availability, seller, and market conditions. Verify final prices before purchasing.
          </p>
        </div>
      </div>
    </footer>
  );
};
