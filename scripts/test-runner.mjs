import { processAndValidateVariation, GOOGLE_LIMITS, META_RECOMMENDED_LIMITS } from '../src/lib/adProcessor.js';
import {
  buildSystemAndUserPrompt,
  parseJsonSafely,
  extractGroqErrorInfo,
  extractVariationsFromParsed,
  synthesizeComplementaryVariation,
  ensureExactVariationCount,
  SUPPORTED_GROQ_MODELS,
} from '../src/lib/groq.js';
import {
  buildVisualCreative,
  inferAdCategory,
  createAiImagePrompt,
} from '../src/lib/artDirector.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n=== RUNNING ADNOVA COMPREHENSIVE TEST SUITE (GROQ INTEGRATION) ===\n');

// 1. Test Prompt Builder for Google + PAS
console.log('1. Testing Prompt Builder: Google Ads + PAS Framework');
const googleInput = {
  productName: 'SwiftFlow',
  productDescription: 'AI project management for distributed teams.',
  targetAudience: 'Engineering managers',
  platform: 'google',
  framework: 'pas',
  tone: 'Professional',
  objective: 'Leads',
  variationCount: 3,
  offerKeywords: '14-day free trial',
};
const googlePrompt = buildSystemAndUserPrompt(googleInput);
assert(googlePrompt.systemInstruction.includes('PAS: Problem'), 'Prompt includes PAS instructions');
assert(googlePrompt.systemInstruction.includes('Google Ads (Search)'), 'Prompt includes Google Ads constraints');
assert(googlePrompt.systemInstruction.includes('headline1: Target <= 30 characters'), 'Prompt specifies 30-char headline target');
assert(googlePrompt.systemInstruction.includes('description1: Target <= 90 characters'), 'Prompt specifies 90-char description target');
assert(googlePrompt.userPrompt.includes('SwiftFlow'), 'User prompt includes product name');
assert(googlePrompt.userPrompt.includes('14-day free trial'), 'User prompt includes offer keywords');

// 2. Test Prompt Builder for Meta + AIDA
console.log('\n2. Testing Prompt Builder: Meta Ads + AIDA Framework');
const metaInput = {
  productName: 'EcoBreeze Thermostat',
  productDescription: 'Smart home thermostat that cuts electric bills.',
  targetAudience: 'Eco-conscious homeowners',
  platform: 'meta',
  framework: 'aida',
  tone: 'Persuasive',
  objective: 'Sales',
  variationCount: 2,
};
const metaPrompt = buildSystemAndUserPrompt(metaInput);
assert(metaPrompt.systemInstruction.includes('AIDA: Attention'), 'Prompt includes AIDA instructions');
assert(metaPrompt.systemInstruction.includes('Meta Ads (Facebook & Instagram Feed)'), 'Prompt includes Meta feed instructions');
assert(metaPrompt.systemInstruction.includes('primaryText: Target ~125 characters'), 'Prompt specifies Meta primary text guideline');

// 3. Test JSON Parser Safety
console.log('\n3. Testing Robust JSON Parser');
const cleanJson = '{"variations":[{"headline":"Test Ad"}]}';
const wrappedJson = '```json\n{"variations":[{"headline":"Test Ad"}]}\n```';
const textWithSurroundings = 'Here is the result:\n{"variations":[{"headline":"Test Ad"}]}\nHope this helps!';

assert(parseJsonSafely(cleanJson)?.variations[0]?.headline === 'Test Ad', 'Parses clean JSON');
assert(parseJsonSafely(wrappedJson)?.variations[0]?.headline === 'Test Ad', 'Parses markdown wrapped JSON');
assert(parseJsonSafely(textWithSurroundings)?.variations[0]?.headline === 'Test Ad', 'Parses embedded JSON within conversational text');
assert(parseJsonSafely('Invalid JSON string') === null, 'Returns null on unparseable string');

