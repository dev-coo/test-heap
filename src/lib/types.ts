export interface HeapStep {
  type: 'compare' | 'swap' | 'complete' | 'insert' | 'remove'
  indices: number[]
  description: string
  heap: (number | null)[]
}

export const MAX_HEAP_SIZE = 24
export const MIN_VALUE = -999
export const MAX_VALUE = 999
