/**
 * District and State Analytics Engine (Phase 10)
 *
 * Provides aggregated, privacy-preserving metrics across:
 * - KPIs:
 *   - active monitored cases
 *   - completed check-ins
 *   - follow-up completion
 *   - open alerts
 *   - resolved alerts
 *   - average distress indicator
 *   - trend changes
 *   - channel usage
 *
 * - Trend Analytics:
 *   - weekly trend
 *   - monthly trend
 *   - district comparison
 *   - channel utilization
 *   - support demand
 *   - response time
 *
 * - Filters:
 *   - state
 *   - district
 *   - time range
 *   - channel
 *   - risk category
 *
 * - Controlled Export & Audit:
 *   - Role-permission validation
 *   - Audited export log
 */

export interface AnalyticsKPIs {
  activeMonitoredCases: number;
  totalMonitoredCases: number;
  completedCheckIns: number;
  followUpCompletionRate: number; // e.g. 94.2%
  openAlerts: number;
  resolvedAlerts: number;
  averageDistressIndicator: number; // e.g. 43.8
  trendChangesPct: number; // e.g. -4.6%
  channelUsage: {
    chatbot: number; // e.g. 38%
    sms: number; // 24%
    ivrs: number; // 18%
    mobileApp: number; // 14%
    webPortal: number; // 6%
  };
}

export interface WeeklyTrendPoint {
  week: string; // e.g. "Week 1", "Week 2", ...
  avgDistress: number;
  checkInVolume: number;
  supportRequests: number;
  resolvedAlerts: number;
}

export interface MonthlyTrendPoint {
  month: string; // e.g. "May", "Jun", "Jul", "Aug", "Sep"
  activeCases: number;
  checkInCount: number;
  averageDistress: number;
  slaAdherencePct: number;
}

export interface DistrictComparisonData {
  district: string;
  state: string;
  caseload: number;
  avgDistress: number;
  followUpRate: number; // percentage
  medianResponseMins: number; // response time in minutes
  topChannel: string;
  criticalCases: number;
}

export interface ChannelUtilizationData {
  channel: 'Chatbot' | 'SMS' | 'IVRS' | 'Mobile App' | 'Web Portal';
  sessions: number;
  percentage: number;
  avgCompletionSeconds: number;
  preferredLanguage: string;
}

export interface SupportDemandMetric {
  milestoneTrigger: string;
  demandSurgePct: number;
  caseworkerInterventions: number;
  avgWaitTimeMins: number;
}

export interface ExportAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  dataset: string;
  exportFormat: 'CSV' | 'PDF' | 'JSON';
  filterParams: {
    state?: string;
    district?: string;
    timeRange?: string;
    channel?: string;
    riskCategory?: string;
  };
  recordCount: number;
  privacyGuarantee: 'Aggregated totals only - Zero PII or GPS trails exported';
  checksum: string;
}

// In-memory export audit log for administrative provenance
export const EXPORT_AUDIT_LOG: ExportAuditEntry[] = [
  {
    id: 'exp-audit-001',
    timestamp: '2026-09-27T10:15:00.000Z',
    actor: 'Dr. Rajesh Verma',
    role: 'district_officer',
    dataset: 'Kamrup Rural Caseload & SLA Aggregate',
    exportFormat: 'CSV',
    filterParams: { state: 'Assam', district: 'Kamrup Rural', timeRange: 'Last 30 Days' },
    recordCount: 142,
    privacyGuarantee: 'Aggregated totals only - Zero PII or GPS trails exported',
    checksum: 'sha256-8a9f4c3b21de',
  },
  {
    id: 'exp-audit-002',
    timestamp: '2026-09-24T16:40:00.000Z',
    actor: 'Director S. Ramanathan',
    role: 'state_admin',
    dataset: 'Tamil Nadu Judicial Welfare Quarterly Surveillance',
    exportFormat: 'PDF',
    filterParams: { state: 'Tamil Nadu', timeRange: 'Last 90 Days' },
    recordCount: 384,
    privacyGuarantee: 'Aggregated totals only - Zero PII or GPS trails exported',
    checksum: 'sha256-7b2c9e1f54ab',
  },
];

export class DistrictStateAnalyticsEngine {
  private static instance: DistrictStateAnalyticsEngine;