// 4. Test Google Ads Variation Validation & Character Limits
console.log('\n4. Testing Google Ads Validation & Strict Character Limits');
const mockGoogleRaw = {
  variationNumber: 1,
  label: 'Direct Benefit',
  headline: 'Cut Project Delays Today',
  primaryCopy: 'Automate sprint status updates and free up 10 hours weekly for your team.',
  googleFields: {
    headline1: 'Fast Project Setup', // 18 chars (<= 30)
    headline2: 'This Headline Is Way Too Long And Exceeds The Thirty Char Limit', // 63 chars (> 30)
    description1: 'Manage engineering sprints with ease. Start your free 14-day trial without a credit card.', // 89 chars (<= 90)
    description2: 'This description is excessively lengthy and goes way past the ninety characters threshold established for Google Search descriptions to ensure compliance.', // 155 chars (> 90)
  },
  frameworkBreakdown: {
    problem: 'Teams waste 10 hours weekly writing manual status reports.',
    agitate: 'Deadlines slip while context gets lost in endless chat threads.',
    solution: 'SwiftFlow organizes chats into prioritized Jira sprints automatically.',
  },
};

const processedGoogle = processAndValidateVariation(mockGoogleRaw, 0, 'google', 'pas');
assert(processedGoogle.variationNumber === 1, 'Maintains variation number');
assert(processedGoogle.googleFields.headline1 === 'Fast Project Setup', 'Extracts headline 1');
assert(processedGoogle.characterCounts['headline1'] === 18, 'Calculates headline 1 char count correctly (18)');
assert(processedGoogle.characterCounts['headline2'] === 63, 'Calculates headline 2 char count correctly (63)');
assert(processedGoogle.limitWarnings.some(w => w.field === 'Headline 2' && w.exceeded), 'Flags Headline 2 over-limit warning');
assert(processedGoogle.limitWarnings.some(w => w.field === 'Description 2' && w.exceeded), 'Flags Description 2 over-limit warning');
assert(processedGoogle.frameworkBreakdown.problem.length > 0, 'Contains PAS problem');
assert(processedGoogle.frameworkBreakdown.agitate.length > 0, 'Contains PAS agitate');
assert(processedGoogle.frameworkBreakdown.solution.length > 0, 'Contains PAS solution');

// 5. Test Meta Ads Variation Validation & AIDA
console.log('\n5. Testing Meta Ads Validation & Recommended Limits');
const mockMetaRaw = {
  variationNumber: 2,
  label: 'Social Proof Hook',
  headline: 'Slash Your Electric Bill By 23%',
  primaryCopy: 'Tired of shocking power bills every summer? EcoBreeze learns your daily habits and optimizes temperature automatically.',
  metaFields: {
    primaryText: 'Tired of shocking power bills every summer? EcoBreeze learns your daily habits and optimizes temperature automatically.',
    headline: 'EcoBreeze Smart Thermostat', // 26 chars
    description: 'Save 23% on energy bills', // 24 chars
    callToAction: 'Shop Now',
  },
  frameworkBreakdown: {
    attention: 'Stop overpaying for energy you do not use.',
    interest: 'EcoBreeze monitors room-by-room thermal patterns.',
    desire: 'Join 50,000 homeowners saving hundreds every season.',
    action: 'Order today with 60-day money-back guarantee.',
  },
};

const processedMeta = processAndValidateVariation(mockMetaRaw, 1, 'meta', 'aida');
assert(processedMeta.variationNumber === 2, 'Maintains variation number');
assert(processedMeta.metaFields.callToAction === 'Shop Now', 'Extracts Meta CTA');
assert(processedMeta.frameworkBreakdown.attention.length > 0, 'Contains AIDA attention');
assert(processedMeta.frameworkBreakdown.interest.length > 0, 'Contains AIDA interest');
assert(processedMeta.frameworkBreakdown.desire.length > 0, 'Contains AIDA desire');
assert(processedMeta.frameworkBreakdown.action.length > 0, 'Contains AIDA action');

// 6. Test Groq Supported Model Configuration
console.log('\n6. Testing Groq Model Configuration');
assert(SUPPORTED_GROQ_MODELS.includes('openai/gpt-oss-20b'), 'Includes openai/gpt-oss-20b as primary');
assert(SUPPORTED_GROQ_MODELS.includes('openai/gpt-oss-120b'), 'Includes openai/gpt-oss-120b as fallback');
assert(SUPPORTED_GROQ_MODELS[0] === 'openai/gpt-oss-20b', 'openai/gpt-oss-20b is top priority');

