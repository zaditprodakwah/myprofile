# Implementation Notes: ONBOARDING & ACTIVATION

Blueprints for onboarding steps.

## Onboarding Checklist Component

```tsx
import { useState } from 'react';

export function OnboardingChecklist() {
  const [steps, setSteps] = useState([
    { id: 1, text: 'Run your first site audit', done: false },
    { id: 2, text: 'Claim your Local Entity Profile', done: false },
    { id: 3, text: 'Connect your target city', done: false }
  ]);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
      <h3 className="text-slate-100 font-bold mb-4">Complete Setup</h3>
      <div className="space-y-3">
        {steps.map(step => (
          <div key={step.id} className="flex items-center space-x-3">
            <input type="checkbox" checked={step.done} readOnly className="rounded text-teal-600 focus:ring-teal-500 bg-slate-800 border-slate-700" />
            <span className={step.done ? 'line-through text-slate-500' : 'text-slate-300'}>{step.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Action Plan
- Build onboarding checklists for new accounts.
- Configure dashboard empty states with action triggers.
