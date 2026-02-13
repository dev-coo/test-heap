# 기술 아키텍처 설계

## 1. 현재(힙 프로젝트)의 교훈

힙 프로젝트에서 검증된 아키텍처 패턴과, 멀티 알고리즘 사이트로 확장할 때의 한계를 정리한다.

### 검증된 패턴 (유지)
```
User Action → State Handler → Algorithm Logic → Step[] 반환 → 애니메이션 루프 → View 렌더링
```

이 단방향 데이터 흐름은 모든 알고리즘에 적용 가능하다.

### 확장 필요 사항

| 현재 | 한계 | 해결 방향 |
|------|------|----------|
| 단일 페이지 | 30+ 알고리즘을 한 페이지에 담을 수 없음 | React Router로 멀티 페이지 |
| HeapStep 타입 | 힙 전용, 다른 알고리즘에 부족 | 범용 AlgorithmStep 타입 설계 |
| 모든 상태가 App.tsx | 알고리즘마다 상태 구조가 다름 | 커스텀 훅으로 분리 |
| 컴포넌트 결합 | ArrayView가 힙 전용 | 범용 시각화 컴포넌트 레이어 |
| 단일 CSS 파일 | 스타일 충돌 위험 | CSS Modules 또는 BEM 엄격 적용 |

---

## 2. 디렉토리 구조

```
src/
├── main.tsx                          # 앱 진입점
├── App.tsx                           # 라우터 + 레이아웃
├── App.css                           # 전역 스타일, CSS 변수
│
├── types/
│   └── algorithm.ts                  # AlgorithmStep, 공용 타입
│
├── hooks/
│   ├── useAnimation.ts               # 애니메이션 루프 (공용)
│   └── useAlgorithmState.ts          # 스텝 관리 상태 (공용)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx                # 사이트 헤더 + 네비게이션
│   │   ├── Sidebar.tsx               # 카테고리별 알고리즘 목록
│   │   ├── AlgorithmLayout.tsx       # 알고리즘 페이지 공통 레이아웃
│   │   └── Footer.tsx
│   │
│   ├── shared/
│   │   ├── ArrayView.tsx             # 범용 배열 시각화
│   │   ├── BarChartView.tsx          # 막대 그래프 (정렬용)
│   │   ├── TreeView.tsx              # 범용 트리 시각화
│   │   ├── GraphView.tsx             # 그래프 시각화 (노드 + 간선)
│   │   ├── StackView.tsx             # 스택 시각화
│   │   ├── QueueView.tsx             # 큐 시각화
│   │   ├── TableView.tsx             # DP 테이블, 해시 테이블
│   │   ├── LinkedListView.tsx        # 연결 리스트 시각화
│   │   ├── StepInfo.tsx              # 현재 단계 설명
│   │   ├── PseudocodeView.tsx        # 의사코드 + 실행 줄 하이라이트
│   │   ├── ComplexityBadge.tsx       # O(n), O(log n) 등 표시
│   │   ├── Controls.tsx              # 입력, 실행, 속도, 리셋
│   │   └── ComparisonLayout.tsx      # 두 알고리즘 나란히 비교
│   │
│   └── algorithm-specific/           # 알고리즘 전용 컴포넌트 (필요 시)
│       ├── sorting/
│       │   └── PartitionView.tsx     # Quick Sort 파티션 뷰
│       └── graph/
│           └── AdjacencyView.tsx     # 인접 리스트/행렬 뷰
│
├── algorithms/
│   ├── sorting/
│   │   ├── bubbleSort.ts
│   │   ├── selectionSort.ts
│   │   ├── insertionSort.ts
│   │   ├── mergeSort.ts
│   │   └── quickSort.ts
│   │
│   ├── data-structures/
│   │   ├── stack.ts
│   │   ├── queue.ts
│   │   ├── heap.ts                   # 기존 MinHeap 로직 이전
│   │   ├── bst.ts
│   │   └── hashTable.ts
│   │
│   ├── search/
│   │   ├── linearSearch.ts
│   │   └── binarySearch.ts
│   │
│   ├── graph/
│   │   ├── bfs.ts
│   │   ├── dfs.ts
│   │   └── dijkstra.ts
│   │
│   └── tree/
│       └── traversals.ts
│
├── pages/
│   ├── HomePage.tsx                  # 카테고리 개요 + 인기 알고리즘
│   ├── sorting/
│   │   ├── BubbleSortPage.tsx
│   │   ├── SelectionSortPage.tsx
│   │   └── ...
│   ├── data-structures/
│   │   ├── StackPage.tsx
│   │   ├── HeapPage.tsx              # 기존 힙 페이지 이전
│   │   └── ...
│   ├── search/
│   │   ├── LinearSearchPage.tsx
│   │   └── BinarySearchPage.tsx
│   └── graph/
│       ├── BfsPage.tsx
│       └── ...
│
└── utils/
    ├── colors.ts                     # 하이라이트 색상 유틸
    ├── presets.ts                     # 데이터 프리셋 (랜덤, 최선, 최악)
    └── graphUtils.ts                 # 그래프 레이아웃 계산
```

