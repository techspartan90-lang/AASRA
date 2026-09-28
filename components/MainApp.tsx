'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { PublicLandingPage } from '@/components/PublicLandingPage';
import { VictimDashboard } from '@/components/VictimDashboard';
import { CheckInWizard } from '@/components/CheckInWizard';
import { CounsellorWorkspace } from '@/components/CounsellorWorkspace';
import { AlertCenter } from '@/components/AlertCenter';
import { AdministrativeDashboard } from '@/components/AdministrativeDashboard';
import { PrioritizationQueue } from '@/components/PrioritizationQueue';
import { PrivacyCenter } from '@/components/PrivacyCenter';
import { AiModelEvaluationHub } from '@/components/AiModelEvaluationHub';
import { CaseProfileModal } from '@/components/CaseProfileModal';
import { EmergencyModal } from '@/components/EmergencyModal';
import { MultilingualVoiceModal } from '@/components/MultilingualVoiceModal';
import { ReportModal } from '@/components/ReportModal';
import { GuidedDemoModal } from '@/components/GuidedDemoModal';
import { CommandPalette } from '@/components/CommandPalette';
import { SecureLoginModal } from '@/components/SecureLoginModal';
import { SurvivorOnboardingModal } from '@/components/SurvivorOnboardingModal';
import { MultiChannelCheckInHub } from '@/components/MultiChannelCheckInHub';
import { DynamicDistressDashboard } from '@/components/DynamicDistressDashboard';
import { PredictiveRiskDashboard } from '@/components/PredictiveRiskDashboard';
import { getTextDirection } from '@/lib/i18n-engine';
import {
  HeartPulse,
  Home,
  Users,
  ShieldAlert,
  BarChart3,
  Lock,
  Flame,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  Globe2,
  Calendar,
  Sparkles,
  PhoneCall,
  Search,
  Brain,
  Radio,
  Activity,
  TrendingUp,
} from 'lucide-react';

