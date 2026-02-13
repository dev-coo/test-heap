# 단계별 개발 로드맵

## 전체 타임라인 개요

```
Phase 0: 기반 구축 (프로젝트 셋업 + 공용 인프라)
    │
Phase 1: 기초 알고리즘 (정렬 3개 + 탐색 2개 + 자료구조 2개)
    │
Phase 2: 중급 알고리즘 (분할정복 정렬 + 트리 + 그래프 기초)
    │
Phase 3: 심화 알고리즘 (고급 정렬 + 해시 + 최단경로 + DP 입문)
    │
Phase 4: 전문 알고리즘 (AVL + MST + DP 심화)
```

---

## Phase 0: 기반 구축

> 목표: 멀티 알고리즘 사이트의 공용 인프라를 구축한다. 이 단계에서 기존 힙 프로젝트를 새 구조로 마이그레이션한다.

### 작업 목록

| # | 작업 | 상세 | 산출물 |
|---|------|------|--------|
| 0-1 | 프로젝트 초기화 | 새 Vite + React + TS 프로젝트 생성, ESLint/Prettier 설정 | 빌드 가능한 빈 프로젝트 |
| 0-2 | React Router 설정 | 라우팅 구조, 코드 스플리팅 (lazy import) | 빈 페이지 간 이동 가능 |
| 0-3 | 레이아웃 컴포넌트 | Header, Sidebar, AlgorithmLayout, Footer | 사이트 골격 완성 |
| 0-4 | 공용 타입 정의 | `AlgorithmStep`, `AlgorithmMeta`, `Highlight` 등 | `src/types/algorithm.ts` |
| 0-5 | useAnimation 훅 | 재생/정지/스텝/속도 로직 일반화 | `src/hooks/useAnimation.ts` |
| 0-6 | 공용 컴포넌트 (1차) | ArrayView, StepInfo, PseudocodeView, Controls, ComplexityBadge | `src/components/shared/` |
| 0-7 | 색상/테마 시스템 | CSS 변수 정의, 다크 테마 | 전역 스타일 |
| 0-8 | 홈페이지 | 카테고리별 알고리즘 목록, 카드 레이아웃 | `HomePage.tsx` |
| 0-9 | 힙 마이그레이션 | 기존 힙 페이지를 새 구조로 이전 | `HeapPage.tsx` 동작 확인 |

### 완료 기준
- `pnpm build` 통과
- `/`, `/data-structures/heap` 라우팅 동작
- 힙 페이지가 기존과 동일하게 동작
- useAnimation 훅이 힙에서 정상 동작

---

## Phase 1: 기초 알고리즘

> 목표: 가장 단순한 알고리즘 7개를 구현한다. 배열 기반 시각화의 패턴을 완성한다.

### 알고리즘 목록

| # | 알고리즘 | 뷰 타입 | 새로 필요한 컴포넌트 |
|---|---------|---------|-------------------|
| 1 | Bubble Sort | BarChart + Array | BarChartView |
| 2 | Selection Sort | BarChart + Array | (공유) |
| 3 | Insertion Sort | BarChart + Array | (공유) |
| 4 | Linear Search | Array | (공유) |
| 5 | Binary Search | Array + 범위 표시 | SearchRangeOverlay |
| 6 | Stack | StackView | StackView |
| 7 | Queue | QueueView | QueueView |

### 작업 순서

```
1. BarChartView 컴포넌트 구현
   └── 막대 높이 = 값, 색상 = 상태, Framer Motion 애니메이션

2. Bubble Sort 구현 (정렬의 기준점)
   ├── algorithms/sorting/bubbleSort.ts (스텝 생성 로직)
   ├── pages/sorting/BubbleSortPage.tsx (페이지 조립)
   └── 프리셋: 랜덤, 정렬됨, 역순

3. Selection Sort, Insertion Sort
   └── Bubble Sort와 같은 뷰/컨트롤, 알고리즘 로직만 다름

4. 정렬 비교 뷰
   └── ComparisonLayout으로 Bubble vs Selection vs Insertion 나란히

5. Linear Search, Binary Search
   ├── ArrayView 재사용
   ├── Binary Search: 탐색 범위 축소 오버레이
   └── 비교: 같은 데이터에서 탐색 횟수 차이

6. Stack, Queue
   ├── StackView: 세로 쌓기 뷰
   ├── QueueView: 가로 줄서기 뷰
   └── 각 연산별 스텝 (push/pop/enqueue/dequeue)
```

### 완료 기준
- 7개 알고리즘 페이지 모두 동작
- 각 페이지에서 사용자 데이터 입력 + 프리셋 사용 가능
- 정렬 3개 알고리즘 비교 뷰 동작
- Linear vs Binary Search 비교 뷰 동작

---

## Phase 2: 중급 알고리즘

> 목표: 재귀/분할정복, 트리, 그래프 시각화를 도입한다. 가장 많은 새 컴포넌트가 필요한 단계.

### 알고리즘 목록

| # | 알고리즘 | 뷰 타입 | 새로 필요한 컴포넌트 |
|---|---------|---------|-------------------|
| 8 | Merge Sort | BarChart + 분할 트리 | MergeSplitView |
| 9 | Quick Sort | BarChart + 파티션 | PartitionOverlay |
| 10 | MaxHeap | Array + Tree | (MinHeap 변형) |
| 11 | BST | TreeView | BSTNodeView (삭제 케이스) |
| 12 | Linked List | LinkedListView | LinkedListView |
| 13 | BFS | GraphView + Queue | GraphView |
| 14 | DFS | GraphView + Stack | (공유) |
| 15-18 | Tree Traversals | TreeView + 결과 배열 | TraversalResultView |