---

## 3. 핵심 타입 설계

### 3.1 AlgorithmStep (범용 스텝)

```typescript
// src/types/algorithm.ts

/** 스텝 내 개별 하이라이트 */
interface Highlight {
  /** 배열 인덱스, 노드 ID, 간선 ID 등 */
  target: number | string
  /** 하이라이트 스타일 */
  style: 'compare' | 'swap' | 'active' | 'complete' | 'visited' | 'path' | 'pivot'
}

/** 모든 알고리즘의 애니메이션 스텝 */
interface AlgorithmStep<TState = unknown> {
  /** 스텝 유형 (알고리즘마다 확장 가능) */
  type: string
  /** 하이라이트 대상 목록 */
  highlights: Highlight[]
  /** 한국어 설명 */
  description: string
  /** 알고리즘별 상태 스냅샷 (배열, 트리, 그래프 등) */
  state: TState
  /** 의사코드에서 현재 실행 중인 줄 번호 (0-based) */
  pseudocodeLine?: number
}
```

### 3.2 알고리즘별 상태 타입 예시

```typescript
/** 정렬 알고리즘 상태 */
interface SortingState {
  array: number[]
  /** 정렬 완료된 인덱스 범위 */
  sortedRange?: { start: number; end: number }
}

/** 그래프 알고리즘 상태 */
interface GraphState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  /** 노드별 방문 상태 */
  visited: Map<string, 'unvisited' | 'visiting' | 'visited'>
  /** 보조 자료구조 (큐, 스택, 거리 테이블 등) */
  auxiliary?: unknown
}

/** 트리 알고리즘 상태 */
interface TreeState {
  /** 1-based 배열 표현 또는 노드 기반 표현 */
  nodes: TreeNode[]
  /** 결과 배열 (순회용) */
  result?: number[]
}
```

### 3.3 알고리즘 메타데이터

```typescript
/** 알고리즘 페이지 구성에 필요한 메타 정보 */
interface AlgorithmMeta {
  id: string                          // 'bubble-sort'
  name: string                        // 'Bubble Sort'
  koreanName: string                  // '버블 정렬'
  category: 'sorting' | 'data-structures' | 'search' | 'graph' | 'tree' | 'dp'
  timeComplexity: {
    best: string                      // 'O(n)'
    average: string                   // 'O(n²)'
    worst: string                     // 'O(n²)'
  }
  spaceComplexity: string             // 'O(1)'
  stable?: boolean                    // true (정렬 전용)
  description: string                 // 한 줄 설명
  pseudocode: string[]                // 의사코드 줄 배열
  keyPoints: string[]                 // 핵심 포인트
  compareWith?: string[]              // 비교 가능한 알고리즘 ID들
}
```

---

## 4. 공용 애니메이션 훅

```typescript
// src/hooks/useAnimation.ts

interface UseAnimationOptions {
  defaultSpeed?: number               // 기본 800ms
  onStepChange?: (step: AlgorithmStep, index: number) => void
}

interface UseAnimationReturn<TState> {
  // 상태
  isAnimating: boolean
  currentStep: AlgorithmStep<TState> | null
  stepIndex: number
  totalSteps: number

  // 액션
  play: (steps: AlgorithmStep<TState>[], finalState: TState) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  stepForward: () => void
  stepBackward: () => void

  // 설정
  speed: number
  setSpeed: (ms: number) => void
}
```

이 훅은 모든 알고리즘 페이지에서 재사용된다. 기존 힙의 `runAnimation` 로직을 일반화한 것이다.

주요 개선점:
- **일시정지/재개**: 현재 힙은 멈추면 처음부터 다시 시작해야 함
- **스텝 앞/뒤**: 한 스텝씩 수동 진행 가능
- **콜백**: 스텝 변경 시 외부 상태 동기화

---

## 5. 라우팅 구조

