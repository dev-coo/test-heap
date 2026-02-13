import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HeapStep } from '../lib/types'
import { insertWithSteps, extractMinWithSteps } from '../lib/heapSteps'
import { insertIntoSortedArray, extractMinFromSortedArray } from '../lib/sortedArraySteps'
import { getHighlightColor } from '../lib/colorUtils'

const INITIAL_VALUES = [7, 12, 11, 20, 14]

function buildHeap(values: number[]): (number | null)[] {
  let heap: (number | null)[] = [null]
  for (const v of values) {
    const { finalHeap } = insertWithSteps(heap, v)
    heap = finalHeap
  }
  return heap
}

function buildSorted(values: number[]): number[] {
  return [...values].sort((a, b) => a - b)
}

function countByType(steps: HeapStep[], type: HeapStep['type'], upTo: number): number {
  let count = 0
  for (let i = 0; i <= upTo && i < steps.length; i++) {
    if (steps[i].type === type) count++
  }
  return count
}

interface SortedColumnProps {
  label: string
  labelColor: string
  array: number[]
  indices: number[]
  stepType: HeapStep['type'] | null
  step: HeapStep | null
  compares: number
  moves: number
  totalSteps: number
}

function SortedColumn({
  label, labelColor, array, indices, stepType, step,
  compares, moves, totalSteps,
}: SortedColumnProps) {
  return (
    <div className="comparison-column">
      <div className="comparison-column-header">
        <span className="comparison-label" style={{ borderColor: labelColor }}>
          {label}
        </span>
        <span className="comparison-total-steps">
          총 {totalSteps}스텝
        </span>
      </div>

      <div className="comparison-array">
        {array.map((val, i) => {
          const color = getHighlightColor(i, indices, stepType)
          return (
            <div key={i} className="comparison-cell" style={{ backgroundColor: color }}>
              <span className="comparison-cell-value">{val}</span>
              <span className="comparison-cell-index">{i}</span>
            </div>
          )
        })}
        {array.length === 0 && (
          <span className="comparison-empty">빈 배열</span>
        )}
      </div>

      <div className="comparison-counters">
        <span className="counter-badge counter-compare">
          비교 <strong>{compares}</strong>
        </span>
        <span className="counter-badge counter-move">
          이동 <strong>{moves}</strong>
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step && (
          <motion.div
            key={step.description}
            className="comparison-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="comparison-step-badge">{step.type.toUpperCase()}</span>
            <span className="comparison-step-desc">{step.description}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface HeapColumnProps {
  label: string
  labelColor: string
  heap: (number | null)[]
  indices: number[]
  stepType: HeapStep['type'] | null
  step: HeapStep | null
  compares: number
  moves: number
  totalSteps: number
}

function HeapColumn({
  label, labelColor, heap, indices, stepType, step,
  compares, moves, totalSteps,
}: HeapColumnProps) {
  const dataCount = heap.length - 1

  return (
    <div className="comparison-column">
      <div className="comparison-column-header">
        <span className="comparison-label" style={{ borderColor: labelColor }}>
          {label}
        </span>
        <span className="comparison-total-steps">
          총 {totalSteps}스텝
        </span>
      </div>

      <div className="comparison-array">
        {dataCount > 0 ? (
          heap.slice(1).map((val, offset) => {
            const i = offset + 1
            const color = getHighlightColor(i, indices, stepType)
            return (
              <div key={i} className="comparison-cell" style={{ backgroundColor: color }}>
                <span className="comparison-cell-value">{val}</span>
                <span className="comparison-cell-index">{i}</span>
              </div>
            )
          })
        ) : (
          <span className="comparison-empty">빈 배열</span>
        )}
      </div>

      <div className="comparison-counters">
        <span className="counter-badge counter-compare">
          비교 <strong>{compares}</strong>
        </span>
        <span className="counter-badge counter-move">
          이동 <strong>{moves}</strong>
        </span>
      </div>

      <AnimatePresence mode="wait">
        {step && (
          <motion.div
            key={step.description}
            className="comparison-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="comparison-step-badge">{step.type.toUpperCase()}</span>
            <span className="comparison-step-desc">{step.description}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ComparisonView() {
  const [heapArray, setHeapArray] = useState(() => buildHeap(INITIAL_VALUES))
  const [sortedArray, setSortedArray] = useState(() => buildSorted(INITIAL_VALUES))

  const [heapSteps, setHeapSteps] = useState<HeapStep[]>([])
  const [sortedSteps, setSortedSteps] = useState<HeapStep[]>([])
  const [stepIndex, setStepIndex] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [resultMessage, setResultMessage] = useState('')

  const cancelRef = useRef(false)

  const currentHeapStep = stepIndex >= 0 && stepIndex < heapSteps.length ? heapSteps[stepIndex] : null
  const currentSortedStep = stepIndex >= 0 && stepIndex < sortedSteps.length ? sortedSteps[stepIndex] : null

  // Display arrays: show step snapshot or base array
  const displayHeap = currentHeapStep?.heap ?? heapArray
  const displaySorted = currentSortedStep?.heap ?? sortedArray
  const heapIndices = currentHeapStep?.indices ?? []
  const sortedIndices = currentSortedStep?.indices ?? []
  const heapType = currentHeapStep?.type ?? null
  const sortedType = currentSortedStep?.type ?? null

  // Counters
  const heapCompares = stepIndex >= 0 ? countByType(heapSteps, 'compare', stepIndex) : 0
  const heapMoves = stepIndex >= 0 ? countByType(heapSteps, 'swap', stepIndex) : 0
  const sortedCompares = stepIndex >= 0 ? countByType(sortedSteps, 'compare', stepIndex) : 0
  const sortedMoves = stepIndex >= 0 ? countByType(sortedSteps, 'swap', stepIndex) : 0

  const runAnimation = useCallback(
    async (hSteps: HeapStep[], sSteps: HeapStep[], finalHeap: (number | null)[], finalSorted: number[]) => {
      const total = Math.max(hSteps.length, sSteps.length)
      if (total === 0) return

      cancelRef.current = false
      setIsAnimating(true)
      setHeapSteps(hSteps)
      setSortedSteps(sSteps)
      setResultMessage('')

      for (let i = 0; i < total; i++) {
        if (cancelRef.current) break
        setStepIndex(i)
        await new Promise(r => setTimeout(r, 700))
      }

      if (!cancelRef.current) {
        setHeapArray(finalHeap)
        setSortedArray(finalSorted)

        // Calculate result
        const hTotal = hSteps.filter(s => s.type === 'compare' || s.type === 'swap').length
        const sTotal = sSteps.filter(s => s.type === 'compare' || s.type === 'swap').length
        if (sTotal > hTotal) {
          const pct = Math.round((1 - hTotal / sTotal) * 100)
          setResultMessage(`MinHeap이 ${pct}% 적은 연산으로 완료! (${hTotal} vs ${sTotal})`)
        } else if (hTotal > sTotal) {
          setResultMessage(`정렬 배열이 더 효율적 (${sTotal} vs ${hTotal})`)
        } else {
          setResultMessage(`동일한 연산 횟수 (${hTotal})`)
        }
      }

      setIsAnimating(false)
    },
    []
  )

  const handleInsert = useCallback(() => {
    const val = Number(inputValue)
    if (isNaN(val)) return

    const heapResult = insertWithSteps(heapArray, val)
    const sortedResult = insertIntoSortedArray(sortedArray, val)

    runAnimation(heapResult.steps, sortedResult.steps, heapResult.finalHeap, sortedResult.finalArray)
  }, [inputValue, heapArray, sortedArray, runAnimation])

  const handleExtractMin = useCallback(() => {
    const heapResult = extractMinWithSteps(heapArray)
    const sortedResult = extractMinFromSortedArray(sortedArray)

    runAnimation(
      heapResult.steps, sortedResult.steps,
      heapResult.finalHeap, sortedResult.finalArray
    )
  }, [heapArray, sortedArray, runAnimation])

  const handleReset = useCallback(() => {
    cancelRef.current = true
    setHeapArray(buildHeap(INITIAL_VALUES))
    setSortedArray(buildSorted(INITIAL_VALUES))
    setHeapSteps([])
    setSortedSteps([])
    setStepIndex(-1)
    setIsAnimating(false)
    setResultMessage('')
    setInputValue('')
  }, [])

  useEffect(() => {
    return () => { cancelRef.current = true }
  }, [])

  const parsedValue = Number(inputValue)
  const isValidInput = inputValue !== '' && !isNaN(parsedValue) && parsedValue >= -999 && parsedValue <= 999

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h3>정렬 배열 vs MinHeap 비교</h3>
        <p className="comparison-hint">
          같은 작업을 정렬 배열과 MinHeap에서 수행할 때 연산 횟수 차이를 확인하세요
        </p>
      </div>

      <div className="comparison-controls">
        <input
          type="number"
          className="comparison-input"
          placeholder="값 입력"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValidInput && !isAnimating) handleInsert()
          }}
          disabled={isAnimating}
        />
        <button
          className="comp-btn comp-btn-insert"
          onClick={handleInsert}
          disabled={isAnimating || !isValidInput}
        >
          Insert 비교
        </button>
        <button
          className="comp-btn comp-btn-extract"
          onClick={handleExtractMin}
          disabled={isAnimating || heapArray.length <= 1}
        >
          ExtractMin 비교
        </button>
        <button
          className="comp-btn comp-btn-reset"
          onClick={handleReset}
        >
          리셋
        </button>
      </div>

      <div className="comparison-columns">
        <SortedColumn
          label="정렬 배열"
          labelColor="#f59e0b"
          array={displaySorted as number[]}
          indices={sortedIndices}
          stepType={sortedType}
          step={currentSortedStep}
          compares={sortedCompares}
          moves={sortedMoves}
          totalSteps={sortedSteps.length}
        />

        <div className="comparison-vs">VS</div>

        <HeapColumn
          label="MinHeap"
          labelColor="#3b82f6"
          heap={displayHeap}
          indices={heapIndices}
          stepType={heapType}
          step={currentHeapStep}
          compares={heapCompares}
          moves={heapMoves}
          totalSteps={heapSteps.length}
        />
      </div>

      <AnimatePresence>
        {resultMessage && (
          <motion.div
            className="comparison-result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {resultMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
