package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"marketplace/internal/server"
)

func main() {
	srv := server.New()

	// Start server in a separate goroutine
	go func() {
		if err := srv.Start(); err != nil {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Wait for SIGINT or SIGTERM
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	log.Println("Shutdown signal received")

	// Graceful shutdown with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server shutdown failed: %v", err)
	}

	log.Println("Server exited gracefully")
}
