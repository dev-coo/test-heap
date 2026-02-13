import { motion } from 'framer-motion'
import { MiniVisualization } from './MiniVisualization'

export interface FunctionInfo {
  name: string
  koreanName: string
  description: string
  timeComplexity: string
  pseudocode: string[]
  keyPoints: string[]
}

export type FunctionName = 'insert' | 'extractMin' | 'heapifyUp' | 'heapifyDown' | 'peek'

interface FunctionPopupProps {
  func: FunctionInfo
  funcKey: FunctionName
  onClose: () => void
}

export function FunctionPopup({ func, funcKey, onClose }: FunctionPopupProps) {
  return (
    <motion.div
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="popup-content"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="popup-close" onClick={onClose}>✕</button>

        <div className="popup-header">
          <code className="func-name">{func.name}</code>
          <span className="time-complexity">{func.timeComplexity}</span>
        </div>

        <p className="func-description">{func.description}</p>

        <div className="popup-body">
          <div className="popup-left">
            <div className="pseudocode">
              <h4>의사코드</h4>
              <pre>
                {func.pseudocode.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </pre>
            </div>

            <div className="key-points">
              <h4>핵심 포인트</h4>
              <ul>
                {func.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="popup-right">
            <h4>미니 데모</h4>
            <MiniVisualization mode={funcKey} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