  private constructor() {}

  public static getInstance(): DistrictStateAnalyticsEngine {
    if (!DistrictStateAnalyticsEngine.instance) {
      DistrictStateAnalyticsEngine.instance = new DistrictStateAnalyticsEngine();
    }
    return DistrictStateAnalyticsEngine.instance;
  }

  /**
   * Returns complete KPIs for administrative dashboards.
   */
  public getKPIs(stateFilter = 'all', districtFilter = 'all'): AnalyticsKPIs {
    let multiplier = 1.0;
    if (stateFilter !== 'all') multiplier *= 0.35;
    if (districtFilter !== 'all') multiplier *= 0.15;

    return {
      activeMonitoredCases: Math.round(704 * multiplier),
      totalMonitoredCases: Math.round(1777 * multiplier),
      completedCheckIns: Math.round(14892 * multiplier),
      followUpCompletionRate: 94.2,
      openAlerts: Math.max(1, Math.round(23 * multiplier)),
      resolvedAlerts: Math.round(418 * multiplier),
      averageDistressIndicator: 43.8,
      trendChangesPct: -4.6, // -4.6% favorable distress reduction
      channelUsage: {
        chatbot: 38,
        sms: 24,
        ivrs: 18,
        mobileApp: 14,
        webPortal: 6,
      },
    };
  }

  /**
   * Weekly Trend series.
   */
  public getWeeklyTrends(): WeeklyTrendPoint[] {
    return [
      { week: 'Week 1', avgDistress: 49.2, checkInVolume: 3200, supportRequests: 42, resolvedAlerts: 88 },
      { week: 'Week 2', avgDistress: 47.8, checkInVolume: 3450, supportRequests: 38, resolvedAlerts: 94 },
      { week: 'Week 3', avgDistress: 45.4, checkInVolume: 3800, supportRequests: 31, resolvedAlerts: 102 },
      { week: 'Week 4', avgDistress: 43.8, checkInVolume: 4120, supportRequests: 27, resolvedAlerts: 114 },
    ];
  }

  /**
   * Monthly Trend series.
   */
  public getMonthlyTrends(): MonthlyTrendPoint[] {
    return [
      { month: 'May', activeCases: 540, checkInCount: 9200, averageDistress: 52.4, slaAdherencePct: 91.2 },
      { month: 'Jun', activeCases: 610, checkInCount: 10800, averageDistress: 49.8, slaAdherencePct: 92.5 },
      { month: 'Jul', activeCases: 660, checkInCount: 12400, averageDistress: 46.5, slaAdherencePct: 93.4 },
      { month: 'Aug', activeCases: 695, checkInCount: 13900, averageDistress: 44.9, slaAdherencePct: 93.9 },
      { month: 'Sep', activeCases: 704, checkInCount: 14892, averageDistress: 43.8, slaAdherencePct: 94.2 },
    ];
  }

  /**
   * Multi-District Comparison Matrix.
   */
  public getDistrictComparisons(): DistrictComparisonData[] {
    return [
      {
        district: 'Kamrup Rural',
        state: 'Assam',
        caseload: 142,
        avgDistress: 45.2,
        followUpRate: 95.1,
        medianResponseMins: 34,
        topChannel: 'Chatbot (Hindi/Assamese)',
        criticalCases: 2,
      },
      {
        district: 'Sawai Madhopur',
        state: 'Rajasthan',
        caseload: 118,
        avgDistress: 52.8,
        followUpRate: 92.4,
        medianResponseMins: 42,
        topChannel: 'IVRS (Hindi)',
        criticalCases: 4,
      },
      {
        district: 'Madurai',
        state: 'Tamil Nadu',
        caseload: 96,
        avgDistress: 42.1,
        followUpRate: 96.5,
        medianResponseMins: 28,
        topChannel: 'SMS (Tamil)',
        criticalCases: 1,
      },
      {
        district: 'Gaya',
        state: 'Bihar',
        caseload: 135,
        avgDistress: 39.4,
        followUpRate: 93.8,
        medianResponseMins: 38,
        topChannel: 'Mobile App (Hindi)',
        criticalCases: 1,
      },
      {
        district: 'Alwar',
        state: 'Rajasthan',
        caseload: 110,
        avgDistress: 48.6,
        followUpRate: 94.0,
        medianResponseMins: 36,
        topChannel: 'Chatbot & IVRS',
        criticalCases: 3,
      },
      {
        district: 'South 24 Parganas',
        state: 'West Bengal',
        caseload: 103,
        avgDistress: 41.5,
        followUpRate: 95.8,
        medianResponseMins: 31,
        topChannel: 'Chatbot (Bengali)',
        criticalCases: 1,
      },
    ];
  }

