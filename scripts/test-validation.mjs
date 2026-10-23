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

// Validation logic unit tests
const VALID_PLATFORMS = ['google', 'meta'];
const VALID_FRAMEWORKS = ['aida', 'pas'];
const VALID_TONES = ['Professional', 'Friendly', 'Persuasive', 'Urgent', 'Creative'];
const VALID_OBJECTIVES = ['Awareness', 'Traffic', 'Leads', 'Sales'];

function validatePayload(body) {
  const productName = typeof body.productName === 'string' ? body.productName.trim() : '';
  const productDescription = typeof body.productDescription === 'string' ? body.productDescription.trim() : '';
  const targetAudience = typeof body.targetAudience === 'string' ? body.targetAudience.trim() : '';
  const platform = body.platform;
  const framework = body.framework;
  const tone = body.tone;
  const objective = body.objective;

  if (!productName) return { valid: false, error: 'Product or service name is required.' };
  if (productName.length > 200) return { valid: false, error: 'Product name must be 200 characters or fewer.' };

  if (!productDescription) return { valid: false, error: 'Product description or key features are required.' };
  if (productDescription.length > 4000) return { valid: false, error: 'Product description must be 4000 characters or fewer.' };

  if (!targetAudience) return { valid: false, error: 'Target audience is required.' };
  if (targetAudience.length > 500) return { valid: false, error: 'Target audience must be 500 characters or fewer.' };

  if (!VALID_PLATFORMS.includes(platform)) return { valid: false, error: 'Invalid advertising platform selected.' };
  if (!VALID_FRAMEWORKS.includes(framework)) return { valid: false, error: 'Invalid copywriting framework selected.' };
  if (!VALID_TONES.includes(tone)) return { valid: false, error: 'Invalid tone selected.' };
  if (!VALID_OBJECTIVES.includes(objective)) return { valid: false, error: 'Invalid campaign objective selected.' };

  return { valid: true };
}

console.log('\n=== TESTING SERVER-SIDE PAYLOAD VALIDATION RULES ===\n');

// 1. Missing productName
assert(!validatePayload({}).valid, 'Rejects empty payload');
assert(validatePayload({}).error === 'Product or service name is required.', 'Identifies missing product name');

// 2. Missing description
assert(!validatePayload({ productName: 'Acme' }).valid, 'Rejects payload with missing description');

// 3. Missing audience
assert(!validatePayload({ productName: 'Acme', productDescription: 'Desc' }).valid, 'Rejects payload with missing audience');

// 4. Invalid platform
assert(!validatePayload({ productName: 'Acme', productDescription: 'Desc', targetAudience: 'Audience', platform: 'tiktok' }).valid, 'Rejects unsupported platform');

// 5. Invalid framework
assert(!validatePayload({ productName: 'Acme', productDescription: 'Desc', targetAudience: 'Audience', platform: 'google', framework: 'invalid' }).valid, 'Rejects invalid framework');

// 6. Valid payload
const validResult = validatePayload({
  productName: 'Acme Tool',
  productDescription: 'Reliable cloud monitoring for devops teams.',
  targetAudience: 'Devops engineers',
  platform: 'google',
  framework: 'pas',
  tone: 'Professional',
  objective: 'Leads',
});
assert(validResult.valid === true, 'Accepts valid complete payload');

console.log(`\n=== VALIDATION TESTS: ${passed} PASSED, ${failed} FAILED ===\n`);
if (failed > 0) process.exit(1);
