'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { Sidebar } from '@/components/navigation/Sidebar';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { PageHeader } from '@/components/navigation/PageHeader';
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
import { ManasSurakshaMobileOverview } from '@/components/ManasSurakshaMobileOverview';
import { getTextDirection } from '@/lib/i18n-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { pageTransitionVariants } from '@/lib/design-system';
import { OfflineBanner } from '@/components/ui/StateViews';

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Initialize sidebar collapsed state from localStorage & screen size safely on mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      try {
        const savedCollapsed = localStorage.getItem('manas-suraksha-sidebar-collapsed');
        if (savedCollapsed !== null) {
          setIsSidebarCollapsed(savedCollapsed === 'true');
        } else if (typeof window !== 'undefined') {
          // Default to collapsed on tablet screens (< 1024px)
          setIsSidebarCollapsed(window.innerWidth < 1024);
        }
      } catch {}
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('manas-suraksha-sidebar-collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Keyboard shortcut Ctrl+[ to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '[') {
        e.preventDefault();
        handleToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Synchronize document direction and lang for RTL support (WCAG 3.1.2)
  useEffect(() => {
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

  const handleNavigate = (viewId: string) => {
    if (viewId === 'home') {
      setCurrentView('public');
    } else {
      setCurrentView(viewId);
    }
  };

  return (
    <div
      dir={getTextDirection(language)}
      className="min-h-screen flex flex-col bg-[#FFFFFF] dark:bg-[#151515] text-[#333333] dark:text-white transition-colors duration-200"
    >
      {/* Skip to Main Content Link (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#FD1053] focus:text-white focus:font-bold focus:rounded-xl focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Non-intrusive Offline Notification Banner */}
      <OfflineBanner />

      {/* =======================================================================
          DESKTOP & TABLET VERTICAL LUXURY SIDEBAR (md+)
         ======================================================================= */}
      <div className="hidden md:block">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      </div>

      {/* =======================================================================
          MOBILE TOP BAR & DRAWER (< md)
         ======================================================================= */}
      <MobileNavigation
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* =======================================================================
          MAIN WORKSPACE LAYOUT (Accounting for dynamic Sidebar width)
         ======================================================================= */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out ${
          isSidebarCollapsed ? 'md:pl-[76px]' : 'md:pl-[272px]'
        }`}
      >
        {/* Lightweight Page Top Header */}
        <PageHeader
          currentView={currentView}
          onNavigate={handleNavigate}
          onSelectCase={caseId => setActiveCaseModalId(caseId)}
        />

        {/* View Router with Subtle Framer Motion Page Transitions */}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6 outline-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              variants={pageTransitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {currentView === 'public' && (
                <PublicLandingPage
                  onSelectAction={(targetView, targetRole) => {
                    if (targetRole) setRole(targetRole as any);
                    setCurrentView(targetView);
                  }}
                />
              )}

              {currentView === 'dashboard' && <VictimDashboard />}

              {(currentView === 'mobile_overview' || currentView === 'stitch_mobile') && (
                <div className="py-2">
                  <ManasSurakshaMobileOverview
                    onNavigate={handleNavigate}
                    onOpenCheckIn={() => setCurrentView('checkin_wizard')}
                    onOpenTrajectory={() => setCurrentView('distress_score')}
                  />
                </div>
              )}

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
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Luxury Healthcare Statutory Footer */}
        <footer className="mt-auto border-t border-[#474747]/15 dark:border-white/10 bg-[#F7F7F8] dark:bg-[#1B1B1B] py-5 text-xs text-[#6B7280] dark:text-[#A3A3A3]">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FD1053] shadow-[0_0_6px_#FD1053]" />
              <span className="font-bold text-[#333333] dark:text-white">
                MANAS SURAKSHA
              </span>
              <span className="text-[#6B7280] dark:text-[#A3A3A3]">
                · National Distress Early-Warning & Victim Mental Health Platform
              </span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#6B7280] dark:text-[#A3A3A3]">
              <span>SC/ST PoA Act §15A & DPDPA 2023 End-to-End Encryption</span>
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(true)}
                className="text-[#FD1053] hover:underline font-bold"
              >
                24/7 National Emergency (112)
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* =======================================================================
          GLOBAL APPLICATION MODALS (All Preserved)
         ======================================================================= */}
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

      {/* Accessible Command Palette (⌘K) */}
      <CommandPalette
        onSelectCase={caseId => setActiveCaseModalId(caseId)}
        onNavigate={view => setCurrentView(view)}
      />
    </div>
  );
}