export function MainApp() {
  const {
    role,
    setRole,
    selectedCaseId,
    setSelectedCaseId,
    isEmergencyModalOpen,
    setIsEmergencyModalOpen,
    isVoiceAssistantOpen,
    setIsVoiceAssistantOpen,
    isReportModalOpen,
    setIsReportModalOpen,
    isDemoModalOpen,
    setIsDemoModalOpen,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    survivorOnboardingData,
    setSurvivorOnboardingData,
    language,
  } = useApp();

  const [currentView, setCurrentView] = useState<string>('public');
  const [activeCaseModalId, setActiveCaseModalId] = useState<string | null>(null);

  // Synchronize document direction and lang for RTL support (WCAG 3.1.2)
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const dir = getTextDirection(language);
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const handleLoginSuccess = (user: any, isSurvivor?: boolean) => {
    if (isSurvivor) {
      if (!survivorOnboardingData) {
        setIsOnboardingModalOpen(true);
      }
      setCurrentView('dashboard');
    } else {
      if (user.role === 'counsellor') {
        setCurrentView('cases');
      } else if (user.role === 'district_officer' || user.role === 'state_admin') {
        setCurrentView('analytics');
      } else if (user.role === 'national_admin') {
        setCurrentView('prioritization');
      } else {
        setCurrentView('cases');
      }
    }
  };

  const isStaffRole = role !== 'victim';

  // Victim-specific simple navigation (Section 23)
  const victimNavItems = [
    { id: 'dashboard', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'distress_score', label: 'Distress Score', icon: <Activity className="w-4 h-4" /> },
    { id: 'predictive_risk', label: 'Predictive Trajectory', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'channels', label: 'Multi-Channel Hub', icon: <Radio className="w-4 h-4" /> },
    { id: 'checkin_wizard', label: 'Check-In', icon: <HeartPulse className="w-4 h-4" /> },
    { id: 'support', label: 'Support & Counsellor', icon: <Users className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'public', label: 'About Platform', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  // Administrative / Caseworker Navigation (Section 23)
  const staffNavItems = [
    { id: 'cases', label: 'Counsellor Workspace', icon: <Users className="w-4 h-4" /> },
    { id: 'distress_score', label: 'Dynamic Distress Engine', icon: <Activity className="w-4 h-4" /> },
    { id: 'predictive_risk', label: 'Predictive Risk Hub', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'channels', label: 'Multi-Channel Hub', icon: <Radio className="w-4 h-4" /> },
    { id: 'alerts', label: 'Alert Center', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'prioritization', label: 'Prioritization Queue', icon: <Flame className="w-4 h-4" /> },
    { id: 'analytics', label: 'Administrative & Map', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'ai_models', label: 'AI & ML Hub', icon: <Brain className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Audit Logs', icon: <Lock className="w-4 h-4" /> },
    { id: 'public', label: 'Public Portal', icon: <Globe2 className="w-4 h-4" /> },
  ];

  return (
    <div
      dir={getTextDirection(language)}
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors"
    >
      {/* Skip to Main Content Link (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Global Accessible Navbar */}
      <Navbar
        onNavigate={view => {
          if (view === 'home') setCurrentView('public');
          else if (view === 'cases') setCurrentView('cases');
          else setCurrentView(view);
        }}
      />

      {/* Main Body with Role-Sensitive Secondary Nav */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar for Active Role */}
        <nav
          aria-label="Role Viewport Navigation"
          className="flex items-center justify-between overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 scrollbar-none"
        >
          <div className="flex items-center gap-1 sm:gap-2">
            {(isStaffRole ? staffNavItems : victimNavItems).map(item => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition cursor-pointer min-h-[40px] ${
                  currentView === item.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs font-bold dark:bg-slate-800 dark:text-emerald-400 dark:border-slate-700'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60 font-semibold'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Quick Context pill */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Viewing as:</span>
            <span className="font-bold text-slate-900 dark:text-white capitalize">
              {role.replace('_', ' ')}
            </span>
          </div>
        </nav>

        {/* View Router */}
        <main id="main-content" tabIndex={-1} className="pb-16 outline-hidden">
          {currentView === 'public' && (
            <PublicLandingPage
              onSelectAction={(targetView, targetRole) => {
                if (targetRole) setRole(targetRole as any);
                setCurrentView(targetView);
              }}
            />
          )}

          {currentView === 'dashboard' && <VictimDashboard />}

          {currentView === 'distress_score' && (
            <DynamicDistressDashboard
              initialScore={47}
              initialBaseline={28}
              onOpenSupportModal={() => setIsEmergencyModalOpen(true)}
            />
          )}

          {currentView === 'predictive_risk' && (
            <PredictiveRiskDashboard
              onOpenCaseworkerModal={() => setIsEmergencyModalOpen(true)}
            />
          )}

          {currentView === 'checkin_wizard' && (
            <div className="py-6">
              <CheckInWizard
                onComplete={() => setCurrentView('dashboard')}
                onCancel={() => setCurrentView('dashboard')}
              />
            </div>
          )}

          {currentView === 'support' && <VictimDashboard />}

          {currentView === 'cases' && (
            <CounsellorWorkspace
              onSelectCase={caseId => setActiveCaseModalId(caseId)}
            />
          )}

          {currentView === 'alerts' && (
            <AlertCenter
              onSelectCase={caseId => setActiveCaseModalId(caseId)}
            />
          )}

          {currentView === 'prioritization' && (
            <PrioritizationQueue
              onSelectCase={caseId => setActiveCaseModalId(caseId)}
            />
          )}

          {currentView === 'analytics' && (
            <AdministrativeDashboard
              onSelectCase={caseId => setActiveCaseModalId(caseId)}
            />
          )}

          {currentView === 'ai_models' && <AiModelEvaluationHub />}

          {currentView === 'channels' && <MultiChannelCheckInHub />}

          {currentView === 'privacy' && <PrivacyCenter />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-900 dark:text-slate-200">
              AASRA Care Prototype
            </span>
            <span className="text-slate-600 dark:text-slate-400">· National Atrocity Victim Mental Health & Distress Early Support Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-400">
            <span>Secured with Role-Based Encryption & Audit Trail</span>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-rose-600 dark:text-rose-400 hover:underline font-bold"
            >
              24/7 National Emergency (112)
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      {activeCaseModalId && (
        <CaseProfileModal
          caseId={activeCaseModalId}
          onClose={() => setActiveCaseModalId(null)}
        />
      )}

      {isEmergencyModalOpen && (
        <EmergencyModal onClose={() => setIsEmergencyModalOpen(false)} />
      )}

      {isVoiceAssistantOpen && (
        <MultilingualVoiceModal onClose={() => setIsVoiceAssistantOpen(false)} />
      )}

      {isReportModalOpen && (
        <ReportModal onClose={() => setIsReportModalOpen(false)} />
      )}

      {isDemoModalOpen && (
        <GuidedDemoModal
          onClose={() => setIsDemoModalOpen(false)}
          onNavigateToView={view => setCurrentView(view)}
        />
      )}

      {/* Secure Authentication Modal */}
      <SecureLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Trauma-Informed Survivor Onboarding Modal */}
      <SurvivorOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={data => {
          setSurvivorOnboardingData(data);
          setCurrentView('dashboard');
        }}
      />

      <CommandPalette
        onSelectCase={caseId => setActiveCaseModalId(caseId)}
        onNavigate={view => setCurrentView(view)}
      />
    </div>
  );
}
