package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Server struct {
	httpServer *http.Server
}

func New() *Server {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello from AWS App Runner-compatible Go server!")
	})

	s := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	return &Server{httpServer: s}
}

func (s *Server) Start() error {
	log.Printf("Server listening on %s\n", s.httpServer.Addr)
	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	log.Println("Shutting down server...")
	return s.httpServer.Shutdown(ctx)
}
