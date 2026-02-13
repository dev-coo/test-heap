export type { HeapStep } from './types'

export class MinHeap {
  private heap: (number | null)[] = [null]

  private parent(i: number): number {
    return Math.floor(i / 2)
  }

  private leftChild(i: number): number {
    return 2 * i
  }

  private rightChild(i: number): number {
    return 2 * i + 1
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]
  }

  insert(value: number): void {
    this.heap.push(value)
    this.heapifyUp(this.heap.length - 1)
  }

  extractMin(): number | null {
    if (this.heap.length <= 1) return null
    const min = this.heap[1] as number
    if (this.heap.length === 2) {
      this.heap.pop()
      return min
    }
    this.heap[1] = this.heap.pop()!
    this.heapifyDown(1)
    return min
  }

  private heapifyUp(index: number): void {
    while (index > 1) {
      const parentIdx = this.parent(index)
      if ((this.heap[index] as number) < (this.heap[parentIdx] as number)) {
        this.swap(index, parentIdx)
        index = parentIdx
      } else {
        break
      }
    }
  }

  private heapifyDown(index: number): void {
    const length = this.heap.length
    while (true) {
      const left = this.leftChild(index)
      const right = this.rightChild(index)
      let smallest = index

      if (left < length && (this.heap[left] as number) < (this.heap[smallest] as number)) {
        smallest = left
      }
      if (right < length && (this.heap[right] as number) < (this.heap[smallest] as number)) {
        smallest = right
      }
      if (smallest !== index) {
        this.swap(index, smallest)
        index = smallest
      } else {
        break
      }
    }
  }

  peek(): number | null {
    return this.heap.length > 1 ? (this.heap[1] as number) : null
  }

  size(): number {
    return this.heap.length - 1
  }

  clear(): void {
    this.heap = [null]
  }

  getArray(): number[] {
    return this.heap.slice(1) as number[]
  }
}
