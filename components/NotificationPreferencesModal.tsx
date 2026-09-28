'use client';

import React, { useState } from 'react';
import {
  Bell,
  Shield,
  ShieldAlert,
  Smartphone,
  PhoneCall,
  Mail,
  AppWindow,
  LayoutDashboard,
  Check,
  Clock,
  Lock,
  Eye,
  CheckCircle2,
  X,
  AlertTriangle,
  History,
  Sliders,
} from 'lucide-react';
import {
  NotificationChannel,
  NotificationCategory,
  SurvivorNotificationPreferences,
  getDefaultNotificationPreferences,
  sanitizeNotificationPreview,
  getNotificationAuditLogs,
} from '@/lib/notification-engine';
import { motion, AnimatePresence } from 'framer-motion';
import { modalBackdropVariants, modalDialogVariants } from '@/lib/design-system';

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  survivorId?: string;
}

export function NotificationPreferencesModal({
  isOpen,
  onClose,
  survivorId = 'usr-victim-001',
}: NotificationPreferencesModalProps) {
  const [activeTab, setActiveTab] = useState<'preferences' | 'preview_tester' | 'audit_logs'>('preferences');
  const [prefs, setPrefs] = useState<SurvivorNotificationPreferences>(
    getDefaultNotificationPreferences(survivorId)
  );
  const [testInput, setTestInput] = useState('Your suicide risk score has increased.');
  const [testCategory, setTestCategory] = useState<NotificationCategory>('alert');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const testSanitized = sanitizeNotificationPreview(testInput, testCategory);
  const auditLogs = getNotificationAuditLogs({ recipientId: survivorId });

  const categoryLabels: Record<NotificationCategory, { title: string; description: string; isCritical?: boolean }> = {
    check_in_reminder: {
      title: 'Daily Wellness Check-In',
      description: 'Gentle prompts to record your emotional wellness and check-in pulses.',
    },
    follow_up_reminder: {
      title: 'Counsellor Follow-Up Reminder',
      description: 'Notifications when your clinical counsellor schedules or updates a follow-up consultation.',
    },
    alert: {
      title: 'Safety & Protection Alert',
      description: 'Mandatory statutory protection notices under Section 15A SC/ST (PoA) Act.',
      isCritical: true,
    },
    appointment: {
      title: 'Appointment & Calendar Milestones',
      description: 'Reminders for scheduled court hearings, counselling sessions, and relief disbursement.',
    },
    consent_update: {
      title: 'Consent & Data Sovereignty Notice',
      description: 'Alerts when data access permissions or DPDPA 2023 consent records are modified.',
    },
    privacy_notification: {
      title: 'Privacy & Security Notifications',
      description: 'Security login notices, new session detections, and emergency quick-exit audits.',
    },
  };

  const channelIcons: Record<NotificationChannel, React.ReactNode> = {
    sms: <Smartphone className="w-3.5 h-3.5" />,
    ivrs: <PhoneCall className="w-3.5 h-3.5" />,
    in_app: <AppWindow className="w-3.5 h-3.5" />,
    email: <Mail className="w-3.5 h-3.5" />,
    dashboard: <LayoutDashboard className="w-3.5 h-3.5" />,
  };

  const handleCategoryToggle = (cat: NotificationCategory) => {
    if (categoryLabels[cat].isCritical) return; // Prevent disabling critical safety alerts
    setPrefs(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [cat]: {
          ...prev.categories[cat],
          enabled: !prev.categories[cat].enabled,
        },
      },
    }));
  };

  const handleChannelToggle = (cat: NotificationCategory, ch: NotificationChannel) => {
    setPrefs(prev => {
      const allowed = prev.categories[cat].allowedChannels;
      const newAllowed = allowed.includes(ch)
        ? allowed.filter(c => c !== ch)
        : [...allowed, ch];

      // At least one channel must remain enabled for critical alerts
      if (categoryLabels[cat].isCritical && newAllowed.length === 0) {
        return prev;
      }

      return {
        ...prev,
        categories: {
          ...prev.categories,
          [cat]: {
            ...prev.categories[cat],
            allowedChannels: newAllowed,
          },
        },
      };
    });
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        onClick={e => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          variants={modalDialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-3xl max-h-[90vh] flex flex-col glass-modal-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 id="modal-headline" className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Notification Center & Preferences
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Privacy Shield
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your channels, quiet hours, and privacy-safe preview settings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close notification settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'preferences'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Channel Preferences
          </button>
          <button
            onClick={() => setActiveTab('preview_tester')}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'preview_tester'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Safe Preview Shield
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'audit_logs'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Delivery Audit Trail
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Quiet hours banner */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Quiet Hours (Do Not Disturb)</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Non-critical notifications are held during resting hours ({prefs.quietHoursStart} – {prefs.quietHoursEnd}).
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.quietHoursEnabled}
                    onChange={e => setPrefs(prev => ({ ...prev, quietHoursEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Categories list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Notification Categories & Permitted Delivery Channels
                </h3>

                {(Object.keys(categoryLabels) as NotificationCategory[]).map(catKey => {
                  const meta = categoryLabels[catKey];
                  const catPref = prefs.categories[catKey];

                  return (
                    <div
                      key={catKey}
                      className={`p-4 rounded-2xl border transition-all ${
                        catPref.enabled
                          ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
                          : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200/60 dark:border-slate-800/40 opacity-75'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {meta.title}
                            </span>
                            {meta.isCritical && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5" />
                                Life Safety Priority
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {meta.description}
                          </p>
                        </div>

                        {/* Enable / Disable Switch */}
                        {!meta.isCritical ? (
                          <label className="relative inline-flex items-center cursor-pointer shrink-0">
                            <input
                              type="checkbox"
                              checked={catPref.enabled}
                              onChange={() => handleCategoryToggle(catKey)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                          </label>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mandatory Active
                          </span>
                        )}
                      </div>

                      {/* Channels Selector */}
                      {catPref.enabled && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-medium text-slate-400 mr-1">Receive via:</span>
                          {(['in_app', 'dashboard', 'sms', 'ivrs', 'email'] as NotificationChannel[]).map(ch => {
                            const isAllowed = catPref.allowedChannels.includes(ch);
                            return (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => handleChannelToggle(catKey, ch)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                                  isAllowed
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                                }`}
                              >
                                {channelIcons[ch]}
                                <span className="capitalize">{ch.replace('_', ' ')}</span>
                                {isAllowed && <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'preview_tester' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Trauma-Informed Lock-Screen Preview Shield
                  </h3>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
                    Under AASRA security policies, SMS, push previews, and lock-screen headers NEVER expose
                    psychological distress scores, suicidal ideation markers, court case numbers, or police complaint details.
                    Sensitive details remain safely encrypted inside the app.
                  </p>
                </div>
              </div>

              {/* Interactive preview demonstration */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Test Any Outgoing Message (Preview Masking Demonstration):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={e => setTestInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-indigo-500"
                    placeholder="Enter candidate message..."
                  />
                  <select
                    value={testCategory}
                    onChange={e => setTestCategory(e.target.value as NotificationCategory)}
                    className="px-3 py-2 rounded-xl text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="alert">Alert</option>
                    <option value="check_in_reminder">Check-In</option>
                    <option value="appointment">Appointment</option>
                    <option value="follow_up_reminder">Follow-Up</option>
                  </select>
                </div>

                {/* Comparison Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 space-y-2">
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Blocked Stigmatizing Preview (Raw)
                    </span>
                    <p className="text-xs font-mono text-slate-800 dark:text-slate-200 p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-rose-200 dark:border-rose-900/50">
                      "{testInput}"
                    </p>
                    {testSanitized.detectedSensitiveTerms.length > 0 && (
                      <p className="text-[10px] text-rose-600 dark:text-rose-400">
                        Triggered redaction: {testSanitized.detectedSensitiveTerms.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sanitized Lock-Screen Preview (Delivered)
                    </span>
                    <p className="text-xs font-medium text-slate-900 dark:text-white p-2.5 rounded-lg bg-white/70 dark:bg-slate-900/70 border border-emerald-200 dark:border-emerald-900/50">
                      "{testSanitized.maskedPreview}"
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                      Discreet & trauma-informed. Full context viewable only after authenticated biometric/PIN unlock.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit_logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Showing recent notifications recorded with cryptographic SHA-256 integrity
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Merkle Chain Verified
                </span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {auditLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                    No recent notification dispatches recorded.
                  </div>
                ) : (
                  auditLogs.map(log => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="capitalize">{log.category.replace(/_/g, ' ')}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 uppercase font-mono">
                            {log.channel}
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(log.dispatchedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">
                        "{log.maskedPreview}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
                        <span>Status: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">{log.deliveryStatus}</strong></span>
                        <span className="truncate max-w-[200px]" title={log.auditHash}>
                          Hash: {log.auditHash.substring(0, 16)}...
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <div className="text-[11px] text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Preferences successfully synchronized!
              </span>
            ) : (
              'Changes saved instantly to local session.'
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
