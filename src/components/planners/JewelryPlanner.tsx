import React, { useState } from 'react';
import { Gem, Sparkles, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { JewelryPlannerInput, PlanResult } from '../../types';
import { formatINR } from '../../utils/formatters';

interface JewelryPlannerProps {
  onBack: () => void;
  onPlanGenerated: (plan: PlanResult) => void;
}

export const JewelryPlanner: React.FC<JewelryPlannerProps> = ({ onBack, onPlanGenerated }) => {
  const [totalBudget, setTotalBudget] = useState<number>(100000);
  const [jewelryType, setJewelryType] = useState<string>('Set');
  const [occasion, setOccasion] = useState<string>('Wedding');
  const [preferredMetal, setPreferredMetal] = useState<string>('Gold');
  const [style, setStyle] = useState<string>('Traditional');
  const [mainPiece, setMainPiece] = useState<string>('22KT Choker Necklace');
  const [matchingRequirements, setMatchingRequirements] = useState<string>('Matching Chandbali Earrings & Ring');
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const budgetPresets = [30000, 50000, 100000, 200000, 500000];

  const jewelryTypes = ['Set', 'Necklace', 'Earrings', 'Bracelet / Bangles', 'Ring'];
  const occasions = ['Wedding', 'Festival / Diwali', 'Daily Wear', 'Gift', 'Anniversary'];
  const metals = ['Gold', 'Silver', 'Platinum', 'Other'];
  const styles = ['Traditional', 'Modern', 'Minimal', 'Elegant'];

  const mainPieceSuggestions = [
    '22KT Choker Necklace',
    'Solitaire Diamond Look Pendant',
    'Temple Craft Haar',
    'Contemporary Geometric Collar',
    'Layered Chain with Gemstone Drop',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!totalBudget || totalBudget < 5000) {
      setError('Please enter a budget of at least ₹5,000 for realistic jewelry planning.');
      return;
    }

    setIsLoading(true);

    try {
      const payload: JewelryPlannerInput & { planType: string } = {
        planType: 'jewelry',
        totalBudget,
        jewelryType,
        occasion,
        preferredMetal,
        style,
        mainPiece,
        matchingRequirements,
        additionalRequirements,
      };

      const res = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate jewelry plan.');
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
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Gem className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              Category 03
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Jewelry Budget Planner
            </h1>
          </div>
        </div>
        <p className="text-slate-600 text-sm max-w-2xl">
          Find suitable jewelry combinations within your budget. PocketSmart AI balances precious metals, hallmarking certifications, making charge buffers, and protective velvet care boxes.
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
              min="5000"
              step="1000"
              required
              value={totalBudget || ''}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full pl-9 pr-4 py-3 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 tabular-nums"
              placeholder="100000"
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
                    ? 'bg-amber-50 text-amber-800 border-amber-300 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {formatINR(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Jewelry Type & Occasion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Jewelry Type
            </label>
            <select
              value={jewelryType}
              onChange={(e) => setJewelryType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {jewelryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Occasion
            </label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {occasions.map((occ) => (
                <option key={occ} value={occ}>
                  {occ}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preferred Metal & Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Preferred Metal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {metals.map((metal) => (
                <button
                  key={metal}
                  type="button"
                  onClick={() => setPreferredMetal(metal)}
                  className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                    preferredMetal === metal
                      ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Design Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {styles.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStyle(st)}
                  className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                    style === st
                      ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Piece Selection / Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Main Focal Piece
          </label>
          <input
            type="text"
            required
            value={mainPiece}
            onChange={(e) => setMainPiece(e.target.value)}
            placeholder="e.g. 22KT Gold Choker Necklace, Solitaire Diamond Ring..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2"
          />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Suggestions:</span>
            {mainPieceSuggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => setMainPiece(sug)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Matching Requirements */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Matching Requirements
          </label>
          <input
            type="text"
            value={matchingRequirements}
            onChange={(e) => setMatchingRequirements(e.target.value)}
            placeholder="e.g. Matching Drop Earrings, Maang Tikka, Bangle Pair..."
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Additional Requirements */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Requirements / Hallmark Preferences
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Prefer 22KT BIS hallmarking with 916 stamp, want lightweight pearl accents, require anti-tarnish velvet travel box..."
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                <span>PocketSmart AI is creating your smart plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Generate Jewelry Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