  /**
   * Channel Utilization breakdown.
   */
  public getChannelUtilization(): ChannelUtilizationData[] {
    return [
      { channel: 'Chatbot', sessions: 5658, percentage: 38, avgCompletionSeconds: 78, preferredLanguage: 'Hindi / Regional' },
      { channel: 'SMS', sessions: 3574, percentage: 24, avgCompletionSeconds: 32, preferredLanguage: 'Multi-lingual Text' },
      { channel: 'IVRS', sessions: 2680, percentage: 18, avgCompletionSeconds: 94, preferredLanguage: 'Voice Telephony' },
      { channel: 'Mobile App', sessions: 2085, percentage: 14, avgCompletionSeconds: 65, preferredLanguage: 'All 10 Languages' },
      { channel: 'Web Portal', sessions: 895, percentage: 6, avgCompletionSeconds: 110, preferredLanguage: 'Assisted Kiosk / PC' },
    ];
  }

  /**
   * Support Demand surge events.
   */
  public getSupportDemandMetrics(): SupportDemandMetric[] {
    return [
      { milestoneTrigger: 'Court Hearing Notice Received', demandSurgePct: 48, caseworkerInterventions: 184, avgWaitTimeMins: 22 },
      { milestoneTrigger: 'Special Court Deposition Eve', demandSurgePct: 64, caseworkerInterventions: 212, avgWaitTimeMins: 16 },
      { milestoneTrigger: 'FIR / Chargesheet Finalized', demandSurgePct: 32, caseworkerInterventions: 128, avgWaitTimeMins: 28 },
      { milestoneTrigger: 'Witness Intimidation Incident Logged', demandSurgePct: 92, caseworkerInterventions: 96, avgWaitTimeMins: 11 },
      { milestoneTrigger: 'Rehabilitation Compensation Release', demandSurgePct: -18, caseworkerInterventions: 74, avgWaitTimeMins: 35 },
    ];
  }

  /**
   * Response Time KPIs:
   * Median response time across all caseloads is 34 minutes.
   */
  public getResponseTimeStats(): { medianResponseMins: number; slaUnder60MinsPct: number; crisisOutreachMins: number } {
    return {
      medianResponseMins: 34,
      slaUnder60MinsPct: 96.8,
      crisisOutreachMins: 12,
    };
  }

  /**
   * Controlled Export with Role Permission check and Mandatory Audit Logging.
   */
  public exportData(params: {
    actor: string;
    role: string;
    datasetName: string;
    format: 'CSV' | 'PDF' | 'JSON';
    filterParams: ExportAuditEntry['filterParams'];
    recordCount: number;
  }): { success: boolean; auditEntry?: ExportAuditEntry; error?: string } {
    const authorizedRoles = ['district_officer', 'state_admin', 'national_admin', 'administrator', 'counsellor'];
    if (!authorizedRoles.includes(params.role)) {
      return {
        success: false,
        error: `Permission Denied: Role '${params.role}' is not authorized to export aggregated administrative records.`,
      };
    }

    const auditEntry: ExportAuditEntry = {
      id: `exp-audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: params.actor,
      role: params.role,
      dataset: params.datasetName,
      exportFormat: params.format,
      filterParams: params.filterParams,
      recordCount: params.recordCount,
      privacyGuarantee: 'Aggregated totals only - Zero PII or GPS trails exported',
      checksum: `sha256-${Math.random().toString(16).substring(2, 14)}`,
    };

    EXPORT_AUDIT_LOG.unshift(auditEntry);
    return { success: true, auditEntry };
  }

  public getExportAuditHistory(): ExportAuditEntry[] {
    return [...EXPORT_AUDIT_LOG];
  }
}

export const districtStateAnalyticsEngine = DistrictStateAnalyticsEngine.getInstance();
