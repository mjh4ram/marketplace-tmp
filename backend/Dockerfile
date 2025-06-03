# Build stage
FROM golang:1.24-alpine AS builder

# Install build dependencies
RUN apk add --no-cache make git protobuf-dev

# Install protoc plugins with specific versions
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# Set working directory
WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Generate protobuf files and build the application
RUN make proto-gen
RUN make build

# Final stage
FROM alpine:latest

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/marketplace-server .

# Expose port
EXPOSE 8080

# Run the application
CMD ["./marketplace-server"] 