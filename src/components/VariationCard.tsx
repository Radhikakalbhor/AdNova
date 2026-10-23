'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Globe,
  Share2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { AdVariation, Platform, Framework } from '@/types/ad';
import { AdCreativePoster } from './AdCreativePoster';

interface VariationCardProps {
  variation: AdVariation;
  platform: Platform;
  framework: Framework;
  productName: string;
}

export function VariationCard({
  variation,
  platform,
  framework,
  productName,
}: VariationCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'creative' | 'copy'>('creative');

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const copyEntireVariation = () => {
    let formatted = `=== AdNova Variation #${variation.variationNumber} (${variation.label || 'Default'}) ===\n`;
    formatted += `Platform: ${platform === 'google' ? 'Google Ads' : 'Meta Ads'}\n`;
    formatted += `Framework: ${framework.toUpperCase()}\n\n`;

    if (platform === 'google' && variation.googleFields) {
      formatted += `[HEADLINES]\n`;
      formatted += `Headline 1: ${variation.googleFields.headline1}\n`;
      formatted += `Headline 2: ${variation.googleFields.headline2}\n`;
      if (variation.googleFields.headline3) {
        formatted += `Headline 3: ${variation.googleFields.headline3}\n`;
      }
      formatted += `\n[DESCRIPTIONS]\n`;
      formatted += `Description 1: ${variation.googleFields.description1}\n`;
      if (variation.googleFields.description2) {
        formatted += `Description 2: ${variation.googleFields.description2}\n`;
      }
      if (variation.googleFields.displayPath1) {
        formatted += `Display Path: /${variation.googleFields.displayPath1}${
          variation.googleFields.displayPath2 ? `/${variation.googleFields.displayPath2}` : ''
        }\n`;
      }
    } else if (platform === 'meta' && variation.metaFields) {
      formatted += `[PRIMARY TEXT]\n${variation.metaFields.primaryText}\n\n`;
      formatted += `[HEADLINE]\n${variation.metaFields.headline}\n\n`;
      if (variation.metaFields.description) {
        formatted += `[DESCRIPTION]\n${variation.metaFields.description}\n\n`;
      }
      formatted += `[CALL TO ACTION]\n${variation.metaFields.callToAction}\n`;
    } else {
      formatted += `Headline: ${variation.headline}\n`;
      formatted += `Primary Copy: ${variation.primaryCopy}\n`;
      if (variation.description) formatted += `Description: ${variation.description}\n`;
      formatted += `CTA: ${variation.callToAction}\n`;
    }

    formatted += `\n[${framework.toUpperCase()} BREAKDOWN]\n`;
    const fb: any = variation.frameworkBreakdown;
    if (framework === 'aida') {
      formatted += `• Attention: ${fb.attention || ''}\n`;
      formatted += `• Interest: ${fb.interest || ''}\n`;
      formatted += `• Desire: ${fb.desire || ''}\n`;
      formatted += `• Action: ${fb.action || ''}\n`;
    } else {
      formatted += `• Problem: ${fb.problem || ''}\n`;
      formatted += `• Agitate: ${fb.agitate || ''}\n`;
      formatted += `• Solution: ${fb.solution || ''}\n`;
    }

    copyToClipboard(formatted, 'entire');
  };

  const isAida = framework === 'aida';
  const fb: any = variation.frameworkBreakdown || {};

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden transition hover:border-slate-700/80">
      {/* Card Header */}
      <div className="px-5 py-4 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs">
            #{variation.variationNumber}
          </span>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              {variation.label || `Variation ${variation.variationNumber}`}
            </h3>
            <span className="text-[11px] text-slate-400">
              {platform === 'google' ? 'Google Ads Creative' : 'Meta Social Feed Creative'}
            </span>
          </div>
        </div>

        {/* Tab Switcher: Visual Creative vs Copy Breakdown */}
        <div className="no-print flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('creative')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeTab === 'creative'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Ad</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('copy')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeTab === 'copy'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Copy & Limits</span>
          </button>
        </div>

        {/* Copy All Button */}
        <button
          type="button"
          onClick={copyEntireVariation}
          className={`no-print flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            copiedKey === 'entire'
              ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/70'
          }`}
        >
          {copiedKey === 'entire' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Text</span>
            </>
          )}
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Visual Creative Tab View */}
        {activeTab === 'creative' && variation.visualCreative ? (
          <div className="space-y-3">
            <AdCreativePoster
              creative={variation.visualCreative}
              productName={productName}
              platform={platform}
              variationNumber={variation.variationNumber}
            />
            {platform === 'google' && (
              <div className="no-print p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <span>Google Display banner creative. Switch to <strong>Copy & Limits</strong> tab to view Google Search Ad text & strict character limits.</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('copy')}
                  className="text-cyan-400 underline hover:text-cyan-300 font-medium"
                >
                  View Search Copy
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Copy & Framework Breakdown View (Preserved completely) */
          <>
        {/* Visual Platform Mockup Preview */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span className="flex items-center gap-1.5">
              {platform === 'google' ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-sky-400" /> Google Search Preview
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-indigo-400" /> Meta Feed Preview
                </>
              )}
            </span>
            <span className="text-slate-500 text-[10px] lowercase font-normal">
              simulated visual rendering
            </span>
          </div>

          {platform === 'google' ? (
            /* Google Search Ad Preview */
            <div className="space-y-1.5 font-sans">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  Sponsored
                </span>
                <span className="text-slate-400 text-xs truncate">
                  https://www.{productName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'example'}.com
                  {variation.googleFields?.displayPath1 ? `/${variation.googleFields.displayPath1}` : ''}
                  {variation.googleFields?.displayPath2 ? `/${variation.googleFields.displayPath2}` : ''}
                </span>
              </div>
              <h4 className="text-blue-400 hover:underline cursor-pointer text-base sm:text-lg font-medium leading-snug">
                {variation.googleFields?.headline1 || variation.headline} |{' '}
                {variation.googleFields?.headline2 || 'Official Site'}
                {variation.googleFields?.headline3 ? ` | ${variation.googleFields.headline3}` : ''}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {variation.googleFields?.description1 || variation.primaryCopy}{' '}
                {variation.googleFields?.description2 || variation.description || ''}
              </p>
            </div>
          ) : (
            /* Meta Feed Post Preview */
            <div className="space-y-3 font-sans max-w-lg mx-auto bg-slate-900/90 rounded-lg p-3.5 border border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-xs font-bold text-white">
                  {productName.slice(0, 2).toUpperCase() || 'AD'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                    {productName || 'Your Brand'}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    Sponsored • <Globe className="w-2.5 h-2.5 inline" />
                  </div>
                </div>
              </div>

              {/* Primary Text */}
              <p className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                {variation.metaFields?.primaryText || variation.primaryCopy}
              </p>

              {/* Media Card Placeholder */}
              <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                <div className="h-28 sm:h-36 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 flex flex-col items-center justify-center p-4 text-center">
                  <Sparkles className="w-6 h-6 text-indigo-400 mb-1 opacity-70" />
                  <span className="text-xs text-slate-400 font-medium">
                    Creative Ad Placement
                  </span>
                  <span className="text-[11px] text-slate-500">
                    1080 × 1080 Feed Image / Video Asset
                  </span>
                </div>
                <div className="p-3 bg-slate-900 flex items-center justify-between gap-2 border-t border-slate-800/60">
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider truncate">
                      {productName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'brand'}.com
                    </div>
                    <div className="text-xs font-bold text-slate-100 truncate">
                      {variation.metaFields?.headline || variation.headline}
                    </div>
                    {(variation.metaFields?.description || variation.description) && (
                      <div className="text-[11px] text-slate-400 truncate">
                        {variation.metaFields?.description || variation.description}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white shrink-0"
                  >
                    {variation.metaFields?.callToAction || variation.callToAction || 'Learn More'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Framework Breakdown Visualizer */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isAida ? 'bg-indigo-400' : 'bg-emerald-400'}`} />
              {isAida ? 'AIDA Framework Breakdown' : 'PAS Framework Breakdown'}
            </span>
          </div>

          {isAida ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40">
                <span className="font-bold text-indigo-400 block mb-0.5">Attention (Hook):</span>
                <p className="text-slate-300 text-[11px]">{fb.attention || 'N/A'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-900/40">
                <span className="font-bold text-sky-400 block mb-0.5">Interest (Features/Value):</span>
                <p className="text-slate-300 text-[11px]">{fb.interest || 'N/A'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-violet-950/30 border border-violet-900/40">
                <span className="font-bold text-violet-400 block mb-0.5">Desire (Emotional Appeal):</span>
                <p className="text-slate-300 text-[11px]">{fb.desire || 'N/A'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40">
                <span className="font-bold text-amber-400 block mb-0.5">Action (Call to Action):</span>
                <p className="text-slate-300 text-[11px]">{fb.action || 'N/A'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40">
                <span className="font-bold text-rose-400 block mb-0.5">Problem:</span>
                <p className="text-slate-300 text-[11px]">{fb.problem || 'N/A'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40">
                <span className="font-bold text-amber-400 block mb-0.5">Agitate:</span>
                <p className="text-slate-300 text-[11px]">{fb.agitate || 'N/A'}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                <span className="font-bold text-emerald-400 block mb-0.5">Solution:</span>
                <p className="text-slate-300 text-[11px]">{fb.solution || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Copy Fields with Copy Buttons and Character Counters */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Copy Fields & Limits
          </h4>

          {platform === 'google' && variation.googleFields ? (
            <div className="space-y-2">
              {/* Headline 1 */}
              <CopyFieldRow
                label="Headline 1"
                text={variation.googleFields.headline1}
                limit={30}
                limitType="strict"
                fieldKey={`h1-${variation.variationNumber}`}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
              />
              {/* Headline 2 */}
              <CopyFieldRow
                label="Headline 2"
                text={variation.googleFields.headline2}
                limit={30}
                limitType="strict"
                fieldKey={`h2-${variation.variationNumber}`}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
              />
              {/* Headline 3 */}
              {variation.googleFields.headline3 && (
                <CopyFieldRow
                  label="Headline 3"
                  text={variation.googleFields.headline3}
                  limit={30}
                  limitType="strict"
                  fieldKey={`h3-${variation.variationNumber}`}
                  copiedKey={copiedKey}
                  onCopy={copyToClipboard}
                />
              )}
              {/* Description 1 */}
              <CopyFieldRow
                label="Description 1"
                text={variation.googleFields.description1}
                limit={90}
                limitType="strict"
                fieldKey={`d1-${variation.variationNumber}`}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
              />
              {/* Description 2 */}
              {variation.googleFields.description2 && (
                <CopyFieldRow
                  label="Description 2"
                  text={variation.googleFields.description2}
                  limit={90}
                  limitType="strict"
                  fieldKey={`d2-${variation.variationNumber}`}
                  copiedKey={copiedKey}
                  onCopy={copyToClipboard}
                />
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Primary Text */}
              <CopyFieldRow
                label="Primary Text"
                text={variation.metaFields?.primaryText || variation.primaryCopy}
                limit={125}
                limitType="recommended"
                fieldKey={`pt-${variation.variationNumber}`}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
                multiline
              />
              {/* Meta Headline */}
              <CopyFieldRow
                label="Headline"
                text={variation.metaFields?.headline || variation.headline}
                limit={40}
                limitType="recommended"
                fieldKey={`mh-${variation.variationNumber}`}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
              />
              {/* Meta Description */}
              {(variation.metaFields?.description || variation.description) && (
                <CopyFieldRow
                  label="Link Description"
                  text={variation.metaFields?.description || variation.description || ''}
                  limit={30}
                  limitType="recommended"
                  fieldKey={`md-${variation.variationNumber}`}
                  copiedKey={copiedKey}
                  onCopy={copyToClipboard}
                />
              )}
              {/* Meta CTA */}
              <CopyFieldRow
                label="Call to Action (Button)"
                text={variation.metaFields?.callToAction || variation.callToAction}
                limit={20}
                limitType="recommended"
                fieldKey={`cta-${variation.variationNumber}`}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
              />
            </div>
          )}
        </div>

        {/* Warning Notices if limits exceeded */}
        {variation.limitWarnings && variation.limitWarnings.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Platform Length Advisory</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1">
              {variation.limitWarnings.map((w, idx) => (
                <li key={idx}>
                  <strong>{w.field}</strong>: {w.actual} chars ({w.actual - w.limit} over {w.type} limit of {w.limit})
                </li>
              ))}
            </ul>
          </div>
        )}
        </>
      )}
      </div>
    </div>
  );
}

interface CopyFieldRowProps {
  label: string;
  text: string;
  limit: number;
  limitType: 'strict' | 'recommended';
  fieldKey: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
  multiline?: boolean;
}

function CopyFieldRow({
  label,
  text,
  limit,
  limitType,
  fieldKey,
  copiedKey,
  onCopy,
  multiline = false,
}: CopyFieldRowProps) {
  const charCount = text.length;
  const isOver = charCount > limit;
  const isCopied = copiedKey === fieldKey;

  return (
    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col gap-1.5 hover:border-slate-700 transition">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          {/* Character counter badge */}
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isOver
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {charCount}/{limit} {limitType === 'recommended' ? 'rec' : 'max'}
            {isOver && ' ⚠️'}
          </span>

          {/* Copy button */}
          <button
            type="button"
            onClick={() => onCopy(text, fieldKey)}
            className={`p-1.5 rounded-md transition ${
              isCopied
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={`Copy ${label}`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      <div
        className={`text-xs text-slate-100 font-sans ${
          multiline ? 'whitespace-pre-line' : ''
        }`}
      >
        {text}
      </div>
    </div>
  );
}
