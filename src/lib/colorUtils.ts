import type { HeapStep } from './types'

const COLORS = {
  default: '#3b82f6',
  compare: '#f59e0b',
  swap: '#ef4444',
  insert: '#10b981',
  remove: '#ef4444',
  complete: '#10b981',
} as const

export function getHighlightColor(
  index: number,
  highlightIndices: number[],
  highlightType: HeapStep['type'] | null
): string {
  if (!highlightType || !highlightIndices.includes(index)) return COLORS.default
  return COLORS[highlightType] ?? COLORS.default
}
