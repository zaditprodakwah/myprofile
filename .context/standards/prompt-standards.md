# Prompt Engineering & LLM Standards

Standards for prompt architectures, context packing, and routing guidelines.

## 1. Context Engineering
- **Context Packing:** Wrap context segments in clear XML tags (e.g., `<CONTEXT_DATA>`, `<SYSTEM_RULES>`) to structure model prompt scopes.
- **Hierarchy Mapping:** Structure prompt inputs from permanent rules, dynamic variables, and conversation history.

## 2. API Routing Fallbacks
- **Fallback Chains:** Attempt fast, cost-efficient APIs (like Groq) first, with automated failover logic to Google Gemini Flash on rate limit warnings.
