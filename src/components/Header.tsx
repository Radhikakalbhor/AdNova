'use client';

import React, { useState } from 'react';
import { Sparkles, BookOpen, ChevronDown, Check, Layers, Image as ImageIcon, FileText } from 'lucide-react';
import { PRESET_CAMPAIGNS, PresetCampaign } from '@/data/presets';
import { AdInput } from '@/types/ad';
import { FrameworkModal } from './FrameworkModal';

interface HeaderProps {
  onLoadPreset: (preset: AdInput) => void;
}

export function Header({ onLoadPreset }: HeaderProps) {
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const handleSelectPreset = (preset: PresetCampaign) => {
    setSelectedPresetId(preset.id);
    onLoadPreset(preset.data);
    setIsPresetsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  AdNova
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  AI Ad Generator
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden md:block">
                Turn product ideas into complete, visual ad creatives & copy.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Presets dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPresetsOpen(!isPresetsOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 transition shadow-sm"
                aria-expanded={isPresetsOpen}
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Try Sample</span> Preset
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isPresetsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsPresetsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      1-Click Sample Campaigns
                    </div>
                    {PRESET_CAMPAIGNS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 flex items-center justify-between text-xs transition"
                      >
                        <div>
                          <div className="font-medium text-slate-100">{preset.name}</div>
                          <div className="text-[11px] text-slate-400">{preset.badge}</div>
                        </div>
                        {selectedPresetId === preset.id && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Framework guide button */}
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-transparent hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
              title="AIDA & PAS Framework Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Guide</span>
            </button>
          </div>
        </div>
      </header>

      <FrameworkModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
}
