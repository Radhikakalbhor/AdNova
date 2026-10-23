'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VisualCreative, Platform } from '@/types/ad';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import {
  Download,
  FileText,
  Printer,
  Sparkles,
  ArrowRight,
  Check,
  Utensils,
  Dumbbell,
  Laptop,
  Heart,
  ShoppingBag,
  RefreshCw,
  Clock,
  Coffee,
  AlertCircle,
  Palette,
  Droplets,
  Zap,
  Cpu,
} from 'lucide-react';

// Global shared cooldown tracker across variation instances to prevent socket flooding
let globalCooldownExpiry = 0;

interface AdCreativePosterProps {
  creative: VisualCreative;
  productName: string;
  platform: Platform;
  variationNumber: number;
}

export function AdCreativePoster({
  creative,
  productName,
  platform,
  variationNumber,
}: AdCreativePosterProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'cooldown' | 'error'>('idle');
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<'png' | 'pdf' | null>(null);

  // Fetch the AI image with rate-limit cooldown handling
  const fetchImage = async () => {
    // Check if global cooldown is still active from another variation
    const now = Date.now();
    if (globalCooldownExpiry > now) {
      const remainingSec = Math.ceil((globalCooldownExpiry - now) / 1000);
      setCooldownSeconds(remainingSec);
      setLoadingState('cooldown');
      return;
    }

    setLoadingState('loading');
    setErrorMessage(null);

    try {
      const res = await fetch(creative.imageUrl);

      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageBlobUrl(objectUrl);
        setLoadingState('success');
      } else if (res.status === 402 || res.status === 429) {
        // Free limit on Pollinations anonymous endpoint (1 image per 45s)
        let retrySec = 45;
        try {
          const errData = await res.json();
          if (errData?.retryAfter) {
            retrySec = Number(errData.retryAfter);
          }
        } catch {
          // Default to 45 seconds cooldown
        }
        globalCooldownExpiry = Date.now() + retrySec * 1000;
        setCooldownSeconds(retrySec);
        setLoadingState('cooldown');
      } else if (res.status === 504) {
        setErrorMessage('Upstream queue timed out. Graphic fallback active.');
        setLoadingState('error');
      } else {
        try {
          const errData = await res.json();
          setErrorMessage(errData?.error || `Server responded with ${res.status}`);
        } catch {
          setErrorMessage(`Server responded with ${res.status}`);
        }
        setLoadingState('error');
      }
    } catch {
      setErrorMessage('Could not load AI image. Network timed out.');
      setLoadingState('error');
    }
  };

  // Cooldown countdown timer
  useEffect(() => {
    if (loadingState !== 'cooldown' || cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          fetchImage(); // Auto-retry after cooldown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadingState, cooldownSeconds]);

  // Staggered sequential initiation: Variation 1 loads immediately; subsequent wait 2s
  useEffect(() => {
    const initialDelay = (variationNumber - 1) * 2000; // Stagger requests to avoid socket saturation
    const timer = setTimeout(() => {
      fetchImage();
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [creative.imageUrl]);

  // Clean up Object URL
  useEffect(() => {
    return () => {
      if (imageBlobUrl) {
        URL.revokeObjectURL(imageBlobUrl);
      }
    };
  }, [imageBlobUrl]);

  // Download high-resolution PNG
  const handleDownloadPng = async () => {
    if (!posterRef.current) return;
    setIsExporting('png');
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'adnova'}-ad-${variationNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    } finally {
      setIsExporting(null);
    }
  };

  // Download A4 PDF
  const handleDownloadPdf = async () => {
    if (!posterRef.current) return;
    setIsExporting('pdf');
    try {
      const dataUrl = await toPng(posterRef.current, {
        quality: 0.95,
        pixelRatio: 2,
      });

      const pdf = new jsPDF({
        orientation: platform === 'meta' ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const imgRatio = img.width / img.height;
      let renderWidth = pageWidth - 20;
      let renderHeight = renderWidth / imgRatio;

      if (renderHeight > pageHeight - 20) {
        renderHeight = pageHeight - 20;
        renderWidth = renderHeight * imgRatio;
      }

      const x = (pageWidth - renderWidth) / 2;
      const y = (pageHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', x, y, renderWidth, renderHeight);
      pdf.save(`${productName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'adnova'}-ad-${variationNumber}.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const CategoryIcon = () => {
    switch (creative.category) {
      case 'skincare':
        return <Sparkles className="w-3.5 h-3.5 text-rose-300" />;
      case 'coffee':
        return <Coffee className="w-3.5 h-3.5 text-amber-500" />;
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-amber-400" />;
      case 'beverage':
        return <Coffee className="w-3.5 h-3.5 text-cyan-400" />;
      case 'fitness':
        return <Dumbbell className="w-3.5 h-3.5 text-lime-400" />;
      case 'tech':
        return <Laptop className="w-3.5 h-3.5 text-indigo-400" />;
      case 'beauty':
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      case 'fashion':
        return <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Action Toolbar above poster */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-200">
            <CategoryIcon />
            <span className="capitalize">{creative.category} Commercial Ad</span>
          </span>
          {imageBlobUrl ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              AI Photorealistic Visual
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              <Palette className="w-3 h-3 text-cyan-400" />
              {loadingState === 'loading' ? 'Generating AI Visual...' : 'Creative Graphic Design'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Download PNG */}
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExporting !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-md transition active:scale-95 disabled:opacity-50"
            title="Download high-resolution PNG poster"
          >
            {isExporting === 'png' ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Download PNG</span>
          </button>

          {/* Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExporting !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95 disabled:opacity-50"
            title="Download printable A4 PDF"
          >
            {isExporting === 'pdf' ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span className="hidden sm:inline">A4 PDF</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={() => window.print()}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            title="Print creative"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The Downloadable/Printable Commercial Advertisement Canvas */}
      <div
        ref={posterRef}
        id={`adnova-poster-${variationNumber}`}
        className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br ${creative.colors.bgGradient} flex flex-col justify-between select-none transition-all duration-300`}
        style={{
          minHeight: platform === 'meta' ? '540px' : '420px',
        }}
      >
        {/* Render Layout Variations */}
        {creative.layout === 'showcase' && (
          <CommercialHeroLayout
            creative={creative}
            productName={productName}
            imageBlobUrl={imageBlobUrl}
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={fetchImage}
          />
        )}

        {creative.layout === 'immersive' && (
          <CommercialBillboardLayout
            creative={creative}
            productName={productName}
            imageBlobUrl={imageBlobUrl}
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={fetchImage}
          />
        )}

        {creative.layout === 'split' && (
          <CommercialColorBlockLayout
            creative={creative}
            productName={productName}
            imageBlobUrl={imageBlobUrl}
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={fetchImage}
          />
        )}

        {creative.layout === 'bold' && (
          <CommercialKineticLayout
            creative={creative}
            productName={productName}
            imageBlobUrl={imageBlobUrl}
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={fetchImage}
          />
        )}

        {creative.layout === 'minimal' && (
          <CommercialPowerhouseLayout
            creative={creative}
            productName={productName}
            imageBlobUrl={imageBlobUrl}
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={fetchImage}
          />
        )}
      </div>

      {/* Prompt Tooltip & Live Queue Status */}
      <div className="no-print flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 px-1">
        <span className="truncate max-w-[70%]" title={creative.imagePrompt}>
          Prompt: <span className="text-slate-400 italic">“{creative.imagePrompt}”</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {imageBlobUrl && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Check className="w-3 h-3" /> AI Visual Ready
            </span>
          )}
          {!imageBlobUrl && loadingState === 'cooldown' && (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-mono">
              <Clock className="w-3 h-3 animate-spin" /> Free Cooldown: {cooldownSeconds}s
            </span>
          )}
          {!imageBlobUrl && loadingState === 'error' && (
            <button
              type="button"
              onClick={fetchImage}
              className="inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white font-medium hover:underline"
            >
              <RefreshCw className="w-3 h-3" /> Retry AI Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Shared Responsive Editorial Headline Display Component
// -------------------------------------------------------------
function HeadlineDisplay({
  headline,
  size = 'default',
}: {
  headline: string;
  size?: 'default' | 'large' | 'compact';
}) {
  const isLong = headline.length > 32;

  let textSize = 'text-2xl sm:text-3xl lg:text-4xl';
  if (size === 'large') {
    textSize = isLong ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-3xl sm:text-4xl lg:text-5xl';
  } else if (size === 'compact') {
    textSize = 'text-xl sm:text-2xl lg:text-3xl';
  }

  return (
    <h2 className={`${textSize} font-extrabold tracking-tight text-white leading-tight drop-shadow-md break-words`}>
      {headline}
    </h2>
  );
}

// -------------------------------------------------------------
// Layout 1: The Commercial Hero (Center Stage Splash)
// Balanced Editorial Typography + Hero Product Stage
// -------------------------------------------------------------
function CommercialHeroLayout({
  creative,
  productName,
  imageBlobUrl,
  loadingState,
  cooldownSeconds,
  errorMessage,
  onRetry,
}: any) {
  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white text-slate-950 shadow-lg">
            {productName}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300 hidden sm:inline">
            Official Campaign
          </span>
        </div>

        {/* Tilted Sticker Badge */}
        <div className={`transform -rotate-2 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg shadow-xl border-2 ${creative.colors.badgeBg}`}>
          {creative.badgeText}
        </div>
      </div>

      {/* Editorial Headline */}
      <div className="relative z-10 my-3 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-widest text-amber-300/90 drop-shadow flex items-center gap-1.5">
          <span>★</span>
          <span>Featured Creative</span>
        </div>
        <HeadlineDisplay
          headline={creative.headline}
          size="large"
        />
      </div>

      {/* Center Photorealistic AI Image Stage */}
      <div className="relative z-0 w-full h-64 sm:h-72 my-2 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950 flex items-center justify-center">
        {imageBlobUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageBlobUrl}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <ImageLoadingPlaceholder
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={onRetry}
            colors={creative.colors}
            category={creative.category}
            productName={productName}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Bottom Information & High-Conversion CTA Layer */}
      <div className="relative z-10 space-y-4 pt-2">
        {/* Benefit Chips */}
        <div className="flex flex-wrap gap-2">
          {creative.benefitBullets.map((bullet: string, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-black/70 backdrop-blur-md text-white border border-white/20 shadow"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{bullet}</span>
            </span>
          ))}
        </div>

        {/* Supporting Copy & Giant CTA Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/20">
          <p className="text-xs sm:text-sm text-slate-200 font-normal max-w-sm leading-relaxed line-clamp-2">
            {creative.supportingCopy}
          </p>

          <button
            type="button"
            className="w-full sm:w-auto py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2 transition active:scale-95 shrink-0"
            style={{
              backgroundColor: creative.colors.accent,
              color: creative.colors.accentText,
            }}
          >
            <span>{creative.callToAction}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layout 2: The Commercial Billboard (Full Bleed Immersive)
// Edge-to-edge Photography + Clean Contrast Scrim
// -------------------------------------------------------------
function CommercialBillboardLayout({
  creative,
  productName,
  imageBlobUrl,
  loadingState,
  cooldownSeconds,
  errorMessage,
  onRetry,
}: any) {
  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-6 sm:p-8 overflow-hidden bg-slate-950">
      {/* Background Hero Photography with Scrim */}
      <div className="absolute inset-0 z-0">
        {imageBlobUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageBlobUrl}
            alt={productName}
            className="w-full h-full object-cover opacity-80 transition-opacity duration-500"
          />
        ) : (
          <ImageLoadingPlaceholder
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={onRetry}
            colors={creative.colors}
            category={creative.category}
            productName={productName}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/45 pointer-events-none" />
      </div>

      {/* Top Branding */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/20">
          {productName}
        </span>
        <div className={`transform rotate-2 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-lg shadow-xl border-2 ${creative.colors.badgeBg}`}>
          {creative.badgeText}
        </div>
      </div>

      {/* Center/Bottom Editorial Typography & Action */}
      <div className="relative z-10 space-y-4 max-w-xl pt-20 my-auto">
        <div className="space-y-2">
          <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-white/90 bg-white/20 backdrop-blur-sm">
            Featured Commercial Drop
          </div>
          <HeadlineDisplay
            headline={creative.headline}
            size="large"
          />
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal line-clamp-3 max-w-md pt-1">
            {creative.supportingCopy}
          </p>
        </div>

        {/* Benefits Pill Strip */}
        <div className="flex flex-wrap gap-2 pt-1">
          {creative.benefitBullets.map((bullet: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white border border-white/20 shadow"
            >
              ✓ {bullet}
            </span>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            className="py-3 px-8 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 transition active:scale-95"
            style={{
              backgroundColor: creative.colors.accent,
              color: creative.colors.accentText,
            }}
          >
            <span>{creative.callToAction}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layout 3: The Saturated Color Block (Editorial Split)
// Editorial Split Grid + Clean Copy Framing
// -------------------------------------------------------------
function CommercialColorBlockLayout({
  creative,
  productName,
  imageBlobUrl,
  loadingState,
  cooldownSeconds,
  errorMessage,
  onRetry,
}: any) {
  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between">
      {/* Top Bar */}
      <div className="p-4 sm:p-5 bg-slate-950/95 border-b border-white/10 flex items-center justify-between">
        <span className="text-sm font-bold tracking-wider text-white">
          {productName}
        </span>
        <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider border ${creative.colors.badgeBg}`}>
          {creative.badgeText}
        </span>
      </div>

      {/* Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1">
        {/* Left Copy Panel (7 cols on md) */}
        <div
          className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6"
          style={{ backgroundColor: creative.colors.cardBg }}
        >
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Curated Edition
            </span>
            <HeadlineDisplay
              headline={creative.headline}
              size="default"
            />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {creative.supportingCopy}
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              {creative.benefitBullets.map((b: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="w-full py-3 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition active:scale-95"
              style={{
                backgroundColor: creative.colors.accent,
                color: creative.colors.accentText,
              }}
            >
              <span>{creative.callToAction}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Photo Panel (5 cols on md) */}
        <div className="md:col-span-5 relative min-h-[260px] md:min-h-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {imageBlobUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageBlobUrl}
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <ImageLoadingPlaceholder
              loadingState={loadingState}
              cooldownSeconds={cooldownSeconds}
              errorMessage={errorMessage}
              onRetry={onRetry}
              colors={creative.colors}
              category={creative.category}
              productName={productName}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layout 4: The Kinetic Action (High Energy Dynamic)
// -------------------------------------------------------------
function CommercialKineticLayout({
  creative,
  productName,
  imageBlobUrl,
  loadingState,
  cooldownSeconds,
  errorMessage,
  onRetry,
}: any) {
  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
      {/* Background Image with High Vibrance */}
      <div className="absolute inset-0 z-0 bg-slate-950">
        {imageBlobUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageBlobUrl}
            alt={productName}
            className="w-full h-full object-cover opacity-75 transition-opacity duration-500"
          />
        ) : (
          <ImageLoadingPlaceholder
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={onRetry}
            colors={creative.colors}
            category={creative.category}
            productName={productName}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/45" />
      </div>

      {/* Top Banner Ribbon */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="px-3.5 py-1.5 rounded-md text-xs font-black uppercase tracking-wider bg-white text-black shadow-lg">
          {productName}
        </span>
        <span className={`transform rotate-2 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md shadow-xl border-2 ${creative.colors.badgeBg}`}>
          {creative.badgeText}
        </span>
      </div>

      {/* Kinetic Headline */}
      <div className="relative z-10 my-auto py-6 space-y-3">
        <HeadlineDisplay
          headline={creative.headline}
          size="large"
        />
        <p className="text-xs sm:text-sm text-slate-200 max-w-md leading-relaxed line-clamp-3 font-normal">
          {creative.supportingCopy}
        </p>
      </div>

      {/* Bottom CTA Layer */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          {creative.benefitBullets.map((b: string, i: number) => (
            <span key={i} className="px-2.5 py-1 rounded bg-black/60 text-[11px] font-semibold text-white border border-white/10">
              ✓ {b}
            </span>
          ))}
        </div>

        <button
          type="button"
          className="py-3 px-7 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-2xl flex items-center gap-2 transition active:scale-95"
          style={{
            backgroundColor: creative.colors.accent,
            color: creative.colors.accentText,
          }}
        >
          <span>{creative.callToAction}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Layout 5: The Premium Powerhouse (Deep Obsidian & Clean Framing)
// -------------------------------------------------------------
function CommercialPowerhouseLayout({
  creative,
  productName,
  imageBlobUrl,
  loadingState,
  cooldownSeconds,
  errorMessage,
  onRetry,
}: any) {
  return (
    <div className="relative w-full h-full min-h-[520px] flex flex-col justify-between p-6 sm:p-8 bg-slate-950 border border-white/10">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">
          {productName}
        </span>
        <span className="text-[11px] font-mono tracking-wider text-slate-400">
          {creative.badgeText}
        </span>
      </div>

      {/* Center Hero Artwork Frame */}
      <div className="relative w-full h-56 sm:h-64 my-3 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center">
        {imageBlobUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageBlobUrl}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <ImageLoadingPlaceholder
            loadingState={loadingState}
            cooldownSeconds={cooldownSeconds}
            errorMessage={errorMessage}
            onRetry={onRetry}
            colors={creative.colors}
            category={creative.category}
            productName={productName}
          />
        )}
      </div>

      {/* Bottom Typography & Clean CTA */}
      <div className="space-y-3">
        <div className="space-y-1">
          <HeadlineDisplay
            headline={creative.headline}
            size="default"
          />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 font-normal">
            {creative.supportingCopy}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {creative.benefitBullets.map((b: string, i: number) => (
              <span key={i} className="text-[11px] font-medium text-slate-400">
                • {b}
              </span>
            ))}
          </div>

          <button
            type="button"
            className="py-2.5 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-white border border-white/30 hover:border-white transition flex items-center gap-2 active:scale-95"
            style={{ backgroundColor: `${creative.colors.accent}40` }}
          >
            <span>{creative.callToAction}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Category-Specific High-Resolution Fallback Vector Artwork
// Ensures no ad ever presents a blank or broken black box
// -------------------------------------------------------------
function CategoryFallbackGraphic({
  category,
  productName,
}: {
  category: string;
  productName: string;
  colors?: any;
}) {
  switch (category) {
    case 'skincare':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-rose-950/60 via-slate-950 to-emerald-950/40 select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-400/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-3">
              <div className="w-20 h-20 rounded-full bg-rose-500/15 border border-rose-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <Droplets className="w-10 h-10 text-rose-300 drop-shadow" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-900/60 border border-rose-500/30 text-rose-200">
              ✦ GENTLE DERMAL ESSENCE
            </span>
            <p className="text-xs font-bold text-slate-200 max-w-[220px] truncate mt-1">
              {productName}
            </p>
          </div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border border-rose-500/10 pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-emerald-500/10 pointer-events-none" />
        </div>
      );

    case 'coffee':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-amber-950/70 via-stone-950 to-orange-950/50 select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-3">
              <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm">
                <Coffee className="w-10 h-10 text-amber-300 drop-shadow animate-pulse" />
              </div>
              <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-900/60 border border-amber-500/30 text-amber-200">
              ☕ SINGLE-ORIGIN ROAST
            </span>
            <p className="text-xs font-bold text-amber-100/90 max-w-[220px] truncate mt-1">
              {productName}
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full border border-amber-500/10 pointer-events-none" />
        </div>
      );

    case 'food':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-orange-950/70 via-slate-950 to-red-950/50 select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-orange-500/15 border border-orange-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm mb-3">
              <Utensils className="w-10 h-10 text-orange-300 drop-shadow" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-900/60 border border-orange-500/30 text-orange-200">
              ★ GOURMET CULINARY CREATION
            </span>
            <p className="text-xs font-bold text-slate-200 max-w-[220px] truncate mt-1">
              {productName}
            </p>
          </div>
        </div>
      );

    case 'beverage':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-cyan-950/70 via-slate-950 to-blue-950/50 select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm mb-3">
              <Droplets className="w-10 h-10 text-cyan-300 drop-shadow" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-900/60 border border-cyan-500/30 text-cyan-200">
              ❄ ICE-COLD REFRESHMENT
            </span>
            <p className="text-xs font-bold text-cyan-100 max-w-[220px] truncate mt-1">
              {productName}
            </p>
          </div>
        </div>
      );

    case 'fitness':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-lime-950/70 via-slate-950 to-emerald-950/50 select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-400/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-lime-500/15 border border-lime-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm mb-3">
              <Dumbbell className="w-10 h-10 text-lime-300 drop-shadow" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-lime-900/60 border border-lime-500/30 text-lime-200">
              ⚡ PEAK PERFORMANCE ATHLETICS
            </span>
            <p className="text-xs font-bold text-lime-100 max-w-[220px] truncate mt-1">
              {productName}
            </p>
          </div>
        </div>
      );

    case 'tech':
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-indigo-950/70 via-slate-950 to-cyan-950/50 select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm mb-3">
              <Laptop className="w-10 h-10 text-indigo-300 drop-shadow" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-900/60 border border-indigo-500/30 text-indigo-200">
              🚀 NEXT-GEN AUTOMATION
            </span>
            <p className="text-xs font-bold text-indigo-100 max-w-[220px] truncate mt-1">
              {productName}
            </p>
          </div>
        </div>
      );

    default:
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-purple-950/70 via-slate-950 to-indigo-950/50 select-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-purple-500/15 border border-purple-400/30 flex items-center justify-center shadow-2xl backdrop-blur-sm mb-3">
              <Sparkles className="w-10 h-10 text-purple-300 drop-shadow" />
            </div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-900/60 border border-purple-500/30 text-purple-200">
              ★ PREMIUM CRAFTED EDITION
            </span>
            <p className="text-xs font-bold text-purple-100 max-w-[220px] truncate mt-1">
              {productName}
            </p>
          </div>
        </div>
      );
  }
}

// -------------------------------------------------------------
// Interactive Image Loading & Rate-Limit Cooldown Stage
// Transparently handles free queue cooldown and renders elegant fallback artwork
// -------------------------------------------------------------
function ImageLoadingPlaceholder({
  loadingState,
  cooldownSeconds,
  errorMessage,
  onRetry,
  colors,
  category,
  productName,
}: any) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Product-Specific Editorial Vector Artwork */}
      <CategoryFallbackGraphic
        category={category}
        productName={productName}
        colors={colors}
      />

      {/* Floating Non-Blocking Status Pill */}
      {loadingState === 'loading' && (
        <div className="no-print absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/20 text-white text-xs shadow-2xl">
          <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-[11px] font-medium">Generating AI visual...</span>
        </div>
      )}

      {loadingState === 'cooldown' && (
        <div className="no-print absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/90 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs shadow-2xl">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-[11px] font-mono font-medium">
            Queue Cooldown: {cooldownSeconds}s
          </span>
          <button
            type="button"
            onClick={onRetry}
            className="ml-1 px-2 py-0.5 rounded bg-amber-800/80 hover:bg-amber-700 text-white text-[10px] font-bold transition"
          >
            Retry
          </button>
        </div>
      )}

      {loadingState === 'error' && (
        <div className="no-print absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/20 text-slate-200 text-xs shadow-2xl">
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-medium">Graphic Artwork Active</span>
          <button
            type="button"
            onClick={onRetry}
            className="ml-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold flex items-center gap-1 transition"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>Retry AI</span>
          </button>
        </div>
      )}
    </div>
  );
}
