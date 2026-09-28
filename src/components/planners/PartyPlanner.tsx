import React, { useState } from 'react';
import { PartyPopper, Sparkles, ArrowLeft, Users, AlertCircle, Loader2 } from 'lucide-react';
import { PartyPlannerInput, PlanResult } from '../../types';
import { formatINR } from '../../utils/formatters';

interface PartyPlannerProps {
  onBack: () => void;
  onPlanGenerated: (plan: PlanResult) => void;
}

export const PartyPlanner: React.FC<PartyPlannerProps> = ({ onBack, onPlanGenerated }) => {
  const [totalBudget, setTotalBudget] = useState<number>(30000);
  const [partyType, setPartyType] = useState<string>('Birthday');
  const [numberOfGuests, setNumberOfGuests] = useState<number>(20);
  const [location, setLocation] = useState<string>('Rooftop');
  const [foodPreference, setFoodPreference] = useState<string>('Multi-cuisine');
  const [decorationPreference, setDecorationPreference] = useState<string>('Thematic');
  const [entertainmentPreference, setEntertainmentPreference] = useState<string>('DJ & Music');
  const [date, setDate] = useState<string>(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const budgetPresets = [10000, 25000, 30000, 50000, 100000];

  const partyTypes = [
    'Birthday',
    'College Event',
    'Anniversary',
    'Family Function',
    'Celebration',
    'Other',
  ];

  const locationOptions = ['Home', 'Outdoor/Park', 'Banquet Hall', 'Rooftop', 'Cafe/Lounge'];
  const foodOptions = ['Veg', 'Non-Veg', 'Multi-cuisine', 'Snacks & Finger Food'];
  const decorationOptions = ['Minimal', 'Thematic', 'Balloon Arch & Lights', 'Luxury Floral'];
  const entertainmentOptions = ['DJ & Music', 'Games & MC', 'Live Acoustic', 'Playlist / Casual'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!totalBudget || totalBudget < 3000) {
      setError('Please enter a budget of at least ₹3,000 for realistic party planning.');
      return;
    }

    setIsLoading(true);

    try {
      const payload: PartyPlannerInput & { planType: string } = {
        planType: 'party',
        totalBudget,
        partyType,
        numberOfGuests,
        location,
        foodPreference,
        decorationPreference,
        entertainmentPreference,
        date,
        additionalRequirements,
      };

      const res = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate party plan.');
      }

      onPlanGenerated(data.plan);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while generating your plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Back bar */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <PartyPopper className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-violet-700 uppercase tracking-wider">
              Category 02
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Party Budget Planner
            </h1>
          </div>
        </div>
        <p className="text-slate-600 text-sm max-w-2xl">
          Create a complete party plan without exceeding your budget. PocketSmart AI allocates catering, venue, decorations, entertainment, and safety reserves within your limit.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Planner Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Total Budget Input with Presets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900">
              Total Budget (₹) <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-orange-600 font-semibold">
              Ceiling: {formatINR(totalBudget)}
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-3 text-slate-400 font-bold text-base">₹</span>
            <input
              type="number"
              min="3000"
              step="500"
              required
              value={totalBudget || ''}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full pl-9 pr-4 py-3 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 tabular-nums"
              placeholder="30000"
            />
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
            {budgetPresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTotalBudget(preset)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                  totalBudget === preset
                    ? 'bg-violet-50 text-violet-800 border-violet-300 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {formatINR(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Party Type & Number of Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Party Type
            </label>
            <select
              value={partyType}
              onChange={(e) => setPartyType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {partyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Estimated Guests
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="number"
                min="2"
                max="500"
                value={numberOfGuests}
                onChange={(e) => setNumberOfGuests(Math.max(2, Number(e.target.value)))}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 tabular-nums"
              />
            </div>
            <div className="flex gap-2 mt-1.5 text-xs text-slate-500">
              {[10, 20, 35, 50, 100].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setNumberOfGuests(count)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    numberOfGuests === count
                      ? 'bg-violet-100 text-violet-800 border-violet-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Location / Venue Type
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {locationOptions.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Target Event Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Food & Decoration Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Food Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {foodOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFoodPreference(opt)}
                  className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                    foodPreference === opt
                      ? 'bg-violet-50 border-violet-500 text-violet-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Decoration Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {decorationOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDecorationPreference(opt)}
                  className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                    decorationPreference === opt
                      ? 'bg-violet-50 border-violet-500 text-violet-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Entertainment Preference */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Entertainment Preference
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {entertainmentOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setEntertainmentPreference(opt)}
                className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                  entertainmentPreference === opt
                    ? 'bg-violet-50 border-violet-500 text-violet-800 font-bold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Additional Requirements */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Requirements / Special Notes
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Include 1.5kg customized chocolate truffle cake, need photo booth backdrop with fairy lights, keep budget for ice & disposables..."
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-violet-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                <span>PocketSmart AI is creating your smart plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Generate Party Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
