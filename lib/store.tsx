'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  CaseRecord,
  RiskAlert,
  Intervention,
  NotificationItem,
  AuditLogItem,
  UserConsent,
  RiskLevel,
  SurvivorOnboardingData,
} from '@/types';
import {
  INITIAL_CASES,
  INITIAL_ALERTS,
  INITIAL_INTERVENTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONSENT,
} from '@/lib/mock-data';
import { SupportedLanguage } from '@/lib/i18n';
import { calculateDistressAnalysis, AnalysisInput, AnalysisResult } from '@/lib/ai-service';
import { AuthUserProfile, DEMO_USERS } from '@/lib/auth-service';
import {
  canViewCase as checkCanViewCase,
  canEditCase as checkCanEditCase,
  canCreateIntervention as checkCanCreateIntervention,
  canViewAnalytics as checkCanViewAnalytics,
} from '@/lib/access-control';
import { getSupabaseConfig } from '@/lib/supabase';

export type FontSizeOption = 'normal' | 'large' | 'extra-large';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: AuthUserProfile;
  canViewCase: (caseRecord: CaseRecord) => boolean;
  canEditCase: (caseRecord: CaseRecord) => boolean;
  canCreateIntervention: (caseRecord: CaseRecord) => boolean;
  canViewAnalytics: () => boolean;
  isSupabaseConfigured: boolean;

  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;

  cases: CaseRecord[];
  alerts: RiskAlert[];
  interventions: Intervention[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  consent: UserConsent;

  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;

  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isEmergencyModalOpen: boolean;
  setIsEmergencyModalOpen: (open: boolean) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
  isVoiceAssistantOpen: boolean;
  setIsVoiceAssistantOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isOnboardingModalOpen: boolean;
  setIsOnboardingModalOpen: (open: boolean) => void;
  survivorOnboardingData: SurvivorOnboardingData | null;
  setSurvivorOnboardingData: (data: SurvivorOnboardingData | null) => void;

  submitVictimCheckIn: (input: AnalysisInput, targetCaseId?: string) => Promise<AnalysisResult>;
  resolveAlert: (alertId: string, status?: 'reviewed' | 'resolved') => void;
  createIntervention: (data: Omit<Intervention, 'id'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updateConsent: (key: keyof UserConsent, value: boolean) => void;
  resetDemoData: () => void;
  runGuidedDemoStep: (stepNumber: number) => void;
  demoStep: number;
  setDemoStep: (step: number) => void;
  demoActive: boolean;
  setDemoActive: (active: boolean) => void;
  isClientHydrated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'aasra_app_state_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('victim');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('light');
  const [fontSize, setFontSize] = useState<FontSizeOption>('normal');
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_CASES);
  const [alerts, setAlerts] = useState<RiskAlert[]>(INITIAL_ALERTS);
  const [interventions, setInterventions] = useState<Intervention[]>(INITIAL_INTERVENTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [consent, setConsent] = useState<UserConsent>(INITIAL_CONSENT);

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('CASE-002');

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [survivorOnboardingData, setSurvivorOnboardingData] = useState<SurvivorOnboardingData | null>(null);

  const [demoStep, setDemoStep] = useState(0);
  const [demoActive, setDemoActive] = useState(false);
  const [isClientHydrated, setIsClientHydrated] = useState(false);

  const isSupabaseConfigured = useMemo(() => getSupabaseConfig().isConfigured, []);

  const currentUser: AuthUserProfile = useMemo(() => {
    return DEMO_USERS[role] || DEMO_USERS.victim;
  }, [role]);

  const canViewCase = (caseRecord: CaseRecord) => checkCanViewCase(currentUser, caseRecord);
  const canEditCase = (caseRecord: CaseRecord) => checkCanEditCase(currentUser, caseRecord);
  const canCreateIntervention = (caseRecord: CaseRecord) => checkCanCreateIntervention(currentUser, caseRecord);
  const canViewAnalytics = () => checkCanViewAnalytics(currentUser);

  // Hydrate state from localStorage safely on client mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const explicitTheme = localStorage.getItem('manas-suraksha-theme');
        const saved = localStorage.getItem(STORAGE_KEY);
        let parsed: any = null;
        if (saved) {
          try {
            parsed = JSON.parse(saved);
          } catch {}
        }

        if (explicitTheme === 'light' || explicitTheme === 'dark') {
          setThemeState(explicitTheme);
        } else if (parsed?.theme) {
          setThemeState(parsed.theme);
        } else if (typeof window !== 'undefined' && window.matchMedia) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setThemeState(prefersDark ? 'dark' : 'light');
        }

        if (parsed) {
          if (parsed.role) setRoleState(parsed.role);
          if (parsed.language) setLanguage(parsed.language);
          if (parsed.fontSize) setFontSize(parsed.fontSize);
          if (parsed.cases && Array.isArray(parsed.cases)) setCases(parsed.cases);
          if (parsed.alerts && Array.isArray(parsed.alerts)) setAlerts(parsed.alerts);
          if (parsed.interventions && Array.isArray(parsed.interventions)) setInterventions(parsed.interventions);
          if (parsed.notifications && Array.isArray(parsed.notifications)) setNotifications(parsed.notifications);
          if (parsed.auditLogs && Array.isArray(parsed.auditLogs)) setAuditLogs(parsed.auditLogs);
          if (parsed.consent) setConsent(parsed.consent);
          if (parsed.survivorOnboardingData) setSurvivorOnboardingData(parsed.survivorOnboardingData);
        }
      } catch {
        // ignore JSON parse or storage errors
      } finally {
        setIsClientHydrated(true);
      }
    });

    return () => cancelAnimationFrame(handle);
  }, []);

  // Save to localStorage when critical entities change (only after client has hydrated)
  useEffect(() => {
    if (!isClientHydrated) return;
    try {
      localStorage.setItem('manas-suraksha-theme', theme === 'dark' ? 'dark' : 'light');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          role,
          cases,
          alerts,
          interventions,
          notifications,
          auditLogs,
          consent,
          theme,
          fontSize,
          language,
          survivorOnboardingData,
        })
      );
    } catch {
      // storage quota or private browsing
    }
  }, [isClientHydrated, role, cases, alerts, interventions, notifications, auditLogs, consent, theme, fontSize, language, survivorOnboardingData]);

  // Apply theme class and data-theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      try { localStorage.setItem('manas-suraksha-theme', 'dark'); } catch {}
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      try { localStorage.setItem('manas-suraksha-theme', 'light'); } catch {}
    } else {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applySystemTheme = () => {
        if (mediaQuery.matches) {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      };
      applySystemTheme();
      mediaQuery.addEventListener('change', applySystemTheme);
      return () => mediaQuery.removeEventListener('change', applySystemTheme);
    }
  }, [theme]);

  // Keyboard shortcut for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Add audit log
    const newLog: AuditLogItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: `User (${newRole})`,
      actorRole: newRole,
      action: 'ROLE_SWITCH',
      resource: 'SYSTEM_VIEWPORT',
      district: 'Session Context',
      purpose: 'Switched user interface role in demonstration environment',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
  };

  const submitVictimCheckIn = async (input: AnalysisInput, targetCaseId = 'CASE-002'): Promise<AnalysisResult> => {
    const currentCase = cases.find(c => c.id === targetCaseId) || cases[0];

    // Compute analysis
    let analysisResult: AnalysisResult;
    try {
      const res = await fetch('/api/ai/analyze-checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...input,
          previousScore: currentCase.currentScore,
          baselineScore: currentCase.baselineScore,
          missedCheckIns: currentCase.missedCheckInsCount,
        }),
      });
      if (res.ok) {
        analysisResult = await res.json();
      } else {
        analysisResult = calculateDistressAnalysis({
          ...input,
          previousScore: currentCase.currentScore,
          baselineScore: currentCase.baselineScore,
          missedCheckIns: currentCase.missedCheckInsCount,
        });
      }
    } catch {
      analysisResult = calculateDistressAnalysis({
        ...input,
        previousScore: currentCase.currentScore,
        baselineScore: currentCase.baselineScore,
        missedCheckIns: currentCase.missedCheckInsCount,
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newTrendPoint = {
      date: todayStr,
      score: analysisResult.computedScore,
      eventNote: `Periodic Check-In: ${analysisResult.riskLabel}`,
      isCheckIn: true,
    };

    // Update case record
    setCases(prev =>
      prev.map(c => {
        if (c.id === targetCaseId) {
          return {
            ...c,
            previousScore: c.currentScore,
            currentScore: analysisResult.computedScore,
            riskLevel: analysisResult.riskLevel,
            lastCheckInDate: todayStr,
            missedCheckInsCount: 0,
            recentSignals: analysisResult.contributingSignals,
            trendHistory: [...c.trendHistory, newTrendPoint],
          };
        }
        return c;
      })
    );

    // If elevated or high, generate RiskAlert
    if (analysisResult.riskLevel === 'elevated' || analysisResult.riskLevel === 'high') {
      const newAlert: RiskAlert = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        caseId: currentCase.id,
        caseCode: currentCase.anonymizedCode,
        district: `${currentCase.district}, ${currentCase.state}`,
        riskLevel: analysisResult.riskLevel,
        title: `${analysisResult.riskLabel}: Recent Check-in Indicator Change`,
        reason: analysisResult.explanationSummary,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: analysisResult.riskLevel === 'high' ? 'urgent' : 'pending',
        signals: analysisResult.contributingSignals,
        assignedTo: currentCase.assignedCounsellor,
      };

      setAlerts(prev => [newAlert, ...prev]);

      // Add notification for counsellors
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        type: 'alert',
        title: `${analysisResult.riskLabel} Detected`,
        message: `Case ${currentCase.id} registered a score of ${analysisResult.computedScore}. Human follow-up recommended.`,
        timestamp: 'Just now',
        read: false,
        linkCaseId: currentCase.id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    } else {
      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        type: 'check_in',
        title: 'Check-in Recorded',
        message: `Case ${currentCase.id} completed check-in. Indicators remain in stable parameters.`,
        timestamp: 'Just now',
        read: false,
        linkCaseId: currentCase.id,
      };
      setNotifications(prev => [newNotif, ...prev]);
    }

    // Add Audit Log entry
    const auditItem: AuditLogItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: `Complainant (${currentCase.anonymizedCode})`,
      actorRole: 'victim',
      action: 'CHECK_IN_SUBMISSION',
      resource: currentCase.id,
      district: currentCase.district,
      purpose: 'Voluntary periodic well-being check-in recorded for early distress monitoring',
    };
    setAuditLogs(prev => [auditItem, ...prev]);

    // Background sync to persistent check-ins API
    fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId: targetCaseId,
        userId: currentUser.id,
        feelingScore: input.feelingScore,
        safetyScore: input.safetyScore,
        sleepScore: input.sleepScore,
        fearScore: input.fearScore,
        avoidanceScore: input.avoidanceScore,
        requestHelp: input.requestHelp,
        notes: input.notes,
        hasVoiceSample: input.hasVoiceSample,
      }),
    }).catch((err) => {
      // Non-blocking background sync error
      console.warn('Background checkin API sync:', err);
    });

    return analysisResult;
  };

  const resolveAlert = (alertId: string, status: 'reviewed' | 'resolved' = 'resolved') => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, status } : a))
    );

    // Background sync alert resolution
    fetch(`/api/alerts/${alertId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch((err) => console.warn('Background alert PATCH:', err));

    const targetAlert = alerts.find(a => a.id === alertId);
    if (targetAlert) {
      const auditItem: AuditLogItem = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actor: 'Authorized Caseworker',
        actorRole: role,
        action: status === 'reviewed' ? 'ALERT_REVIEWED' : 'ALERT_RESOLVED',
        resource: alertId,
        district: targetAlert.district,
        purpose: `Human professional completed clinical triage and marked alert as ${status}`,
      };
      setAuditLogs(prev => [auditItem, ...prev]);
    }
  };

  const createIntervention = (data: Omit<Intervention, 'id'>) => {
    const newIntervention: Intervention = {
      ...data,
      id: `INT-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setInterventions(prev => [newIntervention, ...prev]);

    // Background sync to persistent interventions API
    fetch('/api/interventions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caseId: newIntervention.caseId,
        type: newIntervention.category,
        description: `${newIntervention.title}: ${newIntervention.description}`,
        assignedTo: newIntervention.assignedProfessional,
        notes: newIntervention.outcomeNotes || '',
        userId: currentUser.id,
      }),
    }).catch(err => console.warn('Background intervention API sync:', err));

    // Notification
    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'intervention',
      title: 'Intervention Scheduled',
      message: `${newIntervention.title} recorded for Case ${newIntervention.caseId}.`,
      timestamp: 'Just now',
      read: false,
      linkCaseId: newIntervention.caseId,
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Audit log
    const auditItem: AuditLogItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Case Worker / District Officer',
      actorRole: role,
      action: 'INTERVENTION_CREATION',
      resource: newIntervention.id,
      district: 'Case Jurisdiction',
      purpose: `Human decision: authorized ${newIntervention.category} support action`,
    };
    setAuditLogs(prev => [auditItem, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateConsent = (key: keyof UserConsent, value: boolean) => {
    setConsent(prev => ({
      ...prev,
      [key]: value,
      lastUpdated: new Date().toISOString().split('T')[0],
    }));

    const auditItem: AuditLogItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: 'Complainant',
      actorRole: 'victim',
      action: 'CONSENT_PREFERENCE_UPDATE',
      resource: `CONSENT_${String(key).toUpperCase()}`,
      district: 'User Profile',
      purpose: `Individual updated privacy permission: ${String(key)} set to ${value}`,
    };
    setAuditLogs(prev => [auditItem, ...prev]);
  };

  const resetDemoData = () => {
    setCases(INITIAL_CASES);
    setAlerts(INITIAL_ALERTS);
    setInterventions(INITIAL_INTERVENTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setConsent(INITIAL_CONSENT);
    setSelectedCaseId('ATC-2026-00124');
    setDemoStep(0);
    setDemoActive(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Guided demo scenario steps
  const runGuidedDemoStep = (stepNumber: number) => {
    setDemoStep(stepNumber);
    setDemoActive(true);

    if (stepNumber === 1) {
      // Step 1: Switch to Victim & open check-in
      setRole('victim');
      setSelectedCaseId('CASE-002');
    } else if (stepNumber === 2) {
      // Step 2: Simulate Victim submitting elevated check-in (surges to 71/100, +33 from baseline 38)
      submitVictimCheckIn({
        feelingScore: 1, // Struggling
        safetyScore: 2, // Low safety
        sleepScore: 1, // Severe sleep trouble
        fearScore: 5, // High fear
        avoidanceScore: 4, // High avoidance
        requestHelp: true,
        notes: 'Summons delivered. I am terrified of going to court next week and cannot sleep.',
        hasVoiceSample: true,
        voiceDurationSeconds: 14,
      }, 'CASE-002');
    } else if (stepNumber === 3) {
      // Step 3: Switch to Counsellor to inspect generated alert
      setRole('counsellor');
      setSelectedCaseId('CASE-002');
    } else if (stepNumber === 4) {
      // Step 4: Schedule human intervention
      createIntervention({
        caseId: 'CASE-002',
        category: 'counselling',
        title: 'Emergency Grounding & Pre-Trial Orientation Session',
        description: 'Provide immediate psychological stabilization and review court accompaniment protocol.',
        assignedProfessional: 'Dr. Ananya Sarma (Senior Clinical Counsellor)',
        scheduledDate: '2026-09-27',
        status: 'scheduled',
        outcomeNotes: 'Intervention agreed by clinical supervisor.',
        aiSuggested: true,
      });
    } else if (stepNumber === 5) {
      // Step 5: Switch back to victim to see notification & updated status
      setRole('victim');
      setSelectedCaseId('CASE-002');
    } else if (stepNumber === 6) {
      // Step 6: Subsequent check-in simulates recovery trajectory (Section 38: 71 -> 59 -> 44)
      const targetCase = cases.find(c => c.id === 'CASE-002');
      if (targetCase) {
        const recoveryPoint1 = { date: '2026-09-28', score: 59, eventNote: 'Counselling completed: anxiety reduced', isCheckIn: true };
        const recoveryPoint2 = { date: '2026-10-02', score: 44, eventNote: 'Follow-up check-in: trajectory improving', isCheckIn: true };
        setCases(prev => prev.map(c => {
          if (c.id === 'CASE-002') {
            return {
              ...c,
              previousScore: 59,
              currentScore: 44,
              riskLevel: 'mild',
              lastCheckInDate: '2026-10-02',
              priorityReason: 'Recent well-being indicators show improvement (71 -> 59 -> 44) following authorized intervention',
              recentSignals: [
                'Recent well-being indicators show improvement',
                'Stabilizing trajectory detected across consecutive check-ins',
                'Intervention completed and follow-up recorded',
              ],
              trendHistory: [...c.trendHistory, recoveryPoint1, recoveryPoint2],
            };
          }
          return c;
        }));

        setNotifications(prev => [
          {
            id: `NOTIF-${Date.now().toString().slice(-4)}`,
            type: 'check_in',
            title: 'Recovery Trajectory Recorded',
            message: 'Case CASE-002 indicators decreased to 44/100. Recent well-being indicators show improvement.',
            timestamp: 'Just now',
            read: false,
            linkCaseId: 'CASE-002',
          },
          ...prev,
        ]);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        canViewCase,
        canEditCase,
        canCreateIntervention,
        canViewAnalytics,
        isSupabaseConfigured,
        language,
        setLanguage,
        theme,
        setTheme,
        fontSize,
        setFontSize,
        cases,
        alerts,
        interventions,
        notifications,
        auditLogs,
        consent,
        selectedCaseId,
        setSelectedCaseId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        isReportModalOpen,
        setIsReportModalOpen,
        isDemoModalOpen,
        setIsDemoModalOpen,
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isOnboardingModalOpen,
        setIsOnboardingModalOpen,
        survivorOnboardingData,
        setSurvivorOnboardingData,
        submitVictimCheckIn,
        resolveAlert,
        createIntervention,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateConsent,
        resetDemoData,
        runGuidedDemoStep,
        demoStep,
        setDemoStep,
        demoActive,
        setDemoActive,
        isClientHydrated,
      }}
    >
      <div
        className={
          fontSize === 'large'
            ? 'text-lg font-normal'
            : fontSize === 'extra-large'
            ? 'text-xl font-normal'
            : 'text-base'
        }
      >
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
