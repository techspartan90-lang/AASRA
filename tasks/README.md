# MANAS SURAKSHA — TASK SYSTEM & WORKFLOW SPECIFICATION

This directory serves as the **Single Source of Truth** for milestone tracking, feature decomposition, and execution tasks across the multi-agent system.

---

## 1. HIERARCHY

```text
Project (MANAS SURAKSHA)
   │
   ▼
Milestone (M1 - M8)
   │
   ▼
Feature / Task (tasks/backlog.md)
   │
   ▼
Implementation (Roo Code / Ralph)
   │
   ▼
Validation (Build, Tests, Lint, Accessibility, Contrast)
   │
   ▼
Review (CodeRabbit) -> Merge to main
```

---

## 2. AGENT ROLES

* **GSD (Planner)**: Plans, decomposes requirements into atomic tasks, identifies affected files, risks, and verification gates.
* **Roo Code (Implementer)**: Implements changes incrementally following the 8 rules (reusable components, no wholesale rewrites, safe types, luxury tokens `#474747` / `#333333` / `#FD1053`).
* **Ralph (Iterative Execution)**: Runs task -> implement -> build -> fix loops with a strict stopping condition (`maxIterations = 10`).
* **CodeRabbit (Reviewer)**: Automated audit of security, confidentiality, PII zero-leakage, WCAG 2.1 AA accessibility, and code quality.
* **GitHub (Source Control)**: Manages feature branches and PR lifecycle targeting `main`.

---

## 3. TASK FORMAT STANDARD

Every implementation task must adhere to the following schema:

```markdown
# Task: [Task Title]

## Objective
What needs to be implemented?

## Context
Why is this required?

## Existing Implementation
What currently exists?

## Requirements
- Requirement 1
- Requirement 2
- Requirement 3

## Files
Potential affected files.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Validation
Commands used to verify the implementation (`npm run build`, `npm run typecheck`, etc.).

## Risks
Potential regressions.
```

---

## 4. DEFINITION OF DONE (DOD)

A task is complete only when:
1. Implementation is fully functional without regressions.
2. `npm run typecheck` exits 0.
3. `npm run build` exits 0.
4. `npm run lint` exits 0 (or no fatal errors).
5. All automated unit/prebuild tests pass.
6. Zero mixed-theme rendering (light/dark themes checked).
7. Responsive views verified across Desktop, Tablet, and Mobile.
8. Reduced motion respected for animations (`prefers-reduced-motion`).
9. Git diff reviewed; zero secrets, tokens, or PII exposed.
