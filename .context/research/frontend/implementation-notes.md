# Implementation Notes: FRONTEND UI & UX

Guidelines for building the Intelligence Console and custom components.

## Building the Split-Pane Intelligence Layout

```tsx
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function IntelligenceLayout() {
  return (
    <PanelGroup direction="horizontal" className="h-screen bg-slate-950">
      <Panel defaultSize={20} minSize={15} maxSize={30} className="border-r border-slate-800">
        {/* Entity Tree Selector */}
      </Panel>
      <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-teal-500 transition-colors" />
      <Panel defaultSize={50}>
        {/* Main Graph Canvas / Data Grid */}
      </Panel>
      <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-teal-500 transition-colors" />
      <Panel defaultSize={30} minSize={20} className="border-l border-slate-800">
        {/* Contextual Inspector Panel */}
      </Panel>
    </PanelGroup>
  );
}
```

### Action Plan
1. Scaffold layout wrapper utilizing `react-resizable-panels` for splitting the inspector.
2. Build command palette trigger using `cmdk` and register search shortcuts.
3. Integrate TanStack Table for dense, virtualized entity lists.
