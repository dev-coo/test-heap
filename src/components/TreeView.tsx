import { motion } from 'framer-motion'
import { getHighlightColor } from '../lib/colorUtils'
import type { HeapStep } from '../lib/types'

interface TreeViewProps {
  heap: (number | null)[]
  highlightIndices: number[]
  highlightType: HeapStep['type'] | null
}

interface NodePosition {
  x: number
  y: number
  value: number
  index: number
}

export function TreeView({ heap, highlightIndices, highlightType }: TreeViewProps) {
  const dataCount = heap.length - 1 // exclude index 0 (null sentinel)

  if (dataCount <= 0) {
    return (
      <div className="tree-container empty">
        <p>힙이 비어있습니다</p>
      </div>
    )
  }

  const levels = Math.floor(Math.log2(dataCount)) + 1
  const nodeRadius = levels <= 3 ? 24 : levels <= 4 ? 20 : 16
  const width = Math.max(600, Math.pow(2, levels) * (nodeRadius * 2.5))
  const levelHeight = 80
  const height = levels * levelHeight + 40

  const positions: NodePosition[] = []
  for (let i = 1; i < heap.length; i++) {
    const level = Math.floor(Math.log2(i))
    const posInLevel = i - Math.pow(2, level)
    const levelWidth = width / Math.pow(2, level)
    const x = levelWidth * (posInLevel + 0.5)
    const y = level * levelHeight + levelHeight / 2 + 10

    positions.push({ x, y, value: heap[i] as number, index: i })
  }

  const edges: { from: NodePosition; to: NodePosition }[] = []
  for (const node of positions) {
    const leftIdx = 2 * node.index
    const rightIdx = 2 * node.index + 1
    const leftNode = positions.find(p => p.index === leftIdx)
    const rightNode = positions.find(p => p.index === rightIdx)
    if (leftNode) edges.push({ from: node, to: leftNode })
    if (rightNode) edges.push({ from: node, to: rightNode })
  }

  return (
    <div className="tree-container">
      <h3>트리 뷰</h3>
      <div className="tree-scroll">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {edges.map((edge, i) => (
            <motion.path
              key={`edge-${i}`}
              d={`M ${edge.from.x} ${edge.from.y} L ${edge.to.x} ${edge.to.y}`}
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}

          {positions.map((node) => {
            const color = getHighlightColor(node.index, highlightIndices, highlightType)
            return (
              <g key={node.index}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={nodeRadius}
                  fill={color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, fill: color }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={nodeRadius <= 16 ? 11 : 14}
                  fontWeight="bold"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.value}
                </text>
                <text
                  x={node.x}
                  y={node.y + nodeRadius + 12}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                >
                  [{node.index}]
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
