import { motion, AnimatePresence } from 'framer-motion'
import { getHighlightColor } from '../lib/colorUtils'
import type { HeapStep } from '../lib/types'
import { MAX_HEAP_SIZE } from '../lib/types'

interface ArrayViewProps {
  heap: (number | null)[]
  highlightIndices: number[]
  highlightType: HeapStep['type'] | null
}

export function ArrayView({ heap, highlightIndices, highlightType }: ArrayViewProps) {
  const totalSlots = MAX_HEAP_SIZE + 1 // 0~24 (25 slots)

  return (
    <div className="array-container">
      <h3>배열 뷰 <span className="array-count">[{heap.length - 1}]</span></h3>

      <div className="array-grid">
        {Array.from({ length: totalSlots }, (_, index) => {
          if (index === 0) {
            return (
              <div key={index} className="array-slot">
                <div className="array-cell array-cell--null">
                  null
                </div>
                <span className="array-index">0</span>
              </div>
            )
          }

          const hasValue = index < heap.length && heap[index] !== null
          const color = hasValue
            ? getHighlightColor(index, highlightIndices, highlightType)
            : undefined

          return (
            <div key={index} className="array-slot">
              <AnimatePresence mode="wait">
                {hasValue ? (
                  <motion.div
                    key={`val-${index}`}
                    className="array-cell"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      backgroundColor: color,
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    {heap[index]}
                  </motion.div>
                ) : (
                  <div className="array-cell empty" />
                )}
              </AnimatePresence>
              <span className="array-index">{index}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
