# Threat Model: AASRA Care Platform

## 1. Assets & Critical Resources
* Victim personal identities and case histories
* Longitudinal distress assessment records and baseline indices
* Caseworker intervention records and protection authorizations
* System audit logs and forensic records
* Private API credentials (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)

## 2. Adversarial Profiles
* **Malicious External Actors**: Credential brute-force, denial-of-service, prompt injection attacks against LLMs.
* **Compromised Insiders**: Unauthorized case viewing, attempts to manipulate risk scores or remove audit entries.
* **Coerced Users**: Attempts to alter records under duress or access another victim's monitoring data.

## 3. Threat Scenarios & Countermeasures
| Threat Category | Potential Impact | Enforced Countermeasure |
|---|---|---|
| Cross-Victim Case Enumeration | Unauthorized access to confidential case files | Supabase PostgreSQL Row Level Security (RLS) + server-side `canViewCase()` verification. |
| Privilege Escalation | Victim alters role to admin or caseworker | Role authorization locked to server-verified session token; database RLS rejects role modifications. |
| AI Prompt Injection | User input overrides risk scoring logic | Input sanitizer strips delimiters and regex patterns; AI score strictly validated against deterministic rules. |
| Secret Key Leakage | External access to full database | Server-only secrets kept out of `NEXT_PUBLIC_` namespace; verified by automated CI checks. |
| Brute-Force Authentication | Account takeover | Token bucket rate limiting (5 attempts/minute/IP) with HTTP 429 response. |
| Data Poisoning | Fabrication of historical baseline | Insufficient history returns low confidence flag without baseline fabrication; temporal leakage audit checks enforce strict causality. |
