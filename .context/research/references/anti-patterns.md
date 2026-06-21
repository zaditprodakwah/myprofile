# Anti-Patterns to Avoid: VIBE CODING & AGENTS

AI-assisted developer anti-patterns.

## Critical Pitfalls

### 1. Blind Code Generation without Compilation Validation
- **Trap:** Let AI write complex code without running compiler tests.
- **Consequence:** Breaking existing systems and introducing compiler bugs.
- **Remedy:** Ensure the agent compiles the codebase successfully after editing.

### 2. Monolithic Code Commits
- **Trap:** Committing multiple code changes in a single commit.
- **Consequence:** Hard to isolate bugs, track changes, or roll back code safely.
- **Remedy:** Make small commits in logical units.
