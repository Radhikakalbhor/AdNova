import { ColorPaletteConfig, VisualTheme, VisualLayout, AdFormat } from '@/types/ad';

export const COLOR_PALETTES: ColorPaletteConfig[] = [
  {
    id: 'midnight-indigo',
    name: 'Midnight Indigo',
    previewColor: '#4F46E5',
    bgDark: '#090D16',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-950',
    accent: '#6366F1',
    accentGradient: 'from-indigo-500 via-violet-500 to-cyan-400',
    textPrimary: '#FFFFFF',
    textMuted: '#94A3B8',
    cardBg: 'rgba(15, 23, 42, 0.75)',
    border: 'rgba(99, 102, 241, 0.3)',
    badgeBg: 'rgba(99, 102, 241, 0.2)',
    badgeText: '#A5B4FC',
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    previewColor: '#F43F5E',
    bgDark: '#14060A',
    bgGradient: 'from-zinc-950 via-rose-950 to-zinc-950',
    accent: '#FB7185',
    accentGradient: 'from-rose-500 via-orange-500 to-amber-400',
    textPrimary: '#FFFFFF',
    textMuted: '#FDA4AF',
    cardBg: 'rgba(28, 10, 16, 0.75)',
    border: 'rgba(244, 63, 94, 0.3)',
    badgeBg: 'rgba(244, 63, 94, 0.2)',
    badgeText: '#FECDD3',
  },
  {
    id: 'emerald-luxe',
    name: 'Emerald Luxe',
    previewColor: '#10B981',
    bgDark: '#03140E',
    bgGradient: 'from-slate-950 via-emerald-950 to-slate-950',
    accent: '#34D399',
    accentGradient: 'from-emerald-500 via-teal-400 to-amber-300',
    textPrimary: '#FFFFFF',
    textMuted: '#A7F3D0',
    cardBg: 'rgba(6, 30, 22, 0.75)',
    border: 'rgba(16, 185, 129, 0.3)',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    badgeText: '#6EE7B7',
  },
  {
    id: 'obsidian-gold',
    name: 'Obsidian Gold',
    previewColor: '#D97706',
    bgDark: '#0A0A0A',
    bgGradient: 'from-neutral-950 via-amber-950/40 to-neutral-950',
    accent: '#F59E0B',
    accentGradient: 'from-amber-400 via-yellow-300 to-amber-500',
    textPrimary: '#FFFBEB',
    textMuted: '#D1D5DB',
    cardBg: 'rgba(20, 20, 20, 0.8)',
    border: 'rgba(217, 119, 6, 0.4)',
    badgeBg: 'rgba(245, 158, 11, 0.2)',
    badgeText: '#FDE68A',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    previewColor: '#00F0FF',
    bgDark: '#0B0017',
    bgGradient: 'from-slate-950 via-purple-950 to-slate-950',
    accent: '#00F0FF',
    accentGradient: 'from-cyan-400 via-fuchsia-500 to-violet-500',
    textPrimary: '#FFFFFF',
    textMuted: '#C4B5FD',
    cardBg: 'rgba(20, 6, 38, 0.8)',
    border: 'rgba(0, 240, 255, 0.35)',
    badgeBg: 'rgba(0, 240, 255, 0.15)',
    badgeText: '#67E8F9',
  },
  {
    id: 'clean-minimal',
    name: 'Monochrome Crisp',
    previewColor: '#94A3B8',
    bgDark: '#0F172A',
    bgGradient: 'from-slate-950 via-slate-900 to-slate-950',
    accent: '#E2E8F0',
    accentGradient: 'from-slate-200 via-slate-400 to-slate-100',
    textPrimary: '#FFFFFF',
    textMuted: '#94A3B8',
    cardBg: 'rgba(30, 41, 59, 0.7)',
    border: 'rgba(148, 163, 184, 0.25)',
    badgeBg: 'rgba(148, 163, 184, 0.15)',
    badgeText: '#E2E8F0',
  },
];

export interface StockImageItem {
  id: string;
  title: string;
  category: 'saas' | 'smart-home' | 'fitness' | 'fashion' | 'food' | 'business' | 'minimal';
  url: string;
  photographer: string;
}

