export type Platform = 'google' | 'meta';
export type Framework = 'aida' | 'pas';
export type Tone = 'Professional' | 'Friendly' | 'Persuasive' | 'Urgent' | 'Creative';
export type CampaignObjective = 'Awareness' | 'Traffic' | 'Leads' | 'Sales';

export interface AdInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  platform: Platform;
  framework: Framework;
  tone: Tone;
  objective: CampaignObjective;
  variationCount: number;
  offerKeywords?: string;
}

export interface AidaBreakdown {
  attention: string;
  interest: string;
  desire: string;
  action: string;
}

export interface PasBreakdown {
  problem: string;
  agitate: string;
  solution: string;
}

export interface GoogleFields {
  headline1: string; // Target: <= 30 chars
  headline2: string; // Target: <= 30 chars
  headline3?: string; // Target: <= 30 chars
  description1: string; // Target: <= 90 chars
  description2?: string; // Target: <= 90 chars
  displayPath1?: string; // Target: <= 15 chars
  displayPath2?: string; // Target: <= 15 chars
}

export interface MetaFields {
  primaryText: string; // Recommended: ~125 chars
  headline: string; // Recommended: ~40 chars
  description?: string; // Recommended: ~30 chars
  callToAction: string;
}

export interface CharacterLimitWarning {
  field: string;
  actual: number;
  limit: number;
  exceeded: boolean;
  type: 'strict' | 'recommended';
}

export interface VisualCreativeTheme {
  bgGradient: string;
  cardBg: string;
  accent: string;
  accentGradient: string;
  accentText: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  border: string;
}

export interface VisualCreative {
  imageUrl: string;
  imagePrompt: string;
  imageProvider: string;
  category:
    | 'skincare'
    | 'coffee'
    | 'food'
    | 'beverage'
    | 'fitness'
    | 'tech'
    | 'beauty'
    | 'fashion'
    | 'general';
  layout: 'showcase' | 'immersive' | 'split' | 'bold' | 'minimal';
  colors: VisualCreativeTheme;
  headline: string;
  highlightWord?: string;
  supportingCopy: string;
  callToAction: string;
  badgeText: string;
  benefitBullets: string[];
  aspectRatio: string;
}

export interface AdVariation {
  variationNumber: number;
  label?: string;
  headline: string;
  primaryCopy: string;
  description?: string;
  callToAction: string;
  frameworkBreakdown: AidaBreakdown | PasBreakdown;
  googleFields?: GoogleFields;
  metaFields?: MetaFields;
  characterCounts: Record<string, number>;
  limitWarnings: CharacterLimitWarning[];
  visualCreative?: VisualCreative;
}

export interface GenerateApiResponse {
  success: boolean;
  data?: {
    variations: AdVariation[];
    framework: Framework;
    platform: Platform;
    modelUsed: string;
    generatedAt: string;
  };
  error?: string;
  details?: string;
}

/* =========================================================================
   Visual Ad Studio Types
   ========================================================================= */

export type AdFormat = 'square' | 'portrait' | 'story' | 'poster';
export type VisualTheme = 'modern' | 'minimal' | 'luxury' | 'playful' | 'bold' | 'elegant';
export type VisualLayout = 'split-showcase' | 'hero-card' | 'editorial-modern' | 'bold-banner' | 'minimalist-chic';

export interface ColorPaletteConfig {
  id: string;
  name: string;
  previewColor: string;
  bgDark: string;
  bgGradient: string;
  accent: string;
  accentGradient: string;
  textPrimary: string;
  textMuted: string;
  cardBg: string;
  border: string;
  badgeBg: string;
  badgeText: string;
}

export interface PosterData {
  id: string;
  brandName: string;
  tagline?: string;
  headline: string;
  subheadline?: string;
  bodyCopy: string;
  callToAction: string;
  offerBadge?: string;
  keyBenefits: string[];
  website?: string;
  phone?: string;
  imageUrl?: string;
  format: AdFormat;
  theme: VisualTheme;
  layout: VisualLayout;
  paletteId: string;
  framework: Framework;
  variationIndex: number;
}
