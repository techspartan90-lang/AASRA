'use client';

import React, { useState, useEffect } from 'react';
import { useApp, FontSizeOption } from '@/lib/store';
import { authService, AuthUserProfile, DEMO_USERS } from '@/lib/auth-service';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from '@/lib/i18n';
import { UserRole } from '@/types';
import {
  Shield,
  Lock,
  Mail,
  Phone,
  KeyRound,
  ArrowRight,
  Eye,
  EyeOff,
  Languages,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  X,
  Type,
  Sun,
  Moon,
  Smartphone,
  Check,
  ShieldCheck,
  User,
} from 'lucide-react';

interface SecureLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUserProfile, isNewSurvivor?: boolean) => void;
  initialRoleHint?: UserRole;
}

export function SecureLoginModal({
  isOpen,
  onClose,
  onSuccess,
  initialRoleHint,
}: SecureLoginModalProps) {
  const { language, setLanguage, theme, setTheme, fontSize, setFontSize, setRole } = useApp();

  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState(() =>
    initialRoleHint && DEMO_USERS[initialRoleHint] ? DEMO_USERS[initialRoleHint].email : ''
  );
  const [prevRoleHint, setPrevRoleHint] = useState(initialRoleHint);
  if (initialRoleHint !== prevRoleHint) {
    setPrevRoleHint(initialRoleHint);
    if (initialRoleHint && DEMO_USERS[initialRoleHint]) {
      setIdentifier(DEMO_USERS[initialRoleHint].email);
    }
  }
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  // Countdown timer for OTP
  useEffect(() => {
    if (otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpTimer]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered email address or mobile number.');
      return;
    }
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.sendOtp(identifier);
      if (res.success) {
        setOtpSent(true);
        setOtpTimer(60);
        setInfoMessage(res.message);
      } else {
        setErrorMessage(res.error || 'Failed to dispatch OTP.');
      }
    } catch {
      setErrorMessage('Network or service error while requesting OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please provide an email or phone number.');
      return;
    }

    setIsLoading(true);
    try {
      let result: { user: AuthUserProfile | null; error: string | null };

      if (authMethod === 'otp') {
        if (!otpCode.trim()) {
          setErrorMessage('Please enter the 6-digit OTP code.');
          setIsLoading(false);
          return;
        }
        result = await authService.signInWithOtp(identifier, otpCode);
      } else {
        if (!password.trim() && !identifier.includes('demo')) {
          setErrorMessage('Please enter your account password.');
          setIsLoading(false);
          return;
        }
        result = await authService.signIn(identifier, password);
      }

      if (result.error || !result.user) {
        setErrorMessage(result.error || 'Authentication credentials were not recognized.');
      } else {
        // Successful authentication
        setRole(result.user.role);
        const isSurvivor = result.user.role === 'victim';
        onSuccess(result.user, isSurvivor);
        onClose();
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication encountered an unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to load credentials for one of the 5 authorized roles
  const handleAutofillDemoAccount = (roleKey: UserRole) => {
    const targetUser = DEMO_USERS[roleKey];
    if (targetUser) {
      setIdentifier(targetUser.email);
      setPassword('Aasra@2026');
      setOtpCode('123456');
      setErrorMessage(null);
      setInfoMessage(`Autofilled credentials for: ${targetUser.name} (${targetUser.email}). Role is securely resolved from account profile.`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors">
        {/* Header Bar */}
        <div className="bg-[#FFF7FA] text-[#111111] dark:bg-[#111116] dark:text-white px-6 py-5 flex items-center justify-between border-b border-[#F1D5DE] dark:border-[#2A2028]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B91C1C] dark:bg-[#EC4899] flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 id="login-modal-title" className="text-base font-bold tracking-tight text-[#111111] dark:text-white">
                Manas Suraksha Access
              </h2>
              <p className="text-xs text-[#64748B] dark:text-[#B8B8C2]">
                Secure, Role-Authenticated Government Welfare Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#17171D] hover:bg-[#FFF0F5] dark:hover:bg-[#22141F] border border-[#F1D5DE] dark:border-[#2A2028] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accessibility & Language Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-850 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
              aria-label="Select language for login screen"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Accessibility Controls: Font Size & High Contrast */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-0.5">
              {(['normal', 'large', 'extra-large'] as FontSizeOption[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                    fontSize === size
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  }`}
                  title={`Font size: ${size}`}
                >
                  {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              title="Toggle theme contrast"
              aria-label="Toggle theme contrast"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Method Tabs: Password vs OTP */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMethod === 'password'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Password Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                authMethod === 'otp'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile OTP Login</span>
            </button>
          </div>

          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Identifier: Email or Mobile */}
            <div>
              <label htmlFor="login-identifier" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Registered Email or 10-Digit Mobile Number
              </label>
              <div className="relative">
                <input
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or your.name@aasra.gov.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                  autoComplete="username"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Password Field (when authMethod === 'password') */}
            {authMethod === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('otp');
                      handleSendOtp();
                    }}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot password? Use OTP
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition"
                    autoComplete="current-password"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* OTP Field (when authMethod === 'otp') */}
            {authMethod === 'otp' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="login-otp" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    6-Digit Verification Code (OTP)
                  </label>
                  <button
                    type="button"
                    disabled={otpTimer > 0 || isLoading}
                    onClick={handleSendOtp}
                    className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {otpTimer > 0 ? `Resend in ${otpTimer}s` : otpSent ? 'Resend Code' : 'Send Code'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="login-otp"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 123456"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono tracking-widest text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition text-center"
                    autoComplete="one-time-code"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    Click to Send 6-Digit OTP to Provided Contact
                  </button>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 min-h-[44px]"
            >
              {isLoading ? (
                <span>Authenticating with Sovereign Keyring...</span>
              ) : (
                <>
                  <span>Sign In &amp; Verify Identity</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Non-Commercial Notice */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Data Protection &amp; Confidentiality Guarantee</span>
            </div>
            <p>
              In compliance with the Digital Personal Data Protection Act (DPDPA), role permissions and access tokens are strictly verified server-side. Your session is end-to-end encrypted with automatic inactivity logout.
            </p>
          </div>

          {/* Authorized Demo Credentials Directory (Phase 2 Requirement) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Evaluation Accounts (Backend Role Resolution)
              </span>
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {showDemoAccounts ? 'Hide' : 'Show Accounts'}
              </button>
            </div>

            {showDemoAccounts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* 1. Survivor */}
                <button
                  type="button"
                  onClick={() => handleAutofillDemoAccount('victim')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-800/40 text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">1. Survivor</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Citizen
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Ananya Sharma (9876543210)
                  </p>
                </button>

                {/* 2. Counsellor */}
                <button
                  type="button"
                  onClick={() => handleAutofillDemoAccount('counsellor')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-800/40 text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">2. Counsellor</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                      Clinical
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Dr. Priya Nair (priya.nair@crisis-monitor.in)
                  </p>
                </button>

                {/* 3. District Officer */}
                <button
                  type="button"
                  onClick={() => handleAutofillDemoAccount('district_officer')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-800/40 text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">3. District Officer</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      Welfare
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    R. K. Barua (Kamrup Metro)
                  </p>
                </button>

                {/* 4. State Officer */}
                <button
                  type="button"
                  onClick={() => handleAutofillDemoAccount('state_admin')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-800/40 text-left transition cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">4. State Officer</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      State Admin
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Sunita Bora (Assam State)
                  </p>
                </button>

                {/* 5. Administrator */}
                <button
                  type="button"
                  onClick={() => handleAutofillDemoAccount('national_admin')}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50/70 dark:bg-slate-800/40 text-left transition cursor-pointer sm:col-span-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">5. Administrator</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200">
                      National Oversight
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    Director General Verma (director.crisis-monitor@gov.in)
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
