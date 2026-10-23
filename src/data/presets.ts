import { AdInput } from '@/types/ad';

export interface PresetCampaign {
  id: string;
  name: string;
  badge: string;
  data: AdInput;
}

export const PRESET_CAMPAIGNS: PresetCampaign[] = [
  {
    id: 'saas-task',
    name: 'SwiftFlow (B2B SaaS)',
    badge: 'Google Ads • PAS',
    data: {
      productName: 'SwiftFlow',
      productDescription: 'AI-driven project management platform that turns unstructured team chats into prioritized sprints, automates status updates, and prevents team burnout without micromanagement.',
      targetAudience: 'Engineering managers, product leaders, and tech startup founders managing distributed teams.',
      platform: 'google',
      framework: 'pas',
      tone: 'Professional',
      objective: 'Leads',
      variationCount: 3,
      offerKeywords: '14-day free trial, no credit card required, sync with Slack & GitHub',
    },
  },
  {
    id: 'ecommerce-thermostat',
    name: 'EcoBreeze Smart Thermostat',
    badge: 'Meta Ads • AIDA',
    data: {
      productName: 'EcoBreeze Smart Thermostat',
      productDescription: 'Adaptive smart home thermostat with room-by-room thermal sensors that slashes monthly electric bills by learning daily family routines and adjusting automatically.',
      targetAudience: 'Eco-conscious homeowners, tech-savvy parents, and modern apartment renters.',
      platform: 'meta',
      framework: 'aida',
      tone: 'Persuasive',
      objective: 'Sales',
      variationCount: 3,
      offerKeywords: 'Save up to 23% on energy bills, easy 15-minute DIY setup, 60-day money-back guarantee',
    },
  },
  {
    id: 'fitness-bars',
    name: 'Zenith Organic Energy Bars',
    badge: 'Meta Ads • PAS',
    data: {
      productName: 'Zenith Clean Fuel Bars',
      productDescription: '100% plant-based organic energy bar packed with 16g clean pea protein, zero added sugar, and adaptogenic mushrooms for steady focus without caffeine jitters.',
      targetAudience: 'Active professionals, gym enthusiasts, marathon runners, and mindful snackers.',
      platform: 'meta',
      framework: 'pas',
      tone: 'Urgent',
      objective: 'Traffic',
      variationCount: 3,
      offerKeywords: 'Variety sample pack, free expedited shipping over $35',
    },
  },
];
