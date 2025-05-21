package server

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"marketplace/internal/api/middleware"
)

type Server struct {
	httpServer *http.Server
}

func New() *Server {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	server := &Server{}

	mux := http.NewServeMux()
	server.registerRoutes(mux)

	// Apply middleware
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
	return s.httpServer.Shutdown(ctx)
}
