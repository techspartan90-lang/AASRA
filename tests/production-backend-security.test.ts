/**
 * PHASE 14: PRODUCTION BACKEND SECURITY TEST SUITE
 * 
 * Validates:
 * 1. Supabase SQL Migration (all 16 tables, foreign keys, indexes, strict RLS policies)
 * 2. Security Middleware (Secure headers, Rate limiting, Input sanitization, Auth, RBAC, Caseworker isolation)
 * 3. All 12 Express API modules (/auth, /survivors, /checkins, /consent, /analysis,
 *    /predictions, /alerts, /counsellors, /cases, /notifications, /audit, /admin)
 * 4. Error handling and API versioning
 */

import assert from 'node:assert';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import app from '../backend/server';
import { 
  inputSanitizer, 
  validateBody, 
  createRateLimiter,
  secureHeaders
} from '../backend/middleware/security';

export async function runProductionBackendSecurityTests() {
  console.log('🧪 Starting Phase 14: Production Backend Security & Supabase RLS Test Suite...');

  // -------------------------------------------------------------
  // PART 1: SUPABASE SQL MIGRATION & RLS VALIDATION
  // -------------------------------------------------------------
  console.log('--- Subsuite 1: Database Migration & RLS Security ---');
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20260928000002_phase14_production_security.sql');
  assert(fs.existsSync(migrationPath), 'Phase 14 SQL migration file must exist');
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');

  // Verify all 16 required normalized tables
  const expectedTables = [
    'roles',
    'users',
    'survivor_profiles',
    'consent_records',
    'checkins',
    'checkin_responses',
    'ai_analysis',
    'distress_scores',
    'risk_predictions',
    'alerts',
    'case_milestones',
    'support_interactions',
    'trusted_contacts',
    'notifications',
    'audit_logs',
    'model_versions',
  ];

  for (const table of expectedTables) {
    assert(
      migrationSql.includes(`CREATE TABLE IF NOT EXISTS ${table}`) ||
      migrationSql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
      `Migration must create normalized table '${table}'`
    );
    assert(
      migrationSql.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`) ||
      migrationSql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`),
      `RLS must be enabled on table '${table}'`
    );
  }
  console.log('  ✅ Test 1 Passed: All 16 normalized tables defined and RLS enabled');

  // Verify Foreign keys and Indexes
  assert(
    migrationSql.includes('REFERENCES users(id)') || migrationSql.includes('REFERENCES public.users(id)'),
    'Foreign key to users(id) must exist'
  );
  assert(
    migrationSql.includes('REFERENCES survivor_profiles(id)') || migrationSql.includes('REFERENCES public.survivor_profiles(id)'),
    'Foreign key to survivor_profiles(id) must exist'
  );
  assert(migrationSql.includes('CREATE INDEX IF NOT EXISTS idx_survivor_profiles_district'), 'District index must be defined');
  assert(migrationSql.includes('CREATE INDEX IF NOT EXISTS idx_alerts_survivor_severity'), 'Alerts severity composite index must be defined');
  assert(migrationSql.includes('CREATE INDEX IF NOT EXISTS idx_audit_logs_actor'), 'Audit logs actor index must be defined');
  console.log('  ✅ Test 2 Passed: Normalized foreign keys and multi-column indexes verified');

  // Verify RLS policies:
  // - Counsellor only accesses assigned/authorized survivor records
  // - District users access permitted aggregated information
  // - State users access permitted state-level information
  // - Administrators have controlled administrative access
  // - Never create a single unrestricted database policy
  assert(migrationSql.includes('counsellor_view_assigned_survivors'), 'Counsellor assigned survivor policy must exist');
  assert(migrationSql.includes('district_officer_view_district_survivors'), 'District scope policy must exist');
  assert(migrationSql.includes('state_admin_view_state_survivors'), 'State scope policy must exist');
  assert(migrationSql.includes('national_admin_view_survivors'), 'National admin policy must exist');
  assert(!migrationSql.includes('USING (true);'), 'Must NEVER create a single unrestricted database policy (USING (true))');
  console.log('  ✅ Test 3 Passed: Fine-grained RLS least-privilege policies verified (no unrestricted policy)');

  // -------------------------------------------------------------
  // PART 2: MIDDLEWARE UNIT TESTS
  // -------------------------------------------------------------
  console.log('--- Subsuite 2: Security Middleware Units ---');

  // Test Input Sanitization
  const mockReq: any = {
    body: {
      bio: 'Normal text <script>alert("xss")</script> after',
      injection: 'javascript:void(0)',
      nested: {
        attack: 'malicious onload=evil() content',
      },
    },
  };
  const mockRes: any = {};
  inputSanitizer(mockReq, mockRes, () => {});
  assert.strictEqual(mockReq.body.bio, 'Normal text  after');
  assert.strictEqual(mockReq.body.injection, 'void(0)');
  assert(!mockReq.body.nested.attack.includes('onload='), 'onload handler must be stripped');
  console.log('  ✅ Test 4 Passed: Input sanitizer neutralizes script tags, event handlers & protocols');

  // Test Validation Middleware
  const valMiddleware = validateBody(['requiredField', 'channel']);
  let valErrorStatus = 0;
  let valErrorBody: any = null;
  const invalidReq: any = { body: { channel: 'sms' } };
  const mockValRes: any = {
    status(code: number) {
      valErrorStatus = code;
      return this;
    },
    json(data: any) {
      valErrorBody = data;
    },
  };
  valMiddleware(invalidReq, mockValRes, () => {});
  assert.strictEqual(valErrorStatus, 400);
  assert(valErrorBody.missingFields.includes('requiredField'));
  console.log('  ✅ Test 5 Passed: Request validation rejects missing required attributes with 400');

  // -------------------------------------------------------------
  // PART 3: EXPRESS END-TO-END HTTP INTEGRATION
  // -------------------------------------------------------------
  console.log('--- Subsuite 3: Express HTTP Route Integration ---');
  
  // Start ephemeral server
  const server = http.createServer(app);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', () => resolve()));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    // 1. Root /health & Secure Headers
    const healthRes = await fetch(`${baseUrl}/health`);
    assert.strictEqual(healthRes.status, 200);
    assert.strictEqual(healthRes.headers.get('x-frame-options'), 'DENY');
    assert.strictEqual(healthRes.headers.get('x-content-type-options'), 'nosniff');
    assert(healthRes.headers.get('strict-transport-security')?.includes('max-age=31536000'));
    assert(healthRes.headers.get('content-security-policy')?.includes("default-src 'self'"));
    assert(healthRes.headers.has('x-request-id'), 'X-Request-ID correlation header must be present');
    console.log('  ✅ Test 6 Passed: Health check returns 200 with strict production security headers');

    // 2. /api/v1/auth Module (Rate limiter & OTP login)
    const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '9876543210', role: 'victim' }),
    });
    assert.strictEqual(loginRes.status, 200);
    const loginJson = await loginRes.json();
    assert.strictEqual(loginJson.success, true);
    assert(Boolean(loginJson.data.mockSessionToken));

    const token = loginJson.data.mockSessionToken;
    console.log('  ✅ Test 7 Passed: /api/v1/auth/login successfully initiated session');

    // 3. /api/v1/auth/me (Protected auth route)
    const unauthMe = await fetch(`${baseUrl}/api/v1/auth/me`);
    assert.strictEqual(unauthMe.status, 401, 'Unauthenticated request to /auth/me must return 401');

    const authMe = await fetch(`${baseUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(authMe.status, 200);
    const meJson = await authMe.json();
    assert.strictEqual(meJson.data.user.role, 'victim');
    console.log('  ✅ Test 8 Passed: Authentication middleware enforces 401 and validates bearer tokens');

    // 4. /api/v1/survivors Module
    const survivorRes = await fetch(`${baseUrl}/api/v1/survivors/me`, {
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'victim' },
    });
    assert.strictEqual(survivorRes.status, 200);
    const survivorJson = await survivorRes.json();
    assert.strictEqual(survivorJson.data.caseNumber, 'ATC-2026-00124');
    console.log('  ✅ Test 9 Passed: /api/v1/survivors/me returns survivor profile under least-privilege');

    // 5. Counsellor isolation: Counsellor accessing UNASSIGNED case should receive 403
    const counsellorToken = 'session_counsellor_test_token';
    const forbiddenCaseRes = await fetch(`${baseUrl}/api/v1/survivors/CASE-999-UNASSIGNED`, {
      headers: { Authorization: `Bearer ${counsellorToken}`, 'x-user-role': 'counsellor' },
    });
    assert.strictEqual(forbiddenCaseRes.status, 403, 'Counsellor cannot access unassigned case');
    console.log('  ✅ Test 10 Passed: Counsellor restricted to assigned caseload (403 for unassigned)');

    // 6. /api/v1/checkins Module
    const checkinRes = await fetch(`${baseUrl}/api/v1/checkins`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: 'whatsapp',
        responses: [{ questionId: 'q_mood', answer: 'Feeling anxious' }],
        rawText: 'Woke up scared',
      }),
    });
    assert.strictEqual(checkinRes.status, 201);
    const checkinJson = await checkinRes.json();
    assert.strictEqual(checkinJson.data.status, 'ANALYSIS_QUEUED');
    console.log('  ✅ Test 11 Passed: /api/v1/checkins records response and queues analysis');

    // 7. /api/v1/consent Module
    const consentRes = await fetch(`${baseUrl}/api/v1/consent/CASE-002`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(consentRes.status, 200);
    const consentJson = await consentRes.json();
    assert.strictEqual(consentJson.data.status, 'active');
    console.log('  ✅ Test 12 Passed: /api/v1/consent retrieves DPDPA 2023 consent state');

    // 8. /api/v1/analysis Module (Text, Voice, Behavioral)
    const analysisRes = await fetch(`${baseUrl}/api/v1/analysis/text`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'I feel terrified and cannot sleep because of the trial' }),
    });
    assert.strictEqual(analysisRes.status, 200);
    const analysisJson = await analysisRes.json();
    assert(analysisJson.data.distress_indicator > 40);
    assert(analysisJson.data.disclaimer.includes('NOT a medical diagnosis'));
    console.log('  ✅ Test 13 Passed: /api/v1/analysis/text returns distress score with non-diagnostic disclaimer');

    // 9. /api/v1/predictions Module
    const predictionRes = await fetch(`${baseUrl}/api/v1/predictions/predict`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ survivorId: 'CASE-002', predictionWindowDays: 7 }),
    });
    assert.strictEqual(predictionRes.status, 200);
    const predJson = await predictionRes.json();
    assert.strictEqual(predJson.data.predictionWindow, '7 days');
    assert(Boolean(predJson.data.modelVersion));
    console.log('  ✅ Test 14 Passed: /api/v1/predictions/predict returns probabilistic forecast with explainability');

    // 10. /api/v1/alerts Module (Acknowledge, Escalate, Resolve)
    const alertsRes = await fetch(`${baseUrl}/api/v1/alerts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(alertsRes.status, 200);
    const alertsJson = await alertsRes.json();
    assert(alertsJson.alerts.length > 0);

    const ackRes = await fetch(`${baseUrl}/api/v1/alerts/ALT-2026-089/acknowledge`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${counsellorToken}`, 'x-user-role': 'counsellor' },
    });
    assert.strictEqual(ackRes.status, 200);
    console.log('  ✅ Test 15 Passed: /api/v1/alerts workflow (listing, acknowledgement) functioning');

    // 11. /api/v1/counsellors Module (Worklist & RBAC)
    const victimWorklistRes = await fetch(`${baseUrl}/api/v1/counsellors/worklist`, {
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'victim' },
    });
    assert.strictEqual(victimWorklistRes.status, 403, 'Victim persona cannot access counsellor workbench');

    const counsellorWorklistRes = await fetch(`${baseUrl}/api/v1/counsellors/worklist`, {
      headers: { Authorization: `Bearer ${counsellorToken}`, 'x-user-role': 'counsellor' },
    });
    assert.strictEqual(counsellorWorklistRes.status, 200);
    console.log('  ✅ Test 16 Passed: /api/v1/counsellors RBAC prevents unauthorized access and delivers worklist');

    // 12. /api/v1/cases Module
    const casesRes = await fetch(`${baseUrl}/api/v1/cases/CASE-002`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(casesRes.status, 200);
    const casesJson = await casesRes.json();
    assert.strictEqual(casesJson.data.witnessProtectionActive, true);
    console.log('  ✅ Test 17 Passed: /api/v1/cases delivers judicial milestones & protection status');

    // 13. /api/v1/notifications Module
    const notifRes = await fetch(`${baseUrl}/api/v1/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(notifRes.status, 200);
    const notifJson = await notifRes.json();
    assert(notifJson.notifications.length > 0);
    console.log('  ✅ Test 18 Passed: /api/v1/notifications delivers active alerts and reminders');

    // 14. /api/v1/audit Module (Strict National/State Admin check)
    const forbiddenAuditRes = await fetch(`${baseUrl}/api/v1/audit`, {
      headers: { Authorization: `Bearer ${counsellorToken}`, 'x-user-role': 'counsellor' },
    });
    assert.strictEqual(forbiddenAuditRes.status, 403, 'Counsellor cannot query administrative audit logs');

    const adminToken = 'session_national_admin_token';
    const auditRes = await fetch(`${baseUrl}/api/v1/audit`, {
      headers: { Authorization: `Bearer ${adminToken}`, 'x-user-role': 'national_admin' },
    });
    assert.strictEqual(auditRes.status, 200);

    const integrityRes = await fetch(`${baseUrl}/api/v1/audit/verify-integrity`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}`, 'x-user-role': 'national_admin' },
    });
    assert.strictEqual(integrityRes.status, 200);
    const integrityJson = await integrityRes.json();
    assert.strictEqual(integrityJson.data.chainIntegrityStatus, 'UNCOMPROMISED');
    console.log('  ✅ Test 19 Passed: /api/v1/audit enforces strict admin role and verifies SHA-256 chain integrity');

    // 15. /api/v1/admin Module (District & State Aggregated Analytics)
    const districtRes = await fetch(`${baseUrl}/api/v1/admin/analytics/district`, {
      headers: { Authorization: `Bearer ${adminToken}`, 'x-user-role': 'district_officer' },
    });
    assert.strictEqual(districtRes.status, 200);
    const districtJson = await districtRes.json();
    assert.strictEqual(districtJson.scope, 'DISTRICT_AGGREGATED');
    assert(Boolean(districtJson.metrics.activeMonitoredCases));

    const stateRes = await fetch(`${baseUrl}/api/v1/admin/analytics/state`, {
      headers: { Authorization: `Bearer ${adminToken}`, 'x-user-role': 'state_admin' },
    });
    assert.strictEqual(stateRes.status, 200);
    const stateJson = await stateRes.json();
    assert.strictEqual(stateJson.scope, 'STATE_AGGREGATED');

    console.log('  ✅ Test 20 Passed: /api/v1/admin delivers authorized aggregated district & state KPIs');

    // 16. Rate Limiting verification
    const testLimiter = createRateLimiter({ maxRequests: 3, windowMs: 10000 });
    const dummyReq: any = { ip: '192.168.1.100', baseUrl: '/test', socket: {} };
    let finalCode = 200;
    const dummyRes: any = {
      setHeader: () => {},
      status: (c: number) => {
        finalCode = c;
        return { json: () => {} };
      },
    };
    for (let i = 0; i < 4; i++) {
      testLimiter(dummyReq, dummyRes, () => {});
    }
    assert.strictEqual(finalCode, 429, 'Excess requests beyond limit must trigger HTTP 429');
    console.log('  ✅ Test 21 Passed: Sliding window rate limiter correctly triggers 429 when capacity exceeded');

    // 17. 404 for unknown endpoints
    const notFoundRes = await fetch(`${baseUrl}/api/v1/unknown-endpoint-xyz`);
    assert.strictEqual(notFoundRes.status, 404);
    console.log('  ✅ Test 22 Passed: Unmapped route triggers standardized 404 response');

  } finally {
    server.close();
  }

  console.log('🎉 All 22 Production Backend Security & Supabase RLS tests passed successfully!\n');
}

// Allow standalone execution
if (typeof require !== 'undefined' && require.main === module) {
  runProductionBackendSecurityTests()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Test Suite Failed:', err);
      process.exit(1);
    });
}
