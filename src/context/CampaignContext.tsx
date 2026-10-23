'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdInput, AdVariation, Platform, Framework } from '@/types/ad';

export interface GenerationData {
  variations: AdVariation[];
  framework: Framework;
  platform: Platform;
  modelUsed: string;
  generatedAt?: string;
}

interface CampaignContextType {
  currentInput: AdInput;
  setCurrentInput: React.Dispatch<React.SetStateAction<AdInput>>;
  updateCurrentInput: (fields: Partial<AdInput>) => void;
  loadPreset: (preset: AdInput) => void;
  resetInput: () => void;
  generationResult: GenerationData | null;
  setGenerationResult: (result: GenerationData | null) => void;
  favorites: number[];
  toggleFavorite: (variationNumber: number) => void;
  clearAll: () => void;
}

export const DEFAULT_CAMPAIGN_INPUT: AdInput = {
  productName: '',
  productDescription: '',
  targetAudience: '',
  platform: 'meta',
  framework: 'aida',
  tone: 'Persuasive',
  objective: 'Leads',
  variationCount: 3,
  offerKeywords: '',
};

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [currentInput, setCurrentInput] = useState<AdInput>(DEFAULT_CAMPAIGN_INPUT);
  const [generationResult, setGenerationResultState] = useState<GenerationData | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from sessionStorage once mounted
  useEffect(() => {
    try {
      const savedInput = sessionStorage.getItem('adnova_campaign_input');
      if (savedInput) {
        setCurrentInput(JSON.parse(savedInput));
      }

      const savedResult = sessionStorage.getItem('adnova_generation_result');
      if (savedResult) {
        setGenerationResultState(JSON.parse(savedResult));
      }

      const savedFavs = sessionStorage.getItem('adnova_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch (e) {
      console.warn('[CampaignContext] Could not hydrate from sessionStorage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync currentInput to sessionStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      sessionStorage.setItem('adnova_campaign_input', JSON.stringify(currentInput));
    } catch {}
  }, [currentInput, isHydrated]);

  // Set generation result and sync
  const setGenerationResult = useCallback((result: GenerationData | null) => {
    setGenerationResultState(result);
    try {
      if (result) {
        sessionStorage.setItem('adnova_generation_result', JSON.stringify(result));
      } else {
        sessionStorage.removeItem('adnova_generation_result');
      }
    } catch {}
  }, []);

  // Update partial fields
  const updateCurrentInput = useCallback((fields: Partial<AdInput>) => {
    setCurrentInput((prev) => ({ ...prev, ...fields }));
  }, []);

  // Load a preset
  const loadPreset = useCallback((preset: AdInput) => {
    setCurrentInput(preset);
  }, []);

  // Reset inputs
  const resetInput = useCallback(() => {
    setCurrentInput(DEFAULT_CAMPAIGN_INPUT);
  }, []);

  // Toggle favorite variation
  const toggleFavorite = useCallback((variationNumber: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(variationNumber)
        ? prev.filter((n) => n !== variationNumber)
        : [...prev, variationNumber];
      try {
        sessionStorage.setItem('adnova_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Clear all
  const clearAll = useCallback(() => {
    setCurrentInput(DEFAULT_CAMPAIGN_INPUT);
    setGenerationResultState(null);
    setFavorites([]);
    try {
      sessionStorage.removeItem('adnova_campaign_input');
      sessionStorage.removeItem('adnova_generation_result');
      sessionStorage.removeItem('adnova_favorites');
    } catch {}
  }, []);

  return (
    <CampaignContext.Provider
      value={{
        currentInput,
        setCurrentInput,
        updateCurrentInput,
        loadPreset,
        resetInput,
        generationResult,
        setGenerationResult,
        favorites,
        toggleFavorite,
        clearAll,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}
