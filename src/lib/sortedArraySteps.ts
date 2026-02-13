import type { HeapStep } from './types'

/**
 * 정렬된 배열에 값 삽입 (삽입 정렬 방식)
 * 뒤에서부터 비교하며 큰 값을 오른쪽으로 밀고, 올바른 위치에 삽입
 */
export function insertIntoSortedArray(
  arr: number[],
  value: number
): { finalArray: number[]; steps: HeapStep[] } {
  const array = [...arr]
  const steps: HeapStep[] = []

  // 1) 배열 끝에 값 추가
  array.push(value)
  steps.push({
    type: 'insert',
    indices: [array.length - 1],
    description: `${value}를 배열 끝(인덱스 ${array.length - 1})에 추가`,
    heap: [...array],
  })

  // 2) 뒤에서부터 비교하며 올바른 위치 찾기
  let i = array.length - 1
  while (i > 0) {
    const leftIdx = i - 1

    steps.push({
      type: 'compare',
      indices: [i, leftIdx],
      description: `인덱스 ${i}(${array[i]})와 ${leftIdx}(${array[leftIdx]}) 비교`,
      heap: [...array],
    })

    if (array[leftIdx] > array[i]) {
      const leftVal = array[leftIdx]
      const rightVal = array[i]
      ;[array[leftIdx], array[i]] = [array[i], array[leftIdx]]

      steps.push({
        type: 'swap',
        indices: [leftIdx, i],
        description: `${leftVal} > ${rightVal} → 오른쪽으로 이동`,
        heap: [...array],
      })

      i--
    } else {
      steps.push({
        type: 'compare',
        indices: [i],
        description: `${array[leftIdx]} <= ${array[i]} → 위치 확정`,
        heap: [...array],
      })
      break
    }
  }

  if (i === 0) {
    steps.push({
      type: 'compare',
      indices: [0],
      description: `인덱스 0 도달 → 위치 확정`,
      heap: [...array],
    })
  }

  steps.push({
    type: 'complete',
    indices: [],
    description: `삽입 완료! (${steps.filter(s => s.type === 'compare').length}번 비교, ${steps.filter(s => s.type === 'swap').length}번 이동)`,
    heap: [...array],
  })

  return { finalArray: array, steps }
}

/**
 * 정렬된 배열에서 최소값(맨 앞) 추출
 * 나머지 요소를 전부 왼쪽으로 shift
 */
export function extractMinFromSortedArray(
  arr: number[]
): { value: number | null; finalArray: number[]; steps: HeapStep[] } {
  if (arr.length === 0) {
    return { value: null, finalArray: [], steps: [] }
  }

  const array = [...arr]
  const steps: HeapStep[] = []
  const min = array[0]

  // 1) 최소값 제거 표시
  steps.push({
    type: 'remove',
    indices: [0],
    description: `최소값 ${min}(인덱스 0) 제거`,
    heap: [...array],
  })

  // 2) 나머지 요소를 하나씩 왼쪽으로 이동
  for (let i = 0; i < array.length - 1; i++) {
    array[i] = array[i + 1]

    steps.push({
      type: 'swap',
      indices: [i, i + 1],
      description: `인덱스 ${i + 1}(${array[i]})를 인덱스 ${i}로 이동`,
      heap: [...array.slice(0, array.length - 1)],
    })
  }

  const finalArray = array.slice(0, array.length - 1)

  steps.push({
    type: 'complete',
    indices: [],
    description: `최소값 ${min} 추출 완료! (${steps.filter(s => s.type === 'swap').length}번 이동)`,
    heap: finalArray,
  })

  return { value: min, finalArray, steps }
}