// 7. Test Groq Error Info Extraction
console.log('\n7. Testing Sanitized Groq Error Info Extraction');
const err401 = extractGroqErrorInfo({ status: 401, message: 'Invalid API Key provided: gsk_1234567890abcdef1234567890' });
assert(err401.isInvalidKey === true, 'Correctly flags 401 invalid API key');
assert(!err401.message.includes('gsk_1234567890'), 'Sanitizes/redacts secret key from message');

const err429 = extractGroqErrorInfo({ status: 429, message: 'Rate limit reached for requests per minute' });
assert(err429.isRateLimit === true, 'Correctly flags 429 rate limit');

const err404 = extractGroqErrorInfo({ status: 404, message: 'The model `old-model` does not exist or has been decommissioned' });
assert(err404.isModelNotFound === true, 'Correctly flags model not found / decommissioned');

// 8. Test Variation Counts 1, 2, 3, and 5 (API, Prompt & Guarantees)
console.log('\n8. Testing Exact Variation Counts (1, 2, 3, and 5)');
const baseTestInput = {
  productName: 'AdNova Pro',
  productDescription: 'AI ad copy generator creating multi-angle variations in seconds.',
  targetAudience: 'Digital marketing agencies',
  platform: 'meta',
  framework: 'aida',
  tone: 'Persuasive',
  objective: 'Conversions',
  variationCount: 1,
};

// Test Count 1
const prompt1 = buildSystemAndUserPrompt({ ...baseTestInput, variationCount: 1 });
assert(prompt1.systemInstruction.includes('EXACTLY 1 distinct variation'), 'Prompt 1: Specifies exactly 1 variation in system instruction');
assert(prompt1.userPrompt.includes('Generate exactly 1 distinct ad copy'), 'Prompt 1: Requests exactly 1 variation in user prompt');
const res1 = ensureExactVariationCount([mockMetaRaw], 1, { ...baseTestInput, variationCount: 1 });
assert(res1.length === 1, 'Count 1: Returns exactly 1 variation');
assert(res1[0].variationNumber === 1, 'Count 1: Re-indexed to variationNumber 1');

// Test Count 2 (The reported bug scenario)
console.log('\nTesting Count 2 (The reported bug scenario: 2 requested)');
const prompt2 = buildSystemAndUserPrompt({ ...baseTestInput, variationCount: 2 });
assert(prompt2.systemInstruction.includes('EXACTLY 2 distinct variation'), 'Prompt 2: Specifies exactly 2 variations in system instruction');
assert(prompt2.userPrompt.includes('Generate exactly 2 distinct ad copy'), 'Prompt 2: Requests exactly 2 variations in user prompt');

// Case 2a: Model returns only 1 variation when 2 requested (partial/incomplete model response)
const incompleteSingle = [mockMetaRaw]; // Only 1 variation provided
const res2From1 = ensureExactVariationCount(incompleteSingle, 2, { ...baseTestInput, variationCount: 2 });
assert(res2From1.length === 2, 'Count 2 (from 1 raw): Returns exactly 2 variations without discarding user request');
assert(res2From1[0].variationNumber === 1 && res2From1[1].variationNumber === 2, 'Count 2 (from 1 raw): Deterministic numbering [1, 2]');
assert(res2From1[0].headline !== res2From1[1].headline, 'Count 2 (from 1 raw): Variations have distinct headlines and angles');
assert(res2From1[1].metaFields && res2From1[1].metaFields.primaryText, 'Count 2 (from 1 raw): Synthesized variation includes valid platform fields');

// Case 2b: Model returns 2 complete variations
const twoRaw = [
  { ...mockMetaRaw, variationNumber: 1, headline: 'Headline A' },
  { ...mockMetaRaw, variationNumber: 2, headline: 'Headline B' },
];
const res2From2 = ensureExactVariationCount(twoRaw, 2, { ...baseTestInput, variationCount: 2 });
assert(res2From2.length === 2, 'Count 2 (from 2 raw): Returns exactly 2 variations');
assert(res2From2[0].headline === 'Headline A' && res2From2[1].headline === 'Headline B', 'Count 2 (from 2 raw): Preserves distinct headlines');

