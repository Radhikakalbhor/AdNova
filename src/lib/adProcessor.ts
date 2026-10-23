import { AdVariation, CharacterLimitWarning, Platform, Framework } from '@/types/ad';

export const GOOGLE_LIMITS = {
  headline: 30,
  description: 90,
  displayPath: 15,
};

export const META_RECOMMENDED_LIMITS = {
  primaryText: 125,
  headline: 40,
  description: 30,
};

export function processAndValidateVariation(
  raw: any,
  index: number,
  platform: Platform,
  framework: Framework
): AdVariation {
  // Guarantee unique deterministic 1-based variationNumber (1, 2, 3...) to avoid duplicate keys
  const variationNumber =
    typeof raw.variationNumber === 'number' && raw.variationNumber === index + 1
      ? raw.variationNumber
      : index + 1;
  const label = raw.label || `Variation ${variationNumber}`;
  const headline = String(raw.headline || '').trim();
  const primaryCopy = String(raw.primaryCopy || raw.body || raw.primaryText || '').trim();
  const description = raw.description ? String(raw.description).trim() : undefined;
  const callToAction = String(raw.callToAction || raw.cta || 'Learn More').trim();

  // Validate or build framework breakdown
  const rawBreakdown = raw.frameworkBreakdown || {};
  let frameworkBreakdown: any = {};

  if (framework === 'aida') {
    frameworkBreakdown = {
      attention: String(rawBreakdown.attention || headline).trim(),
      interest: String(rawBreakdown.interest || primaryCopy.slice(0, 100)).trim(),
      desire: String(rawBreakdown.desire || primaryCopy.slice(100)).trim(),
      action: String(rawBreakdown.action || callToAction).trim(),
    };
  } else {
    frameworkBreakdown = {
      problem: String(rawBreakdown.problem || headline).trim(),
      agitate: String(rawBreakdown.agitate || primaryCopy.slice(0, 120)).trim(),
      solution: String(rawBreakdown.solution || primaryCopy.slice(120)).trim(),
    };
  }

  const characterCounts: Record<string, number> = {
    headline: headline.length,
    primaryCopy: primaryCopy.length,
  };
  if (description) {
    characterCounts.description = description.length;
  }
  characterCounts.callToAction = callToAction.length;

  const limitWarnings: CharacterLimitWarning[] = [];

  // Platform-specific fields and validation
  let googleFields = undefined;
  let metaFields = undefined;

  if (platform === 'google') {
    const rawG = raw.googleFields || {};
    const h1 = String(rawG.headline1 || headline.slice(0, 30)).trim();
    const h2 = String(rawG.headline2 || (headline.length > 30 ? headline.slice(30, 60) : 'Official Site')).trim();
    const h3 = rawG.headline3 ? String(rawG.headline3).trim() : undefined;
    const d1 = String(rawG.description1 || (description || primaryCopy.slice(0, 90))).trim();
    const d2 = rawG.description2 ? String(rawG.description2).trim() : (primaryCopy.length > 90 ? primaryCopy.slice(90, 180).trim() : undefined);
    const p1 = rawG.displayPath1 ? String(rawG.displayPath1).trim() : undefined;
    const p2 = rawG.displayPath2 ? String(rawG.displayPath2).trim() : undefined;

    googleFields = {
      headline1: h1,
      headline2: h2,
      headline3: h3,
      description1: d1,
      description2: d2,
      displayPath1: p1,
      displayPath2: p2,
    };

    characterCounts['headline1'] = h1.length;
    characterCounts['headline2'] = h2.length;
    if (h3) characterCounts['headline3'] = h3.length;
    characterCounts['description1'] = d1.length;
    if (d2) characterCounts['description2'] = d2.length;

    // Check Google strict limits
    if (h1.length > GOOGLE_LIMITS.headline) {
      limitWarnings.push({ field: 'Headline 1', actual: h1.length, limit: GOOGLE_LIMITS.headline, exceeded: true, type: 'strict' });
    }
    if (h2.length > GOOGLE_LIMITS.headline) {
      limitWarnings.push({ field: 'Headline 2', actual: h2.length, limit: GOOGLE_LIMITS.headline, exceeded: true, type: 'strict' });
    }
    if (h3 && h3.length > GOOGLE_LIMITS.headline) {
      limitWarnings.push({ field: 'Headline 3', actual: h3.length, limit: GOOGLE_LIMITS.headline, exceeded: true, type: 'strict' });
    }
    if (d1.length > GOOGLE_LIMITS.description) {
      limitWarnings.push({ field: 'Description 1', actual: d1.length, limit: GOOGLE_LIMITS.description, exceeded: true, type: 'strict' });
    }
    if (d2 && d2.length > GOOGLE_LIMITS.description) {
      limitWarnings.push({ field: 'Description 2', actual: d2.length, limit: GOOGLE_LIMITS.description, exceeded: true, type: 'strict' });
    }
  } else {
    // Meta platform
    const rawM = raw.metaFields || {};
    const pText = String(rawM.primaryText || primaryCopy).trim();
    const mHead = String(rawM.headline || headline).trim();
    const mDesc = rawM.description ? String(rawM.description).trim() : description;
    const mCta = String(rawM.callToAction || callToAction).trim();

    metaFields = {
      primaryText: pText,
      headline: mHead,
      description: mDesc,
      callToAction: mCta,
    };

    characterCounts['primaryText'] = pText.length;
    characterCounts['metaHeadline'] = mHead.length;
    if (mDesc) characterCounts['metaDescription'] = mDesc.length;

    // Meta recommended guidelines (feed truncation limits)
    if (pText.length > META_RECOMMENDED_LIMITS.primaryText) {
      limitWarnings.push({ field: 'Primary Text', actual: pText.length, limit: META_RECOMMENDED_LIMITS.primaryText, exceeded: true, type: 'recommended' });
    }
    if (mHead.length > META_RECOMMENDED_LIMITS.headline) {
      limitWarnings.push({ field: 'Meta Headline', actual: mHead.length, limit: META_RECOMMENDED_LIMITS.headline, exceeded: true, type: 'recommended' });
    }
    if (mDesc && mDesc.length > META_RECOMMENDED_LIMITS.description) {
      limitWarnings.push({ field: 'Meta Description', actual: mDesc.length, limit: META_RECOMMENDED_LIMITS.description, exceeded: true, type: 'recommended' });
    }
  }

  return {
    variationNumber,
    label,
    headline,
    primaryCopy,
    description,
    callToAction,
    frameworkBreakdown,
    googleFields,
    metaFields,
    characterCounts,
    limitWarnings,
  };
}
