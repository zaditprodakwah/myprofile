# Design & Implementation Patterns: AI ENGINEERING & AGENTS

Patterns for structured output validation, fallbacks, and memory caches.

## Recommended Patterns

### 1. Fallback LLM Router
- **Description:** Route prompt tasks based on system performance requirements and rate limit budgets.
- **Implementation:** Attempt Groq API (Llama-3.1 8B) for fast text rewriting, falling back to Gemini Flash (1.5 Flash) on failure.

### 2. Hierarchical Agent Memory Lifecycle
- **Description:** Structure agent memory into Working Memory (current task variables), Episodic Memory (past step history), and Semantic Memory (long-term database embeddings).
- **Implementation:** Store episodic summaries in database tables and retrieve them dynamically using vector searches.
