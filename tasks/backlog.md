# MANAS SURAKSHA — MASTER MILESTONES & BACKLOG

This backlog organizes the MANAS SURAKSHA project into 8 core milestones (M1–M8).

---

## M1 — Foundation
*Core architecture, security boundaries, luxury design tokens, navigation, and application shell.*

- [x] **M1.1 Application Shell & Navigation**: Modern sidebar, mobile navigation drawer, page header, and command palette.
- [x] **M1.2 Luxury Design System**: Base tokens (`#474747`, `#333333`, `#FD1053`), glassmorphic panels, animated metrics, and 3D hero components.
- [x] **M1.3 Theme Integrity**: Day/night switcher with zero split-theme leakage and WCAG 2.1 AA text contrast.
- [x] **M1.4 Authentication & Authorization**: Secure session management, canonical role representation (SURVIVOR, COUNSELLOR, ADMIN, SUPER_ADMIN), and server-side route guards.

---

## M2 — Survivor Experience
*Empathetic, confidential, and accessible survivor interface.*

- [x] **M2.1 Survivor Onboarding**: Trauma-informed guided onboarding wizard with consent capture.
- [x] **M2.2 Victim Dashboard**: Personal distress tracking, support connections, and quick-access emergency actions.
- [x] **M2.3 Check-in Workflow**: Multi-channel check-ins with mood selection, voice input, and encrypted note storage.
- [x] **M2.4 Emergency Access & Quick Exit**: Instant panic button, quick exit disguise, and crisis hotline direct triggers.
- [x] **M2.5 Privacy Center**: Granular consent revocation, cryptographic access receipts, and audit trail views.
- [x] **M2.6 Mobile Overview Experience**: Dedicated mobile-first quick overview and calming toolkit.
- [ ] **M2.7 Multilingual Voice Interaction**: Real-time regional voice check-in processing with 0-day retention guarantee.

---

## M3 — Mental Health Monitoring
*Continuous longitudinal tracking and distress signal detection.*

- [x] **M3.1 Dynamic Distress Dashboard**: Real-time score trends, biometric signals, and anomaly alerts.
- [x] **M3.2 Distress Scoring Engine**: Multi-factor scoring with explainable contribution factors.
- [x] **M3.3 Early Warning Signals**: Proactive risk spike detection and threshold-based alert triggers.
- [ ] **M3.4 Longitudinal Trend Analytics**: Historical trajectory visualization with clinician notes integration.

---

## M4 — AI Prediction
*Transparent, explainable, and human-in-the-loop AI risk modeling.*

- [x] **M4.1 Predictive Risk Dashboard**: Trajectory forecasts with confidence intervals and risk categorization.
- [x] **M4.2 AI Explainability Panel**: Feature importance breakdown, counterfactual guidance, and clinician override.
- [x] **M4.3 Model Evaluation Hub**: Calibration metrics, fair-representation validation, and model drift telemetry.
- [ ] **M4.4 Human-in-the-Loop Override Pipeline**: Formal clinician review and justification logging for AI overrides.

---

## M5 — Professional Workspaces
*Comprehensive triage and caseload management for clinicians and administrators.*

- [x] **M5.1 Counsellor Workspace**: Active case triage, patient history, appointment sync, and intervention notes.
- [x] **M5.2 Administrative Dashboard**: System-wide telemetry, resource utilization, and clinician caseload balancing.
- [x] **M5.3 Prioritization Queue**: Algorithmic urgency ranking with safety locks and manual re-ordering.
- [x] **M5.4 Alert Center**: High-priority distress notifications, escalation workflows, and acknowledgment audit.
- [ ] **M5.5 Statutory Reporting Engine**: Tamper-evident, court-ready anonymized milestone generation.

---

## M6 — Communication
*Multi-channel, low-bandwidth, and offline-resilient crisis communication.*

- [ ] **M6.1 IVRS Telephony Pipeline**: Automated telephone distress triage for non-smartphone users.
- [ ] **M6.2 Encrypted SMS Fallback**: Encrypted offline SMS signaling when data connections drop.
- [ ] **M6.3 Trusted Contact Dispatch**: Automatic escalation to trusted contacts for unacknowledged critical distress.
- [ ] **M6.4 Offline Data Synchronization**: Background IndexedDB caching and sync upon reconnection.

---

## M7 — Security & Privacy
*Zero-compromise protection for vulnerable survivor data.*

- [x] **M7.1 Cryptographic Audit Trail**: Hash-chained, tamper-evident audit logs for every record access.
- [x] **M7.2 0-Day Audio Retention Guarantee**: Automatic destruction of raw voice recordings post-transcription.
- [x] **M7.3 Supabase RLS Policies**: Row Level Security isolating case data by tenant and assigned counsellor.
- [ ] **M7.4 Client-Side Encryption**: End-to-end payload encryption for sensitive mental-health notes.

---

## M8 — Production Readiness
*Performance, accessibility, observability, and automated CI/CD.*

- [x] **M8.1 Automated Test Suite**: 13-stage lifecycle tests, Phase 11 privacy tests, and synthetic data suites.
- [x] **M8.2 Multi-Agent CI/CD Workflow**: GitHub Actions workflow (`ci.yml`) with CodeRabbit audit gates.
- [x] **M8.3 Reduced-Motion & 3D Policy**: GPU-conscious Three.js rendering with `prefers-reduced-motion` compliance.
- [ ] **M8.4 Production Deployment Hardening**: Edge CDN caching, security header CSP rules, and telemetry monitoring.
