import { Platform, Framework } from '@/types/ad';

export interface SampleAdItem {
  id: string;
  category: 'skincare' | 'coffee' | 'food' | 'beverage' | 'fitness';
  categoryLabel: string;
  productName: string;
  headline: string;
  highlightWord?: string;
  supportingCopy: string;
  callToAction: string;
  badgeText: string;
  platform: Platform;
  framework: Framework;
  benefitBullets: string[];
  presetInput: {
    productName: string;
    productDescription: string;
    targetAudience: string;
    platform: Platform;
    framework: Framework;
    tone: 'Professional' | 'Friendly' | 'Persuasive' | 'Urgent' | 'Creative';
    objective: 'Awareness' | 'Traffic' | 'Leads' | 'Sales';
    variationCount: number;
    offerKeywords: string;
  };
  visual: {
    bgGradient: string;
    accent: string;
    accentText: string;
    badgeBg: string;
    previewImageUrl: string;
  };
}

export const SAMPLE_ADS: SampleAdItem[] = [
  {
    id: 'sample-skincare',
    category: 'skincare',
    categoryLabel: 'Skincare',
    productName: 'Gentle Milk Face Wash',
    headline: 'Calm Your Sensitive Skin Daily',
    highlightWord: 'Sensitive',
    supportingCopy: 'Silky hydrating daily cleanser formulated with soothing almond milk extract, chamomile, and vitamin E for sensitive or dry skin.',
    callToAction: 'Explore Gentle Care',
    badgeText: '✦ GENTLE DAILY CARE',
    platform: 'meta',
    framework: 'aida',
    benefitBullets: ['Soothing Almond Milk', 'Non-Drying Daily Formula'],
    presetInput: {
      productName: 'Gentle Milk Face Wash',
      productDescription: 'Silky hydrating daily cleanser formulated with almond milk extract, soothing chamomile, and vitamin E for sensitive skin.',
      targetAudience: 'Women with sensitive or dry skin looking for gentle hydration',
      platform: 'meta',
      framework: 'aida',
      tone: 'Friendly',
      objective: 'Sales',
      variationCount: 3,
      offerKeywords: 'Free travel mini with first order, dermatologically gentle',
    },
    visual: {
      bgGradient: 'from-stone-900 via-neutral-900 to-stone-950',
      accent: '#d4a373',
      accentText: '#291807',
      badgeBg: 'bg-[#d4a373] text-stone-950 border-[#c49363]',
      previewImageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 'sample-coffee',
    category: 'coffee',
    categoryLabel: 'Coffee & Cafe',
    productName: 'Velvet Crema Dark Roast',
    headline: 'Rich Crema, Bold Italian Flavor',
    highlightWord: 'Crema',
    supportingCopy: 'Slow-roasted high-altitude Arabica coffee beans delivering thick golden crema and deep notes of dark cocoa and toasted hazelnut.',
    callToAction: 'Order Fresh Roast',
    badgeText: '☕ ARTISANAL ROAST',
    platform: 'meta',
    framework: 'pas',
    benefitBullets: ['Velvety Golden Crema', 'Freshly Roasted Weekly'],
    presetInput: {
      productName: 'Velvet Crema Dark Roast',
      productDescription: 'Slow-roasted high-altitude Arabica coffee beans delivering thick golden crema and deep notes of dark chocolate and toasted hazelnuts.',
      targetAudience: 'Espresso connoisseurs and home baristas',
      platform: 'meta',
      framework: 'pas',
      tone: 'Persuasive',
      objective: 'Sales',
      variationCount: 3,
      offerKeywords: 'Free shipping on 2+ bags, roasted to order',
    },
    visual: {
      bgGradient: 'from-amber-950 via-stone-950 to-neutral-950',
      accent: '#f59e0b',
      accentText: '#451a03',
      badgeBg: 'bg-amber-500 text-stone-950 border-amber-400',
      previewImageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 'sample-food',
    category: 'food',
    categoryLabel: 'Food & Dining',
    productName: "Nonna's Wood-Fired Lasagna",
    headline: 'Comfort Food Baked To Golden Perfection',
    highlightWord: 'Perfection',
    supportingCopy: 'Traditional slow-cooked lasagna layered with rich bolognese ragù, creamy bechamel, and melted golden mozzarella.',
    callToAction: 'Order Fresh Tonight',
    badgeText: '★ 100% HOMEMADE',
    platform: 'google',
    framework: 'aida',
    benefitBullets: ['Slow-Simmered Bolognese', 'Baked Fresh To Order'],
    presetInput: {
      productName: "Nonna's Wood-Fired Lasagna",
      productDescription: 'Traditional slow-cooked beef and ricotta lasagna baked in a wood-fired oven with fresh herbs and golden melted cheese.',
      targetAudience: 'Families, foodies, and comfort food lovers looking for authentic dinner delivery',
      platform: 'google',
      framework: 'aida',
      tone: 'Persuasive',
      objective: 'Leads',
      variationCount: 3,
      offerKeywords: 'Family meal deal, free garlic bread with order',
    },
    visual: {
      bgGradient: 'from-red-950 via-stone-950 to-orange-950',
      accent: '#ea580c',
      accentText: '#ffffff',
      badgeBg: 'bg-orange-500 text-stone-950 border-orange-400',
      previewImageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 'sample-beverage',
    category: 'beverage',
    categoryLabel: 'Beverages',
    productName: 'Citrus Glacier Sparkling Soda',
    headline: 'Ice-Cold Blood Orange Refreshment',
    highlightWord: 'Ice-Cold',
    supportingCopy: 'Effervescent sparkling water infused with cold-pressed Mediterranean blood orange, crisp bubbles, and zero artificial sugar.',
    callToAction: 'Taste The Chill',
    badgeText: '❄ ICE COLD & REFRESHING',
    platform: 'meta',
    framework: 'aida',
    benefitBullets: ['Pure Cold-Pressed Citrus', 'Zero Added Sugar'],
    presetInput: {
      productName: 'Citrus Glacier Sparkling Soda',
      productDescription: 'Effervescent sparkling mineral water infused with real Mediterranean blood orange, crisp bubbles, and zero artificial sugar.',
      targetAudience: 'Health-conscious beverage drinkers and soda lovers',
      platform: 'meta',
      framework: 'aida',
      tone: 'Creative',
      objective: 'Traffic',
      variationCount: 3,
      offerKeywords: '12-pack sampler, free fridge delivery',
    },
    visual: {
      bgGradient: 'from-cyan-950 via-slate-950 to-blue-950',
      accent: '#06b6d4',
      accentText: '#083344',
      badgeBg: 'bg-cyan-400 text-slate-950 border-cyan-300',
      previewImageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 'sample-fitness',
    category: 'fitness',
    categoryLabel: 'Fitness & Fuel',
    productName: 'Zenith Clean Fuel Bars',
    headline: '16g Organic Protein. Zero Crash.',
    highlightWord: 'Protein',
    supportingCopy: 'Plant-based organic energy bar packed with 16g clean pea protein, zero refined sugar, and adaptogens for steady athletic endurance.',
    callToAction: 'Claim Your Pack',
    badgeText: '⚡ PROVEN PERFORMANCE',
    platform: 'meta',
    framework: 'pas',
    benefitBullets: ['16g Plant Protein', 'No Energy Slump'],
    presetInput: {
      productName: 'Zenith Clean Fuel Bars',
      productDescription: '100% plant-based organic energy bar packed with 16g clean pea protein, zero added sugar, and adaptogenic mushrooms for steady focus without caffeine jitters.',
      targetAudience: 'Active professionals, gym enthusiasts, marathon runners, and mindful snackers.',
      platform: 'meta',
      framework: 'pas',
      tone: 'Urgent',
      objective: 'Sales',
      variationCount: 3,
      offerKeywords: 'Variety sample pack, free expedited shipping over $35',
    },
    visual: {
      bgGradient: 'from-blue-950 via-slate-950 to-cyan-950',
      accent: '#84cc16',
      accentText: '#1a2e05',
      badgeBg: 'bg-lime-400 text-black border-lime-300',
      previewImageUrl: 'https://images.unsplash.com/photo-1622484216805-4c07d30f7c22?auto=format&fit=crop&w=800&q=80',
    },
  },
];
