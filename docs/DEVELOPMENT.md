# 개발 가이드

## 환경 설정

### 필수 도구

- **Node.js**: v22 이상
- **pnpm**: v9 이상 (또는 npm/yarn)

### 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd heap

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev
```

개발 서버: http://localhost:5173

## 스크립트

```bash
# 개발 서버 (HMR)
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 미리보기
pnpm preview

# 린트 검사
pnpm lint
```

## 프로젝트 구조

```
heap/
├── public/              # 정적 파일
├── src/
│   ├── App.tsx          # 메인 컴포넌트
│   ├── App.css          # 앱 스타일
│   ├── main.tsx         # 엔트리 포인트
│   ├── components/      # UI 컴포넌트
│   │   ├── TreeView.tsx
│   │   ├── ArrayView.tsx
│   │   ├── Controls.tsx
│   │   ├── StepInfo.tsx
│   │   └── FunctionExplainer.tsx
│   └── lib/
│       └── MinHeap.ts   # 힙 로직
├── docs/                # 문서
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

## 컴포넌트 가이드

### TreeView

트리 형태로 힙을 시각화합니다.

```typescript
interface TreeViewProps {
  heap: number[]                           // 힙 배열
  highlightIndices: number[]               // 하이라이트할 인덱스
  highlightType: 'compare' | 'swap' | ... | null
}
```

### ArrayView

배열 형태로 힙을 시각화합니다.

```typescript
interface ArrayViewProps {
  heap: number[]
  highlightIndices: number[]
  highlightType: 'compare' | 'swap' | ... | null
}
```

### Controls

사용자 입력 컨트롤입니다.

```typescript
interface ControlsProps {
  onInsert: (value: number) => void
  onExtractMin: () => void
  onClear: () => void
  onRandomFill: () => void
  isAnimating: boolean
  heapSize: number
  minValue: number | null
}
```

### StepInfo

현재 단계 정보를 표시합니다.

```typescript
interface StepInfoProps {
  currentStep: HeapStep | null
  stepIndex: number
  totalSteps: number
}
```

## 스타일 가이드

### CSS 클래스 네이밍

```css
/* 컴포넌트 루트 */
.tree-view { }
.array-view { }

/* 하위 요소 */
.tree-view__node { }
.tree-view__edge { }

/* 상태 변형 */
.tree-view__node--highlight { }
.tree-view__node--compare { }
.tree-view__node--swap { }
```

### 색상 규칙

| 상태 | 색상 | 용도 |
|------|------|------|
| 기본 | `#667eea` | 일반 노드 |
| 비교 중 | `#f6ad55` | compare 단계 |
| 교환 | `#fc8181` | swap 단계 |
| 완료 | `#68d391` | complete 단계 |
| 삽입 | `#4fd1c5` | insert 단계 |

## 확장하기

### 새 기능 추가

1. `lib/MinHeap.ts`에 로직 추가
2. `HeapStep` 타입에 새 타입 추가 (필요시)
3. `App.tsx`에 핸들러 추가
4. `Controls.tsx`에 버튼 추가

### 예: Max Heap 추가

```typescript
// lib/MaxHeap.ts
export class MaxHeap {
  // MinHeap과 동일, 비교 연산만 반전
  private heapifyUp(index: number): void {
    // this.heap[index] > this.heap[parentIdx] 로 변경
  }
}
```

## 디버깅

### 콘솔 로그

```typescript
// MinHeap.ts에서 단계 확인
console.log('Step:', step)
console.log('Current heap:', this.heap)
```

### React DevTools

- 컴포넌트 상태 확인
- props 값 추적
- 리렌더링 확인

## 배포

### Vercel

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### GitHub Pages

```bash
# gh-pages 브랜치 생성
pnpm build
npx gh-pages -d dist
```

### 정적 빌드

```bash
pnpm build
# dist/ 폴더를 웹 서버에 배포
```
