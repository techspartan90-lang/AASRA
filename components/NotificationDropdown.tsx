'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Bell, CheckCheck, ExternalLink, ShieldAlert, HeartPulse, Calendar, LifeBuoy } from 'lucide-react';

export function NotificationDropdown({
  onClose,
  onSelectCase,
}: {
  onClose: () => void;
  onSelectCase: (caseId: string) => void;
}) {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, setSelectedCaseId } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'check_in':
        return <HeartPulse className="w-4 h-4 text-emerald-500" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      default:
        return <LifeBuoy className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Notifications Center
          </span>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="mt-2 max-h-80 overflow-y-auto space-y-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No new notifications</div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationAsRead(item.id);
                if (item.linkCaseId) {
                  setSelectedCaseId(item.linkCaseId);
                  onSelectCase(item.linkCaseId);
                }
              }}
              className={`pt-2 pb-1.5 px-2 rounded-xl transition cursor-pointer ${
                item.read
                  ? 'opacity-70 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  : 'bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium shrink-0">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-2 mt-0.5">
                    {item.message}
                  </p>
                  {item.linkCaseId && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                      <span>View Case {item.linkCaseId}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
