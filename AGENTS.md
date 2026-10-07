# MANAS SURAKSHA — MASTER MULTI-AGENT ARCHITECTURE

This document establishes the official multi-agent operating contract for **MANAS SURAKSHA**.

```
                    MANAS SURAKSHA
                           │
                           ▼
                    ┌─────────────┐
                    │     GSD     │
                    │   PLANNER   │
                    └──────┬──────┘
                           │
                           ▼
                    Feature / Task
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌────────────┐             ┌────────────┐
       │  Roo Code  │             │   Ralph    │
       │ IMPLEMENT  │             │  ITERATE   │
       └─────┬──────┘             └─────┬──────┘
             │                          │
             └───────────┬──────────────┘
                         ▼
                 Build / Test / Lint
                         │
                         ▼
                  ┌──────────────┐
                  │    GitHub    │
                  │     PUSH     │
                  └──────┬───────┘
                         ▼
                  ┌──────────────┐
                  │  CodeRabbit  │
                  │ CODE REVIEW  │
                  └──────┬───────┘
                         ▼
                    Fix Issues
                         │
                         ▼
                      PR
                         │
                         ▼
                       main
```

---

## 1. AGENT RESPONSIBILITY MATRIX

| Agent | Responsibility | Primary Tooling |
| :--- | :--- | :--- |
| **GSD** | Planning, requirements, scoping, and milestone orchestration | Antigravity GSD Skills (`.planning/`) |
| **Roo Code** | Feature implementation, component development, unit test authoring | Roo Code Editor Extension (`.roomodes`) |
| **Ralph** | Autonomous iterative execution (implement-build-fix loop) | Ralph CLI (`.ralph/config.toml`, `.plans/`) |
| **CodeRabbit** | Automated PR code review, security, accessibility, and privacy auditing | CodeRabbit Action / App (`.coderabbit.yaml`) |
| **GitHub** | Source control, feature branches, pull requests, CI/CD checks | GitHub CLI (`gh`), Git, Actions |
| **Human / User** | Architecture sign-off, product decisions, and final merge approval | Antigravity IDE UI |

---

## 2. GSD (PLANNER) PROTOCOL

GSD serves as the primary planning and decomposition layer. GSD must operate incrementally and avoid blind wholesale repository rewrites.

Before implementing any major feature, GSD produces a plan covering:
1. **Goal**: High-level objective.
2. **Requirements**: Clear functional and non-functional requirements.
3. **Affected Files**: Components, APIs, routes, styles, and tests.
4. **Dependencies**: External and internal package dependencies.
5. **Implementation Steps**: Ordered waves of execution.
6. **Validation Criteria**: Automated checks (`npm run build`, `npm run typecheck`, tests).
7. **Potential Risks**: Regressions, security, or accessibility impact.
8. **Rollback Considerations**: Safe revert strategy.

---

## 3. ROO CODE (IMPLEMENTATION AGENT) RULES

When implementing tasks, Roo Code must strictly adhere to the following 8 operating rules:

* **RULE 1**: Never rewrite the entire application when only a component needs modification.
* **RULE 2**: Reuse existing components (`components/` and `components/design-system/`).
* **RULE 3**: Preserve existing APIs and backend routes.
* **RULE 4**: Preserve Supabase integration and Row Level Security (RLS) constraints.
* **RULE 5**: Do not replace working functionality simply to change visual design.
* **RULE 6**: Use TypeScript safely with strict typing and no unchecked casts.
* **RULE 7**: Avoid adding unnecessary third-party dependencies.
* **RULE 8**: Follow the existing luxury design system and accessibility tokens.

---

## 4. RALPH (ITERATIVE EXECUTION AGENT) SPECIFICATION

Ralph runs an iterative execution loop to bring failing tasks to green:
* **Loop**: Task -> Implement -> Build (`npm run build`) -> Inspect Failure -> Fix -> Build -> Repeat.
* **Hard Stop**: Maximum 10 iterations (`maxIterations = 10` in `.ralph/config.toml`).
* **Success Gates**:
  1. `npm run build` exits 0.
  2. `npm run typecheck` exits 0.
  3. Prebuild unit tests pass.
  4. Requested functionality verified.

---

## 5. CODERABBIT (REVIEW AGENT) AUDIT STANDARDS

Configured via `.coderabbit.yaml`. CodeRabbit enforces:
1. **Privacy & Confidentiality**: Zero logging of survivor PII, case details, or mental health data. Zero retention of raw voice audio.
2. **Security**: Supabase RLS policies, zero exposed service role keys or tokens.
3. **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation, focus indicators, minimum 44px touch targets.
4. **Theme & Contrast**: Day/night integrity without text contrast failures.
5. **3D & Animation**: Canvas/Three.js GPU-conscious animations must respect `prefers-reduced-motion`.

---

## 6. GIT & GITHUB WORKFLOW RULES

1. **Protected Branch**: `main` is protected. Never commit or push directly to `main`.
2. **Feature Branch Convention**: `feat/<name>`, `fix/<name>`, `refactor/<name>`, `docs/<name>`, `chore/<name>`.
3. **Commit Convention**: Conventional Commits (e.g., `feat: redesign Manas Suraksha luxury UI`).
4. **Git Safety**:
   - `git reset --hard`, `git clean -fd`, and force-pushes are strictly forbidden without explicit user command.
   - Always verify `git status` and exclude `.env*`, `.agents/mcp_config.json`, or secret tokens before staging.
5. **PR Lifecycle**: Push feature branch -> Create PR with GitHub CLI (`gh pr create`) -> CodeRabbit Review -> Fix Findings -> Merge to `main`.
