'use client';

import React, { forwardRef } from 'react';
import { PosterData } from '@/types/ad';
import { COLOR_PALETTES, FORMAT_DIMENSIONS } from '@/data/visualTemplates';
import {
  Sparkles,
  CheckCircle,
  ArrowRight,
  Globe,
  Phone,
  ShieldCheck,
  Zap,
  Tag,
} from 'lucide-react';

interface VisualPosterCanvasProps {
  data: PosterData;
  scale?: number;
}

export const VisualPosterCanvas = forwardRef<HTMLDivElement, VisualPosterCanvasProps>(
  ({ data, scale = 1 }, ref) => {
    const palette =
      COLOR_PALETTES.find((p) => p.id === data.paletteId) || COLOR_PALETTES[0];
    const formatInfo = FORMAT_DIMENSIONS[data.format] || FORMAT_DIMENSIONS.square;

    // Convert remote URLs to use proxy to avoid canvas CORS tainting on export
    const safeImageUrl = React.useMemo(() => {
      if (!data.imageUrl) return '';
      if (data.imageUrl.startsWith('data:') || data.imageUrl.startsWith('blob:')) {
        return data.imageUrl;
      }
      if (data.imageUrl.includes('images.unsplash.com') || data.imageUrl.includes('images.pexels.com')) {
        return `/api/image-proxy?url=${encodeURIComponent(data.imageUrl)}`;
      }
      return data.imageUrl;
    }, [data.imageUrl]);

    // Render Abstract Vector Fallback Artwork when no image is available
    const renderAbstractArt = () => (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 flex items-center justify-center">
        <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <svg
          className="w-36 h-36 opacity-30 text-indigo-400 animate-pulse"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polygon points="50 10, 90 90, 10 90" />
          <circle cx="50" cy="55" r="24" strokeDasharray="3 3" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeOpacity="0.5" />
        </svg>
      </div>
    );

    return (
      <div
        ref={ref}
        id="adnova-poster-canvas"
        className={`relative w-full overflow-hidden select-none shadow-2xl font-sans ${formatInfo.aspectClass}`}
        style={{
          backgroundColor: palette.bgDark,
          color: palette.textPrimary,
        }}
      >
        {/* Dynamic Background Noise / Gradient Layer */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 70%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 60%)',
          }}
        />

        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-25"
          style={{ backgroundColor: palette.accent }}
        />

        {/* =====================================================================
            LAYOUT 1: SPLIT SHOWCASE (Default / High Converting)
            ===================================================================== */}
        {data.layout === 'split-showcase' && (
          <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8">
            {/* Top Bar: Brand, Framework Badge, and Offer */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm text-white shadow-md"
                  style={{ background: `linear-gradient(135deg, ${palette.accent}, #06B6D4)` }}
                >
                  {data.brandName.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <span className="font-extrabold text-sm sm:text-base tracking-tight uppercase">
                    {data.brandName}
                  </span>
                  {data.tagline && (
                    <span className="block text-[10px] tracking-wider uppercase opacity-75 font-medium -mt-0.5">
                      {data.tagline}
                    </span>
                  )}
                </div>
              </div>

              {data.offerBadge ? (
                <div
                  className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border"
                  style={{
                    backgroundColor: palette.badgeBg,
                    color: palette.badgeText,
                    borderColor: palette.border,
                  }}
                >
                  <Tag className="w-3 h-3 shrink-0" />
                  <span>{data.offerBadge}</span>
                </div>
              ) : (
                <div
                  className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border"
                  style={{ borderColor: palette.border, color: palette.textMuted }}
                >
                  {data.framework.toUpperCase()}
                </div>
              )}
            </div>

            {/* Middle Section: Hero Image Showcase Frame */}
            <div className="relative my-4 flex-1 flex items-center justify-center min-h-0">
              <div
                className="w-full h-full max-h-[58%] rounded-2xl overflow-hidden shadow-2xl relative border"
                style={{ borderColor: palette.border }}
              >
                {safeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={safeImageUrl}
                    alt={data.brandName}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover transform hover:scale-105 transition duration-700"
                  />
                ) : (
                  renderAbstractArt()
                )}
                {/* Subtle vignette fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Bottom Content Section: Headline, Body, Benefits, CTA */}
            <div
              className="p-5 sm:p-6 rounded-2xl backdrop-blur-md border shadow-xl z-10 flex flex-col justify-between"
              style={{
                backgroundColor: palette.cardBg,
                borderColor: palette.border,
              }}
            >
              <div>
                <h2
                  className="text-lg sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight mb-2"
                  style={{
                    background: `linear-gradient(135deg, #FFFFFF 60%, ${palette.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {data.headline}
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed mb-3 line-clamp-3" style={{ color: palette.textMuted }}>
                  {data.bodyCopy}
                </p>

                {/* Key Benefits List */}
                {data.keyBenefits && data.keyBenefits.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {data.keyBenefits.slice(0, 2).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                        <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: palette.accent }} />
                        <span className="truncate">{benefit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions & Contact Details */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-3">
                <div className="text-[10px] sm:text-[11px] truncate" style={{ color: palette.textMuted }}>
                  {data.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 inline" /> {data.website.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                  {data.phone && (
                    <span className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 inline" /> {data.phone}
                    </span>
                  )}
                </div>

                <div
                  className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer text-white"
                  style={{
                    background: `linear-gradient(135deg, ${palette.accent}, #06B6D4)`,
                  }}
                >
                  <span>{data.callToAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            LAYOUT 2: HERO CARD (Full Bleed Background + Glass Card)
            ===================================================================== */}
        {data.layout === 'hero-card' && (
          <div className="relative w-full h-full flex flex-col justify-end p-6 sm:p-8">
            {/* Background Full Bleed Image */}
            <div className="absolute inset-0 z-0">
              {safeImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={safeImageUrl}
                  alt={data.brandName}
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
              ) : (
                renderAbstractArt()
              )}
              {/* Rich double gradient to guarantee text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/30 pointer-events-none" />
            </div>

            {/* Top Bar Branding */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: palette.accent }} />
                <span className="font-bold text-xs uppercase tracking-wider text-white">
                  {data.brandName}
                </span>
              </div>

              {data.offerBadge && (
                <div
                  className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg text-black"
                  style={{ backgroundColor: palette.accent }}
                >
                  {data.offerBadge}
                </div>
              )}
            </div>

            {/* Floating Glass Content Card */}
            <div
              className="relative z-10 p-6 sm:p-7 rounded-2xl backdrop-blur-xl border shadow-2xl space-y-4"
              style={{
                backgroundColor: 'rgba(10, 15, 29, 0.82)',
                borderColor: palette.border,
              }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight text-white">
                {data.headline}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {data.bodyCopy}
              </p>

              {data.keyBenefits && data.keyBenefits.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.keyBenefits.map((b, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-medium border"
                      style={{
                        backgroundColor: palette.badgeBg,
                        borderColor: palette.border,
                        color: palette.badgeText,
                      }}
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/10 gap-3">
                <div className="text-[11px] text-slate-400">
                  {data.website && <div>{data.website.replace(/^https?:\/\//, '')}</div>}
                  {data.phone && <div>{data.phone}</div>}
                </div>
                <div
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-white shadow-xl flex items-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${palette.accent}, #06B6D4)`,
                  }}
                >
                  <span>{data.callToAction}</span>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            LAYOUT 3: EDITORIAL MODERN (Asymmetric Magazine Showcase)
            ===================================================================== */}
        {data.layout === 'editorial-modern' && (
          <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8">
            <div className="flex justify-between items-start z-10 border-b pb-4" style={{ borderColor: palette.border }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest block opacity-75" style={{ color: palette.accent }}>
                  Official Campaign
                </span>
                <h1 className="text-base sm:text-lg font-black uppercase tracking-wider">{data.brandName}</h1>
              </div>
              <div className="text-right">
                {data.offerBadge ? (
                  <span className="inline-block px-3 py-1 rounded text-xs font-extrabold tracking-wider uppercase bg-white text-black">
                    {data.offerBadge}
                  </span>
                ) : (
                  <span className="text-xs font-mono tracking-wider opacity-60">EDITION 2026</span>
                )}
              </div>
            </div>

            {/* Editorial Frame with Offset Headline */}
            <div className="relative my-4 flex-1 flex flex-col justify-center">
              <div
                className="w-full h-48 sm:h-64 rounded-xl overflow-hidden relative shadow-2xl border"
                style={{ borderColor: palette.border }}
              >
                {safeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={safeImageUrl}
                    alt={data.brandName}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  renderAbstractArt()
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Offset Headline Overlap */}
              <div className="mt-[-2rem] z-10 px-4">
                <div
                  className="p-4 rounded-xl backdrop-blur-md border shadow-xl"
                  style={{ backgroundColor: palette.cardBg, borderColor: palette.border }}
                >
                  <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white leading-snug">
                    {data.headline}
                  </h2>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="z-10 pt-2 space-y-3">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {data.bodyCopy}
              </p>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: palette.border }}>
                <span className="text-[11px] font-mono tracking-wider text-slate-400">
                  {data.website || 'Official Release'}
                </span>
                <div
                  className="px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider text-white shadow-lg flex items-center gap-1.5"
                  style={{ backgroundColor: palette.accent }}
                >
                  <span>{data.callToAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            LAYOUT 4: BOLD BANNER (Brutalist High Impact)
            ===================================================================== */}
        {data.layout === 'bold-banner' && (
          <div className="relative w-full h-full flex flex-col justify-between p-6 sm:p-8">
            {/* Top Bold Headline & Brand */}
            <div className="z-10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm uppercase tracking-widest text-white">
                  {data.brandName}
                </span>
                {data.offerBadge && (
                  <span
                    className="px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md text-black"
                    style={{ backgroundColor: palette.accent }}
                  >
                    ★ {data.offerBadge}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight leading-none text-white">
                {data.headline}
              </h1>
            </div>

            {/* Center Dynamic Circular Cutout or Rounded Box */}
            <div className="relative my-4 flex-1 flex items-center justify-center">
              <div
                className="w-48 h-48 sm:w-60 sm:h-60 rounded-full overflow-hidden border-4 shadow-2xl relative"
                style={{ borderColor: palette.accent }}
              >
                {safeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={safeImageUrl}
                    alt={data.brandName}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  renderAbstractArt()
                )}
              </div>
            </div>

            {/* High Impact Footer CTA Banner */}
            <div
              className="p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl z-10"
              style={{ backgroundColor: palette.cardBg, borderColor: palette.border }}
            >
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-semibold text-white leading-tight">
                  {data.bodyCopy}
                </p>
                {data.website && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {data.website}
                  </span>
                )}
              </div>

              <div
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-black text-center shadow-lg shrink-0 cursor-pointer"
                style={{ backgroundColor: palette.accent }}
              >
                {data.callToAction}
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            LAYOUT 5: MINIMALIST CHIC (Centered Product Elegance)
            ===================================================================== */}
        {data.layout === 'minimalist-chic' && (
          <div className="relative w-full h-full flex flex-col justify-between p-7 sm:p-9 text-center border-8 border-transparent">
            {/* Elegant Header */}
            <div className="z-10 space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] block" style={{ color: palette.accent }}>
                INTRODUCING
              </span>
              <h3 className="text-base sm:text-lg font-bold tracking-tight uppercase text-white">
                {data.brandName}
              </h3>
            </div>

            {/* Framed Center Hero */}
            <div className="relative my-4 flex-1 flex flex-col items-center justify-center">
              <div
                className="w-full max-w-xs h-48 sm:h-64 rounded-2xl overflow-hidden shadow-2xl border"
                style={{ borderColor: palette.border }}
              >
                {safeImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={safeImageUrl}
                    alt={data.brandName}
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  renderAbstractArt()
                )}
              </div>

              {data.offerBadge && (
                <div
                  className="mt-3 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                  style={{ borderColor: palette.border, color: palette.accent }}
                >
                  {data.offerBadge}
                </div>
              )}
            </div>

            {/* Refined Typography Footer */}
            <div className="z-10 space-y-3">
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white">
                {data.headline}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto line-clamp-2">
                {data.bodyCopy}
              </p>
              <div className="pt-2">
                <div
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${palette.accent}, #06B6D4)`,
                  }}
                >
                  <span>{data.callToAction}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VisualPosterCanvas.displayName = 'VisualPosterCanvas';
