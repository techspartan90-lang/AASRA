# Testing & Quality Assurance Manual

## 1. Test Architecture
The platform features automated testing spanning unit validation, security threat scenarios, and data leakage audits:
* **Unit Tests** (`tests/unit/risk-engine.test.ts`):
  * Deterministic risk calculation boundaries
  * Personal baseline computation without fabricated past scores
  * Trajectory slope, velocity, and consecutive increase persistence
  * Probability bounds and non-diagnostic disclaimers
* **Security Threat Scenarios** (`tests/security/threat-scenarios.test.ts`):
  * Cross-victim case access denial
  * Counsellor unauthorized case access denial
  * Frontend role escalation neutralization
  * Prompt injection pattern detection and scrubbing
  * Malformed AI JSON rejection and deterministic fallback
  * Medical diagnosis anti-pattern rejection
  * Missing baseline graceful handling (no fabricated scores)
  * Explicit safety concern keyword detection
  * Sliding-window rate limit threshold enforcement
  * Client bundle secret leakage verification
* **Data Leakage & Temporal Validation** (`lib/ai/data-leakage-audit.ts`):
  * Temporal causality verification
  * Subject-level cross-validation partitioning
  * Target-derived feature exclusion
  * Post-intervention outcome isolation

## 2. Executing Automated Tests
Execute tests via the CLI:
```bash
npm test
```
Or execute the automated suite via the API endpoint:
```bash
curl http://localhost:3000/api/tests/run
```
All tests return structured results including suite name, test descriptions, passed/failed counters, and status codes.
