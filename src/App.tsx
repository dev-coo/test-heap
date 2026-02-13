import { useState, useCallback, useRef, useEffect } from 'react'
import type { HeapStep } from './lib/types'
import { MAX_HEAP_SIZE } from './lib/types'
import { insertWithSteps, extractMinWithSteps } from './lib/heapSteps'
import { TreeView } from './components/TreeView'
import { ArrayView } from './components/ArrayView'
import { Controls } from './components/Controls'
import { StepInfo } from './components/StepInfo'
import { FunctionExplainer } from './components/FunctionExplainer'
import { ComparisonView } from './components/ComparisonView'
import './App.css'

function App() {
  const [heapArray, setHeapArray] = useState<(number | null)[]>(() => {
    const initialValues = [45, 20, 14, 12, 31, 7, 11, 13, 7]
    let heap: (number | null)[] = [null]
    for (const v of initialValues) {
      const { finalHeap } = insertWithSteps(heap, v)
      heap = finalHeap
    }
    return heap
  })
  const [steps, setSteps] = useState<HeapStep[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(800)

  const heapSize = heapArray.length - 1
  const minValue = heapArray.length > 1 ? (heapArray[1] as number) : null

  const animationSpeedRef = useRef(animationSpeed)
  const cancelRef = useRef(false)

  useEffect(() => {
    animationSpeedRef.current = animationSpeed
  }, [animationSpeed])

  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null

  const runAnimation = useCallback(
    async (newSteps: HeapStep[], finalHeap: (number | null)[]) => {
      if (newSteps.length === 0) return

      cancelRef.current = false
      setIsAnimating(true)
      setSteps(newSteps)

      for (let i = 0; i < newSteps.length; i++) {
        if (cancelRef.current) break
        setCurrentStepIndex(i)
        setHeapArray(newSteps[i].heap)
        await new Promise(resolve =>
          setTimeout(resolve, animationSpeedRef.current)
        )
      }

      if (!cancelRef.current) {
        setHeapArray(finalHeap)
      }
      setIsAnimating(false)
    },
    []
  )

  const handleInsert = useCallback(
    (value: number) => {
      if (heapArray.length - 1 >= MAX_HEAP_SIZE) return
      const { finalHeap, steps: newSteps } = insertWithSteps(heapArray, value)
      runAnimation(newSteps, finalHeap)
    },
    [heapArray, runAnimation]
  )

  const handleExtractMin = useCallback(() => {
    if (heapArray.length <= 1) return
    const { steps: newSteps, finalHeap } = extractMinWithSteps(heapArray)
    if (newSteps.length > 0) {
      runAnimation(newSteps, finalHeap)
    }
  }, [heapArray, runAnimation])

  const handleClear = useCallback(() => {
    cancelRef.current = true
    setHeapArray([null])
    setSteps([])
    setCurrentStepIndex(-1)
    setIsAnimating(false)
  }, [])

  const handleRandomFill = useCallback(() => {
    const count = Math.min(5, MAX_HEAP_SIZE - (heapArray.length - 1))
    if (count <= 0) return

    const values = Array.from({ length: count }, () =>
      Math.floor(Math.random() * 100)
    )

    let currentHeap: (number | null)[] = [...heapArray]
    const allSteps: HeapStep[] = []

    for (const value of values) {
      const { finalHeap, steps: newSteps } = insertWithSteps(currentHeap, value)
      allSteps.push(...newSteps)
      currentHeap = finalHeap
    }

    runAnimation(allSteps, currentHeap)
  }, [heapArray, runAnimation])

  const displayHeap = currentStep?.heap ?? heapArray
  const displayIndices = currentStep?.indices ?? []
  const displayType = currentStep?.type ?? null

  return (
    <div className="app">
      <header className="app-header">
        <h1>MinHeap 시각화</h1>
        <p>배열 기반 Min Heap의 동작 원리를 단계별로 확인해보세요</p>
      </header>

      <main className="app-main">
        <section className="array-section">
          <ArrayView
            heap={displayHeap}
            highlightIndices={displayIndices}
            highlightType={displayType}
          />
        </section>

        <section className="tree-section">
          <TreeView
            heap={displayHeap}
            highlightIndices={displayIndices}
            highlightType={displayType}
          />
        </section>

        <section className="control-section">
          <Controls
            onInsert={handleInsert}
            onExtractMin={handleExtractMin}
            onClear={handleClear}
            onRandomFill={handleRandomFill}
            isAnimating={isAnimating}
            heapSize={heapSize}
            minValue={minValue}
          />

          <StepInfo
            currentStep={currentStep}
            stepIndex={currentStepIndex}
            totalSteps={steps.length}
          />

          <div className="speed-control">
            <label>속도</label>
            <input
              type="range"
              min="200"
              max="1500"
              step="100"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
            />
            <span>{animationSpeed}ms</span>
          </div>
        </section>

        <section className="comparison-section">
          <ComparisonView />
        </section>

        <section className="explainer-section">
          <FunctionExplainer />
        </section>
      </main>
    </div>
  )
}

export default App
