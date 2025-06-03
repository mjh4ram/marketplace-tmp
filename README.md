# Marketplace

## 목차
- [개요](#개요)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [프론트엔드 개발](#프론트엔드-개발)
- [백엔드 개발](#백엔드-개발)
- [프로젝트 구조](#프로젝트-구조)
- [Makefile 명령어](#makefile-명령어)

## 개요
이 프로젝트는 마켓플레이스 서비스의 풀스택 애플리케이션입니다. Next.js 기반의 프론트엔드와 Go 언어로 구현된 백엔드로 구성되어 있습니다.

## 기술 스택

### 프론트엔드
- Next.js 15.3.2
- React 19
- TypeScript
- Tailwind CSS
- Protocol Buffers (gRPC-Web)

### 백엔드
- Go 1.21+
- net/http (표준 HTTP 서버)
- Protocol Buffers (요청/응답 직렬화)
- Make (빌드 자동화)

## 시작하기

### 필수 요구사항
- Node.js 18 이상
- Go 1.21 이상
- Protocol Buffers 컴파일러 (protoc)
- Make
- Git

### 설치 방법
1. 저장소 클론
```bash
git clone [repository-url]
cd marketplace
```

2. 프론트엔드 의존성 설치
```bash
cd frontend
npm install
```

3. 백엔드 의존성 설치
```bash
cd ../backend
go mod download
```

4. 개발 서버 실행
```bash
# 프론트엔드 (새 터미널에서)
cd frontend
npm run dev

# 백엔드 (새 터미널에서)
cd backend
make run
```

## 프론트엔드 개발

### 개발 환경 설정
1. Node.js 설치
macOS의 경우:
```bash
brew install node
```

2. 의존성 설치
```bash
cd frontend
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

### 주요 명령어
- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: 코드 린팅
- `npm run generate:proto`: Protocol Buffers 타입 생성

### 프로젝트 구조
```
frontend/
├── src/           # 소스 코드
│   ├── app/      # Next.js 앱 라우터
│   ├── components/# React 컴포넌트
│   ├── proto/    # Protocol Buffers 생성 파일
│   └── styles/   # 스타일 파일
├── public/        # 정적 파일
├── package.json   # 의존성 정의
└── tsconfig.json # TypeScript 설정
```

### Protocol Buffers 사용하기

#### 1. Protocol Buffers 타입 생성
백엔드에서 proto 파일이 수정되면, 프론트엔드에서도 타입을 생성해야 합니다:

```bash
# frontend 디렉토리에서 실행
npm run generate:proto
```

이 명령어는 `../backend/proto/*.proto` 파일들을 읽어서 `src/proto/` 디렉토리에 TypeScript 타입을 생성합니다.

#### 2. API 클라이언트 사용하기
```typescript
// src/components/ItemList.tsx
import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { ListItemsRequest, ListItemsResponse } from '@/proto/item_pb';
import { ApiError } from '@/utils/api';

export const ItemList = () => {
  const [items, setItems] = useState<ListItemsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const request = new ListItemsRequest();
        // 필요한 경우 request 필드 설정
        // request.setPage(1);
        // request.setPageSize(10);

        const response = await api.listItems(request);
        setItems(response);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(`API Error (${err.status}): ${err.message}`);
          // err.details를 통해 상세 에러 정보 접근 가능
        } else {
          setError('Unknown error occurred');
        }
      }
    };

    fetchItems();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!items) return <div>Loading...</div>;

  return (
    <div>
      {/* items.getItemsList()로 아이템 목록 접근 */}
      {items.getItemsList().map(item => (
        <div key={item.getId()}>
          {item.getTitle()}
        </div>
      ))}
    </div>
  );
};
```

#### 3. 새로운 API 메서드 추가하기
`src/utils/api.ts`에 새로운 API 메서드를 추가하는 방법:

```typescript
// src/utils/api.ts
import * as your_pb from '../proto/your_service_pb';

export const api = {
  // ... existing methods ...

  /**
   * 새로운 API 메서드 추가
   */
  yourNewMethod: async (req: your_pb.YourRequest): Promise<your_pb.YourResponse> => {
    return fetchProtobuf<your_pb.YourRequest, your_pb.YourResponse>(
      '/your-endpoint',
      req,
      your_pb.YourResponse,
      'POST',  // 또는 'GET', 'PUT' 등
    );
  },
};
```

#### 4. Protocol Buffers 모범 사례
1. **타입 안전성**
   - 생성된 타입을 항상 사용하여 타입 안전성 보장
   - `getField()` 메서드로 필드 값 접근
   - `setField()` 메서드로 필드 값 설정
   - `toObject()` 메서드로 일반 JavaScript 객체로 변환 가능

2. **에러 처리**
   ```typescript
   try {
     const response = await api.yourMethod(request);
     // 성공 처리
   } catch (err) {
     if (err instanceof ApiError) {
       // API 에러 처리
       console.error(`API Error (${err.status}):`, err.message);
       if (err.details) {
         // Protocol Buffers 에러 응답 처리
         console.error('Error details:', err.details.toObject());
       }
     } else {
       // 기타 에러 처리
       console.error('Unknown error:', err);
     }
   }
   ```

3. **성능 최적화**
   - 필요한 필드만 포함하여 요청/응답 크기 최소화
   - 큰 데이터의 경우 페이지네이션 사용
   - 적절한 HTTP 메서드 사용 (GET, POST 등)

## 백엔드 개발

### Docker로 실행하기

#### 필수 요구사항
- Docker Desktop이 설치되어 있어야 합니다. (https://www.docker.com/products/docker-desktop)
- Make가 설치되어 있어야 합니다.

#### 실행 방법
1. 터미널에서 backend 디렉토리로 이동합니다.
   ```bash
   cd backend
   ```

2. Makefile을 사용하여 Docker 환경을 관리할 수 있습니다:

   ```bash
   # 모든 서비스 빌드 및 실행 (최초 실행 시)
   make docker-up-build

   # 또는 단계별로 실행
   make docker-build  # 컨테이너 빌드
   make docker-up     # 컨테이너 실행
   ```

   - 최초 실행 시, PostgreSQL 데이터베이스와 마이그레이션(테이블 생성), Go 서버가 자동으로 실행됩니다.
   - 마이그레이션은 `migrations/` 디렉토리의 SQL 파일들을 순서대로 실행하여 테이블과 인덱스를 생성합니다.

#### 유용한 Docker 명령어
```bash
# 컨테이너 중지
make docker-down

# 컨테이너 중지 및 볼륨 삭제 (데이터베이스 초기화)
make docker-down-clean

# 로그 확인
make docker-logs
make docker-logs-follow  # 실시간 로그 확인

# 마이그레이션만 실행
make docker-migrate

# 모든 것을 초기화하고 다시 시작
make docker-reset
```

#### 포트 충돌 해결
- 기본적으로 백엔드 서버는 호스트의 8080 포트를 사용합니다.
- 만약 `address already in use` 에러가 발생하면, 다른 프로세스가 8080 포트를 사용 중일 수 있습니다.
- 해결 방법:
  1. 포트를 사용 중인 프로세스 확인:
     ```bash
     # macOS/Linux
     lsof -i :8080
     # Windows
     netstat -ano | findstr :8080
     ```
  2. 해당 프로세스 종료 또는
  3. `docker-compose.yml` 파일에서 포트 매핑을 다른 포트로 변경

#### 데이터베이스 초기화
데이터베이스를 완전히 초기화하고 싶을 때:
```bash
make docker-down-clean  # 모든 컨테이너와 볼륨 삭제
make docker-up-build   # 새로 빌드하고 시작
```

### 개발 환경 설정 (로컬에서 직접 실행)
1. Go 설치
macOS의 경우:
```bash
brew install go
```

2. Protocol Buffers 및 의존성 설치
```bash
make check-proto-deps
```
이 명령어는 Protocol Buffers와 필요한 모든 의존성(Go 플러그인 포함)이 설치되어 있는지 확인하고, 필요한 경우 자동으로 설치합니다.

### API 엔드포인트 추가하기

#### 1. 새로운 엔드포인트 정의하기
1. `proto/` 디렉토리에 새로운 메시지 타입 정의 (필요한 경우)
```protobuf
syntax = "proto3";

package yourservice;

option go_package = "github.com/yourusername/marketplace/proto/yourservice";

message YourRequest {
  string field = 1;
}

message YourResponse {
  string result = 1;
}
```

2. Protocol Buffers 컴파일
```bash
make proto
```

#### 2. 핸들러 구현하기
1. `internal/server/` 디렉토리에 새로운 핸들러 구현
```go
package server

func (s *Server) HandleYourEndpoint(r *http.Request, req *pb.YourRequest) (*pb.YourResponse, *pb.ErrorResponse, int) {
    // 비즈니스 로직 구현
    return &pb.YourResponse{
        Result: "success",
    }, nil, http.StatusOK
}
```

2. 라우터에 엔드포인트 등록
`internal/server/server.go`의 `registerRoutes` 함수에 추가:
```go
func (s *Server) registerRoutes(mux *http.ServeMux) {
    // ... existing code ...
    
    yourHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            middleware.ProtoMiddleware(s.HandleYourEndpoint)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})).ServeHTTP(w, r)
        default:
            http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        }
    })
    v1.Handle("/your-endpoint", yourHandler)
}
```

## 프로젝트 구조
```
marketplace/
├── frontend/      # Next.js 프론트엔드
├── backend/       # Go 백엔드
│   ├── cmd/      # 메인 애플리케이션 진입점
│   ├── internal/ # 내부 패키지
│   ├── pkg/      # 공개 패키지
│   └── proto/    # Protocol Buffers 정의
└── README.md     # 프로젝트 문서
```

## API 엔드포인트 목록
현재 구현된 엔드포인트:
- `POST /api/v1/items` - 새로운 아이템 생성
- `GET /api/v1/items` - 아이템 목록 조회

## Makefile 명령어 (백엔드)
- `make run`: 서버 실행
- `make build`: 서버 빌드
- `make proto`: Protocol Buffers 컴파일
- `make clean`: 빌드 파일 정리

## 주의사항
1. 프론트엔드
   - 새로운 의존성 추가 시 `npm install` 실행
   - Protocol Buffers 수정 후 `npm run generate:proto` 실행
   - TypeScript 타입 체크 준수
   - ESLint 규칙 준수

2. 백엔드
   - 새로운 의존성 추가 시 `go mod tidy` 실행
   - Protocol Buffers 수정 후 반드시 `make proto` 실행
   - 코드 컨벤션 준수 (gofmt, golint 사용)
   - 모든 HTTP 핸들러는 적절한 HTTP 메서드 검사 필요
   - 에러 응답은 `proto.ErrorResponse` 형식 사용

## 문제 해결
### 프론트엔드
- 빌드 실패: `node_modules` 삭제 후 `npm install` 재실행
- 타입 에러: `npm run generate:proto` 실행
- 개발 서버 문제: 포트 3000이 사용 가능한지 확인

### 백엔드
- Protocol Buffers 컴파일 오류: `make clean` 후 `make proto` 재실행
- 의존성 문제: `go mod tidy` 실행
- 빌드 실패: `make clean` 후 `make build` 재시도
- 서버 시작 실패: 포트 8080이 사용 가능한지 확인