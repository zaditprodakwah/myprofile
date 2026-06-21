# Implementation Notes: INFORMATION ARCHITECTURE

Implementation guide for split panels.

## Progressive Disclosure Component

```tsx
import { useState } from 'react';

export function ProgressiveDisclosure({ title, children }: { title: string, children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-800 rounded-lg p-4 bg-slate-900">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between w-full text-slate-100 font-semibold">
        <span>{title}</span>
        <span>{isOpen ? '▲ Muted details' : '▼ View details'}</span>
      </button>
      {isOpen && <div className="mt-4 text-slate-300 transition-all">{children}</div>}
    </div>
  );
}
```

## Action Plan
- Standardize layout grids to limit page margins.
- Apply resizable sidebars to the Command Console.
