'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  HelpCircle,
  RotateCcw,
  AlertCircle,
  Globe,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { AdInput, Platform, Framework, Tone, CampaignObjective } from '@/types/ad';

interface CampaignFormProps {
  initialValues?: AdInput;
  isLoading: boolean;
  onGenerate: (data: AdInput) => void;
}

const TONES: Tone[] = ['Professional', 'Friendly', 'Persuasive', 'Urgent', 'Creative'];
const OBJECTIVES: CampaignObjective[] = ['Awareness', 'Traffic', 'Leads', 'Sales'];

export function CampaignForm({ initialValues, isLoading, onGenerate }: CampaignFormProps) {
  const [formData, setFormData] = useState<AdInput>({
    productName: '',
    productDescription: '',
    targetAudience: '',
    platform: 'google',
    framework: 'aida',
    tone: 'Persuasive',
    objective: 'Leads',
    variationCount: 3,
    offerKeywords: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // When initialValues changes (e.g. from preset loader), sync formData
  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
      setErrors({});
    }
  }, [initialValues]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product or service name is required.';
    } else if (formData.productName.length > 200) {
      newErrors.productName = 'Product name must be under 200 characters.';
    }

    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Product description or key features are required.';
    } else if (formData.productDescription.length < 15) {
      newErrors.productDescription = 'Please provide at least 15 characters describing key features.';
    }

    if (!formData.targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && !isLoading) {
      onGenerate(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      productDescription: '',
      targetAudience: '',
      platform: 'google',
      framework: 'aida',
      tone: 'Persuasive',
      objective: 'Leads',
      variationCount: 3,
      offerKeywords: '',
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">
              1
            </span>
            Campaign Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define your product and positioning strategy
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition py-1 px-2 rounded hover:bg-slate-800"
          title="Reset all fields"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Field 1: Product Name */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="productName" className="text-xs font-semibold text-slate-200">
            Product or Service Name <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-slate-500">{formData.productName.length}/200</span>
        </div>
        <input
          id="productName"
          type="text"
          value={formData.productName}
          onChange={(e) => {
            setFormData({ ...formData, productName: e.target.value });
            if (errors.productName) setErrors({ ...errors, productName: '' });
          }}
          placeholder="e.g. SwiftFlow, EcoBreeze Thermostat"
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border ${
            errors.productName ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
          } text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition`}
          maxLength={200}
        />
        {errors.productName && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.productName}
          </p>
        )}
      </div>

      {/* Field 2: Product Description */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="productDescription" className="text-xs font-semibold text-slate-200">
            Product Description / Key Features <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-slate-500">{formData.productDescription.length}/4000</span>
        </div>
        <textarea
          id="productDescription"
          rows={3}
          value={formData.productDescription}
          onChange={(e) => {
            setFormData({ ...formData, productDescription: e.target.value });
            if (errors.productDescription) setErrors({ ...errors, productDescription: '' });
          }}
          placeholder="Describe what the product does, key benefits, and why it is unique..."
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border ${
            errors.productDescription ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
          } text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none`}
          maxLength={4000}
        />
        {errors.productDescription && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.productDescription}
          </p>
        )}
      </div>

      {/* Field 3: Target Audience */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="targetAudience" className="text-xs font-semibold text-slate-200">
            Target Audience <span className="text-rose-400">*</span>
          </label>
          <span className="text-[11px] text-slate-500">{formData.targetAudience.length}/500</span>
        </div>
        <input
          id="targetAudience"
          type="text"
          value={formData.targetAudience}
          onChange={(e) => {
            setFormData({ ...formData, targetAudience: e.target.value });
            if (errors.targetAudience) setErrors({ ...errors, targetAudience: '' });
          }}
          placeholder="e.g. Remote engineering managers, eco-conscious homeowners"
          className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border ${
            errors.targetAudience ? 'border-rose-500/80 focus:ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
          } text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition`}
          maxLength={500}
        />
        {errors.targetAudience && (
          <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.targetAudience}
          </p>
        )}
      </div>

      {/* Field 4 & 5: Platform & Copywriting Framework */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Platform Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Target Platform
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, platform: 'google' })}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                formData.platform === 'google'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Globe className="w-4 h-4 text-sky-400" />
                {formData.platform === 'google' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div className="text-xs font-bold text-slate-100">Google Ads</div>
              <div className="text-[10px] text-slate-400">Search Headlines & Descriptions</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, platform: 'meta' })}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                formData.platform === 'meta'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Share2 className="w-4 h-4 text-indigo-400" />
                {formData.platform === 'meta' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div className="text-xs font-bold text-slate-100">Meta Ads</div>
              <div className="text-[10px] text-slate-400">FB & IG Feed Copy & CTA</div>
            </button>
          </div>
        </div>

        {/* Framework Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Copywriting Framework
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, framework: 'aida' })}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                formData.framework === 'aida'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-extrabold text-xs text-indigo-300">AIDA</span>
                {formData.framework === 'aida' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </div>
              <div className="text-[11px] font-medium text-slate-200">Attention • Interest</div>
              <div className="text-[10px] text-slate-400">Desire • Action</div>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, framework: 'pas' })}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                formData.framework === 'pas'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="font-extrabold text-xs text-emerald-300">PAS</span>
                {formData.framework === 'pas' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="text-[11px] font-medium text-slate-200">Problem • Agitate</div>
              <div className="text-[10px] text-slate-400">Solution</div>
            </button>
          </div>
        </div>
      </div>

      {/* Field 6 & 7: Tone and Objective */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tone Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Brand Tone
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, tone: t })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  formData.tone === t
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Objective */}
        <div>
          <label className="block text-xs font-semibold text-slate-200 mb-2">
            Campaign Objective
          </label>
          <div className="flex flex-wrap gap-1.5">
            {OBJECTIVES.map((obj) => (
              <button
                key={obj}
                type="button"
                onClick={() => setFormData({ ...formData, objective: obj })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  formData.objective === obj
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {obj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Field 8: Number of Variations (1-5) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-200">
            Number of Ad Variations
          </label>
          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            {formData.variationCount} {formData.variationCount === 1 ? 'Variation' : 'Variations'}
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setFormData({ ...formData, variationCount: num })}
              className={`py-2 rounded-xl text-xs font-bold transition ${
                formData.variationCount === num
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-400'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Field 9: Optional offer, CTA or keywords */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <label htmlFor="offerKeywords" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            Optional Offer, CTA, or Keywords
            <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
          </label>
        </div>
        <input
          id="offerKeywords"
          type="text"
          value={formData.offerKeywords}
          onChange={(e) => setFormData({ ...formData, offerKeywords: e.target.value })}
          placeholder="e.g. 20% off with promo code SAVE20, Free 14-day trial"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
          maxLength={300}
        />
        <p className="mt-1 text-[11px] text-slate-500">
          Include special discounts, promo deadlines, or primary keywords to weave into the copy.
        </p>
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition duration-200 ${
            isLoading
              ? 'bg-indigo-950 border border-indigo-800 text-indigo-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Generating {formData.variationCount} Variations...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Ad Variations</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
