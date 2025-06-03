# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOPATH=$(shell go env GOPATH)
GOBIN=$(GOPATH)/bin
BINARY_NAME=marketplace-server
MAIN_FILE=cmd/server/main.go

# Proto parameters
PROTOC=protoc
PROTO_DIR=proto
GO_OUT_DIR=proto
GO_OPTIONS=paths=source_relative

# Docker parameters
DOCKER_COMPOSE=docker compose
DOCKER_BUILD=$(DOCKER_COMPOSE) build
DOCKER_UP=$(DOCKER_COMPOSE) up
DOCKER_DOWN=$(DOCKER_COMPOSE) down
DOCKER_LOGS=$(DOCKER_COMPOSE) logs

# Ensure GOBIN is in PATH
export PATH := $(GOBIN):$(PATH)

.PHONY: proto-gen clean-proto install-proto-deps check-proto-deps build run dev clean help docker-build docker-up docker-up-build docker-down docker-down-clean docker-logs docker-logs-follow docker-migrate docker-reset

# Check if required protoc plugins are installed
check-proto-deps:
	@echo "Checking protoc plugins..."
	@which protoc-gen-go >/dev/null 2>&1 || (echo "protoc-gen-go not found. Installing..." && $(MAKE) install-proto-deps)
	@which protoc-gen-go-grpc >/dev/null 2>&1 || (echo "protoc-gen-go-grpc not found. Installing..." && $(MAKE) install-proto-deps)

# Generate Go code from proto files
proto-gen: check-proto-deps
	@echo "Generating Go code from proto files..."
	@echo "Using GOPATH: $(GOPATH)"
	@echo "Using GOBIN: $(GOBIN)"
	$(PROTOC) \
		--go_out=$(GO_OUT_DIR) \
		--go_opt=$(GO_OPTIONS) \
		--go-grpc_out=$(GO_OUT_DIR) \
		--go-grpc_opt=$(GO_OPTIONS) \
		-I $(PROTO_DIR) \
		$(PROTO_DIR)/*.proto

# Build the server
build: proto-gen
	@echo "Building server..."
	$(GOBUILD) -o $(BINARY_NAME) $(MAIN_FILE)

# Run the server
run: build
	@echo "Running server..."
	./$(BINARY_NAME)

# Run the server in development mode with hot reload
dev:
	@echo "Running server in development mode..."
	@which air >/dev/null 2>&1 || (echo "Installing air for hot reload..." && $(GOCMD) install github.com/cosmtrek/air@latest)
	air

# Clean generated files and binary
clean: clean-proto
	@echo "Cleaning build artifacts..."
	rm -f $(BINARY_NAME)
	$(GOCLEAN)

# Install required protoc plugins if not already installed
install-proto-deps:
	@echo "Installing required protoc plugins..."
	@echo "Installing to GOBIN: $(GOBIN)"
	$(GOCMD) install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	$(GOCMD) install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
	@echo "Verifying installation..."
	@which protoc-gen-go || (echo "protoc-gen-go installation failed" && exit 1)
	@which protoc-gen-go-grpc || (echo "protoc-gen-go-grpc installation failed" && exit 1)

# Clean generated proto files
clean-proto:
	@echo "Cleaning generated proto files..."
	rm -f $(GO_OUT_DIR)/*.pb.go

# Docker commands
docker-build:
	@echo "Building Docker containers..."
	$(DOCKER_BUILD)

docker-up:
	@echo "Starting Docker containers..."
	$(DOCKER_UP)

docker-up-build:
	@echo "Building and starting Docker containers..."
	$(DOCKER_UP) --build

docker-down:
	@echo "Stopping Docker containers..."
	$(DOCKER_DOWN)

docker-down-clean:
	@echo "Stopping Docker containers and removing volumes..."
	$(DOCKER_DOWN) -v

docker-logs:
	@echo "Showing Docker container logs..."
	$(DOCKER_LOGS)

docker-logs-follow:
	@echo "Following Docker container logs..."
	$(DOCKER_LOGS) -f

docker-migrate:
	@echo "Running database migrations..."
	$(DOCKER_COMPOSE) up migrations

docker-reset: docker-down-clean docker-up-build
	@echo "Reset complete: Docker containers rebuilt and started fresh"

# Help command
help:
	@echo "Available commands:"
	@echo "  make proto-gen        - Generate Go code from proto files"
	@echo "  make build           - Build the server binary"
	@echo "  make run             - Build and run the server"
	@echo "  make dev             - Run the server with hot reload (requires air)"
	@echo "  make clean           - Clean all generated files and binary"
	@echo "  make clean-proto     - Remove generated proto files"
	@echo "  make install-proto-deps - Install required protoc plugins"
	@echo "  make check-proto-deps - Check if required protoc plugins are installed"
	@echo ""
	@echo "Docker commands:"
	@echo "  make docker-build    - Build Docker containers"
	@echo "  make docker-up       - Start Docker containers"
	@echo "  make docker-up-build - Build and start Docker containers"
	@echo "  make docker-down     - Stop Docker containers"
	@echo "  make docker-down-clean - Stop containers and remove volumes"
	@echo "  make docker-logs     - Show container logs"
	@echo "  make docker-logs-follow - Follow container logs"
	@echo "  make docker-migrate  - Run database migrations"
	@echo "  make docker-reset    - Reset everything (stop, clean, rebuild)"
	@echo ""
	@echo "  make help            - Show this help message"

.DEFAULT_GOAL := help 