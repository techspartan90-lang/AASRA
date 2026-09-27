# Security Architecture & Policies

## 1. Core Principle
> **AI assists. Humans decide.**
The AASRA Care platform is an algorithmic decision-support tool designed for authorized caseworkers, district welfare officers, and judicial administrators. It does not perform autonomous medical diagnoses, legal decisions, or automated law enforcement escalations.

## 2. Threat Model & Mitigations
* **Unauthorized Access**: Multi-layered defense with Supabase Row Level Security (RLS) at the database layer and server-side RBAC middleware (`lib/access-control.ts`, `lib/security/auth-middleware.ts`).
* **Privilege Escalation**: Frontend roles are strictly decoupled from database permissions. Modifying a client cookie or UI state cannot escalate database permissions or access unassigned cases.
* **Prompt Injection**: All victim text is treated as untrusted input. Input scrubbing (`lib/security/prompt-guard.ts`) neutralizes delimiters (`system:`, `<instructions>`, `override score`) and strips tokens prior to LLM template interpolation.
* **Malformed AI Outputs**: All LLM responses are parsed and validated against strict JSON schemas with numeric boundary checks ([0, 100]). Malformed or out-of-boundary outputs trigger a deterministic rule-based fallback with zero user disruption.
* **Rate Limiting**: Sliding-window rate limiters protect expensive AI analysis (15/min), check-in submissions (20/min), and authentication attempts (5/min).

## 3. Secret Management
* **Client Boundaries**: Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are exposed to the browser.
* **Server Boundaries**: `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are strictly server-only secrets accessed via Next.js API route handlers. They are never exported or leaked into client bundles.

## 4. Security Incident Reporting
To report security vulnerabilities or configuration defects, contact the platform security coordinators at `security@aasra-care.org`.
