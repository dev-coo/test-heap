# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Interactive MinHeap visualization built with React 19 + TypeScript + Vite 7. Animates insert, extractMin, heapifyUp, and heapifyDown operations step-by-step with tree and array views. Documentation is in Korean.

## Commands

```bash
pnpm install        # Install dependencies (pnpm v9+, Node v22+)
pnpm dev            # Dev server at localhost:5173 with HMR
pnpm build          # TypeScript check (tsc -b) + Vite production build
pnpm lint           # ESLint (flat config, TS + React hooks rules)
pnpm preview        # Preview production build locally
```

No test framework is configured.

## Architecture

**Data flow:** User action (Controls) → App.tsx state handler → MinHeap method → returns `HeapStep[]` → App iterates steps with delays → TreeView/ArrayView/StepInfo re-render per step.

**Key types** (`src/lib/MinHeap.ts`):
- `HeapStep` — captures each animation frame: `{ type, indices, description, heap }` where type is `'compare' | 'swap' | 'complete' | 'insert' | 'remove'`
- `MinHeap` class — array-based heap with `insert()` and `extractMin()` returning `HeapStep[]` for visualization

**Components** (`src/components/`):
- `TreeView` — SVG binary tree rendering with positional math per tree level; color-codes nodes by step type
- `ArrayView` — horizontal array with Framer Motion animations; shows parent/child index formulas
- `Controls` — input field + action buttons; disables during animation
- `StepInfo` — step description + progress bar with Framer Motion transitions
- `FunctionExplainer` — tabbed panel showing pseudocode and complexity for each heap function

**State management:** All state lives in App.tsx via `useState`/`useRef`. MinHeap instance persists across renders via `useRef`. No external state library.

**Styling:** Single `App.css` with dark theme. CSS Grid layout with responsive breakpoints at 768px and 900px. Framer Motion handles all element animations.

## Conventions

- Color coding: blue=default, orange=compare, red=swap/remove, green=insert/complete
- CSS classes follow BEM-like naming: `.tree-view__node--compare`
- Component files: PascalCase. Lib files: PascalCase class name. CSS classes: kebab-case
- TypeScript strict mode enabled; no implicit any
- To add a new heap operation: add logic in `MinHeap.ts` → add `HeapStep` type if needed → add handler in `App.tsx` → add button in `Controls.tsx`
