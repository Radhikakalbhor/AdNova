'use client';

import React from 'react';
import { X, Sparkles, Target, Zap } from 'lucide-react';

interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FrameworkModal({ isOpen, onClose }: FrameworkModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Copywriting Frameworks Guide</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          AdNova structures generative AI prompts around two classical advertising formulas proven across digital marketing.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* AIDA Section */}
          <div className="p-5 rounded-xl bg-slate-800/60 border border-indigo-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-3">
                <Target className="w-4 h-4" />
                <span className="text-base text-white">AIDA Framework</span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Best for <strong>Meta Ads, visual feeds, new product launches</strong>, and building brand awareness.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-400 shrink-0">A - Attention:</span>
                  <span>Compelling headline or hook stopping the scroll.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-400 shrink-0">I - Interest:</span>
                  <span>Highlight a key feature or surprising benefit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-400 shrink-0">D - Desire:</span>
                  <span>Paint a picture of transformation or emotional value.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-400 shrink-0">A - Action:</span>
                  <span>Direct prompt to click, sign up, or purchase.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 text-[11px] text-indigo-300 font-medium">
              Ideal for: E-Commerce, Consumer Apps, Visual Brands
            </div>
          </div>

          {/* PAS Section */}
          <div className="p-5 rounded-xl bg-slate-800/60 border border-emerald-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
                <Zap className="w-4 h-4" />
                <span className="text-base text-white">PAS Framework</span>
              </div>
              <p className="text-xs text-slate-300 mb-4">
                Best for <strong>Google Search intent, B2B SaaS, and problem-solving services</strong>.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400 shrink-0">P - Problem:</span>
                  <span>Pinpoint the exact frustration or hurdle the user faces.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400 shrink-0">A - Agitate:</span>
                  <span>Emphasize the hidden cost, lost time, or stress of inaction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400 shrink-0">S - Solution:</span>
                  <span>Introduce your product as the direct, effortless relief.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-700/50 text-[11px] text-emerald-300 font-medium">
              Ideal for: B2B Services, Productivity Tools, High-Intent Search
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