### 핵심 신규 컴포넌트

**GraphView**
- SVG 기반 노드 + 간선 렌더링
- 노드 위치: 포스 레이아웃 또는 수동 프리셋
- 노드 색상으로 방문 상태 표시
- 간선 하이라이트
- 이 컴포넌트는 Phase 3~4에서도 계속 사용됨

**LinkedListView**
- 노드(박스) + 화살표 체인
- 삽입/삭제 시 포인터 변경 애니메이션

**MergeSplitView**
- 배열이 분할되는 과정을 트리 형태로 시각화
- 병합 단계에서 두 부분 배열이 하나로 합쳐지는 애니메이션

### 작업 순서

```
1. GraphView 컴포넌트 (가장 복잡, 먼저 착수)
   ├── 노드/간선 렌더링
   ├── 상태별 색상
   └── 프리셋 그래프 데이터

2. BFS, DFS 구현
   ├── 그래프 + 큐/스택 보조 뷰
   └── BFS vs DFS 비교 (같은 그래프에서)

3. TreeView 확장 (BST용)
   ├── 동적 노드 추가/삭제 애니메이션
   └── BST 삽입/삭제/탐색 구현

4. Merge Sort, Quick Sort
   ├── 분할 과정 시각화
   └── O(n²) 정렬과의 비교

5. LinkedListView
   └── 노드 + 포인터 체인 애니메이션

6. Tree Traversals (4가지)
   └── 같은 트리에서 순회 순서 비교
```

### 완료 기준
- GraphView로 BFS/DFS 시각화 동작
- BST 3가지 연산 정상 동작
- Merge/Quick Sort 분할 과정 시각화
- 누적 18개 알고리즘

---

## Phase 3: 심화 알고리즘

> 목표: 고급 정렬, 해시 테이블, 최단 경로, DP 입문

### 알고리즘 목록

| # | 알고리즘 | 뷰 타입 | 새로 필요한 컴포넌트 |
|---|---------|---------|-------------------|
| 19 | Heap Sort | BarChart + 힙 트리 | (공유) |
| 20 | Counting Sort | 배열 + 카운트 배열 | CountArrayView |
| 21 | Hash Table | 버킷 배열 + 체이닝 | HashTableView |
| 22 | Deque | 양방향 큐 뷰 | (Queue 확장) |
| 23 | Dijkstra | 그래프 + 거리 테이블 | DistanceTableView |
| 24 | Bellman-Ford | 그래프 + 거리 테이블 | (공유) |
| 25 | Fibonacci DP | 재귀 트리 + 메모 테이블 | RecursionTreeView |

### 완료 기준
- Dijkstra/Bellman-Ford에서 거리 테이블 실시간 업데이트
- Hash Table 충돌 처리 시각화
- Fibonacci에서 재귀 vs 메모이제이션 비교
- 누적 25개 알고리즘

---

## Phase 4: 전문 알고리즘

> 목표: 복잡한 알고리즘과 DP 심화

### 알고리즘 목록

| # | 알고리즘 | 뷰 타입 |
|---|---------|---------|
| 26 | Radix Sort | 배열 + 버킷 |
| 27 | AVL Tree | 트리 + 회전 애니메이션 |
| 28 | Kruskal (MST) | 그래프 + Union-Find |
| 29 | Prim (MST) | 그래프 + 우선순위 큐 |
| 30 | Topological Sort | DAG |
| 31 | Knapsack DP | DP 테이블 |
| 32 | LCS DP | DP 테이블 + 역추적 |
| 33 | Coin Change DP | DP 배열 |

### 완료 기준
- AVL 회전 애니메이션 정상 동작
- MST에서 Union-Find 시각화
- DP 테이블 채우기 + 역추적 경로 시각화
- 누적 33개 알고리즘 (MinHeap 포함)

---

## 각 Phase의 공통 마무리 작업

| 작업 | 설명 |
|------|------|
| 빌드 검증 | `pnpm build && pnpm lint` 통과 |
| 반응형 확인 | 768px, 1024px, 1440px 뷰포트에서 레이아웃 확인 |
| 네비게이션 | Sidebar에 새 알고리즘 추가, 홈페이지 카드 업데이트 |
| 비교 뷰 | 같은 카테고리 알고리즘 간 비교 기능 확인 |
| 성능 | 코드 스플리팅 확인, 번들 크기 모니터링 |

---

## 기술적 마일스톤

| 마일스톤 | 의존 Phase | 설명 |
|---------|-----------|------|
| BarChartView 완성 | Phase 1 | 모든 정렬 알고리즘의 기반 |
| GraphView 완성 | Phase 2 | 모든 그래프 알고리즘의 기반 |
| 비교 프레임워크 | Phase 1 | 두 알고리즘 나란히 실행하는 공용 레이아웃 |
| 의사코드 연동 | Phase 1 | 스텝과 의사코드 줄 연결 |
| 재귀 시각화 | Phase 2~3 | 재귀 호출 스택/트리 표시 (Merge Sort, DFS, DP) |
| 스텝 앞/뒤 이동 | Phase 0 | useAnimation 훅에 stepForward/stepBackward |

---

## Phase 0 시작을 위한 체크리스트

Phase 0을 시작하기 전에 결정해야 할 사항:

- [ ] 프로젝트 이름 확정 (AlgoViz? 다른 이름?)
- [ ] 기존 힙 프로젝트를 같은 리포에서 확장할지, 새 리포를 만들지
- [ ] CSS 전략: CSS Modules vs 전역 CSS + BEM vs Tailwind
- [ ] 테스트 프레임워크 도입 여부 (Vitest 권장)
- [ ] 배포 환경 결정 (Vercel, Netlify, GitHub Pages 등)
