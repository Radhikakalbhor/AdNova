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

async function run() {
  console.log('\n=== RUNNING ADNOVA HTTP ENDPOINT TESTS ===\n');

  // Test 1: GET / (Homepage)
  console.log('1. Testing GET / (HTML Landing Page)');
  const homeRes = await fetch('http://localhost:3000/');
  assert(homeRes.status === 200, 'Homepage returns HTTP 200 OK');
  const html = await homeRes.text();
  assert(html.includes('AdNova'), 'Homepage HTML contains "AdNova"');
  assert(html.includes('Turn ideas into'), 'Homepage HTML contains tagline text');

  // Test 2: POST /api/generate without GROQ_API_KEY
  console.log('\n2. Testing POST /api/generate Missing Groq API Key Behavior');
  const noKeyRes = await fetch('http://localhost:3000/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert(noKeyRes.status === 401, 'Returns HTTP 401 when API key is missing');
  const noKeyJson = await noKeyRes.json();
  assert(noKeyJson.success === false, 'success is false');
  assert(noKeyJson.error.includes('API key is missing'), 'Error message clearly references missing API key');
  assert(!noKeyJson.stack, 'No stack trace leaked');

  console.log(`\n=== HTTP ENDPOINT RESULTS: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
