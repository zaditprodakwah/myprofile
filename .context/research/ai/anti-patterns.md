# Anti-Patterns to Avoid: AI ENGINEERING & AGENTS

AI pitfalls that cause performance degradation and cost spikes.

## Critical Pitfalls

### 1. Blind Prompt Injection
- **Trap:** Sending raw user inputs directly to LLM prompts without structure or sanitation.
- **Consequence:** Enables prompt injection attacks, allowing users to hijack system prompts or fetch unauthorized database data.
- **Remedy:** Always validate inputs with Zod schemas and wrap queries in strict system instructions.

### 2. Monolithic Prompt Bloat
- **Trap:** Packing all system rules, database schemas, and multiple tool definitions into a single prompt.
- **Consequence:** Increased latency, high token costs, and model attention degradation.
- **Remedy:** Break prompts down into modular steps and feed relevant context dynamically based on classification.
