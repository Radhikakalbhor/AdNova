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
} from 'lucide-react';

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
    setLoadingState('loading');
    setErrorMessage(null);

    try {
      const res = await fetch(creative.imageUrl);

      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageBlobUrl(objectUrl);
        setLoadingState('success');
      } else if (res.status === 402) {
        // Free limit on Pollinations anonymous endpoint (1 image per 45s)
        let retrySec = 45;
        try {
          const errData = await res.json();
          const match = errData?.details?.match(/Retry after (\d+)s/);
          if (match && match[1]) {
            retrySec = parseInt(match[1], 10) + 1;
          }
        } catch {
          // Default to 45 seconds cooldown
        }
        setCooldownSeconds(retrySec);
        setLoadingState('cooldown');
      } else {
        setErrorMessage(`Server responded with ${res.status}. Rate limit or network delay.`);
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
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            AI Photorealistic Visual
          </span>
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
          {loadingState === 'success' && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Check className="w-3 h-3" /> AI Visual Ready
            </span>
          )}
          {loadingState === 'cooldown' && (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-mono">
              <Clock className="w-3 h-3 animate-spin" /> Cooldown: {cooldownSeconds}s
            </span>
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
// Interactive Image Loading & Rate-Limit Cooldown Placeholder
// Transparently handles and communicates the exact free-tier limit
// -------------------------------------------------------------
function ImageLoadingPlaceholder({
  loadingState,
  cooldownSeconds,
  errorMessage,
  onRetry,
  colors,
  category,
}: any) {
  if (loadingState === 'cooldown') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 text-white space-y-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
          <Clock className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold text-amber-300">
            Free Queue Cooldown: {cooldownSeconds}s
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            Pollinations anonymous tier limits requests to 1 image every 45s. Auto-generating when countdown reaches 0.
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="px-3 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Retry Now</span>
        </button>
      </div>
    );
  }

  if (loadingState === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 text-white space-y-3">
        <AlertCircle className="w-10 h-10 text-rose-400" />
        <div className="space-y-1">
          <div className="text-xs font-bold text-rose-300">
            Image Generation Rate Limit
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            {errorMessage || 'Free anonymous limit reached. Add a free API key in .env.local for instant multi-image generation.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Default 'loading' spinner
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950/80 text-white space-y-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin" />
        <Sparkles className="w-5 h-5 text-indigo-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <div>
        <div className="text-xs font-bold text-white">Generating AI Artwork...</div>
        <div className="text-[10px] text-slate-400 mt-0.5">
          Rendering photorealistic {category} commercial visuals
        </div>
      </div>
    </div>
  );
}
