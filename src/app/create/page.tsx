'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Layers,
  ChevronDown,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { CampaignForm } from '@/components/CampaignForm';
import { FrameworkModal } from '@/components/FrameworkModal';
import { useCampaign } from '@/context/CampaignContext';
import { AdInput, GenerateApiResponse } from '@/types/ad';
import { PRESET_CAMPAIGNS } from '@/data/presets';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { currentInput, setCurrentInput, loadPreset, setGenerationResult } = useCampaign();

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleGenerate = async (formData: AdInput) => {
    setIsLoading(true);
    setError(null);
    setCurrentInput(formData);
    setLoadingStep(1);

    // Dynamic step progression for user feedback
    const stepTimer1 = setTimeout(() => setLoadingStep(2), 2200);
    const stepTimer2 = setTimeout(() => setLoadingStep(3), 5000);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: GenerateApiResponse = await res.json();

      if (!res.ok || !data.success || !data.data) {
        setError({
          message: data.error || 'Failed to generate ad copy variations.',
          details: data.details || 'The model did not return a valid response. Please adjust your input or try again.',
        });
      } else {
        // Save result in context & sessionStorage
        setGenerationResult({
          variations: data.data.variations,
          framework: data.data.framework,
          platform: data.data.platform,
          modelUsed: data.data.modelUsed,
          generatedAt: data.data.generatedAt,
        });

        // Navigate to the results page
        router.push('/results');
      }
    } catch {
      setError({
        message: 'Network error or service unavailable.',
        details: 'Could not connect to the ad generation endpoint. Check your server connection and try again.',
      });
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Back to Home & Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition py-1 px-2.5 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <Link href="/" className="items-center gap-2 hidden sm:flex">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                AdNova
              </span>
            </Link>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Presets dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPresetsOpen(!isPresetsOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition shadow-sm"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Load Sample</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPresetsOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsPresetsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      1-Click Sample Campaigns
                    </div>
                    {PRESET_CAMPAIGNS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          loadPreset(preset.data);
                          setIsPresetsOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 flex items-center justify-between text-xs transition border-b border-slate-800/40 last:border-0"
                      >
                        <div>
                          <div className="font-medium text-slate-100">{preset.name}</div>
                          <div className="text-[11px] text-slate-400">{preset.badge}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Framework Guide Button */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Framework Guide</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Form Container */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Page Title & Intro */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campaign Creation Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's create your next ad.
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Enter your product details below. Our AI will craft distinct ad copy variations backed by proven marketing psychology and pair them with visual creatives.
          </p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <div className="font-bold text-white">{error.message}</div>
              {error.details && <p className="text-rose-300 text-xs">{error.details}</p>}
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white text-xs underline font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Progress Overlay */}
        {isLoading && (
          <div className="p-8 rounded-2xl bg-slate-900 border border-indigo-500/30 text-center space-y-5 shadow-2xl animate-in fade-in duration-300">
            <div className="relative w-14 h-14 mx-auto">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin" />
              <Sparkles className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-white">
                Generating Ad Variations...
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applying copywriting psychology, validating character limits, and art-directing visual creatives.
              </p>
            </div>

            {/* Stepper Status Indicator */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs font-semibold pt-2 text-slate-400">
              <div className={`flex items-center gap-1.5 ${loadingStep >= 1 ? 'text-indigo-300' : 'opacity-40'}`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Analyzing Product</span>
              </div>
              <div className={`flex items-center gap-1.5 ${loadingStep >= 2 ? 'text-indigo-300' : 'opacity-40'}`}>
                <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>Framing Angles</span>
              </div>
              <div className={`flex items-center gap-1.5 ${loadingStep >= 3 ? 'text-cyan-300' : 'opacity-40'}`}>
                <CheckCircle2 className={`w-4 h-4 ${loadingStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}`} />
                <span>Art-Directing Visuals</span>
              </div>
            </div>
          </div>
        )}

        {/* Reused Campaign Form */}
        <div className={isLoading ? 'opacity-40 pointer-events-none transition-opacity' : ''}>
          <CampaignForm
            initialValues={currentInput}
            isLoading={isLoading}
            onGenerate={handleGenerate}
          />
        </div>
      </main>

      {/* Framework Guide Modal */}
      <FrameworkModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
