import { useState } from 'react'
import { MAX_HEAP_SIZE, MIN_VALUE, MAX_VALUE } from '../lib/types'

interface ControlsProps {
  onInsert: (value: number) => void
  onExtractMin: () => void
  onClear: () => void
  onRandomFill: () => void
  isAnimating: boolean
  heapSize: number
  minValue: number | null
}

export function Controls({
  onInsert,
  onExtractMin,
  onClear,
  onRandomFill,
  isAnimating,
  heapSize,
  minValue,
}: ControlsProps) {
  const [inputValue, setInputValue] = useState('')

  const isFull = heapSize >= MAX_HEAP_SIZE

  const handleInsert = () => {
    const value = parseInt(inputValue, 10)
    if (isNaN(value)) return
    if (value < MIN_VALUE || value > MAX_VALUE) return
    if (isFull) return
    onInsert(value)
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInsert()
    }
  }

  return (
    <div className="controls">
      <h3>컨트롤</h3>

      <div className="input-group">
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isFull ? `최대 ${MAX_HEAP_SIZE}개` : '값 입력'}
          disabled={isAnimating || isFull}
          min={MIN_VALUE}
          max={MAX_VALUE}
        />
        <button
          onClick={handleInsert}
          disabled={isAnimating || !inputValue || isFull}
          className="btn-insert"
        >
          Push
        </button>
      </div>

      <button
        onClick={onExtractMin}
        disabled={isAnimating || heapSize === 0}
        className="btn-extract"
      >
        Pop (최소값 추출)
      </button>

      <div className="btn-row">
        <button
          onClick={onRandomFill}
          disabled={isAnimating || isFull}
          className="btn-random"
        >
          랜덤 추가
        </button>
        <button
          onClick={onClear}
          disabled={heapSize === 0}
          className="btn-clear"
        >
          Clear
        </button>
      </div>

      {isFull && (
        <p className="validation-msg">최대 {MAX_HEAP_SIZE}개까지 가능합니다</p>
      )}

      <div className="heap-info">
        <div className="info-item">
          <span className="label">크기:</span>
          <span className="value">{heapSize} / {MAX_HEAP_SIZE}</span>
        </div>
        <div className="info-item">
          <span className="label">최소값:</span>
          <span className="value">{minValue !== null ? minValue : '-'}</span>
        </div>
      </div>
    </div>
  )
}
