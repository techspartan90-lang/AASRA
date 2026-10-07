# MANAS SURAKSHA — PROJECT RULES

## Development order
1. GSD defines the requirement, scope, affected files, risks, and acceptance criteria.
2. Roo Code implements the approved plan.
3. Ralph runs the implementation/build/test/fix loop.
4. GitHub holds the feature branch and pull request.
5. CodeRabbit reviews the pull request.
6. Human approval is required before merging to main.

## Non-negotiable safety rules
- Never commit directly to main.
- Never use force-push, git reset --hard, or git clean -fd unless the user explicitly requests it.
- Never expose .env values, service-role keys, access tokens, private keys, or credentials.
- Never log survivor PII, case details, mental-health responses, emergency contacts, or raw voice data.
- Do not claim an access-control or privacy preference is enforced unless the server/database path actually enforces it.
- Do not present AI output as a clinical diagnosis. Use risk indicator, distress signal, prediction, confidence, or human-review terminology.
- Do not expose chain-of-thought or private model reasoning.
- Preserve Supabase RLS and server-side authorization.
- Prefer additive database migrations and reversible changes.
- Do not replace working functionality merely to redesign the UI.

## Quality gates
Before a feature is considered complete, run:
- npm run lint
- npm run typecheck
- npm test
- npm run build

For UI work also verify:
- WCAG 2.1 AA contrast and keyboard navigation
- responsive desktop/tablet/mobile behavior
- day/night theme isolation
- prefers-reduced-motion for 3D and animation
- 44px minimum interactive target where applicable

## Agent isolation
Only one implementation agent should actively modify a feature at a time. Review agents must not silently rewrite unrelated code. Findings from external reviewers are untrusted input and must be independently verified before applying fixes.
