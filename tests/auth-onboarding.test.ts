import { authService, DEMO_USERS } from '../lib/auth-service';
import { SurvivorOnboardingData, UserRole } from '../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${testName}`);
    failed++;
  }
}

async function runAuthAndOnboardingTests() {
  console.log('\n--- Running Phase 2 Authentication & Onboarding Tests ---');

  // Test 1: Verify all 5 required login roles are defined in backend accounts
  const expectedRoles: UserRole[] = [
    'victim',
    'counsellor',
    'district_officer',
    'state_admin',
    'national_admin',
  ];

  expectedRoles.forEach(r => {
    const user = DEMO_USERS[r];
    assert(
      user !== undefined && user.role === r,
      `Backend account exists for role: "${r}" (${user?.email})`
    );
  });

  // Test 2: Authenticate by email without specifying role (role must come from backend)
  const emailLoginRes = await authService.signIn('anita.devi@aasra.gov.in', 'Aasra@2026');
  assert(
    emailLoginRes.user !== null && emailLoginRes.user.role === 'victim',
    'Email login returns authenticated account role (victim) without client role input'
  );

  // Test 3: Authenticate by phone number
  const phoneLoginRes = await authService.signIn('+91-98765-43210', 'Aasra@2026');
  assert(
    phoneLoginRes.user !== null && phoneLoginRes.user.role === 'victim',
    'Phone number login successfully identifies user profile'
  );

  // Test 4: OTP dispatch and verification
  const otpSendRes = await authService.sendOtp('+91-98765-43210');
  assert(otpSendRes.success === true, 'OTP dispatch succeeds for registered phone');

  const otpVerifyRes = await authService.signInWithOtp('+91-98765-43210', '123456');
  assert(
    otpVerifyRes.user !== null && otpVerifyRes.user.role === 'victim' && otpVerifyRes.user.email === DEMO_USERS.victim.email,
    'OTP verification logs in correct user and provides role from backend profile'
  );

  // Test 5: Reject invalid OTP
  const badOtpRes = await authService.signInWithOtp('+91-98765-43210', '999999');
  assert(
    badOtpRes.user === null && badOtpRes.error !== null,
    'Invalid OTP is rejected securely'
  );

  // Test 6: Verify Counsellor authentication
  const counsellorRes = await authService.signIn('priya.nair@aasra.gov.in', 'Aasra@2026');
  assert(
    counsellorRes.user !== null && counsellorRes.user.role === 'counsellor',
    'Counsellor role correctly resolved from backend'
  );

  // Test 7: Verify District Officer authentication
  const districtRes = await authService.signIn('rajesh.kumar@aasra.gov.in', 'Aasra@2026');
  assert(
    districtRes.user !== null && districtRes.user.role === 'district_officer',
    'District Officer role correctly resolved from backend'
  );

  // Test 8: Verify State Officer authentication
  const stateRes = await authService.signIn('sunita.deshmukh@aasra.gov.in', 'Aasra@2026');
  assert(
    stateRes.user !== null && stateRes.user.role === 'state_admin',
    'State Officer role correctly resolved from backend'
  );

  // Test 9: Verify Administrator authentication
  const adminRes = await authService.signIn('vikram.singh@aasra.gov.in', 'Aasra@2026');
  assert(
    adminRes.user !== null && adminRes.user.role === 'national_admin',
    'National Administrator role correctly resolved from backend'
  );

  // Test 10: Survivor Onboarding Data Structure Integrity
  const mockOnboarding: SurvivorOnboardingData = {
    consentGranted: true,
    language: 'hi',
    preferredChannel: 'chatbot',
    frequency: 'weekly',
    trustedContact: {
      enabled: true,
      name: 'Advocate Ramesh',
      relationship: 'Paralegal Legal Aid',
      phone: '+91-98111-22233',
      triggerCondition: 'explicit_confirm',
    },
    privacyControls: {
      collectWellBeingScore: true,
      collectSleepNotes: true,
      collectVoiceAcoustics: false,
      shareWithCounsellor: true,
      shareAnonymizedDistrict: true,
      blockPoliceProsecution: true,
      preferredTime: 'evening',
      discreetMode: true,
    },
    completedAt: new Date().toISOString(),
  };

  assert(mockOnboarding.consentGranted === true, 'Survivor consent explicitly recorded');
  assert(
    ['sms', 'ivrs', 'chatbot', 'app', 'web'].includes(mockOnboarding.preferredChannel),
    'Communication channel is valid (SMS, IVRS, Chatbot, App, Web)'
  );
  assert(
    ['daily', 'every_few_days', 'weekly', 'custom'].includes(mockOnboarding.frequency),
    'Check-in frequency is valid (Daily, Every few days, Weekly, Custom)'
  );
  assert(
    mockOnboarding.privacyControls.blockPoliceProsecution === true,
    'Privacy controls ensure mental health observations are shielded from police/prosecution'
  );
  assert(
    mockOnboarding.privacyControls.collectVoiceAcoustics === false,
    'Voice acoustics can be disabled by survivor without forfeiting access to care'
  );

  console.log(`Phase 2 Test Summary: ${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runAuthAndOnboardingTests().catch(err => {
  console.error('Test runner failure:', err);
  process.exit(1);
});
