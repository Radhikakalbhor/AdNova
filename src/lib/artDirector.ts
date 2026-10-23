import { Platform } from '@/types/ad';

export type AdCategory =
  | 'skincare'
  | 'coffee'
  | 'food'
  | 'beverage'
  | 'fitness'
  | 'tech'
  | 'beauty'
  | 'fashion'
  | 'general';

export type VisualLayout = 'showcase' | 'immersive' | 'split' | 'bold' | 'minimal';

export interface ThemeColors {
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

export interface GeneratedVisualCreative {
  imageUrl: string;
  imagePrompt: string;
  imageProvider: string;
  category: AdCategory;
  layout: VisualLayout;
  colors: ThemeColors;
  headline: string;
  highlightWord?: string;
  supportingCopy: string;
  callToAction: string;
  badgeText: string;
  benefitBullets: string[];
  aspectRatio: string;
}

// Infer category from product name, description, and keywords with high specificity
export function inferAdCategory(name: string, description: string, keywords?: string): AdCategory {
  const text = `${name} ${description} ${keywords || ''}`.toLowerCase();

  // 1. Skincare (milk face wash, cleansers, creams, serums, moisturizers)
  if (
    /\b(milk face wash|face wash|cleanser|cleansing|skincare|skin care|moisturizer|face cream|serum|lotion|toner|sunscreen|spf|facial wash|milk wash|hydrating wash|soothing cream|aloe gel|clay mask|eye cream|acne wash|dermatology|dewy skin|sensitive skin)\b/.test(
      text
    )
  ) {
    return 'skincare';
  }

  // 2. Coffee & Espresso (beans, crema, roasts, cafe, latte, cold brew)
  if (
    /\b(coffee|espresso|latte|cappuccino|cold brew|macchiato|roast|roasted beans|arabica|robusta|barista|cafe|french press|drip coffee|crema|mocha|filter coffee|roastery)\b/.test(
      text
    )
  ) {
    return 'coffee';
  }

  // 3. Food & Culinary (homemade dishes, baked goods, meals, pasta, artisan food)
  if (
    /\b(food|meal|lasagna|pasta|pizza|burger|snack|cook|chef|kitchen|bakery|restaurant|dessert|tasty|delicious|recipe|gourmet|bread|cake|cheese|tacos|sauce|focaccia|sourdough|baking|cookies|grill|bbq|curry|salad|artisan food|biscuit|pastry)\b/.test(
      text
    )
  ) {
    return 'food';
  }

  // 4. Beverages (non-coffee drinks, juices, sodas, cocktails, kombucha)
  if (
    /\b(beverage|drink|juice|smoothie|tea|cocktail|beer|wine|soda|energy drink|kombucha|cider|water|cola|refreshment|mocktail|iced tea|lemonade|sparkling water|spritzer)\b/.test(
      text
    )
  ) {
    return 'beverage';
  }

  // 5. Fitness & Sports (gym, workout, protein, supplements)
  if (
    /\b(fitness|gym|workout|exercise|training|running|athlete|muscle|protein|wellness|sport|cardio|weight|crossfit|yoga|activewear|supplement|creatine|preworkout)\b/.test(
      text
    )
  ) {
    return 'fitness';
  }

  // 6. Technology & SaaS (software, apps, cloud, devices)
  if (
    /\b(software|app|saas|ai|cloud|api|platform|code|developer|database|automation|tech|digital|analytics|crm|workflow|cyber|hardware|headphones|gadget|smart watch)\b/.test(
      text
    )
  ) {
    return 'tech';
  }

  // 7. Beauty & Cosmetics (makeup, hair, fragrance)
  if (
    /\b(beauty|cosmetic|makeup|lipstick|mascara|foundation|blush|hair|shampoo|conditioner|spa|perfume|fragrance|scent|cologne|nail polish)\b/.test(
      text
    )
  ) {
    return 'beauty';
  }

  // 8. Fashion & Apparel (clothing, footwear, luxury accessories)
  if (
    /\b(fashion|clothing|apparel|sneakers|shoes|shirt|jacket|dress|watch|jewelry|luxury|streetwear|handbag|denim|boots|suit)\b/.test(
      text
    )
  ) {
    return 'fashion';
  }

  return 'general';
}

// Generate photorealistic, dynamic, product-specific commercial advertising prompts
export function createAiImagePrompt(
  category: AdCategory,
  productName: string,
  description: string,
  variationIndex: number
): string {
  const cleanName = productName.replace(/[^\w\s]/g, '').trim() || 'Product';
  const descSnippet = description.slice(0, 90).replace(/[^\w\s]/g, ' ').trim();

  // 1. Skincare (Focus: product bottle, creamy milk textures, soft water splashes, botanical ingredients, clean pastel spa tones)
  const skincareAngles = [
    `Award-winning commercial product photography of an elegant minimalist ${cleanName} bottle on a smooth polished travertine pedestal, encircled by graceful creamy milk splashes, translucent crystal water ripples, fresh green botanical leaves, warm morning spa sunlight with soft caustics, luxurious clean cosmetics packaging, Hasselblad 8k`,
    `Close-up macro commercial beauty editorial of silky smooth white cream and milk cleanser swirls, delicate morning dew drops on fresh green eucalyptus leaves, soft warm natural bathroom lighting, soothing pastel ivory and beige aesthetic, clean skincare campaign, 8k`,
    `High-end luxury skincare advertisement, ${cleanName} pump bottle centered on floating slate plate in calm crystal water with subtle creamy swirls, soft ethereal rim lighting, botanical spa atmosphere, 8k`,
    `Clean editorial cosmetics photography of ${cleanName} surrounded by natural organic botanical ingredients, fresh green aloe vera and gentle splashing milk droplets, radiant diffuse studio lighting, luxurious pastel beauty campaign, 8k`,
    `Dynamic high-speed commercial skincare shoot, ${cleanName} cosmetic bottle with energetic gentle water and milk crown splash, warm natural window glow, fresh clean skin feeling, ultra-sharp commercial photography, 8k`,
  ];

  // 2. Coffee (Focus: ceramic cups, whole roasted coffee beans, thick golden crema, latte art, warm dark roast tones)
  const coffeeAngles = [
    `Award-winning commercial coffee advertisement, artisanal ceramic cup filled with hot fresh ${cleanName} showing thick velvety golden crema art, steam rising gently, surrounded by scattered freshly roasted dark coffee beans and cinnamon stick on dark rustic wood, warm cozy morning sunlight, Hasselblad 8k`,
    `High-speed commercial action photography, hot freshly brewed espresso pouring into glass cup with cascading crema layers separating, glossy roasted coffee beans floating mid-air, moody cafe background, cinematic warm golden lighting, 8k`,
    `Commercial beverage photography of tall glass of iced ${cleanName} with crystal clear ice cubes, swirling cold brew and rich creamy milk clouds, condensation on glass, dark amber tones, crisp advertising visual, 8k`,
    `Rustic artisanal roastery advertisement, burlap sack overflowing with whole roasted coffee beans, elegant cup of ${cleanName}, warm wooden table, soft morning window light, rich bronze and mocha palette, 8k`,
    `Sleek modern minimalist espresso bar, matte cup of steaming ${cleanName} with golden crema, polished dark slate counter, dramatic studio rim light, premium lifestyle magazine visual, 8k`,
  ];

  // 3. Food (Focus: appetizing food, fresh ingredients, steam, warm culinary tones)
  const foodAngles = [
    `Mouthwatering commercial food advertisement of freshly baked hot ${cleanName}, golden melted texture, steam rising gracefully, garnished with chopped fresh herbs and olive oil drizzle, dark slate presentation, appetizing warm studio lighting, 8k`,
    `Dynamic high-speed culinary action photography of ${cleanName}, flying fresh basil leaves, cracked black peppercorns and cherry tomatoes in mid-air, rustic gourmet kitchen setting, Hasselblad commercial food shoot, 8k`,
    `Appetizing artisanal ${cleanName} served on warm ceramic plate, steam curls rising, rich warm appetizing colors, scattered roasted garlic and sea salt crystals, cinematic restaurant advertising visual, 8k`,
    `Rustic comfort food photography of freshly prepared ${cleanName} in hot cast iron skillet or baking dish, golden crust, bubbling warm sauce, cozy dining atmosphere, Hasselblad 8k`,
    `Fine dining commercial magazine cover photography of ${cleanName}, delicate microgreens garnish, dramatic warm overhead rim light, rich savory textures, 8k`,
  ];

  // 4. Beverage (Focus: ice-cold, vibrant splashes, fruits, effervescent bubbles)
  const beverageAngles = [
    `Ice-cold bottle of ${cleanName} with explosive crystal clear water splash, floating lime wedges, fresh mint leaves, condensation droplets, high-speed commercial beverage photography, 8k`,
    `Refreshing ${cleanName} pouring with dynamic liquid swirl, flying ice cubes, effervescent bubbles, bold saturated studio lighting, 8k`,
    `Frosty condensation on can or bottle of ${cleanName}, vibrant fruit explosion splash, dynamic motion freeze, crisp advertising visual, 8k`,
    `Artisan beverage bottle of ${cleanName} centered in dramatic colorful liquid wave, floating fresh fruit slices, commercial billboard quality, 8k`,
    `Vibrant cocktail or iced beverage of ${cleanName} with dynamic splash crest, glowing rim light, energetic summer commercial campaign, 8k`,
  ];

  // 5. Fitness (Focus: athletic powerhouse, kinetic lighting, chalk dust)
  const fitnessAngles = [
    `Dynamic athletic hero product of ${cleanName} with energetic chalk dust explosion, electric neon blue and orange rim lighting, high-contrast sports commercial, 8k`,
    `High-octane training visual with kinetic motion streaks, dramatic sweat and water spray in mid-air, powerhouse athletic aesthetic, 8k`,
    `Bold product centered in dark industrial gym, dramatic volumetric laser lights, high performance advertising photography, 8k`,
    `Kinetic fitness advertisement, ${cleanName} centered in front of blurred modern track arena, golden athletic rim light, 8k`,
    `Minimalist powerhouse workout visual, ${cleanName} on textured rubber gym mat with dumbbell silhouettes, crisp blue LED backlighting, 8k`,
  ];

  // 6. Tech & SaaS (Focus: futuristic obsidian, floating UI, laser neon)
  const techAngles = [
    `Futuristic sleek device displaying ${cleanName} interface with floating holographic charts and glowing digital particle clouds, dark obsidian studio, 8k`,
    `Isometric modern digital workspace with laser neon accents, clean geometric floating UI elements, 3D commercial render, 8k`,
    `Sleek minimalist hardware with cyan and magenta ambient reflections, cutting-edge tech commercial campaign, 8k`,
    `Clean modern workstation setup featuring ${cleanName} on ultra-wide monitor, warm ambient desk lamp, productivity lifestyle, 8k`,
    `Abstract high-tech visualization of speed and connectivity, glowing data streams surrounding ${cleanName}, dark obsidian backdrop, 8k`,
  ];

  // 7. Beauty & Cosmetics (Focus: luxury perfume, lipstick, skincare vanity)
  const beautyAngles = [
    `Luxury cosmetic product ${cleanName} resting in rippling crystal water with floating botanical flower petals, golden hour sunbeams, 8k`,
    `Clean organic skincare cosmetic on natural textured travertine stone, gentle water splash, soft luminous commercial cosmetics lighting, 8k`,
    `Radiant beauty aesthetic with delicate floral botanicals and morning dew droplets, high-fashion beauty editorial visual, 8k`,
    `Luxury vanity table visual featuring ${cleanName}, warm backlit mirror reflection, soft silk cloth drape, high-end editorial, 8k`,
    `Minimalist studio beauty campaign, ${cleanName} on brushed champagne gold pedestal with soft diffuse shadows, 8k`,
  ];

  // 8. Fashion (Focus: editorial styling, gold accents, clean shadows)
  const fashionAngles = [
    `High-fashion editorial showcase of ${cleanName}, dramatic studio lighting, clean architectural shadows, luxury billboard aesthetic, 8k`,
    `Urban streetwear commercial visual featuring ${cleanName}, vibrant golden hour city reflections, modern high-contrast styling, 8k`,
    `Minimalist luxury product display of ${cleanName} on polished concrete pedestal, soft ambient spotlighting, 8k`,
    `Dynamic fabric flow and movement surrounding ${cleanName}, cinematic rim lighting, high-end catalog quality, 8k`,
    `Classic tailored fashion campaign, rich textures, deep shadows, premium luxury brand visual, 8k`,
  ];

  // 9. General
  const generalAngles = [
    `Vibrant high-energy commercial advertising hero shot of ${cleanName}, dynamic particles, bold complementary studio lighting, award-winning campaign visual, 8k`,
    `Striking modern product photography of ${cleanName}, clean bold shadows, floating design elements, premium commercial billboard, 8k`,
    `Warm lifestyle commercial photograph featuring ${cleanName} in everyday use, natural soft lighting, premium consumer brand aesthetic, 8k`,
    `High-contrast editorial product visual of ${cleanName} centered on minimalist stone pedestal, soft diffuse studio lights, 8k`,
    `Dynamic commercial campaign visual of ${cleanName}, complementary colored smoke and ambient particle glow, 8k`,
  ];

  switch (category) {
    case 'skincare':
      return skincareAngles[variationIndex % skincareAngles.length];
    case 'coffee':
      return coffeeAngles[variationIndex % coffeeAngles.length];
    case 'food':
      return foodAngles[variationIndex % foodAngles.length];
    case 'beverage':
      return beverageAngles[variationIndex % beverageAngles.length];
    case 'fitness':
      return fitnessAngles[variationIndex % fitnessAngles.length];
    case 'tech':
      return techAngles[variationIndex % techAngles.length];
    case 'beauty':
      return beautyAngles[variationIndex % beautyAngles.length];
    case 'fashion':
      return fashionAngles[variationIndex % fashionAngles.length];
    default:
      return generalAngles[variationIndex % generalAngles.length];
  }
}

// Saturated, High-Contrast, Product-Tailored Advertising Color Palettes
// Each category contains 5 genuinely distinct, harmonious palettes for variations 1-5
const CATEGORY_PALETTES: Record<AdCategory, ThemeColors[]> = {
  skincare: [
    {
      bgGradient: 'from-stone-900 via-neutral-900 to-stone-950',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#d4a373', // Warm Cream & Almond
      accentGradient: 'from-amber-200 to-orange-300',
      accentText: '#291807',
      textPrimary: '#ffffff',
      textSecondary: '#f5ebe0',
      badgeBg: 'bg-[#d4a373] text-stone-950 border-[#c49363]',
      border: 'border-[#d4a373]/40',
    },
    {
      bgGradient: 'from-emerald-950 via-stone-950 to-neutral-950',
      cardBg: 'rgba(20, 28, 24, 0.94)',
      accent: '#84a98c', // Botanical Sage
      accentGradient: 'from-emerald-300 to-teal-400',
      accentText: '#0d2818',
      textPrimary: '#ffffff',
      textSecondary: '#cad2c5',
      badgeBg: 'bg-[#84a98c] text-stone-950 border-[#52796f]',
      border: 'border-[#84a98c]/40',
    },
    {
      bgGradient: 'from-rose-950 via-stone-950 to-neutral-950',
      cardBg: 'rgba(28, 20, 24, 0.94)',
      accent: '#f4a261', // Soft Rose Gold
      accentGradient: 'from-rose-300 to-amber-300',
      accentText: '#3a1700',
      textPrimary: '#ffffff',
      textSecondary: '#ffe5d9',
      badgeBg: 'bg-[#f4a261] text-stone-950 border-[#e76f51]',
      border: 'border-[#f4a261]/40',
    },
    {
      bgGradient: 'from-neutral-950 via-stone-900 to-zinc-950',
      cardBg: 'rgba(24, 24, 27, 0.94)',
      accent: '#e29578', // Warm Terracotta Glow
      accentGradient: 'from-orange-200 to-rose-300',
      accentText: '#2e1208',
      textPrimary: '#ffffff',
      textSecondary: '#ffddd2',
      badgeBg: 'bg-[#e29578] text-stone-950 border-[#d48366]',
      border: 'border-[#e29578]/40',
    },
    {
      bgGradient: 'from-slate-950 via-indigo-950 to-neutral-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#a29bfe', // Serene Lavender Dew
      accentGradient: 'from-indigo-200 to-purple-300',
      accentText: '#1b1b3a',
      textPrimary: '#ffffff',
      textSecondary: '#e0e7ff',
      badgeBg: 'bg-[#a29bfe] text-slate-950 border-[#8c82fc]',
      border: 'border-[#a29bfe]/40',
    },
  ],
  coffee: [
    {
      bgGradient: 'from-amber-950 via-stone-950 to-neutral-950',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#f59e0b', // Golden Crema
      accentGradient: 'from-amber-400 to-yellow-500',
      accentText: '#451a03',
      textPrimary: '#ffffff',
      textSecondary: '#fef3c7',
      badgeBg: 'bg-amber-500 text-stone-950 border-amber-400',
      border: 'border-amber-500/40',
    },
    {
      bgGradient: 'from-stone-950 via-neutral-950 to-amber-950',
      cardBg: 'rgba(24, 24, 27, 0.94)',
      accent: '#ea580c', // Dark Roasted Cinnamon
      accentGradient: 'from-orange-500 to-amber-600',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#ffedd5',
      badgeBg: 'bg-orange-500 text-white border-orange-400',
      border: 'border-orange-500/40',
    },
    {
      bgGradient: 'from-neutral-950 via-amber-950 to-stone-950',
      cardBg: 'rgba(23, 23, 23, 0.94)',
      accent: '#d97706', // Velvety Caramel Macchiato
      accentGradient: 'from-amber-300 to-orange-400',
      accentText: '#3b1c03',
      textPrimary: '#ffffff',
      textSecondary: '#fef08a',
      badgeBg: 'bg-amber-400 text-stone-950 border-amber-300',
      border: 'border-amber-400/40',
    },
    {
      bgGradient: 'from-stone-950 via-zinc-950 to-stone-900',
      cardBg: 'rgba(20, 20, 22, 0.94)',
      accent: '#fbbf24', // Cold Brew Bronze
      accentGradient: 'from-yellow-400 to-amber-500',
      accentText: '#3c2205',
      textPrimary: '#ffffff',
      textSecondary: '#fef3c7',
      badgeBg: 'bg-yellow-400 text-stone-950 border-yellow-300',
      border: 'border-yellow-400/40',
    },
    {
      bgGradient: 'from-orange-950 via-stone-950 to-neutral-950',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#f97316', // Artisanal Roastery Copper
      accentGradient: 'from-orange-400 to-red-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#fed7aa',
      badgeBg: 'bg-orange-500 text-white border-orange-400',
      border: 'border-orange-500/40',
    },
  ],
  food: [
    {
      bgGradient: 'from-amber-950 via-stone-950 to-orange-950',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#f59e0b', // Saffron Mustard Gold
      accentGradient: 'from-amber-400 to-orange-500',
      accentText: '#451a03',
      textPrimary: '#ffffff',
      textSecondary: '#fed7aa',
      badgeBg: 'bg-amber-500 text-stone-950 border-amber-400',
      border: 'border-amber-500/40',
    },
    {
      bgGradient: 'from-red-950 via-zinc-950 to-orange-950',
      cardBg: 'rgba(24, 24, 27, 0.94)',
      accent: '#ea580c', // Fiery Paprika Red
      accentGradient: 'from-orange-500 to-red-600',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#ffedd5',
      badgeBg: 'bg-orange-500 text-stone-950 border-orange-400',
      border: 'border-orange-500/40',
    },
    {
      bgGradient: 'from-stone-950 via-emerald-950 to-amber-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#10b981', // Fresh Basil Emerald
      accentGradient: 'from-emerald-400 to-teal-500',
      accentText: '#022c22',
      textPrimary: '#ffffff',
      textSecondary: '#d1fae5',
      badgeBg: 'bg-emerald-500 text-stone-950 border-emerald-400',
      border: 'border-emerald-500/40',
    },
    {
      bgGradient: 'from-neutral-950 via-amber-950 to-stone-900',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#eab308', // Warm Golden Sourdough
      accentGradient: 'from-yellow-400 to-amber-500',
      accentText: '#422006',
      textPrimary: '#ffffff',
      textSecondary: '#fef08a',
      badgeBg: 'bg-yellow-400 text-stone-950 border-yellow-300',
      border: 'border-yellow-400/40',
    },
    {
      bgGradient: 'from-stone-950 via-zinc-950 to-neutral-950',
      cardBg: 'rgba(24, 24, 27, 0.94)',
      accent: '#f97316', // Searing Gourmet Char
      accentGradient: 'from-orange-400 to-red-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#fed7aa',
      badgeBg: 'bg-orange-500 text-stone-950 border-orange-400',
      border: 'border-orange-500/40',
    },
  ],
  beverage: [
    {
      bgGradient: 'from-cyan-950 via-slate-950 to-blue-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#06b6d4', // Glacier Cyan
      accentGradient: 'from-cyan-400 to-blue-500',
      accentText: '#083344',
      textPrimary: '#ffffff',
      textSecondary: '#cffafe',
      badgeBg: 'bg-cyan-400 text-slate-950 border-cyan-300',
      border: 'border-cyan-500/40',
    },
    {
      bgGradient: 'from-emerald-950 via-teal-950 to-cyan-950',
      cardBg: 'rgba(13, 27, 30, 0.94)',
      accent: '#10b981', // Citrus Lime
      accentGradient: 'from-lime-400 to-emerald-500',
      accentText: '#064e3b',
      textPrimary: '#ffffff',
      textSecondary: '#d1fae5',
      badgeBg: 'bg-lime-400 text-stone-950 border-lime-300',
      border: 'border-lime-500/40',
    },
    {
      bgGradient: 'from-orange-950 via-slate-950 to-red-950',
      cardBg: 'rgba(23, 23, 23, 0.94)',
      accent: '#f97316', // Vibrant Blood Orange
      accentGradient: 'from-orange-400 to-amber-500',
      accentText: '#431407',
      textPrimary: '#ffffff',
      textSecondary: '#ffedd5',
      badgeBg: 'bg-orange-500 text-stone-950 border-orange-400',
      border: 'border-orange-500/40',
    },
    {
      bgGradient: 'from-fuchsia-950 via-slate-950 to-purple-950',
      cardBg: 'rgba(24, 24, 27, 0.94)',
      accent: '#d946ef', // Wild Berry Fizz
      accentGradient: 'from-fuchsia-400 to-pink-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#fae8ff',
      badgeBg: 'bg-fuchsia-500 text-white border-fuchsia-400',
      border: 'border-fuchsia-500/40',
    },
    {
      bgGradient: 'from-teal-950 via-slate-950 to-emerald-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#14b8a6', // Tropical Mint Wave
      accentGradient: 'from-teal-300 to-cyan-400',
      accentText: '#042f2e',
      textPrimary: '#ffffff',
      textSecondary: '#ccfbf1',
      badgeBg: 'bg-teal-400 text-stone-950 border-teal-300',
      border: 'border-teal-400/40',
    },
  ],
  fitness: [
    {
      bgGradient: 'from-blue-950 via-slate-950 to-cyan-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#06b6d4', // Kinetic Cyan
      accentGradient: 'from-cyan-400 to-blue-600',
      accentText: '#083344',
      textPrimary: '#ffffff',
      textSecondary: '#cffafe',
      badgeBg: 'bg-cyan-400 text-slate-950 border-cyan-300',
      border: 'border-cyan-500/40',
    },
    {
      bgGradient: 'from-zinc-950 via-neutral-950 to-lime-950',
      cardBg: 'rgba(24, 24, 27, 0.94)',
      accent: '#84cc16', // Acid Volt Lime
      accentGradient: 'from-lime-400 to-green-500',
      accentText: '#1a2e05',
      textPrimary: '#ffffff',
      textSecondary: '#ecfccb',
      badgeBg: 'bg-lime-400 text-black border-lime-300',
      border: 'border-lime-500/40',
    },
    {
      bgGradient: 'from-orange-950 via-neutral-950 to-amber-950',
      cardBg: 'rgba(23, 23, 23, 0.94)',
      accent: '#f97316', // High-Impact Orange
      accentGradient: 'from-orange-500 to-red-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#ffedd5',
      badgeBg: 'bg-orange-500 text-stone-950 border-orange-400',
      border: 'border-orange-500/40',
    },
    {
      bgGradient: 'from-slate-950 via-neutral-950 to-violet-950',
      cardBg: 'rgba(20, 20, 25, 0.94)',
      accent: '#8b5cf6', // Electric Violet
      accentGradient: 'from-violet-400 to-indigo-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#ede9fe',
      badgeBg: 'bg-violet-500 text-white border-violet-400',
      border: 'border-violet-500/40',
    },
    {
      bgGradient: 'from-stone-950 via-red-950 to-neutral-950',
      cardBg: 'rgba(25, 20, 20, 0.94)',
      accent: '#ef4444', // Powerhouse Crimson
      accentGradient: 'from-red-500 to-rose-600',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#fee2e2',
      badgeBg: 'bg-red-500 text-white border-red-400',
      border: 'border-red-500/40',
    },
  ],
  tech: [
    {
      bgGradient: 'from-indigo-950 via-slate-950 to-violet-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#6366f1', // Laser Indigo
      accentGradient: 'from-indigo-500 to-violet-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#e0e7ff',
      badgeBg: 'bg-indigo-500 text-white border-indigo-400',
      border: 'border-indigo-500/40',
    },
    {
      bgGradient: 'from-cyan-950 via-slate-950 to-blue-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#06b6d4', // Cyber Cyan
      accentGradient: 'from-cyan-400 to-blue-500',
      accentText: '#083344',
      textPrimary: '#ffffff',
      textSecondary: '#cffafe',
      badgeBg: 'bg-cyan-400 text-slate-950 border-cyan-300',
      border: 'border-cyan-500/40',
    },
    {
      bgGradient: 'from-purple-950 via-slate-950 to-pink-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#d946ef', // Neon Magenta
      accentGradient: 'from-fuchsia-500 to-pink-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#fae8ff',
      badgeBg: 'bg-fuchsia-500 text-white border-fuchsia-400',
      border: 'border-fuchsia-500/40',
    },
    {
      bgGradient: 'from-slate-950 via-emerald-950 to-slate-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#10b981', // Terminal Emerald
      accentGradient: 'from-emerald-400 to-teal-400',
      accentText: '#022c22',
      textPrimary: '#ffffff',
      textSecondary: '#d1fae5',
      badgeBg: 'bg-emerald-500 text-stone-950 border-emerald-400',
      border: 'border-emerald-500/40',
    },
    {
      bgGradient: 'from-blue-950 via-slate-950 to-indigo-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#3b82f6', // Quantum Blue
      accentGradient: 'from-blue-400 to-cyan-400',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#dbeafe',
      badgeBg: 'bg-blue-500 text-white border-blue-400',
      border: 'border-blue-500/40',
    },
  ],
  beauty: [
    {
      bgGradient: 'from-rose-950 via-stone-950 to-pink-950',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#f43f5e', // Rose Gold
      accentGradient: 'from-rose-400 to-pink-500',
      accentText: '#4c0519',
      textPrimary: '#ffffff',
      textSecondary: '#ffe4e6',
      badgeBg: 'bg-rose-400 text-stone-950 border-rose-300',
      border: 'border-rose-500/40',
    },
    {
      bgGradient: 'from-emerald-950 via-neutral-950 to-teal-950',
      cardBg: 'rgba(23, 23, 23, 0.94)',
      accent: '#14b8a6', // Botanical Jade
      accentGradient: 'from-teal-400 to-emerald-500',
      accentText: '#042f2e',
      textPrimary: '#ffffff',
      textSecondary: '#ccfbf1',
      badgeBg: 'bg-teal-400 text-stone-950 border-teal-300',
      border: 'border-teal-500/40',
    },
    {
      bgGradient: 'from-neutral-950 via-stone-950 to-rose-950',
      cardBg: 'rgba(25, 23, 23, 0.94)',
      accent: '#fb7185', // Soft Petal Blush
      accentGradient: 'from-rose-300 to-amber-300',
      accentText: '#4c0519',
      textPrimary: '#ffffff',
      textSecondary: '#ffe4e6',
      badgeBg: 'bg-rose-400 text-stone-950 border-rose-300',
      border: 'border-rose-400/40',
    },
    {
      bgGradient: 'from-stone-950 via-amber-950 to-neutral-950',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#f59e0b', // Champagne Shimmer
      accentGradient: 'from-amber-300 to-yellow-400',
      accentText: '#451a03',
      textPrimary: '#ffffff',
      textSecondary: '#fef3c7',
      badgeBg: 'bg-amber-400 text-stone-950 border-amber-300',
      border: 'border-amber-400/40',
    },
    {
      bgGradient: 'from-purple-950 via-stone-950 to-pink-950',
      cardBg: 'rgba(25, 20, 25, 0.94)',
      accent: '#c084fc', // Orchid Mist
      accentGradient: 'from-purple-300 to-pink-400',
      accentText: '#2e1065',
      textPrimary: '#ffffff',
      textSecondary: '#f3e8ff',
      badgeBg: 'bg-purple-400 text-stone-950 border-purple-300',
      border: 'border-purple-400/40',
    },
  ],
  fashion: [
    {
      bgGradient: 'from-neutral-950 via-stone-950 to-zinc-950',
      cardBg: 'rgba(24, 24, 27, 0.94)',
      accent: '#facc15', // High-Fashion Gold
      accentGradient: 'from-yellow-400 to-amber-500',
      accentText: '#422006',
      textPrimary: '#ffffff',
      textSecondary: '#fef08a',
      badgeBg: 'bg-yellow-400 text-black border-yellow-300',
      border: 'border-yellow-500/40',
    },
    {
      bgGradient: 'from-slate-950 via-indigo-950 to-neutral-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#818cf8', // Electric Indigo
      accentGradient: 'from-indigo-400 to-blue-500',
      accentText: '#1e1b4b',
      textPrimary: '#ffffff',
      textSecondary: '#e0e7ff',
      badgeBg: 'bg-indigo-400 text-black border-indigo-300',
      border: 'border-indigo-500/40',
    },
    {
      bgGradient: 'from-stone-950 via-zinc-900 to-neutral-950',
      cardBg: 'rgba(20, 20, 22, 0.94)',
      accent: '#e2e8f0', // Minimalist Platinum
      accentGradient: 'from-slate-200 to-zinc-400',
      accentText: '#0f172a',
      textPrimary: '#ffffff',
      textSecondary: '#cbd5e1',
      badgeBg: 'bg-slate-200 text-slate-950 border-slate-300',
      border: 'border-slate-300/40',
    },
    {
      bgGradient: 'from-amber-950 via-neutral-950 to-stone-950',
      cardBg: 'rgba(25, 23, 20, 0.94)',
      accent: '#fbbf24', // Warm Cognac & Amber
      accentGradient: 'from-amber-300 to-orange-400',
      accentText: '#451a03',
      textPrimary: '#ffffff',
      textSecondary: '#fef3c7',
      badgeBg: 'bg-amber-400 text-stone-950 border-amber-300',
      border: 'border-amber-400/40',
    },
    {
      bgGradient: 'from-zinc-950 via-neutral-900 to-stone-950',
      cardBg: 'rgba(18, 18, 20, 0.94)',
      accent: '#2dd4bf', // Modern Emerald Teal
      accentGradient: 'from-teal-300 to-emerald-400',
      accentText: '#042f2e',
      textPrimary: '#ffffff',
      textSecondary: '#ccfbf1',
      badgeBg: 'bg-teal-400 text-stone-950 border-teal-300',
      border: 'border-teal-400/40',
    },
  ],
  general: [
    {
      bgGradient: 'from-indigo-950 via-slate-950 to-violet-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#6366f1',
      accentGradient: 'from-indigo-500 to-cyan-500',
      accentText: '#ffffff',
      textPrimary: '#ffffff',
      textSecondary: '#e0e7ff',
      badgeBg: 'bg-indigo-500 text-white border-indigo-400',
      border: 'border-indigo-500/40',
    },
    {
      bgGradient: 'from-cyan-950 via-slate-950 to-blue-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#06b6d4',
      accentGradient: 'from-cyan-400 to-teal-500',
      accentText: '#083344',
      textPrimary: '#ffffff',
      textSecondary: '#cffafe',
      badgeBg: 'bg-cyan-400 text-slate-950 border-cyan-300',
      border: 'border-cyan-500/40',
    },
    {
      bgGradient: 'from-amber-950 via-stone-950 to-orange-950',
      cardBg: 'rgba(28, 25, 23, 0.94)',
      accent: '#f59e0b',
      accentGradient: 'from-amber-400 to-orange-500',
      accentText: '#451a03',
      textPrimary: '#ffffff',
      textSecondary: '#fef3c7',
      badgeBg: 'bg-amber-500 text-stone-950 border-amber-400',
      border: 'border-amber-500/40',
    },
    {
      bgGradient: 'from-rose-950 via-neutral-950 to-pink-950',
      cardBg: 'rgba(25, 20, 23, 0.94)',
      accent: '#f43f5e',
      accentGradient: 'from-rose-400 to-pink-500',
      accentText: '#4c0519',
      textPrimary: '#ffffff',
      textSecondary: '#ffe4e6',
      badgeBg: 'bg-rose-400 text-stone-950 border-rose-300',
      border: 'border-rose-400/40',
    },
    {
      bgGradient: 'from-emerald-950 via-slate-950 to-teal-950',
      cardBg: 'rgba(15, 23, 42, 0.94)',
      accent: '#10b981',
      accentGradient: 'from-emerald-400 to-teal-500',
      accentText: '#022c22',
      textPrimary: '#ffffff',
      textSecondary: '#d1fae5',
      badgeBg: 'bg-emerald-500 text-stone-950 border-emerald-400',
      border: 'border-emerald-500/40',
    },
  ],
};

const LAYOUTS: VisualLayout[] = ['showcase', 'immersive', 'split', 'bold', 'minimal'];

// Extract 2 key benefit bullets strictly from the user's description without inventing claims
function extractBenefitBullets(description: string, category: AdCategory): string[] {
  const sentences = description
    .split(/[.,;\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5 && s.length < 55);

  if (sentences.length >= 2) {
    return [sentences[0], sentences[1]];
  }
  if (sentences.length === 1) {
    return [
      sentences[0],
      category === 'skincare'
        ? 'Gentle Daily Cleansing'
        : category === 'coffee'
        ? 'Rich Aromatic Crema'
        : category === 'food'
        ? 'Fresh Homemade Taste'
        : 'Quality Guaranteed',
    ];
  }

  // Fallbacks by category (truthful and non-exaggerated)
  switch (category) {
    case 'skincare':
      return ['Hydrating Gentle Cleanser', 'Pure Botanical Care'];
    case 'coffee':
      return ['Fresh Roasted Beans', 'Rich Velvety Crema'];
    case 'food':
      return ['Fresh Artisanal Ingredients', 'Homemade Quality'];
    case 'beverage':
      return ['Refreshing Crisp Flavor', 'Naturally Delicious'];
    case 'fitness':
      return ['Built For Daily Training', 'High Performance'];
    case 'tech':
      return ['Clean Intuitive Interface', 'Built For Productivity'];
    case 'beauty':
      return ['Radiant Natural Glow', 'Lightweight Nourishing Care'];
    case 'fashion':
      return ['Premium Modern Cut', 'Timeless Comfort'];
    default:
      return ['Carefully Crafted', 'Designed For You'];
  }
}

// Clean and polish headlines to prevent awkward shouting or word splicing
function polishHeadline(headline: string, productName: string): string {
  let clean = headline.trim().replace(/^["']|["']$/g, '');

  // Detect and fix awkward uppercase concatenations like "MILK WASH WOMEN"
  if (/^[A-Z\s]+$/.test(clean) && clean.length > 15) {
    // Convert all-caps into clean title case
    clean = clean
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  return clean || `${productName} — Made For You`;
}

// Find a punchy highlight word in the headline for styled typography
function getHighlightWord(headline: string): string | undefined {
  const words = headline.split(/\s+/).filter((w) => w.length >= 4);
  if (words.length > 0) {
    return words[Math.min(1, words.length - 1)].replace(/[^\w]/g, '');
  }
  return undefined;
}

// Build complete visual creative configuration
export function buildVisualCreative(
  rawVariation: any,
  variationIndex: number,
  productName: string,
  productDescription: string,
  platform: Platform,
  offerKeywords?: string
): GeneratedVisualCreative {
  const category = inferAdCategory(productName, productDescription, offerKeywords);
  const layout = LAYOUTS[variationIndex % LAYOUTS.length];
  const palettes = CATEGORY_PALETTES[category] || CATEGORY_PALETTES.general;
  const colors = palettes[variationIndex % palettes.length];

  const imagePrompt =
    rawVariation?.imagePrompt ||
    createAiImagePrompt(category, productName, productDescription, variationIndex);

  // Generate real AI image URL with unique seed
  const seed = 1000 + (variationIndex + 1) * 347 + productName.length * 13;
  const width = platform === 'meta' ? 800 : 960;
  const height = platform === 'meta' ? 800 : 540;

  // Pollinations API endpoint with seed and dimensions
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=${width}&height=${height}&nologo=true&seed=${seed}`;

  // Always route through local image-proxy to ensure same-origin headers and zero CORS canvas tainting
  const proxiedImageUrl = `/api/image-proxy?url=${encodeURIComponent(pollinationsUrl)}`;

  // Ensure headline, body copy, and CTA are clean, natural, and grounded
  const rawHeadline =
    rawVariation?.metaFields?.headline ||
    rawVariation?.googleFields?.headline1 ||
    rawVariation?.headline ||
    `${productName} — Crafted For You`;

  const headline = polishHeadline(rawHeadline, productName);
  const highlightWord = getHighlightWord(headline);

  const supportingCopy =
    rawVariation?.metaFields?.primaryText ||
    rawVariation?.googleFields?.description1 ||
    rawVariation?.primaryCopy ||
    productDescription.slice(0, 130);

  const callToAction =
    rawVariation?.metaFields?.callToAction ||
    rawVariation?.callToAction ||
    (category === 'skincare'
      ? 'Explore Care'
      : category === 'coffee'
      ? 'Order Fresh'
      : category === 'food'
      ? 'Order Fresh Now'
      : category === 'beverage'
      ? 'Taste Refreshment'
      : 'Learn More');

  const badgeText =
    offerKeywords?.trim() ||
    (category === 'skincare'
      ? '✦ GENTLE DAILY CARE'
      : category === 'coffee'
      ? '☕ FRESHLY ROASTED'
      : category === 'food'
      ? '★ 100% HOMEMADE'
      : category === 'beverage'
      ? '❄ ICE COLD & REFRESHING'
      : category === 'fitness'
      ? '⚡ PROVEN QUALITY'
      : category === 'tech'
      ? '🚀 SMART AUTOMATION'
      : category === 'beauty'
      ? '✦ RADIANT FINISH'
      : category === 'fashion'
      ? '★ TIMELESS CRAFT'
      : '★ SPECIAL OFFER');

  const benefitBullets = extractBenefitBullets(productDescription, category);

  return {
    imageUrl: proxiedImageUrl,
    imagePrompt,
    imageProvider: 'Pollinations AI (FLUX)',
    category,
    layout,
    colors,
    headline,
    highlightWord,
    supportingCopy,
    callToAction,
    badgeText,
    benefitBullets,
    aspectRatio: platform === 'meta' ? 'aspect-square' : 'aspect-[16/9]',
  };
}
