# 아키텍처

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | React | 19.2 |
| 언어 | TypeScript | 5.9 |
| 빌드 도구 | Vite | 7.3 |
| 애니메이션 | Framer Motion | 12.x |
| 린팅 | ESLint | 9.x |

## 프로젝트 구조

```
src/
├── App.tsx              # 메인 앱 컴포넌트
├── App.css              # 앱 스타일
├── main.tsx             # 엔트리 포인트
├── components/
│   ├── TreeView.tsx     # 트리 시각화 컴포넌트
│   ├── ArrayView.tsx    # 배열 시각화 컴포넌트
│   ├── Controls.tsx     # 조작 버튼 컴포넌트
│   ├── StepInfo.tsx     # 단계 정보 표시
│   └── FunctionExplainer.tsx  # 함수 설명 컴포넌트
└── lib/
    └── MinHeap.ts       # MinHeap 자료구조 구현
```

## 컴포넌트 구조

```
App
├── TreeView          # 이진 트리 형태로 힙 시각화
│   └── 노드 + 연결선
├── ArrayView         # 배열 형태로 힙 시각화
│   └── 인덱스 + 값
├── Controls          # 사용자 입력 컨트롤
│   ├── 삽입 입력 + 버튼
│   ├── 추출 버튼
│   ├── 초기화 버튼
│   └── 랜덤 채우기 버튼
├── StepInfo          # 현재 단계 설명
│   └── 단계 번호 + 설명 텍스트
└── FunctionExplainer # 힙 함수 설명 카드
    └── 함수별 설명 + 복잡도
```

## 데이터 흐름

```
[사용자 입력]
      │
      ▼
  Controls ─────────────────┐
      │                     │
      ▼                     ▼
  App (상태 관리)      MinHeap (로직)
      │                     │
      │◀── steps[] ─────────┘
      │
      ├──▶ TreeView (시각화)
      ├──▶ ArrayView (시각화)
      └──▶ StepInfo (설명)
```

## 핵심 로직

### MinHeap 클래스

```typescript
class MinHeap {
  heap: number[] = []
  
  // 삽입: O(log n)
  insert(value: number): HeapStep[]
  
  // 최소값 추출: O(log n)
  extractMin(): { value: number | null; steps: HeapStep[] }
  
  // 위로 정렬 (삽입 후)
  private heapifyUp(index: number): void
  
  // 아래로 정렬 (추출 후)
  private heapifyDown(index: number): void
  
  // 최소값 확인: O(1)
  peek(): number | null
}
```

### HeapStep 인터페이스

```typescript
interface HeapStep {
  type: 'compare' | 'swap' | 'complete' | 'insert' | 'remove'
  indices: number[]       // 하이라이트할 인덱스
  description: string     // 단계 설명
  heap: number[]          // 현재 힙 상태
}
```

## 애니메이션 흐름

### 삽입 연산

```
1. [insert] 배열 끝에 값 추가
2. [compare] 부모와 비교
3. [swap] 필요시 교환 (반복)
4. [complete] 완료
```

### 추출 연산

```
1. [remove] 루트(최소값) 제거
2. [swap] 마지막 요소를 루트로 이동
3. [compare] 자식들과 비교
4. [swap] 더 작은 자식과 교환 (반복)
5. [complete] 완료
```

## 상태 관리

App 컴포넌트에서 `useState`, `useRef`로 상태 관리:

| 상태 | 타입 | 설명 |
|------|------|------|
| `heapRef` | `useRef<MinHeap>` | MinHeap 인스턴스 |
| `heapArray` | `number[]` | 현재 힙 배열 |
| `steps` | `HeapStep[]` | 애니메이션 단계 목록 |
| `currentStepIndex` | `number` | 현재 재생 중인 단계 |
| `isAnimating` | `boolean` | 애니메이션 진행 여부 |
| `animationSpeed` | `number` | 애니메이션 속도 (ms) |

## 확장 가능성

- **Max Heap 추가**: MinHeap 로직 반전
- **buildHeap 시각화**: 배열을 힙으로 변환하는 과정
- **heapSort 시각화**: 힙 정렬 알고리즘
- **다른 자료구조**: BST, AVL, Red-Black Tree 등
