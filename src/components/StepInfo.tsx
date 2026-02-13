import { motion, AnimatePresence } from 'framer-motion'
import type { HeapStep } from '../lib/types'

interface StepInfoProps {
  currentStep: HeapStep | null
  stepIndex: number
  totalSteps: number
}

const STEP_ICON: Record<HeapStep['type'], string> = {
  insert: '+',
  remove: '-',
  compare: '?',
  swap: '~',
  complete: 'v',
}

const STEP_LABEL: Record<HeapStep['type'], string> = {
  insert: 'INSERT',
  remove: 'REMOVE',
  compare: 'COMPARE',
  swap: 'SWAP',
  complete: 'COMPLETE',
}

const STEP_COLOR: Record<HeapStep['type'], string> = {
  insert: '#10b981',
  remove: '#ef4444',
  compare: '#f59e0b',
  swap: '#ef4444',
  complete: '#10b981',
}

export function StepInfo({ currentStep, stepIndex, totalSteps }: StepInfoProps) {
  return (
    <div className="step-info">
      <h3>현재 단계</h3>

      <AnimatePresence mode="wait">
        {currentStep ? (
          <motion.div
            key={stepIndex}
            className="step-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ borderLeftColor: STEP_COLOR[currentStep.type] }}
          >
            <div className="step-header">
              <span className="step-icon">{STEP_ICON[currentStep.type]}</span>
              <span className="step-type">{STEP_LABEL[currentStep.type]}</span>
              <span className="step-counter">{stepIndex + 1} / {totalSteps}</span>
            </div>
            <p className="step-description">{currentStep.description}</p>

            {currentStep.indices.length > 0 && (
              <div className="step-indices">
                {currentStep.indices.map((idx, i) => (
                  <span key={i} className="index-badge">[{idx}]</span>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="step-card empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>작업을 수행하면 단계별 설명이 표시됩니다</p>
          </motion.div>
        )}
      </AnimatePresence>

      {totalSteps > 0 && (
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}
    </div>
  )
}