// Test Count 3
console.log('\nTesting Count 3');
const prompt3 = buildSystemAndUserPrompt({ ...baseTestInput, variationCount: 3 });
assert(prompt3.systemInstruction.includes('EXACTLY 3 distinct variation'), 'Prompt 3: Specifies exactly 3 variations in system instruction');
const res3 = ensureExactVariationCount(incompleteSingle, 3, { ...baseTestInput, variationCount: 3 });
assert(res3.length === 3, 'Count 3: Returns exactly 3 variations');
assert(res3.map(v => v.variationNumber).join(',') === '1,2,3', 'Count 3: Correct variation numbering [1, 2, 3]');
const headlines3 = new Set(res3.map(v => v.headline));
assert(headlines3.size === 3, 'Count 3: All 3 variations have distinct headlines');

// Test Count 5
console.log('\nTesting Count 5');
const prompt5 = buildSystemAndUserPrompt({ ...baseTestInput, variationCount: 5 });
assert(prompt5.systemInstruction.includes('EXACTLY 5 distinct variation'), 'Prompt 5: Specifies exactly 5 variations in system instruction');
const res5 = ensureExactVariationCount(incompleteSingle, 5, { ...baseTestInput, variationCount: 5 });
assert(res5.length === 5, 'Count 5: Returns exactly 5 variations');
assert(res5.map(v => v.variationNumber).join(',') === '1,2,3,4,5', 'Count 5: Correct variation numbering [1, 2, 3, 4, 5]');
const headlines5 = new Set(res5.map(v => v.headline));
assert(headlines5.size === 5, 'Count 5: All 5 variations have distinct headlines');

// 9. Test Malformed, Incomplete, and Non-Standard Model Responses
console.log('\n9. Testing Malformed & Non-Standard Model Responses');

// Malformed 1: Nested under `data.variations`
const nestedVariations = { data: { variations: [mockMetaRaw, mockMetaRaw] } };
const extractedNested = extractVariationsFromParsed(nestedVariations);
assert(extractedNested !== null && extractedNested.length === 2, 'Extracts variations nested in object properties');

// Malformed 2: Direct array root
const arrayRoot = [mockMetaRaw, mockMetaRaw];
const extractedArray = extractVariationsFromParsed(arrayRoot);
assert(extractedArray !== null && extractedArray.length === 2, 'Extracts variations from root array');

// Malformed 3: Variations named as variation1, variation2 keys
const keyedVariations = {
  variation1: { headline: 'Keyed 1', primaryCopy: 'Copy 1' },
  variation2: { headline: 'Keyed 2', primaryCopy: 'Copy 2' },
};
const extractedKeyed = extractVariationsFromParsed(keyedVariations);
assert(extractedKeyed !== null && extractedKeyed.length === 2, 'Extracts variations formatted as variation1, variation2 keys');

// Malformed 4: Single object root (model skipped variations array wrapper)
const singleObjectRoot = { headline: 'Solo Ad', primaryCopy: 'Solo copy' };
const extractedSingle = extractVariationsFromParsed(singleObjectRoot);
assert(extractedSingle !== null && extractedSingle.length === 1 && extractedSingle[0].headline === 'Solo Ad', 'Handles model returning single ad object instead of array');

// Malformed 5: Duplicate variationNumber from model (e.g. model gave both variationNumber: 1)
const duplicateNumbers = [
  { ...mockMetaRaw, variationNumber: 1, headline: 'Ad 1' },
  { ...mockMetaRaw, variationNumber: 1, headline: 'Ad 2' },
];
const validatedWithDups = duplicateNumbers.map((v, i) => processAndValidateVariation(v, i, 'meta', 'aida'));
assert(validatedWithDups[0].variationNumber === 1, 'First duplicate gets variationNumber 1');
assert(validatedWithDups[1].variationNumber === 2, 'Second duplicate gets corrected to variationNumber 2 (prevents React key collision)');

// 10. Test Visual Creative Diversity
console.log('\n10. Testing Visual Creative Diversity for Generated Variations');
const creatives = [0, 1, 2, 3, 4].map(idx =>
  buildVisualCreative(
    res5[idx],
    idx,
    'Artisanal Sourdough Bakery',
    'Fresh wood-fired sourdough bread made daily with organic heirloom flour and natural wild yeast.',
    'meta',
    'Order Fresh'
  )
);
const layouts = new Set(creatives.map(c => c.layout));
const prompts = new Set(creatives.map(c => c.imagePrompt));
// 11. Test Category-Specific Creative Intelligence & Visual Prompts
console.log('\n11. Testing Category-Specific Creative Intelligence & Visual Prompts');

