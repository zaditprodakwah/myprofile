# Implementation Notes: INTERACTION DESIGN

Blueprints for optimistic UI states.

## Optimistic UI Action Blueprint

```typescript
import { useState } from 'react';

export function OptimisticUpdateComponent({ onSave }) {
  const [data, setData] = useState('initial');
  const [pendingData, setPendingData] = useState<string | null>(null);

  const handleUpdate = async (newData: string) => {
    setPendingData(newData); // Set optimistic state instantly
    try {
      await onSave(newData);
      setData(newData);
    } catch (e) {
      console.error('Failed to save', e);
    } finally {
      setPendingData(null);
    }
  };

  return (
    <div>
      <p>Current: {pendingData || data}</p>
      <button onClick={() => handleUpdate('updated')}>Update</button>
    </div>
  );
}
```

## Action Plan
- Add skeleton panels for loading states.
- Setup spring variables inside Framer Motion wrappers.
