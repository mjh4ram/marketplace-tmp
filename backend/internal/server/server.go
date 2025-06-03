package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"marketplace/internal/api/middleware"
	"marketplace/internal/clients/repository"
)

type Server struct {
	httpServer *http.Server
	repo       *repository.Repository
}

func New() *Server {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &Server{}

	// Setup repository
	repo, err := repository.NewRepository()
	if err != nil {
		log.Fatalf("Failed to initialize repository: %v", err)
	}
	server.repo = repo

	// Setup HTTP server
	mux := http.NewServeMux()
	server.registerRoutes(mux)

	handler := middleware.Chain(
		mux,
		middleware.RecoveryMiddleware,
		middleware.LoggingMiddleware,
		middleware.CORSMiddleware,
		middleware.ContentTypeMiddleware,
	)

	server.httpServer = &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: handler,
	}

	return server
}

func (s *Server) registerRoutes(mux *http.ServeMux) {
	// API routes
	api := http.NewServeMux()

	// v1 routes
	v1 := http.NewServeMux()

	itemsHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			middleware.ProtoMiddleware(s.HandleCreateItem)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})).ServeHTTP(w, r)
		case http.MethodGet:
			middleware.ProtoMiddleware(s.HandleListItems)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})).ServeHTTP(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	v1.Handle("/items", itemsHandler)

	// Mount v1 under /api/v1
	api.Handle("/v1/", http.StripPrefix("/v1", v1))

	// Mount API routes under /api
	mux.Handle("/api/", http.StripPrefix("/api", api))
}

func (s *Server) Start() error {
	log.Printf("Server listening on %s\n", s.httpServer.Addr)
	return s.httpServer.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	log.Println("Shutting down server...")

	// Close repository connection
	if err := s.repo.Close(); err != nil {
		log.Printf("Error closing repository connection: %v", err)
	}

	// Close HTTP server
	if err := s.httpServer.Shutdown(ctx); err != nil {
		log.Printf("Error shutting down HTTP server: %v", err)
		return err
	}

	return nil
}
