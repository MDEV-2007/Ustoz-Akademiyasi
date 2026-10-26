// Comprehensive End-to-End Integration Test for Ustoz Akademiyasi

async function runTests() {
  console.log('====================================================');
  console.log('USTOZ AKADEMIYASI — FULL INTEGRATION TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      process.stdout.write(`• Checking ${name}... `);
      await fn();
      console.log('[\x1b[32mPASS\x1b[0m]');
      passed++;
    } catch (err) {
      console.log('[\x1b[31mFAIL\x1b[0m]');
      console.error('  Error:', err.message);
      failed++;
    }
  }

  // 1. NestJS & Database Health
  await check('NestJS + PostgreSQL Health Check', async () => {
    const res = await fetch('http://localhost:4000/api/v1/health/ready');
    if (!res.ok) throw new Error(`Health returned ${res.status}`);
    const data = await res.json();
    const payload = data.data || data;
    if (payload.status !== 'ok' || payload.database !== 'connected') {
      throw new Error(`Unexpected health payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. Public Courses
  await check('Live Courses Endpoint (/public/courses)', async () => {
    const res = await fetch('http://localhost:4000/api/v1/public/courses');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('No courses returned');
    }
    const fonetika = data.data.find(c => c.slug === 'professional-fonetika');
    if (!fonetika) throw new Error('professional-fonetika course not found');
  });

  // 3. Public Branches
  await check('Live Branches Endpoint (/public/branches)', async () => {
    const res = await fetch('http://localhost:4000/api/v1/public/branches');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length < 8) {
      throw new Error(`Expected at least 8 branches, got ${data.data?.length}`);
    }
  });

  // 4. Public Teachers
  await check('Live Teachers Endpoint (/public/teachers)', async () => {
    const res = await fetch('http://localhost:4000/api/v1/public/teachers');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('Teachers list failed');
    }
  });

  // 5. Public Articles
  await check('Live Articles Endpoint (/public/articles)', async () => {
    const res = await fetch('http://localhost:4000/api/v1/public/articles');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('Articles list failed');
    }
  });

  // 6. Public FAQs
  await check('Live FAQs Endpoint (/public/faqs)', async () => {
    const res = await fetch('http://localhost:4000/api/v1/public/faqs');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      throw new Error('FAQs list failed');
    }
  });

  // 7. Site Settings
  await check('Live Site Settings Endpoint (/public/site-settings)', async () => {
    const res = await fetch('http://localhost:4000/api/v1/public/site-settings');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.data || !data.data.contact_info?.phoneDisplay) {
      throw new Error('Site settings payload missing');
    }
  });

  // 8. Next.js Internal Proxy Validation Rejection (HTTP 400)
  await check('Next.js API route rejects invalid registration (HTTP 400)', async () => {
    const res = await fetch('http://localhost:3000/api/trial-registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: 'Ali' }), // missing phone
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 9. Next.js End-to-End Registration (HTTP 201 + Real Reference ID)
  const testPhone = '+99890' + Math.floor(1000000 + Math.random() * 9000000);
  let savedRefId = null;

  await check('Next.js API route persists new trial registration (HTTP 201)', async () => {
    const res = await fetch('http://localhost:3000/api/trial-registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Kamronbek Oripov (Avto-test)',
        phone: testPhone,
        courseSlug: 'professional-fonetika',
        branchSlug: 'archakocha',
        notes: 'Avtomatlashtirilgan integratsiya testi',
      }),
    });
    if (res.status !== 201 && !res.ok) {
      const err = await res.text();
      throw new Error(`Expected 201 Created, got ${res.status}: ${err}`);
    }
    const data = await res.json();
    if (!data.referenceId || !data.referenceId.startsWith('UA-')) {
      throw new Error(`Expected UA- referenceId, got ${data.referenceId}`);
    }
    savedRefId = data.referenceId;
  });

  // 10. Next.js Duplicate Registration Rejection (HTTP 409 Conflict)
  await check('Next.js API route detects duplicate registration (HTTP 409 Conflict)', async () => {
    const res = await fetch('http://localhost:3000/api/trial-registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Kamronbek Oripov (Avto-test)',
        phone: testPhone, // Same phone and course within 24h
        courseSlug: 'professional-fonetika',
        branchSlug: 'archakocha',
        notes: 'Takroriy ariza testi',
      }),
    });
    if (res.status !== 409) {
      const txt = await res.text();
      throw new Error(`Expected 409 Conflict, got ${res.status}: ${txt}`);
    }
    const data = await res.json();
    const errMsg = data.message || data.error;
    if (!errMsg || !errMsg.includes('yaqinda ariza yuborilgan')) {
      throw new Error(`Expected duplicate message, got ${JSON.stringify(data)}`);
    }
  });

  console.log(`\n====================================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`Sample Reference ID generated in PostgreSQL: ${savedRefId}`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
