import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { FunctionPopup } from './FunctionPopup'
import type { FunctionInfo, FunctionName } from './FunctionPopup'

const functions: Record<FunctionName, FunctionInfo> = {
  insert: {
    name: 'insert(value)',
    koreanName: '삽입',
    description: '새로운 값을 힙에 추가합니다. 배열 끝에 추가한 후 heapifyUp으로 올바른 위치로 이동시킵니다.',
    timeComplexity: 'O(log n)',
    pseudocode: [
      '1. 배열 끝에 새 값 추가',
      '2. 추가된 위치에서 heapifyUp 실행',
      '3. 부모와 비교하며 작으면 교환',
      '4. 루트에 도달하거나 부모가 더 작으면 종료'
    ],
    keyPoints: [
      '항상 완전 이진 트리 형태 유지',
      '최악의 경우 루트까지 이동 (높이 = log n)'
    ]
  },
  extractMin: {
    name: 'extractMin()',
    koreanName: '최소값 추출',
    description: '힙에서 최소값(루트)을 제거하고 반환합니다. 마지막 요소를 루트로 옮긴 후 heapifyDown으로 재정렬합니다.',
    timeComplexity: 'O(log n)',
    pseudocode: [
      '1. 루트(최소값) 저장',
      '2. 마지막 요소를 루트로 이동',
      '3. 배열 크기 감소',
      '4. 루트에서 heapifyDown 실행',
      '5. 저장한 최소값 반환'
    ],
    keyPoints: [
      '항상 최소값이 O(1)에 접근 가능',
      '재정렬에 O(log n) 소요'
    ]
  },
  heapifyUp: {
    name: 'heapifyUp(index)',
    koreanName: '위로 정렬',
    description: '주어진 인덱스에서 시작하여 부모와 비교하며 위로 이동합니다. 삽입 후 호출됩니다.',
    timeComplexity: 'O(log n)',
    pseudocode: [
      'while (index > 1):',
      '  parent = index / 2',
      '  if heap[index] < heap[parent]:',
      '    swap(index, parent)',
      '    index = parent',
      '  else:',
      '    break'
    ],
    keyPoints: [
      'Min Heap: 자식이 부모보다 작으면 교환',
      '최대 트리 높이만큼 반복'
    ]
  },
  heapifyDown: {
    name: 'heapifyDown(index)',
    koreanName: '아래로 정렬',
    description: '주어진 인덱스에서 시작하여 자식과 비교하며 아래로 이동합니다. 추출 후 호출됩니다.',
    timeComplexity: 'O(log n)',
    pseudocode: [
      'while (hasChildren):',
      '  smallest = 더 작은 자식 찾기',
      '  if heap[index] > heap[smallest]:',
      '    swap(index, smallest)',
      '    index = smallest',
      '  else:',
      '    break'
    ],
    keyPoints: [
      '두 자식 중 더 작은 것과 비교',
      '리프에 도달하면 종료'
    ]
  },
  peek: {
    name: 'peek()',
    koreanName: '최소값 확인',
    description: '힙의 최소값(루트)을 제거하지 않고 확인합니다.',
    timeComplexity: 'O(1)',
    pseudocode: [
      'return heap[1]'
    ],
    keyPoints: [
      '힙에서 가장 빠른 연산',
      '루트가 항상 최소값'
    ]
  }
}

const CARD_COLORS: Record<FunctionName, string> = {
  insert: '#10b981',
  extractMin: '#ef4444',
  heapifyUp: '#f59e0b',
  heapifyDown: '#8b5cf6',
  peek: '#3b82f6',
}

export function FunctionExplainer() {
  const [openFunc, setOpenFunc] = useState<FunctionName | null>(null)

  return (
    <div className="function-explainer">
      <h3>MinHeap 함수 설명</h3>
      <p className="function-explainer-hint">카드를 클릭하면 상세 설명과 데모를 볼 수 있습니다</p>

      <div className="function-cards">
        {(Object.keys(functions) as FunctionName[]).map((key) => {
          const func = functions[key]
          return (
            <button
              key={key}
              className="function-card"
              onClick={() => setOpenFunc(key)}
              style={{ borderTopColor: CARD_COLORS[key] }}
            >
              <code className="card-func-name">{func.name}</code>
              <span className="card-complexity" style={{ color: CARD_COLORS[key] }}>
                {func.timeComplexity}
              </span>
              <p className="card-desc">{func.koreanName}</p>
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {openFunc && (
          <FunctionPopup
            func={functions[openFunc]}
            funcKey={openFunc}
            onClose={() => setOpenFunc(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
