# Min Heap 알고리즘

## 개념

**Min Heap**은 완전 이진 트리(Complete Binary Tree) 기반의 자료구조로, 부모 노드가 항상 자식 노드보다 작거나 같은 값을 가집니다.

## 배열 기반 구현

힙은 배열로 효율적으로 구현할 수 있습니다.

```
        0
       / \
      1   2
     / \ / \
    3  4 5  6
```

### 인덱스 관계

| 관계 | 수식 |
|------|------|
| 부모 | `(i - 1) / 2` |
| 왼쪽 자식 | `2 * i + 1` |
| 오른쪽 자식 | `2 * i + 2` |

### 예시

```
배열: [7, 12, 11, 14, 20, 13, 31, 45]
인덱스: 0   1   2   3   4   5   6   7

트리:
          7(0)
        /     \
     12(1)    11(2)
     /  \     /  \
  14(3) 20(4) 13(5) 31(6)
   /
 45(7)
```

## 핵심 연산

### 1. Insert (삽입)

새로운 값을 힙에 삽입합니다.

**과정:**
1. 배열 끝에 새 값 추가
2. heapifyUp으로 올바른 위치로 이동

**시간 복잡도:** O(log n)

```typescript
insert(value: number): void {
  // 1. 배열 끝에 추가
  this.heap.push(value)
  
  // 2. 위로 올리며 정렬
  this.heapifyUp(this.heap.length - 1)
}
```

**예시: 5 삽입**

```
삽입 전:        삽입 후(배열 끝):    heapifyUp 후:
    7               7                   5
   / \             / \                 / \
  12  11         12  11              7   11
                /                   / \
              5                   12  20

1. 5를 배열 끝(인덱스 3)에 추가
2. 부모(12)와 비교: 5 < 12 → 교환
3. 부모(7)와 비교: 5 < 7 → 교환
4. 루트 도달 → 완료
```

### 2. ExtractMin (최소값 추출)

최소값(루트)을 제거하고 반환합니다.

**과정:**
1. 루트(최소값) 저장
2. 마지막 요소를 루트로 이동
3. heapifyDown으로 올바른 위치로 이동

**시간 복잡도:** O(log n)

```typescript
extractMin(): number | null {
  if (this.heap.length === 0) return null
  
  // 1. 최소값 저장
  const min = this.heap[0]
  
  // 2. 마지막 요소를 루트로
  this.heap[0] = this.heap.pop()!
  
  // 3. 아래로 내리며 정렬
  this.heapifyDown(0)
  
  return min
}
```

**예시: 최소값 추출**

```
추출 전:        마지막→루트:       heapifyDown 후:
    5              20                  7
   / \            / \                 / \
  7  11          7  11              12  11
 / \            /                   /
12 20          12                 20

1. 루트(5) 저장
2. 마지막 요소(20)를 루트로 이동
3. 자식(7, 11) 중 작은 값(7)과 비교: 20 > 7 → 교환
4. 자식(12) 비교: 20 > 12 → 교환
5. 리프 도달 → 완료
```

### 3. HeapifyUp (위로 정렬)

삽입된 노드를 부모와 비교하며 위로 이동시킵니다.

```typescript
heapifyUp(index: number): void {
  while (index > 0) {
    const parentIdx = Math.floor((index - 1) / 2)
    
    // 부모가 더 크면 교환
    if (this.heap[index] < this.heap[parentIdx]) {
      this.swap(index, parentIdx)
      index = parentIdx
    } else {
      break  // 부모가 더 작으면 종료
    }
  }
}
```

### 4. HeapifyDown (아래로 정렬)

루트 노드를 자식과 비교하며 아래로 이동시킵니다.

```typescript
heapifyDown(index: number): void {
  while (true) {
    const left = 2 * index + 1
    const right = 2 * index + 2
    let smallest = index

    // 왼쪽 자식과 비교
    if (left < this.heap.length && 
        this.heap[left] < this.heap[smallest]) {
      smallest = left
    }

    // 오른쪽 자식과 비교
    if (right < this.heap.length && 
        this.heap[right] < this.heap[smallest]) {
      smallest = right
    }

    // 교환이 필요하면 교환 후 계속
    if (smallest !== index) {
      this.swap(index, smallest)
      index = smallest
    } else {
      break  // 자식보다 작으면 종료
    }
  }
}
```

### 5. Peek (최소값 확인)

최소값을 제거하지 않고 확인합니다.

**시간 복잡도:** O(1)

```typescript
peek(): number | null {
  return this.heap.length > 0 ? this.heap[0] : null
}
```

## 시간 복잡도 요약

| 연산 | 평균 | 최악 |
|------|------|------|
| Insert | O(log n) | O(log n) |
| ExtractMin | O(log n) | O(log n) |
| Peek | O(1) | O(1) |
| BuildHeap | O(n) | O(n) |

## 공간 복잡도

- **배열 저장:** O(n)
- **추가 공간:** O(1) (in-place 연산)

## 활용 사례

| 분야 | 활용 |
|------|------|
| 우선순위 큐 | 작업 스케줄링, 이벤트 처리 |
| 그래프 알고리즘 | Dijkstra, Prim 알고리즘 |
| 정렬 | Heap Sort |
| 스트리밍 데이터 | Top-K 문제, 중앙값 찾기 |

## Max Heap과의 차이

| 특성 | Min Heap | Max Heap |
|------|----------|----------|
| 루트 | 최소값 | 최대값 |
| 부모-자식 관계 | 부모 ≤ 자식 | 부모 ≥ 자식 |
| 비교 연산 | `<` | `>` |
