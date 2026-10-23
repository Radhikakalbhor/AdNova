'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Star,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileText,
  Share2,
  Sliders,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useCampaign } from '@/context/CampaignContext';
import { VariationCard } from '@/components/VariationCard';
import { GenerateApiResponse, AdVariation } from '@/types/ad';

export default function ResultsPage() {
  const router = useRouter();
  const {
    currentInput,
    generationResult,
    setGenerationResult,
    favorites,
    toggleFavorite,
    clearAll,
  } = useCampaign();

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copyAllSuccess, setCopyAllSuccess] = useState(false);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If no generation result exists, show a friendly empty state
  if (!generationResult || generationResult.variations.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
        {/* Navigation Bar */}
        <nav className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                AdNova
              </span>
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow transition"
            >
              <span>Create Campaign</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>

        {/* Empty State Card */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
              <Layers className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">
                No Advertisements Found
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                You haven't generated any ads in this session yet, or your previous campaign has expired.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/create"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/20 transition active:scale-95"
              >
                <span>Create Your First Campaign</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { variations, framework, platform, modelUsed } = generationResult;

  // Filter variations if favorites only is active
  const displayedVariations = filterFavorites
    ? variations.filter((v) => favorites.includes(v.variationNumber))
    : variations;

  // Regenerate with the same input
  const handleRegenerate = async () => {
    if (!currentInput.productName || isRegenerating) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentInput),
      });

      const data: GenerateApiResponse = await res.json();

      if (!res.ok || !data.success || !data.data) {
        setError(data.error || 'Failed to regenerate variations.');
      } else {
        setGenerationResult({
          variations: data.data.variations,
          framework: data.data.framework,
          platform: data.data.platform,
          modelUsed: data.data.modelUsed,
          generatedAt: data.data.generatedAt,
        });
      }
    } catch {
      setError('Network connection error while regenerating.');
    } finally {
      setIsRegenerating(false);
    }
  };

  // Copy All Variations text
  const handleCopyAll = async () => {
    if (variations.length === 0) return;

    let allText = `====================================================\n`;
    allText += `AdNova Generated Campaign\n`;
    allText += `Product: ${currentInput.productName}\n`;
    allText += `Platform: ${platform === 'google' ? 'Google Ads' : 'Meta Ads'}\n`;
    allText += `Framework: ${framework.toUpperCase()}\n`;
    allText += `Total Variations: ${variations.length}\n`;
    allText += `====================================================\n\n`;

    variations.forEach((v) => {
      allText += `--- VARIATION #${v.variationNumber}: ${v.label || 'Creative'} ---\n`;
      if (platform === 'google' && v.googleFields) {
        allText += `Headline 1: ${v.googleFields.headline1}\n`;
        allText += `Headline 2: ${v.googleFields.headline2}\n`;
        if (v.googleFields.headline3) allText += `Headline 3: ${v.googleFields.headline3}\n`;
        allText += `Description 1: ${v.googleFields.description1}\n`;
        if (v.googleFields.description2) allText += `Description 2: ${v.googleFields.description2}\n`;
      } else if (platform === 'meta' && v.metaFields) {
        allText += `Primary Text: ${v.metaFields.primaryText}\n`;
        allText += `Headline: ${v.metaFields.headline}\n`;
        if (v.metaFields.description) allText += `Description: ${v.metaFields.description}\n`;
        allText += `Call To Action: ${v.metaFields.callToAction}\n`;
      } else {
        allText += `Headline: ${v.headline}\n`;
        allText += `Primary Copy: ${v.primaryCopy}\n`;
        allText += `CTA: ${v.callToAction}\n`;
      }

      if (v.visualCreative) {
        allText += `Visual Prompt: ${v.visualCreative.imagePrompt}\n`;
      }

      const fb: any = v.frameworkBreakdown || {};
      allText += `Framework Breakdown (${framework.toUpperCase()}):\n`;
      if (framework === 'aida') {
        allText += `  • Attention: ${fb.attention || ''}\n`;
        allText += `  • Interest: ${fb.interest || ''}\n`;
        allText += `  • Desire: ${fb.desire || ''}\n`;
        allText += `  • Action: ${fb.action || ''}\n`;
      } else {
        allText += `  • Problem: ${fb.problem || ''}\n`;
        allText += `  • Agitate: ${fb.agitate || ''}\n`;
        allText += `  • Solution: ${fb.solution || ''}\n`;
      }
      allText += `\n`;
    });

    try {
      await navigator.clipboard.writeText(allText);
      setCopyAllSuccess(true);
      setTimeout(() => setCopyAllSuccess(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = allText;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopyAllSuccess(true);
      setTimeout(() => setCopyAllSuccess(false), 2500);
    }
  };

  const handleCreateNew = () => {
    clearAll();
    router.push('/create');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Back to Campaign Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition py-1.5 px-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Campaign</span>
            </Link>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <Link href="/" className="items-center gap-2 hidden sm:flex">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                AdNova
              </span>
            </Link>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Campaign</span>
            </button>

            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow transition"
            >
              <span>Edit Form</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Results Gallery Container */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Campaign Header Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {platform === 'google' ? 'Google Ads' : 'Meta Social Feed'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {framework.toUpperCase()} Framework
                </span>
                {modelUsed && (
                  <span className="hidden lg:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800">
                    {modelUsed}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentInput.productName || 'Generated Campaign'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 line-clamp-1 max-w-2xl">
                {currentInput.productDescription}
              </p>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Copy All Text */}
              <button
                type="button"
                onClick={handleCopyAll}
                className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  copyAllSuccess
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {copyAllSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied All Copy!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy All Text</span>
                  </>
                )}
              </button>

              {/* Regenerate Button */}
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow transition active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>

          {/* Variation Count & Comparison Filter Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-300 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Generated exactly <strong>{variations.length}</strong> {variations.length === 1 ? 'variation' : 'variations'}.
              </span>
            </div>

            {/* Filter by Favorites */}
            {favorites.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterFavorites(!filterFavorites)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    filterFavorites
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-stone-950' : 'text-amber-400'}`} />
                  <span>
                    {filterFavorites
                      ? `Showing ${favorites.length} Favorites`
                      : `Filter Favorites (${favorites.length})`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error message if regenerate failed */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
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

        {/* Variation Cards Gallery */}
        <div className="space-y-8">
          {displayedVariations.map((variation, idx) => {
            const isFav = favorites.includes(variation.variationNumber);

            return (
              <div key={`adnova-result-${idx + 1}-${variation.variationNumber || idx + 1}`} className="relative group">
                {/* Comparison Favorite Star Tool */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2 no-print">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(variation.variationNumber)}
                    className={`p-2 rounded-xl backdrop-blur-md transition shadow-lg border ${
                      isFav
                        ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-amber-400/20'
                        : 'bg-slate-900/80 text-slate-400 hover:text-amber-300 border-slate-800'
                    }`}
                    title={isFav ? 'Remove from favorites' : 'Mark as favorite for comparison'}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-stone-950' : ''}`} />
                  </button>
                </div>

                {/* Render the full VariationCard with all visual posters and copy features */}
                <VariationCard
                  variation={{
                    ...variation,
                    variationNumber: idx + 1,
                  }}
                  platform={platform}
                  framework={framework}
                  productName={currentInput.productName}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation & Microproject Disclaimer */}
        <div className="pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80 text-xs text-slate-400">
          <Link
            href="/create"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Campaign Parameters</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCreateNew}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold transition"
            >
              Create Brand New Campaign
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
