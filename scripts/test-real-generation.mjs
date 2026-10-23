import fs from 'fs';
import Groq from 'groq-sdk';
import { buildSystemAndUserPrompt, parseJsonSafely } from '../src/lib/groq.ts';
import { processAndValidateVariation } from '../src/lib/adProcessor.ts';

let apiKey = process.env.GROQ_API_KEY;
if (!apiKey && fs.existsSync('.env.local')) {
  const env = fs.readFileSync('.env.local', 'utf8');
  const match = env.match(/GROQ_API_KEY\s*=\s*([^\r\n]+)/);
  if (match) apiKey = match[1].trim().replace(/^['"]|['"]$/g, '');
}

if (!apiKey) {
  console.log('Skipping real generation test: GROQ_API_KEY not set.');
  process.exit(0);
}

const groq = new Groq({ apiKey });

async function runRealTests() {
  console.log('Testing Google Ads (PAS) with openai/gpt-oss-20b...');
  const googleInput = {
    productName: 'SwiftFlow',
    productDescription: 'AI-driven project management platform that turns unstructured team chats into prioritized sprints.',
    targetAudience: 'Engineering managers',
    platform: 'google',
    framework: 'pas',
    tone: 'Professional',
    objective: 'Leads',
    variationCount: 1,
    offerKeywords: '14-day free trial',
  };

  const { systemInstruction: gSys, userPrompt: gUser } = buildSystemAndUserPrompt(googleInput);
  const gRes = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: gSys },
      { role: 'user', content: gUser },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const gParsed = parseJsonSafely(gRes.choices[0]?.message?.content);
  console.log('Google variations parsed:', gParsed?.variations?.length);
  const gProcessed = processAndValidateVariation(gParsed.variations[0], 0, 'google', 'pas');
  console.log('Google headline 1:', gProcessed.googleFields?.headline1);
  console.log('Google PAS problem:', gProcessed.frameworkBreakdown?.problem);

  console.log('\nTesting Meta Ads (AIDA) with openai/gpt-oss-20b...');
  const metaInput = {
    productName: 'EcoBreeze Smart Thermostat',
    productDescription: 'Smart home thermostat with thermal sensors that slashes monthly electric bills.',
    targetAudience: 'Homeowners',
    platform: 'meta',
    framework: 'aida',
    tone: 'Persuasive',
    objective: 'Sales',
    variationCount: 1,
  };

  const { systemInstruction: mSys, userPrompt: mUser } = buildSystemAndUserPrompt(metaInput);
  const mRes = await groq.chat.completions.create({
    model: 'openai/gpt-oss-20b',
    messages: [
      { role: 'system', content: mSys },
      { role: 'user', content: mUser },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const mParsed = parseJsonSafely(mRes.choices[0]?.message?.content);
  console.log('Meta variations parsed:', mParsed?.variations?.length);
  const mProcessed = processAndValidateVariation(mParsed.variations[0], 0, 'meta', 'aida');
  console.log('Meta primary text:', mProcessed.metaFields?.primaryText);
  console.log('Meta AIDA attention:', mProcessed.frameworkBreakdown?.attention);
  console.log('Meta CTA:', mProcessed.metaFields?.callToAction);
  console.log('\nALL REAL GENERATION TESTS PASSED WITH openai/gpt-oss-20b!');
}

runRealTests().catch((err) => {
  console.error('Error during real generation tests:', err);
  process.exit(1);
});
