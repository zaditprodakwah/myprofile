const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '../.context');

// Helper to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

ensureDir(path.join(BASE_DIR, 'playbooks'));
ensureDir(path.join(BASE_DIR, 'checklists'));
ensureDir(path.join(BASE_DIR, 'standards'));

// --- GENERATE NEW PLAYBOOKS ---

const playbooks = {
  'human-first-product-playbook.md': `# Human-First Product Playbook

Guidelines for shifting focus from technical execution to user psychology, decision design, and customer journeys.

## Core Philosophy
The product hierarchy of value must flow downwards:
\`\`\`
Human Psychology → Customer Journey → Information Architecture → UX Writing → Interaction Design → Design System → Frontend Engineering → Backend Systems
\`\`\`

## Execution Blueprint
1. **Define User Intention:** Before coding any API endpoint, trace the direct value it delivers to the human visitor.
2. **Minimize Interaction Friction:** Limit form inputs, use progressive disclosures, and defer mandatory registrations.
3. **Handle Anxieties:** Build inline reassurance indicators, transparency links, and descriptive confirmations.
`,
  'ux-review-playbook.md': `# UX Review Playbook

Methodology for conducting interface heuristic inspections and scanning rhythm audits.

## Heuristic Checkpoints
1. **Aesthetic Consistency:** Elements align to the 8px grid and Slate color tokens.
2. **Fitts's Law Compliance:** CTA buttons are large (min 44x44px target) and placed in logical mouse tracks.
3. **Visibility of System Status:** Indicators confirm saving states or search query progressions in real-time.
4. **Consistency and Standards:** Follow platform-specific conventions (e.g. settings in standard tables, user profile menu in the upper-right corner).
`,
  'conversion-playbook.md': `# Conversion Playbook

Strategies for structuring visual paths, CTA triggers, and optimizing registration funnels.

## Funnel Optimizations
- **Foot-in-the-Door Form:** Place simple, zero-commitment selectors in the Hero block. Prompt for signup only after calculating audit value.
- **CTA Copy Rules:** Use active verbs showing exact outcomes (e.g., "Analyze My Site Now") instead of passive labels ("Submit").
- **Local Payment Gateways:** Streamline checkout layouts by integrating **Xendit** payment fields for QRIS, e-wallets, and virtual accounts, benchmarking the visual clarity of Stripe.
`,
  'product-copy-playbook.md': `# Product Copy Playbook

UX writing guidelines to improve clarity and reduce user anxiety.

## Tone & Voice Rules
- **Technical Trust:** Confident, precise, and metric-backed. Avoid hyperbolic marketing phrases ("the best", "revolutionizing").
- **Clear Error Messaging:** Avoid raw code error logs. Provide descriptions indicating what happened and how to resolve it.
- **Empty State Encouragement:** Replace empty list views with visual templates and active prompt buttons.
`,
  'interaction-design-playbook.md': `# Interaction Design Playbook

Motion, hover behaviors, loading screens, and optimistic client transitions.

## Interaction Guidelines
- **Optimistic State Toggles:** Instantly change toggles in the UI during server writes, rolling back only on API failures.
- **Skeleton Panels:** Use gray pulsing placeholders matching the structure of content containers during data fetching.
- **Apple-Level Motion:** Transitions must use spring physics with cubic-bezier easing instead of linear rates.
`,
  'dashboard-design-playbook.md': `# Dashboard Design Playbook

Rules for designing Customer-Centric dashboards versus Engineering-Centric metrics.

## Dashboard Segregations

### Engineering Dashboard (Internal Tools)
- Focus: CPU, API latency, queue capacities, error logs, database connections.

### Customer Dashboard (Business Value Engine)
- Focus: New leads captured, revenue potentials, local business search visibility, next best recommendations.

*Always prioritize human outcomes and actionable alerts over raw backend metrics.*
`,
  'onboarding-playbook.md': `# Onboarding Playbook

Hook models, progressive setups, and activation threshold strategies.

## Activation Milestones
1. **First Value Pathway:** Guide the user to run an audit within 30 seconds of landing.
2. **Setup Checklist:** Display interactive checklists tracking account setups. Auto-check items to leverage the goal gradient effect.
`,
  'trust-design-playbook.md': `# Trust Design Playbook

transparency, explainability, audit logs, and security communications.

## Guidelines
- **Formula Transparency:** Expose the exact penaltes and metrics calculating audit engine scores.
- **Immutable Log Visibility:** Expose credit deductions and entity updates in user settings tables, supporting CSV downloads.
`,
  'human-ai-playbook.md': `# Human-AI Interaction Playbook

UX strategies for AI agents, collaboration models, and human-in-the-loop validation.

## Collaboration Guidelines
- **Explain Before Acting:** Prompt detail summaries before executing database migrations or scraping targets.
- **Versioned Draft Diffs:** Save rewritten drafts and allow users to inspect differences in split diff grids before publishing.
`,
  'storytelling-playbook.md': `# Storytelling Playbook

Structuring single-page landing narrative flows and case study progressions.

## Case Study Template
1. **Target Sector Badge:** Defines the audience.
2. **Challenge Explainer:** Connects with reader pain points.
3. **Approach Blueprint:** Outlines the strategy.
4. **Metric Counters:** Animated counters showing outcomes.
5. **Client Quote:** Local authority attribution.
`
};

