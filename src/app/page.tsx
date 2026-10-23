'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Layers,
  FileText,
  Image as ImageIcon,
  Download,
  Share2,
  Globe,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Coffee,
  Utensils,
  Dumbbell,
  Heart,
  Droplets,
} from 'lucide-react';
import { SAMPLE_ADS, SampleAdItem } from '@/data/sampleAds';
import { useCampaign } from '@/context/CampaignContext';

export default function LandingPage() {
  const router = useRouter();
  const { loadPreset } = useCampaign();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSamples =
    selectedCategory === 'all'
      ? SAMPLE_ADS
      : SAMPLE_ADS.filter((item) => item.category === selectedCategory);

  const handleTrySample = (sample: SampleAdItem) => {
    loadPreset(sample.presetInput);
    router.push('/create');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px]" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                AdNova
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                AI Studio
              </span>
            </div>
          </Link>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#examples" className="hover:text-white transition">
              Examples
            </a>
            <a href="#features" className="hover:text-white transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition active:scale-95"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
          {/* Subtle Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Generation Advertising Intelligence</span>
          </div>

          {/* Main Hero Headline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Ideas in.{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Incredible ads out.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Turn any product idea into eye-catching, campaign-ready advertisements with
              AI-powered copywriting and creative visuals.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm sm:text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-500/25 transition active:scale-95"
            >
              <span>Start Creating Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#examples"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm sm:text-base font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition"
            >
              <span>Explore Examples</span>
            </a>
          </div>

          {/* Value Badges Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Google & Meta Format Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>AIDA & PAS Copywriting Formulas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Printable A4 PDF & High-Res PNG Exports</span>
            </div>
          </div>
        </section>

        {/* Interactive Examples Gallery Section */}
        <section id="examples" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-4 border-b border-slate-800/80">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                Visual Campaign Inspiration
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Crafted for Every Industry
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Explore sample advertisement creatives generated with distinct color palettes,
                expressive typography, and commercial product imagery.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800">
              {[
                { id: 'all', label: 'All Creatives' },
                { id: 'skincare', label: 'Skincare' },
                { id: 'coffee', label: 'Coffee' },
                { id: 'food', label: 'Food' },
                { id: 'beverage', label: 'Beverages' },
                { id: 'fitness', label: 'Fitness' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategory === tab.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sample Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredSamples.map((sample) => (
              <div
                key={sample.id}
                className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800/90 shadow-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl flex flex-col justify-between"
              >
                {/* Visual Artwork Frame */}
                <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-slate-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sample.visual.previewImageUrl}
                    alt={sample.productName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/20">
                      {sample.categoryLabel}
                    </span>
                    <span className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg shadow-lg border ${sample.visual.badgeBg}`}>
                      {sample.badgeText}
                    </span>
                  </div>
                </div>

                {/* Card Content & Information */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between bg-slate-900/90">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                      <span className="uppercase tracking-wider">{sample.platform === 'google' ? 'Google Search & Banner' : 'Meta Feed Creative'}</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-bold">{sample.framework.toUpperCase()} Framework</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-white leading-tight">
                      {sample.headline}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                      {sample.supportingCopy}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sample.benefitBullets.map((bullet, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2.5 py-0.5 rounded-md border border-slate-700/60"
                      >
                        ✓ {bullet}
                      </span>
                    ))}
                  </div>

                  {/* Try with AI Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleTrySample(sample)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 transition flex items-center justify-center gap-2 shadow"
                    >
                      <span>Create Campaign for {sample.categoryLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Engineered for Performance
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Everything Needed to Launch High-Impact Ads
            </h2>
            <p className="text-sm text-slate-400">
              From audience psychology to visual art direction, AdNova automates the tedious parts of digital advertising.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Art-Directed Visual Creatives</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate high-conversion visual concepts featuring product bottles, creamy milk textures, golden espresso crema, or appetizing meals with custom color palettes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AIDA & PAS Copywriting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose between Attention-Interest-Desire-Action or Problem-Agitate-Solution frameworks to systematically guide prospects toward conversion.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Google & Meta Compliance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Strict 30-character headline and 90-character description validation for Google Search Ads, plus high-engagement primary copy for Meta mobile social feeds.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">1 to 5 Distinct Variations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never settle for generic text swaps. Every variation receives distinct hooks, visual compositions, color palettes, and benefit highlights.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">PNG & Printable A4 PDF Export</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download ready-to-run high-resolution PNG advertisements or printable A4 PDFs with a single click. Zero watermarks, zero hassle.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Grounded & Truthful Copy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Engineered with strict hallucination defense. AdNova never fabricates discounts, certifications, or statistics that were not in your product description.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Simple 3-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Raw Idea to Ad Campaign in Seconds
            </h2>
            <p className="text-sm text-slate-400">
              No complex design software or expensive agency retainers required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 font-extrabold text-lg flex items-center justify-center mx-auto shadow-inner">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Describe Your Product</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your product name, key features, target audience, and select your preferred platform and copywriting framework.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 font-extrabold text-lg flex items-center justify-center mx-auto shadow-inner">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Generate Creative Variations</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our AI crafts 1 to 5 distinct variations with natural headlines, tailored color palettes, and commercial image visual concepts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 font-extrabold text-lg flex items-center justify-center mx-auto shadow-inner">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Compare & Download</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review your variations, copy compliant ad copy, tag favorites, and export ready-to-run PNG or printable A4 PDF posters.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition"
            >
              <span>Try It Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 text-center space-y-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Ready to create your next ad?
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Generate high-converting digital advertising copy and art-directed creatives in seconds. Completely free.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/create"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-xl shadow-indigo-500/30 transition active:scale-95"
              >
                <span>Start Creating Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 space-y-3">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AdNova — AI Ad Generator</span>
        </div>
        <p className="max-w-md mx-auto text-slate-500">
          Engineered for digital marketing, college microprojects, and modern creators. Combines classical AIDA & PAS formulas with commercial visual creative synthesis.
        </p>
        <div className="pt-2 text-[11px] text-slate-600">
          © 2026 AdNova. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
