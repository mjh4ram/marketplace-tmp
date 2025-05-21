# Marketplace Backend

## 목차
- [개요](#개요)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [개발 환경 설정](#개발-환경-설정)
- [API 엔드포인트 추가하기](#api-엔드포인트-추가하기)
- [프로젝트 구조](#프로젝트-구조)
- [Makefile 명령어](#makefile-명령어)

## 개요
이 프로젝트는 마켓플레이스 서비스의 백엔드 시스템입니다. Go 언어의 표준 `net/http` 패키지를 사용하여 구현된 RESTful API 서버입니다.

## 기술 스택
- Go 1.21+
- net/http (표준 HTTP 서버)
- Protocol Buffers (요청/응답 직렬화)
- Make (빌드 자동화)

## 시작하기

### 필수 요구사항
- Go 1.21 이상
- Protocol Buffers 컴파일러 (protoc)
- Make
- Git

### 설치 방법
1. 저장소 클론
```bash
git clone [repository-url]
cd marketplace/backend
```

2. 의존성 설치
```bash
go mod download
```

3. 서버 실행
```bash
make run
```

## 개발 환경 설정

### 1. Go 설치
macOS의 경우:
```bash
brew install go
```

### 2. Protocol Buffers 및 의존성 설치
```bash
make check-proto-deps
```
이 명령어는 Protocol Buffers와 필요한 모든 의존성(Go 플러그인 포함)이 설치되어 있는지 확인하고, 필요한 경우 자동으로 설치합니다.

## API 엔드포인트 추가하기

### 1. 새로운 엔드포인트 정의하기
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

### 2. 핸들러 구현하기
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
backend/
├── cmd/            # 메인 애플리케이션 진입점
│   └── server/    # 서버 실행 코드
├── internal/       # 내부 패키지
│   ├── api/       # API 관련 코드
│   │   └── middleware/  # HTTP 미들웨어
│   └── server/    # HTTP 핸들러 및 서버 구현
├── pkg/           # 공개 패키지
├── proto/         # Protocol Buffers 정의
├── go.mod         # Go 모듈 정의
├── go.sum         # 의존성 체크섬
└── Makefile       # 빌드 자동화
```

## API 엔드포인트 목록
현재 구현된 엔드포인트:
- `POST /api/v1/items` - 새로운 아이템 생성
- `GET /api/v1/items` - 아이템 목록 조회

## Makefile 명령어
- `make run`: 서버 실행
- `make build`: 서버 빌드
- `make proto`: Protocol Buffers 컴파일
- `make clean`: 빌드 파일 정리

## 주의사항
1. 새로운 의존성 추가 시 `go mod tidy` 실행
2. Protocol Buffers 수정 후 반드시 `make proto` 실행
3. 코드 컨벤션 준수 (gofmt, golint 사용)
4. 모든 HTTP 핸들러는 적절한 HTTP 메서드 검사 필요
5. 에러 응답은 `proto.ErrorResponse` 형식 사용

## 문제 해결
- Protocol Buffers 컴파일 오류: `make clean` 후 `make proto` 재실행
- 의존성 문제: `go mod tidy` 실행
- 빌드 실패: `make clean` 후 `make build` 재시도
- 서버 시작 실패: 포트 8080이 사용 가능한지 확인