```typescript
// src/App.tsx

<Routes>
  <Route path="/" element={<HomePage />} />

  <Route path="/sorting">
    <Route path="bubble-sort" element={<BubbleSortPage />} />
    <Route path="selection-sort" element={<SelectionSortPage />} />
    <Route path="insertion-sort" element={<InsertionSortPage />} />
    <Route path="merge-sort" element={<MergeSortPage />} />
    <Route path="quick-sort" element={<QuickSortPage />} />
  </Route>

  <Route path="/data-structures">
    <Route path="stack" element={<StackPage />} />
    <Route path="queue" element={<QueuePage />} />
    <Route path="heap" element={<HeapPage />} />
    <Route path="bst" element={<BstPage />} />
  </Route>

  <Route path="/search">
    <Route path="linear" element={<LinearSearchPage />} />
    <Route path="binary" element={<BinarySearchPage />} />
  </Route>

  <Route path="/graph">
    <Route path="bfs" element={<BfsPage />} />
    <Route path="dfs" element={<DfsPage />} />
    <Route path="dijkstra" element={<DijkstraPage />} />
  </Route>
</Routes>
```

---

## 6. 알고리즘 페이지 공통 레이아웃

모든 알고리즘 페이지는 동일한 골격을 공유한다:

```
┌────────────────────────────────────────────────┐
│  Header (사이트명 + 네비게이션)                    │
├──────────┬─────────────────────────────────────┤
│          │  알고리즘명 + 한줄 설명 + 복잡도 뱃지    │
│          ├─────────────────────────────────────┤
│ Sidebar  │  ┌─────────────┐ ┌───────────────┐ │
│ (알고리즘 │  │  메인 뷰     │ │ 보조 뷰       │ │
│  목록)    │  │ (배열/트리/  │ │ (의사코드/    │ │
│          │  │  그래프)     │ │  스택/큐)     │ │
│          │  └─────────────┘ └───────────────┘ │
│          ├─────────────────────────────────────┤
│          │  컨트롤 바 (입력 + 실행 + 속도)        │
│          ├─────────────────────────────────────┤
│          │  단계 설명 + 진행 바                   │
│          ├─────────────────────────────────────┤
│          │  비교 뷰 (선택적)                      │
│          ├─────────────────────────────────────┤
│          │  함수 설명 카드들                      │
└──────────┴─────────────────────────────────────┘
```

```typescript
// src/components/layout/AlgorithmLayout.tsx

interface AlgorithmLayoutProps {
  meta: AlgorithmMeta
  mainView: React.ReactNode           // 알고리즘별 메인 시각화
  auxiliaryView?: React.ReactNode     // 보조 뷰 (의사코드, 스택 등)
  controls: React.ReactNode           // 입력 + 버튼
  stepInfo: React.ReactNode           // 현재 스텝 설명
  comparisonView?: React.ReactNode   // 비교 뷰 (선택)
  explainer?: React.ReactNode        // 함수 설명 (선택)
}
```

---

## 7. 공유 시각화 컴포넌트 설계

### 7.1 BarChartView (정렬용 막대 그래프)
```typescript
interface BarChartViewProps {
  array: number[]
  highlights: Highlight[]
  /** 정렬 완료 영역 (회색 처리) */
  sortedRange?: { start: number; end: number }
  /** 피벗 인덱스 (Quick Sort) */
  pivotIndex?: number
  /** 바 위에 값 표시 여부 */
  showValues?: boolean
}
```

### 7.2 GraphView (그래프 알고리즘용)
```typescript
interface GraphViewProps {
  nodes: { id: string; label: string; x: number; y: number }[]
  edges: { from: string; to: string; weight?: number; directed?: boolean }[]
  highlights: Highlight[]
  /** 노드 드래그 가능 여부 */
  draggable?: boolean
  /** 간선 가중치 표시 여부 */
  showWeights?: boolean
}
```

### 7.3 PseudocodeView (의사코드 뷰)
```typescript
interface PseudocodeViewProps {
  lines: string[]
  /** 현재 실행 중인 줄 번호 (0-based) */
  activeLine?: number
  /** 언어 (하이라이팅용) */
  language?: 'pseudo' | 'python' | 'javascript'
}
```

---

## 8. 성능 고려사항

### 코드 스플리팅
각 알고리즘 페이지를 `React.lazy()`로 동적 임포트한다. 사용자가 방문하지 않는 알고리즘의 코드는 로드하지 않는다.

```typescript
const BubbleSortPage = lazy(() => import('./pages/sorting/BubbleSortPage'))
```

### SVG 최적화
- 노드 수 > 50인 그래프: 가상화 또는 줌/패닝 적용
- `React.memo()`로 변경되지 않은 노드/간선 리렌더 방지
- `will-change: transform`으로 GPU 가속

### 애니메이션 최적화
- `requestAnimationFrame` 기반 타이밍 (setTimeout 대체 고려)
- 스텝 배열을 미리 전부 생성한 후 재생 (현재 패턴 유지)
- 대량 스텝 (>100) 시 자동 속도 조절 또는 스킵 옵션