// 11a. Specific Category Inference
assert(inferAdCategory('Gentle Milk Face Wash', 'Soothing daily facial cleanser with almond milk and chamomile.') === 'skincare', 'Infers skincare for Milk Face Wash');
assert(inferAdCategory('Velvet Crema Dark Roast', 'Artisanal whole bean espresso with rich caramel crema.') === 'coffee', 'Infers coffee for espresso/dark roast');
assert(inferAdCategory('Nonnas Wood-Fired Lasagna', 'Traditional slow-cooked beef and ricotta lasagna.') === 'food', 'Infers food for homemade lasagna');
assert(inferAdCategory('Sparkling Citrus Soda', 'Ice-cold fizzy blood orange soda with organic cane sugar.') === 'beverage', 'Infers beverage for sparkling soda');

// 11b. Product-Specific AI Visual Prompts
const skincarePrompt = createAiImagePrompt('skincare', 'Hydrating Milk Face Wash', 'Creamy milk cleanser with botanical aloe.', 0);
assert(skincarePrompt.toLowerCase().includes('milk splash') || skincarePrompt.toLowerCase().includes('creamy milk'), 'Skincare prompt features creamy milk textures and splashes');
assert(skincarePrompt.toLowerCase().includes('botanical'), 'Skincare prompt highlights botanical ingredients');

const coffeePrompt = createAiImagePrompt('coffee', 'Artisan Espresso', 'Roasted arabica beans with thick crema.', 0);
assert(coffeePrompt.toLowerCase().includes('crema'), 'Coffee prompt highlights rich crema');
assert(coffeePrompt.toLowerCase().includes('coffee beans'), 'Coffee prompt highlights roasted coffee beans');

const foodPrompt = createAiImagePrompt('food', 'Artisan Lasagna', 'Baked pasta with melted cheese and fresh basil.', 0);
assert(foodPrompt.toLowerCase().includes('appetizing') || foodPrompt.toLowerCase().includes('steam'), 'Food prompt highlights appetizing culinary textures and steam');

// 11c. Category-Tailored Distinct Palettes
const skincareCreatives = [0, 1, 2, 3, 4].map(idx =>
  buildVisualCreative(
    { headline: 'Pure Gentle Care' },
    idx,
    'Milk Face Wash',
    'Gentle daily cleanser with soothing milk extract.',
    'meta'
  )
);
const skincarePalettes = new Set(skincareCreatives.map(c => c.colors.accent));
assert(skincarePalettes.size === 5, 'Generates 5 distinct skincare palettes for 5 variations');
assert(skincareCreatives[0].badgeText.includes('GENTLE') || skincareCreatives[0].badgeText.includes('CARE'), 'Skincare receives grounded, truthful badge');

const coffeeCreatives = [0, 1, 2, 3, 4].map(idx =>
  buildVisualCreative(
    { headline: 'Rich Velvet Crema' },
    idx,
    'Dark Roast Espresso',
    'Whole bean coffee with thick golden crema.',
    'meta'
  )
);
const coffeePalettes = new Set(coffeeCreatives.map(c => c.colors.accent));
assert(coffeePalettes.size === 5, 'Generates 5 distinct coffee palettes (amber, cinnamon, crema, caramel, copper)');
assert(coffeeCreatives[0].badgeText.includes('ROASTED') || coffeeCreatives[0].badgeText.includes('CREMA'), 'Coffee receives grounded, truthful badge');

// 11d. Headline Polishing & Natural Phrasing Protection
const rawAwkward = { headline: 'MILK WASH WOMEN SENSITIVE SKIN' };
const polishedCreative = buildVisualCreative(rawAwkward, 0, 'Milk Face Wash', 'Gentle cleanser for women.', 'meta');
assert(!/^[A-Z\s]+$/.test(polishedCreative.headline), 'Polishes awkward all-caps headline into clean natural title-case');

console.log(`\n=== RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
if (failed > 0) process.exit(1);