Object.entries(playbooks).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'playbooks', filename), content);
});

// --- GENERATE CHECKLISTS ---

const checklists = {
  'customer-journey-checklist.md': `# Customer Journey Checklist
- [ ] User motivation is highlighted on entry screens
- [ ] Potential anxieties are addressed before requesting clicks
- [ ] Navigation matches expected user flow
- [ ] Friction points (such as inputs) are reduced to the absolute minimum
`,
  'activation-checklist.md': `# Activation Checklist
- [ ] User achieves First Value under 30 seconds
- [ ] Setup wizard has less than 4 steps
- [ ] Onboarding checklists auto-check completed items
- [ ] Tooltips explain unfamiliar layout elements
`,
  'conversion-checklist.md': `# Conversion Checklist
- [ ] CTA buttons contain active, descriptive verbs
- [ ] Payment overlays (powered by Xendit) display QRIS, e-wallet, and virtual account options clearly
- [ ] Trust indicators and client metrics are visible near action areas
- [ ] Pricing models explain credit limits transparently
`,
  'copy-review-checklist.md': `# Copy Review Checklist
- [ ] Jargon words are removed from client-facing error logs
- [ ] Empty state containers encourage user action
- [ ] Success screens celebrate milestone outcomes
- [ ] Marketing clichés ("world-class", "best") are removed
`,
  'trust-checklist.md': `# Trust Checklist
- [ ] Audit engine formulas are documented and linked
- [ ] User credit transaction lists are audit-ready and downloadable
- [ ] Data privacy settings explain what data is collected
- [ ] Verification badges display claiming statuses transparently
`,
  'onboarding-checklist.md': `# Onboarding Checklist
- [ ] Setup check lists are visible on empty dashboards
- [ ] Joyride walkthrough loops highlight primary action buttons
- [ ] Welcome screens direct users to the setup path
- [ ] Advanced features are hidden behind progressive disclosures
`,
  'dashboard-review-checklist.md': `# Dashboard Review Checklist
- [ ] Visual panels prioritize customer business metrics (leads, opportunities)
- [ ] Technical system logs are restricted to admin paths
- [ ] Next best recommendations are displayed at the top of the interface
- [ ] Filter controls let users sort data ranges easily
`,
  'decision-design-checklist.md': `# Decision Design Checklist
- [ ] Comparison grids group rows in structured tables
- [ ] High-impact recommendations contain "Recommended" highlights
- [ ] Options are limited to top 3 prioritized alerts to prevent fatigue
- [ ] Risk warnings suggest clear solutions
`,
  'human-ai-checklist.md': `# Human-AI Checklist
- [ ] LLM text generators stream content progressively (zero blank delays)
- [ ] AI-generated text is editable inside custom editor textareas
- [ ] Version histories and diff editors are active for draft updates
- [ ] Heavy AI operations request human confirmation before executing
`
};

Object.entries(checklists).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'checklists', filename), content);
});

// --- GENERATE STANDARDS ---

const standards = {
  'product-standards.md': `# Product Engineering Standards
- **Core Value:** Human experience, cognitive ease, and conversion outcomes dictate technical architecture choices.
- **Feature Pipeline:** Write product specification sheets matching user psychology before backend database design.
`,
  'ux-writing-standards.md': `# UX Writing Standards
- **Tone:** Technical trust, concise, and helpful.
- **Language Rules:** Error messages must explain the issue and provide a button to fix it. Keep marketing text to a minimum on action screens.
`,
  'interaction-standards.md': `# Interaction Design Standards
- **Animations:** Micro-animations must use spring easing curves. No linear rates.
- **Perceived Speed:** Implement optimistic UI updates for inputs and skeleton loaders for fetched content.
`,
  'dashboard-standards.md': `# Dashboard Design Standards
- **Customer Viewports:** Prioritize business health signals, new leads, and next best recommendations.
- **Access Limits:** Keep technical database metrics restricted to admin paths.
`,
  'customer-experience-standards.md': `# Customer Experience Standards
- **Lifecycle Alerts:** Milestone events (claims, topups) must trigger automated email or WhatsApp confirmations.
- **Refunds & Billing:** Payment failures on Xendit checkouts must output helpful guides on payment options.
`,
  'human-ai-standards.md': `# Human-AI Interaction Standards
- **User Control:** The AI acts as an assistant. Large mutations must request user approval before execution.
- **Text Outputs:** Content generation must support split-pane diff comparisons and block editors.
`,
  'information-architecture-standards.md': `# Information Architecture Standards
- **Disclosure:** Hide advanced options under progressive disclosure selectors (collapsible panels).
- **Navigation:** Universal command palettes (Cmd+K) must manage primary routing.
`
};

Object.entries(standards).forEach(([filename, content]) => {
  fs.writeFileSync(path.join(BASE_DIR, 'standards', filename), content);
});

console.log('Successfully completed advanced human-first governance structures.');
