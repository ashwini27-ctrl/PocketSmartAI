import React, { useState } from 'react';
import {
  Wallet,
  Sparkles,
  ArrowRight,
  Home,
  PartyPopper,
  Gem,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  History,
  TrendingDown,
  ShieldCheck,
  Search,
  ShoppingCart,
  Zap,
  Mail,
  Send,
  ExternalLink
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  // Interactive live budget preview state on landing page
  const [demoBudget, setDemoBudget] = useState(50000);
  const [demoCategory, setDemoCategory] = useState<'home' | 'party' | 'jewelry'>('home');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<string | null>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  // Dynamic calculation for demo widget
  const getDemoBreakdown = () => {
    if (demoCategory === 'home') {
      return [
        { name: 'Furniture & Seating', pct: 35, amount: demoBudget * 0.35, color: 'bg-blue-600' },
        { name: 'Decor & Essentials', pct: 20, amount: demoBudget * 0.20, color: 'bg-emerald-500' },
        { name: 'Dining & Storage', pct: 18, amount: demoBudget * 0.18, color: 'bg-amber-500' },
        { name: 'Ambient Lighting', pct: 15, amount: demoBudget * 0.15, color: 'bg-violet-500' },
        { name: 'BLDC Fans & Climate', pct: 12, amount: demoBudget * 0.12, color: 'bg-sky-500' },
      ];
    } else if (demoCategory === 'party') {
      return [
        { name: 'Food, Drinks & Cake', pct: 35, amount: demoBudget * 0.35, color: 'bg-violet-600' },
        { name: 'Venue & Seating Area', pct: 25, amount: demoBudget * 0.25, color: 'bg-blue-500' },
        { name: 'Photo Decor & Arch', pct: 15, amount: demoBudget * 0.15, color: 'bg-pink-500' },
        { name: 'Sound & Entertainment', pct: 15, amount: demoBudget * 0.15, color: 'bg-amber-500' },
        { name: 'Contingency Buffer', pct: 10, amount: demoBudget * 0.10, color: 'bg-emerald-500' },
      ];
    } else {
      return [
        { name: '22KT Main Statement Piece', pct: 55, amount: demoBudget * 0.55, color: 'bg-amber-600' },
        { name: 'Matching Earring / Accent', pct: 25, amount: demoBudget * 0.25, color: 'bg-yellow-500' },
        { name: 'Velvet Box & Care Kit', pct: 10, amount: demoBudget * 0.10, color: 'bg-emerald-500' },
        { name: 'GST & Making Reserve', pct: 10, amount: demoBudget * 0.10, color: 'bg-orange-500' },
      ];
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setContactSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
        }),
      });
      const data = await res.json();
      setContactStatus(data.message || 'Thank you! Your message has been received.');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch {
      setContactStatus('Thank you for reaching out! We will contact you soon.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Next-Gen Smart Financial Planning</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display leading-[1.1]">
                  PocketSmart <span className="text-blue-600">AI</span>
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-slate-700 font-display">
                  Your Smart Budget & Recommendation Assistant
                </p>
              </div>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Set your budget, tell us what you need, and get smart recommendations that fit your spending limit.
                <span className="block mt-1 font-medium text-slate-800">
                  Plan smarter. Spend better. Choose confidently.
                </span>
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-5 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-xl border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer text-sm"
                >
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>Try Demo Plans</span>
                </button>
              </div>

              {/* Key Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200 max-w-lg">
                <div>
                  <div className="text-lg font-bold text-slate-900 font-display tabular-nums">100%</div>
                  <div className="text-xs text-slate-500">Budget Adherence</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 font-display tabular-nums">3 Core</div>
                  <div className="text-xs text-slate-500">Smart Planners</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900 font-display tabular-nums">Live</div>
                  <div className="text-xs text-slate-500">Shopping Links</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Mock Illustration */}
            <div className="lg:col-span-5">
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-6 space-y-4">
                {/* Header of widget */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <Wallet className="w-4 h-4 text-orange-300" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Simulator</h4>
                      <p className="text-[11px] text-slate-400">See AI allocation in action</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                    {(['home', 'party', 'jewelry'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setDemoCategory(cat)}
                        className={`px-2 py-1 rounded-md capitalize font-medium transition-all ${
                          demoCategory === cat
                            ? 'bg-white text-blue-700 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-600">Sample Target Budget:</span>
                    <span className="text-base font-bold text-blue-600 font-display tabular-nums">
                      {formatINR(demoBudget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="200000"
                    step="5000"
                    value={demoBudget}
                    onChange={(e) => setDemoBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>₹15,000</span>
                    <span>₹1,00,000</span>
                    <span>₹2,00,000</span>
                  </div>
                </div>

                {/* Dynamic Category Allocation Meter */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                    <span>PocketSmart AI Allocation</span>
                    <span className="text-[11px] text-emerald-600 font-medium">Under Budget Ceiling</span>
                  </div>

                  {/* Multi-colored progress bar */}
                  <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5">
                    {getDemoBreakdown().map((item, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${item.pct}%` }}
                        className={`${item.color} rounded-xs transition-all duration-300`}
                        title={`${item.name}: ${item.pct}%`}
                      />
                    ))}
                  </div>

                  {/* Mini Allocation List */}
                  <div className="space-y-1.5 pt-2">
                    {getDemoBreakdown().map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                          <span className="text-slate-700 font-medium truncate max-w-[140px] sm:max-w-[180px]">
                            {item.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-slate-900 tabular-nums">
                            {formatINR(item.amount)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1.5 font-normal">
                            ({item.pct}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA to start real plan */}
                <button
                  onClick={() => onNavigate(`${demoCategory}-planner`)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Build Full {demoCategory.toUpperCase()} Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Effortless 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
            How PocketSmart AI Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            No complicated spreadsheets or guesswork. Enter your limit and get an actionable, buyable plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                Enter Budget
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specify your exact spending cap in Indian Rupees (₹). Whether ₹10,000 or ₹5,00,000, we strictly enforce it.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
              Zero overspending guarantee
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                Tell Us What You Need
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your room, party type, or jewelry metal, plus style preferences, guest count, and must-have priorities.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
              Customized to your tastes
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                AI Creates Budget Plan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Gemini AI processes your inputs and allocates category percentages so essentials get funded first with buffer to spare.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
              Balanced smart ratios
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 font-display">
                Get Recommendations
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View recommended products, cost breakdowns, expert saving tips, and direct shopping links on Google, Amazon, and Flipkart.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
              Instant 1-click shopping
            </div>
          </div>
        </div>
      </section>

      {/* 3 CORE PLANNERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Tailored Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
            Three Specialized Planners
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Engineered with deep domain rules for home upgrades, social events, and precious jewelry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Home Planner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-300 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Home Budget Planner
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Plan your home purchases based on your available budget.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Living Room, Bedroom, Kitchen & Dining</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Furniture, Lighting, Fans & Home Decor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Modern, Minimalist & Traditional Styles</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('home-planner')}
              className="mt-6 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Home Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Party Planner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-violet-300 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PartyPopper className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Party Budget Planner
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Create a complete party plan without exceeding your budget.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />
                  <span>Birthdays, College Events & Anniversaries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />
                  <span>Food, Cake, Venue, Sound & Balloon Decor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500" />
                  <span>Emergency buffet cushion & disposables</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('party-planner')}
              className="mt-6 w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Party Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Jewelry Planner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:border-amber-300 hover:shadow-lg transition-all group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Gem className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Jewelry Budget Planner
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Find suitable jewelry combinations within your budget.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Necklaces, Earrings, Bangles & Sets</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gold, Silver & Platinum with Hallmark Safety</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>Making charge buffers & anti-tarnish care</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('jewelry-planner')}
              className="mt-6 w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Jewelry Planner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* FEATURE GRID (6 CORE CAPABILITIES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            Why PocketSmart AI
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
            Built for Smart, Stress-Free Spending
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">1. Smart Budget Planning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single recommendation respects your hard ceiling. Our algorithm guarantees total items will never exceed your entered budget.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">2. AI Recommendations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by Google Gemini 3.8 Flash, recommendations factor in style, guest counts, room dimensions, and seasonal trends.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">3. Multiple Planning Categories</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Versatile domain workflows for Home interiors, Party celebrations, and fine Jewelry with custom attributes for each.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">4. Budget Tracking</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time progress bars and category share percentages visually showcase exactly where every rupee is allocated.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">5. Recommendation History</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Plans are securely saved to your account. Re-visit previous plans, export summaries, and track revisions anytime.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 font-display">6. Personalized Suggestions & Links</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Direct live links to Google Shopping, Amazon India, and Flipkart so you can compare prices and purchase right away.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
              <span>About The Platform</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-display">
              About PocketSmart AI
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              PocketSmart AI is a smart budgeting and recommendation platform designed to help users make better spending decisions based on their available budget and personal requirements.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Whether furnishing an apartment on a strict budget, throwing a college or birthday bash without post-party regret, or curating gold and jewelry for a wedding, PocketSmart AI calculates optimal ratios and selects concrete items so you always stay in control.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <div className="text-emerald-400 font-bold text-sm">Home Planning</div>
                <p className="text-xs text-slate-400">Furniture, lighting, fans & space styling</p>
              </div>
              <div className="space-y-1">
                <div className="text-violet-400 font-bold text-sm">Party Planning</div>
                <p className="text-xs text-slate-400">Food, cake, venue, sound & decor</p>
              </div>
              <div className="space-y-1">
                <div className="text-amber-400 font-bold text-sm">Jewelry Planning</div>
                <p className="text-xs text-slate-400">Hallmarked gold, silver, sets & care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          <div className="text-center max-w-md mx-auto mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Get in Touch with Us
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Have feedback, questions, or ideas for new planner categories? Send our team a note!
            </p>
          </div>

          {contactStatus && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{contactStatus}</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Iyer"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="Ask a question, share feedback, or describe your project requirements..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={contactSubmitting}
              className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-medium text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
