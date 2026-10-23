'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PosterData,
  AdFormat,
  VisualTheme,
  VisualLayout,
  Framework,
  CampaignObjective,
  AdInput,
  GenerateApiResponse,
  AdVariation,
} from '@/types/ad';
import {
  COLOR_PALETTES,
  STOCK_IMAGES,
  FORMAT_DIMENSIONS,
  getRecommendedStockImage,
} from '@/data/visualTemplates';
import { PRESET_CAMPAIGNS } from '@/data/presets';
import { VisualPosterCanvas } from './VisualPosterCanvas';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import {
  Sparkles,
  Download,
  Printer,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Palette,
  Layout,
  RefreshCw,
  Sliders,
  Layers,
  ArrowRight,
  ShieldAlert,
  FileText,
  Tag,
  Globe,
  Phone,
  Eye,
} from 'lucide-react';

interface VisualAdStudioProps {
  initialCampaign?: AdInput;
}

const LAYOUTS: { id: VisualLayout; name: string; desc: string }[] = [
  { id: 'split-showcase', name: 'Split Showcase', desc: 'Featured hero with high-contrast bottom card' },
  { id: 'hero-card', name: 'Hero Overlay', desc: 'Full-bleed background with frosted glass card' },
  { id: 'editorial-modern', name: 'Editorial Modern', desc: 'Asymmetric frame with offset headline' },
  { id: 'bold-banner', name: 'Bold Banner', desc: 'High-impact headline with circular product cutout' },
  { id: 'minimalist-chic', name: 'Minimalist Chic', desc: 'Spacious, elegant centered presentation' },
];

const THEMES: { id: VisualTheme; name: string }[] = [
  { id: 'modern', name: 'Modern' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'luxury', name: 'Luxury' },
  { id: 'playful', name: 'Playful' },
  { id: 'bold', name: 'Bold' },
  { id: 'elegant', name: 'Elegant' },
];

