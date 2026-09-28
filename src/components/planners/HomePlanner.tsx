import React, { useState } from 'react';
import { Home, Sparkles, ArrowLeft, Check, Layers, AlertCircle, Loader2 } from 'lucide-react';
import { HomePlannerInput, PlanResult } from '../../types';
import { formatINR } from '../../utils/formatters';

interface HomePlannerProps {
  onBack: () => void;
  onPlanGenerated: (plan: PlanResult) => void;
}

export const HomePlanner: React.FC<HomePlannerProps> = ({ onBack, onPlanGenerated }) => {
  const [totalBudget, setTotalBudget] = useState<number>(50000);
  const [room, setRoom] = useState<string>('Living Room');
  const [homeType, setHomeType] = useState<string>('Apartment');
  const [requiredItems, setRequiredItems] = useState<string[]>(['Sofa', 'Lighting', 'Fans', 'Curtains']);
  const [stylePreference, setStylePreference] = useState<string>('Modern');
  const [priority, setPriority] = useState<string>('Balanced');
  const [additionalRequirements, setAdditionalRequirements] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const budgetPresets = [25000, 50000, 100000, 200000, 350000];

  const roomOptions = ['Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Full Home'];
  const homeTypeOptions = ['Apartment', 'Studio', 'Independent Villa', 'Rental Home', 'Duplex'];
  const styleOptions = ['Modern', 'Minimal', 'Traditional', 'Budget Friendly'];
  const priorityOptions = ['Essential', 'Balanced', 'Premium'];

  const availableItemChoices = [
    'Sofa',
    'Coffee Table',
    'Lighting',
    'Fans',
    'Curtains',
    'Area Rug',
    'Dining Table',
    'Bed & Mattress',
    'Wardrobe',
    'Wall Decor',
    'TV Unit',
    'Bookshelf',
  ];

  const toggleItem = (item: string) => {
    if (requiredItems.includes(item)) {
      setRequiredItems(requiredItems.filter((i) => i !== item));
    } else {
      setRequiredItems([...requiredItems, item]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!totalBudget || totalBudget < 5000) {
      setError('Please enter a budget of at least ₹5,000 for realistic planning.');
      return;
    }

    setIsLoading(true);

    try {
      const payload: HomePlannerInput & { planType: string } = {
        planType: 'home',
        totalBudget,
        room,
        homeType,
        requiredItems,
        stylePreference,
        priority,
        additionalRequirements,
      };

      const res = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate plan.');
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
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Category 01
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              Home Budget Planner
            </h1>
          </div>
        </div>
        <p className="text-slate-600 text-sm max-w-2xl">
          Plan your home purchases based on your available budget. PocketSmart AI will balance furniture, lighting, fans, and styling strictly within your entered amount.
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
              className="w-full pl-9 pr-4 py-3 text-base font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
              placeholder="50000"
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
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {formatINR(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Room / Area & Home Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Room / Area
            </label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {roomOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Home Type
            </label>
            <select
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {homeTypeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Style Preference & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Style Preference
            </label>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStylePreference(opt)}
                  className={`py-2 px-3 text-xs rounded-xl border text-center font-medium transition-all ${
                    stylePreference === opt
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
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
              Priority Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPriority(opt)}
                  className={`py-2 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                    priority === opt
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Required Items Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Required Items (Choose what you need)
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {availableItemChoices.map((item) => {
              const isSelected = requiredItems.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Requirements */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Additional Requirements / Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Prefer wooden warm tones, need compact foldable furniture for small 10x12 room, smart LED ambient lighting..."
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-slate-900 hover:bg-emerald-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                <span>PocketSmart AI is creating your smart plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Generate Home Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
