import type { HeapStep } from './types'

function parentIndex(i: number): number {
  return Math.floor(i / 2)
}

function leftChildIndex(i: number): number {
  return 2 * i
}

function rightChildIndex(i: number): number {
  return 2 * i + 1
}

export function insertWithSteps(
  heapArray: (number | null)[],
  value: number
): { finalHeap: (number | null)[]; steps: HeapStep[] } {
  const heap = [...heapArray]
  const steps: HeapStep[] = []

  heap.push(value)
  const insertIdx = heap.length - 1
  steps.push({
    type: 'insert',
    indices: [insertIdx],
    description: `${value}를 배열 끝(인덱스 ${insertIdx})에 삽입`,
    heap: [...heap],
  })

  let idx = insertIdx
  while (idx > 1) {
    const pIdx = parentIndex(idx)

    steps.push({
      type: 'compare',
      indices: [idx, pIdx],
      description: `인덱스 ${idx}(${heap[idx]})와 부모 ${pIdx}(${heap[pIdx]}) 비교`,
      heap: [...heap],
    })

    if ((heap[idx] as number) < (heap[pIdx] as number)) {
      const childVal = heap[idx]
      const parentVal = heap[pIdx]
      ;[heap[idx], heap[pIdx]] = [heap[pIdx], heap[idx]]

      steps.push({
        type: 'swap',
        indices: [idx, pIdx],
        description: `${childVal} < ${parentVal} → 교환!`,
        heap: [...heap],
      })

      idx = pIdx
    } else {
      steps.push({
        type: 'compare',
        indices: [idx],
        description: `${heap[idx]} >= ${heap[pIdx]} → 위치 확정`,
        heap: [...heap],
      })
      break
    }
  }

  steps.push({
    type: 'complete',
    indices: [],
    description: '삽입 완료!',
    heap: [...heap],
  })

  return { finalHeap: heap, steps }
}

export function extractMinWithSteps(
  heapArray: (number | null)[]
): { value: number | null; finalHeap: (number | null)[]; steps: HeapStep[] } {
  if (heapArray.length <= 1) {
    return { value: null, finalHeap: [null], steps: [] }
  }

  const heap = [...heapArray]
  const steps: HeapStep[] = []
  const min = heap[1] as number

  steps.push({
    type: 'remove',
    indices: [1],
    description: `최소값 ${min}(루트) 제거`,
    heap: [...heap],
  })

  if (heap.length === 2) {
    steps.push({
      type: 'complete',
      indices: [],
      description: '힙이 비었습니다',
      heap: [null],
    })
    return { value: min, finalHeap: [null], steps }
  }

  const lastIndex = heap.length - 1
  const last = heap[lastIndex] as number
  heap.pop()
  heap[1] = last

  steps.push({
    type: 'swap',
    indices: [1],
    description: `마지막 요소 ${last}(인덱스 ${lastIndex})를 루트로 이동`,
    heap: [...heap],
  })

  let idx = 1
  const length = heap.length

  while (true) {
    const left = leftChildIndex(idx)
    const right = rightChildIndex(idx)
    let smallest = idx

    if (left < length) {
      steps.push({
        type: 'compare',
        indices: [idx, left],
        description: `인덱스 ${idx}(${heap[idx]})와 왼쪽 자식 ${left}(${heap[left]}) 비교`,
        heap: [...heap],
      })
      if ((heap[left] as number) < (heap[smallest] as number)) {
        smallest = left
      }
    }

    if (right < length) {
      steps.push({
        type: 'compare',
        indices: [smallest, right],
        description: `현재 최소 ${smallest}(${heap[smallest]})와 오른쪽 자식 ${right}(${heap[right]}) 비교`,
        heap: [...heap],
      })
      if ((heap[right] as number) < (heap[smallest] as number)) {
        smallest = right
      }
    }

    if (smallest !== idx) {
      const currentVal = heap[idx]
      const smallestVal = heap[smallest]
      ;[heap[idx], heap[smallest]] = [heap[smallest], heap[idx]]

      steps.push({
        type: 'swap',
        indices: [idx, smallest],
        description: `${currentVal} > ${smallestVal} → 교환!`,
        heap: [...heap],
      })

      idx = smallest
    } else {
      if (left < length || right < length) {
        steps.push({
          type: 'compare',
          indices: [idx],
          description: `인덱스 ${idx}(${heap[idx]})가 자식보다 작음 → 위치 확정`,
          heap: [...heap],
        })
      }
      break
    }
  }

  steps.push({
    type: 'complete',
    indices: [],
    description: `최소값 ${min} 추출 완료!`,
    heap: [...heap],
  })

  return { value: min, finalHeap: heap, steps }
}