export const STOCK_IMAGES: StockImageItem[] = [
  // SaaS / Tech
  {
    id: 'tech-workspace',
    title: 'Modern Minimalist Workspace',
    category: 'saas',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Christopher Gower',
  },
  {
    id: 'tech-dashboard',
    title: 'Modern Software Interface',
    category: 'saas',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Luke Chesser',
  },
  {
    id: 'tech-team',
    title: 'Collaborative Tech Team',
    category: 'saas',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Annie Spratt',
  },

  // Smart Home / Gadgets
  {
    id: 'smart-interior',
    title: 'Smart Home Contemporary Living',
    category: 'smart-home',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Jason Briscoe',
  },
  {
    id: 'smart-gadget',
    title: 'Sleek Smart Device',
    category: 'smart-home',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Sebastian Scholz',
  },

  // Fitness / Wellness
  {
    id: 'fitness-workout',
    title: 'Active High Energy Workout',
    category: 'fitness',
    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Jonathan Borba',
  },
  {
    id: 'fitness-nutrition',
    title: 'Clean Fuel Nutrition & Healthy Energy',
    category: 'fitness',
    url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Brooke Lark',
  },

  // Fashion & Lifestyle
  {
    id: 'fashion-urban',
    title: 'Modern Urban Fashion',
    category: 'fashion',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Dom Hill',
  },
  {
    id: 'fashion-sneaker',
    title: 'Premium Footwear & Craftsmanship',
    category: 'fashion',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Maksim Larin',
  },

  // Food & Cafe
  {
    id: 'food-gourmet',
    title: 'Artisan Food & Fresh Ingredients',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Lily Banse',
  },
  {
    id: 'cafe-coffee',
    title: 'Specialty Crafted Coffee',
    category: 'food',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Nathana Rebouças',
  },

  // Business & Consulting
  {
    id: 'business-growth',
    title: 'High Growth Corporate Vision',
    category: 'business',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Sean Pollock',
  },
];

export function getRecommendedStockImage(productName: string, description: string): string {
  const combined = `${productName} ${description}`.toLowerCase();

  if (combined.includes('thermostat') || combined.includes('home') || combined.includes('room') || combined.includes('energy')) {
    return STOCK_IMAGES.find((i) => i.id === 'smart-interior')?.url || STOCK_IMAGES[0].url;
  }
  if (combined.includes('bar') || combined.includes('protein') || combined.includes('snack') || combined.includes('food') || combined.includes('drink')) {
    return STOCK_IMAGES.find((i) => i.id === 'fitness-nutrition')?.url || STOCK_IMAGES[0].url;
  }
  if (combined.includes('fit') || combined.includes('gym') || combined.includes('sport') || combined.includes('run')) {
    return STOCK_IMAGES.find((i) => i.id === 'fitness-workout')?.url || STOCK_IMAGES[0].url;
  }
  if (combined.includes('cloth') || combined.includes('wear') || combined.includes('fashion') || combined.includes('shoe')) {
    return STOCK_IMAGES.find((i) => i.id === 'fashion-urban')?.url || STOCK_IMAGES[0].url;
  }
  if (combined.includes('coffee') || combined.includes('cafe') || combined.includes('restaurant')) {
    return STOCK_IMAGES.find((i) => i.id === 'cafe-coffee')?.url || STOCK_IMAGES[0].url;
  }
  if (combined.includes('software') || combined.includes('saas') || combined.includes('chat') || combined.includes('sprint') || combined.includes('team') || combined.includes('app')) {
    return STOCK_IMAGES.find((i) => i.id === 'tech-workspace')?.url || STOCK_IMAGES[0].url;
  }

  return STOCK_IMAGES[0].url;
}

export const FORMAT_DIMENSIONS: Record<AdFormat, { width: number; height: number; aspectClass: string; label: string; sublabel: string }> = {
  square: {
    width: 1080,
    height: 1080,
    aspectClass: 'aspect-square',
    label: 'Square Post',
    sublabel: '1:1 • Instagram / Facebook',
  },
  portrait: {
    width: 1080,
    height: 1350,
    aspectClass: 'aspect-[4/5]',
    label: 'Portrait Feed',
    sublabel: '4:5 • Instagram High-Engagement',
  },
  story: {
    width: 1080,
    height: 1920,
    aspectClass: 'aspect-[9/16]',
    label: 'Story / Reel',
    sublabel: '9:16 • Full-Screen Mobile',
  },
  poster: {
    width: 1240,
    height: 1754,
    aspectClass: 'aspect-[1/1.414]',
    label: 'Printable Poster',
    sublabel: 'A4 Format • High Resolution',
  },
};