export function VisualAdStudio({ initialCampaign }: VisualAdStudioProps) {
  // Campaign inputs
  const [productName, setProductName] = useState(initialCampaign?.productName || 'SwiftFlow');
  const [productDescription, setProductDescription] = useState(
    initialCampaign?.productDescription ||
      'AI-driven project management platform that turns unstructured team chats into prioritized sprints, automates status updates, and prevents team burnout.'
  );
  const [targetAudience, setTargetAudience] = useState(
    initialCampaign?.targetAudience || 'Engineering managers and tech founders'
  );
  const [framework, setFramework] = useState<Framework>(initialCampaign?.framework || 'pas');
  const [objective, setObjective] = useState<CampaignObjective>(initialCampaign?.objective || 'Leads');
  const [offerBadge, setOfferBadge] = useState('14-DAY FREE TRIAL');
  const [website, setWebsite] = useState('swiftflow.io');
  const [phone, setPhone] = useState('+1 (800) 555-0199');

  // Design state
  const [format, setFormat] = useState<AdFormat>('square');
  const [theme, setTheme] = useState<VisualTheme>('modern');
  const [layout, setLayout] = useState<VisualLayout>('split-showcase');
  const [paletteId, setPaletteId] = useState('midnight-indigo');
  const [imageUrl, setImageUrl] = useState(
    getRecommendedStockImage(productName, productDescription)
  );

  // Content state (can be edited in real-time)
  const [headline, setHeadline] = useState('Turn Chat Chaos Into Sprints');
  const [bodyCopy, setBodyCopy] = useState(
    'Tired of losing decisions in endless chat threads? SwiftFlow organizes team chatter into clear, prioritized sprints automatically.'
  );
  const [callToAction, setCallToAction] = useState('Start Free Trial');
  const [keyBenefits, setKeyBenefits] = useState<string[]>([
    'Automated sprint prioritization',
    'Slack & GitHub live sync',
    'Zero micromanagement',
    '60-second setup',
  ]);

  // Variations from AI
  const [generatedVariations, setGeneratedVariations] = useState<AdVariation[]>([]);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);

  // Status & export states
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState<'png' | 'pdf' | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialCampaign if changed externally
  useEffect(() => {
    if (initialCampaign) {
      setProductName(initialCampaign.productName);
      setProductDescription(initialCampaign.productDescription);
      setTargetAudience(initialCampaign.targetAudience);
      setFramework(initialCampaign.framework);
      setObjective(initialCampaign.objective);
      setImageUrl(getRecommendedStockImage(initialCampaign.productName, initialCampaign.productDescription));
    }
  }, [initialCampaign]);

  // Construct current PosterData
  const currentPosterData: PosterData = {
    id: 'adnova-active-poster',
    brandName: productName || 'Brand Name',
    tagline: 'Ad-Ready Visual Creative',
    headline,
    bodyCopy,
    callToAction,
    offerBadge,
    keyBenefits,
    website,
    phone,
    imageUrl,
    format,
    theme,
    layout,
    paletteId,
    framework,
    variationIndex: selectedVariationIndex,
  };

  // Generate copy variations with Groq and map to poster
  const handleGenerate = async () => {
    if (!productName.trim() || !productDescription.trim()) {
      setErrorMessage('Please provide a product name and description.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          productDescription,
          targetAudience: targetAudience || 'General audience',
          platform: 'meta',
          framework,
          tone: theme === 'luxury' || theme === 'elegant' ? 'Professional' : 'Persuasive',
          objective,
          variationCount: 3,
          offerKeywords: offerBadge,
        }),
      });

      const data: GenerateApiResponse = await res.json();

      if (!res.ok || !data.success || !data.data?.variations?.length) {
        setErrorMessage(data.error || 'Failed to generate ad copy with Groq.');
        return;
      }

      setGeneratedVariations(data.data.variations);
      setSelectedVariationIndex(0);

      // Apply first variation to poster
      applyVariationToPoster(data.data.variations[0]);

      // Automatically recommend suitable stock image if using stock
      if (!imageUrl || imageUrl.includes('unsplash')) {
        setImageUrl(getRecommendedStockImage(productName, productDescription));
      }
    } catch (err: any) {
      setErrorMessage('Network error while connecting to generation endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyVariationToPoster = (variation: AdVariation) => {
    setHeadline(variation.headline);
    setBodyCopy(variation.primaryCopy || variation.description || '');
    setCallToAction(variation.callToAction || 'Learn More');

    // Extract benefits from framework breakdown
    const fb: any = variation.frameworkBreakdown || {};
    const benefits: string[] = [];
    if (fb.interest) benefits.push(fb.interest.slice(0, 38));
    if (fb.desire) benefits.push(fb.desire.slice(0, 38));
    if (fb.solution) benefits.push(fb.solution.slice(0, 38));
    if (fb.agitate) benefits.push(fb.agitate.slice(0, 38));

    if (benefits.length > 0) {
      setKeyBenefits(benefits.slice(0, 4));
    }
  };

  const handleSelectVariation = (idx: number) => {
    if (generatedVariations[idx]) {
      setSelectedVariationIndex(idx);
      applyVariationToPoster(generatedVariations[idx]);
    }
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Export as High-Res PNG
  const handleExportPng = async () => {
    if (!posterRef.current) return;
    setIsExporting('png');
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'adnova'}-poster-${format}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG export error:', err);
      alert('Could not export PNG. Check browser permissions or image CORS settings.');
    } finally {
      setIsExporting(null);
    }
  };

  // Export as A4 PDF
  const handleExportPdf = async () => {
    if (!posterRef.current) return;
    setIsExporting('pdf');
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: format === 'poster' || format === 'portrait' || format === 'story' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Fit image centered
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const imgRatio = img.width / img.height;
      let renderWidth = pageWidth;
      let renderHeight = pageWidth / imgRatio;

      if (renderHeight > pageHeight) {
        renderHeight = pageHeight;
        renderWidth = pageHeight * imgRatio;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, renderWidth, renderHeight);
      pdf.save(`${productName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'adnova'}-poster-A4.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Copy ad text
  const handleCopyText = async () => {
    const text = `=== ${productName} Advertisement Poster ===\nHeadline: ${headline}\nBody Copy: ${bodyCopy}\nCTA: ${callToAction}\nOffer: ${offerBadge}\nWebsite: ${website}\nFramework: ${framework.toUpperCase()}`;
    await navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Studio Header Banner */}
      <div className="no-print flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-violet-950/60 border border-indigo-500/30 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Ad Studio • Production Grade</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Design High-Converting Poster Ads
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Combine Groq copy with colorful layouts, stock photography, and 1-click high-res export.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Presets:</span>
          {PRESET_CAMPAIGNS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setProductName(p.data.productName);
                setProductDescription(p.data.productDescription);
                setTargetAudience(p.data.targetAudience);
                setFramework(p.data.framework);
                setImageUrl(getRecommendedStockImage(p.data.productName, p.data.productDescription));
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Controls (Left) and Canvas Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols on lg) */}
        <div className="no-print lg:col-span-5 space-y-6">
          {/* Section 1: Campaign Strategy & Content */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-black">
                  1
                </span>
                Campaign & AI Copy
              </h3>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setFramework('aida')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    framework === 'aida' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  AIDA
                </button>
                <button
                  type="button"
                  onClick={() => setFramework('pas')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    framework === 'pas' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  PAS
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product / Brand Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-white focus:border-indigo-500 focus:outline-none"
                placeholder="e.g. SwiftFlow"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Product Features & Core Benefit
              </label>
              <textarea
                rows={2}
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-white focus:border-indigo-500 focus:outline-none resize-none"
                placeholder="What problem does it solve?"
              />
            </div>

            {/* AI Generate Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2 shadow-lg transition ${
                isLoading
                  ? 'bg-indigo-950 text-indigo-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/20 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Copy with Groq...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Generate Copy with AI</span>
                </>
              )}
            </button>

            {/* Variations Switcher (if generated) */}
            {generatedVariations.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  AI Variations ({generatedVariations.length}):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {generatedVariations.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectVariation(i)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition truncate ${
                        selectedVariationIndex === i
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Var #{v.variationNumber}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Visual Style, Layout & Format */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-black">
                2
              </span>
              Layout & Aspect Ratio
            </h3>

            {/* Format Selection (Aspect Ratios) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Ad Dimensions & Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(FORMAT_DIMENSIONS) as AdFormat[]).map((fmt) => {
                  const info = FORMAT_DIMENSIONS[fmt];
                  const active = format === fmt;
                  return (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        active
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-100">{info.label}</div>
                      <div className="text-[10px] text-slate-400">{info.sublabel}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Poster Layout Composition
              </label>
              <div className="grid grid-cols-1 gap-2">
                {LAYOUTS.map((ly) => (
                  <button
                    key={ly.id}
                    type="button"
                    onClick={() => setLayout(ly.id)}
                    className={`px-3 py-2 rounded-xl border text-left flex items-center justify-between transition ${
                      layout === ly.id
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold block text-slate-200">{ly.name}</span>
                      <span className="text-[10px] text-slate-400">{ly.desc}</span>
                    </div>
                    {layout === ly.id && <Check className="w-4 h-4 text-violet-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Color Palette Theme
              </label>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() => setPaletteId(pal.id)}
                    className={`p-2 rounded-xl border flex items-center gap-2 transition ${
                      paletteId === pal.id
                        ? 'border-indigo-400 bg-slate-800 ring-1 ring-indigo-400/50'
                        : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: pal.previewColor }}
                    />
                    <span className="text-[11px] font-medium text-slate-200 truncate">{pal.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Imagery & Photography */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black">
                3
              </span>
              Hero Imagery
            </h3>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Upload Photo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => setShowImagePicker(!showImagePicker)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition"
              >
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Stock Library</span>
              </button>

              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-xs font-medium text-slate-400 hover:text-white transition"
                title="Use abstract vector gradient artwork"
              >
                Vector Art
              </button>
            </div>

            {/* Stock Image Picker Modal/List */}
            {showImagePicker && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Select High-Res Curated Stock Photography:
                </span>
                <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {STOCK_IMAGES.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => {
                        setImageUrl(img.url);
                        setShowImagePicker(false);
                      }}
                      className="group relative rounded-lg overflow-hidden border border-slate-800 hover:border-indigo-500 aspect-video"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/image-proxy?url=${encodeURIComponent(img.url)}`}
                        alt={img.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <span className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] text-white font-medium truncate">
                        {img.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Live Content Overrides */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-violet-400" />
              Direct Copy Editing
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Supporting Copy</label>
              <textarea
                rows={2}
                value={bodyCopy}
                onChange={(e) => setBodyCopy(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Call To Action</label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Offer Badge</label>
                <input
                  type="text"
                  value={offerBadge}
                  onChange={(e) => setOfferBadge(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. 20% OFF"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Website URL</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Phone / Contact</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Poster Canvas Preview & Export Column (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Action Bar (Export, Print, Copy) */}
          <div className="no-print p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-400" /> Live Preview
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {FORMAT_DIMENSIONS[format].label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy text action */}
              <button
                type="button"
                onClick={handleCopyText}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                title="Copy formatted ad copy"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Copy Text</span>
              </button>

              {/* Print dialog action */}
              <button
                type="button"
                onClick={handlePrint}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition"
                title="Open browser print dialog"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">Print</span>
              </button>

              {/* Download PDF (A4) */}
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExporting !== null}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition shadow"
              >
                {isExporting === 'pdf' ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>A4 PDF</span>
              </button>

              {/* Download PNG */}
              <button
                type="button"
                onClick={handleExportPng}
                disabled={isExporting !== null}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-xs font-extrabold text-white flex items-center gap-1.5 shadow-lg transition active:scale-95"
              >
                {isExporting === 'png' ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Canvas Wrapper & Display Container */}
          <div className="w-full flex justify-center p-4 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-inner overflow-hidden">
            <div className="w-full max-w-lg transition-all duration-300">
              <VisualPosterCanvas
                ref={posterRef}
                data={currentPosterData}
              />
            </div>
          </div>

          <div className="no-print text-center text-xs text-slate-500">
            Exported posters contain only the designed marketing artwork at 2x retina print resolution.
          </div>
        </div>
      </div>
    </div>
  );
}
