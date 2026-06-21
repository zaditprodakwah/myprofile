# AI-Assisted Coding Standards

Standards for collaborative vibe coding between developers and AI agents.

## 1. Vibe Coding Workflow
- **Cursor + Claude Code:** Leverage Cursor for editor edits and inline queries. Use Claude Code CLI client for large refactoring runs, multi-file updates, and agent workflows.
- **Spec-First Plan:** Write and review an ADR or PRD document before letting AI write codebase files.

## 2. Quality Gate Loops
- **Compiler Validation:** After editing files, run `npm run build` or TypeScript checks (`npx tsc`) to ensure no compile errors are introduced.
- **Review Checks:** Audit Git changes and run linter commands (`npm run lint`) to ensure formatting standards are maintained.
