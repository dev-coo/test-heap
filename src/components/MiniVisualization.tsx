import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { HeapStep } from '../lib/types'
import { insertWithSteps, extractMinWithSteps } from '../lib/heapSteps'
import { getHighlightColor } from '../lib/colorUtils'

interface MiniVisualizationProps {
  mode: 'insert' | 'extractMin' | 'heapifyUp' | 'heapifyDown' | 'peek'
}

const DEMO_INITIAL = [7, 12, 11, 20, 14]
const DEMO_INSERT_VALUE = 5

function buildInitialHeap(): (number | null)[] {
  let heap: (number | null)[] = [null]
  for (const v of DEMO_INITIAL) {
    const { finalHeap } = insertWithSteps(heap, v)
    heap = finalHeap
  }
  return heap
}

export function MiniVisualization({ mode }: MiniVisualizationProps) {
  const [heap, setHeap] = useState<(number | null)[]>(() => buildInitialHeap())
  const [steps, setSteps] = useState<HeapStep[]>([])
  const [stepIndex, setStepIndex] = useState(-1)
  const [isPlaying, setIsPlaying] = useState(false)
  const cancelRef = useRef(false)

  const currentStep = stepIndex >= 0 ? steps[stepIndex] : null
  const displayHeap = currentStep?.heap ?? heap
  const displayIndices = currentStep?.indices ?? []
  const displayType = currentStep?.type ?? null

  const reset = useCallback(() => {
    cancelRef.current = true
    const fresh = buildInitialHeap()
    setHeap(fresh)
    setSteps([])
    setStepIndex(-1)
    setIsPlaying(false)
  }, [])

  const play = useCallback(async () => {
    cancelRef.current = true
    await new Promise(r => setTimeout(r, 50))

    const baseHeap = buildInitialHeap()
    let newSteps: HeapStep[] = []
    let finalHeap: (number | null)[] = baseHeap

    if (mode === 'insert' || mode === 'heapifyUp') {
      const result = insertWithSteps(baseHeap, DEMO_INSERT_VALUE)
      newSteps = result.steps
      finalHeap = result.finalHeap
    } else if (mode === 'extractMin' || mode === 'heapifyDown') {
      const result = extractMinWithSteps(baseHeap)
      newSteps = result.steps
      finalHeap = result.finalHeap
    } else if (mode === 'peek') {
      newSteps = [{
        type: 'compare',
        indices: [1],
        description: `최소값 = heap[1] = ${baseHeap[1]}`,
        heap: [...baseHeap],
      }, {
        type: 'complete',
        indices: [1],
        description: `peek() → ${baseHeap[1]} 반환 (제거하지 않음)`,
        heap: [...baseHeap],
      }]
      finalHeap = baseHeap
    }

    if (newSteps.length === 0) return

    cancelRef.current = false
    setIsPlaying(true)
    setHeap(baseHeap)
    setSteps(newSteps)

    for (let i = 0; i < newSteps.length; i++) {
      if (cancelRef.current) break
      setStepIndex(i)
      await new Promise(r => setTimeout(r, 600))
    }

    if (!cancelRef.current) {
      setHeap(finalHeap)
    }
    setIsPlaying(false)
  }, [mode])

  useEffect(() => {
    return () => { cancelRef.current = true }
  }, [])

  // Tree layout for mini view (1-based: skip index 0)
  const dataCount = displayHeap.length - 1
  const nodeRadius = 16
  const levelGap = 50
  const levels = dataCount > 0 ? Math.floor(Math.log2(dataCount)) + 1 : 0
  const treeWidth = Math.max(200, Math.pow(2, levels) * 36)
  const treeHeight = levels * levelGap + 40

  const positions: { x: number; y: number; index: number }[] = []
  for (let i = 1; i < displayHeap.length; i++) {
    const level = Math.floor(Math.log2(i))
    const posInLevel = i - Math.pow(2, level)
    const nodesInLevel = Math.pow(2, level)
    const spacing = treeWidth / nodesInLevel
    positions.push({
      x: spacing * posInLevel + spacing / 2,
      y: level * levelGap + 24,
      index: i,
    })
  }

  return (
    <div className="mini-viz">
      <div className="mini-viz-controls">
        <button
          className="mini-play-btn"
          onClick={isPlaying ? reset : play}
        >
          {isPlaying ? '⏹ 정지' : '▶ 실행'}
        </button>
        {!isPlaying && steps.length > 0 && (
          <button className="mini-reset-btn" onClick={reset}>
            ↺ 리셋
          </button>
        )}
      </div>

      {/* Mini Array: show data from index 1 */}
      <div className="mini-array">
        {dataCount > 0 ? (
          displayHeap.slice(1).map((val, offset) => {
            const i = offset + 1
            const color = getHighlightColor(i, displayIndices, displayType)
            return (
              <div key={i} className="mini-array-cell" style={{ backgroundColor: color }}>
                {val}
              </div>
            )
          })
        ) : (
          <span className="mini-empty">빈 힙</span>
        )}
      </div>

      {/* Mini Tree */}
      {dataCount > 0 && (
        <svg
          className="mini-tree-svg"
          viewBox={`0 0 ${treeWidth} ${treeHeight}`}
          width="100%"
          height={treeHeight}
        >
          {/* Edges */}
          {positions.map((pos) => {
            if (pos.index === 1) return null
            const parentIdx = Math.floor(pos.index / 2)
            const parentPos = positions.find(p => p.index === parentIdx)
            if (!parentPos) return null
            return (
              <line
                key={`edge-${pos.index}`}
                x1={parentPos.x}
                y1={parentPos.y}
                x2={pos.x}
                y2={pos.y}
                stroke="rgba(148,163,184,0.3)"
                strokeWidth={1.5}
              />
            )
          })}

          {/* Nodes */}
          {positions.map((pos) => {
            const val = displayHeap[pos.index]
            const color = getHighlightColor(pos.index, displayIndices, displayType)
            return (
              <g key={`node-${pos.index}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={color}
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {val}
                </text>
              </g>
            )
          })}
        </svg>
      )}

      {/* Step info */}
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={stepIndex}
            className="mini-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="mini-step-badge">{currentStep.type.toUpperCase()}</span>
            <span className="mini-step-desc">{currentStep.description}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
