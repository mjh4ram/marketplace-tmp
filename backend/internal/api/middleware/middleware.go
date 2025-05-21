package middleware

import (
	"log"
	"net/http"
	"runtime/debug"
	"time"

	mpb "marketplace/proto" // alias the proto package to avoid conflict
)

// ResponseWriter is a wrapper around http.ResponseWriter that captures the status code
type ResponseWriter struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
}

// WriteHeader captures the status code before writing it
func (rw *ResponseWriter) WriteHeader(code int) {
	if rw.wroteHeader {
		return
	}
	rw.status = code
	rw.ResponseWriter.WriteHeader(code)
	rw.wroteHeader = true
}

// Write writes the response
func (rw *ResponseWriter) Write(b []byte) (int, error) {
	if !rw.wroteHeader {
		rw.WriteHeader(http.StatusOK)
	}
	return rw.ResponseWriter.Write(b)
}

// Status returns the status code
func (rw *ResponseWriter) Status() int {
	return rw.status
}

// LoggingMiddleware logs information about each request
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rw := &ResponseWriter{ResponseWriter: w}

		next.ServeHTTP(rw, r)

		duration := time.Since(start)
		log.Printf(
			"method=%s path=%s status=%d duration=%s remote_addr=%s user_agent=%s",
			r.Method,
			r.URL.Path,
			rw.Status(),
			duration,
			r.RemoteAddr,
			r.UserAgent(),
		)
	})
}

// RecoveryMiddleware recovers from panics
func RecoveryMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("panic: %v\n%s", err, debug.Stack())
				writeProtoError(w, http.StatusInternalServerError, &mpb.ErrorResponse{
					Code:    mpb.ErrorCode_ERROR_INTERNAL,
					Message: "An unexpected error occurred",
				})
			}
		}()

		next.ServeHTTP(w, r)
	})
}

// CORSMiddleware handles CORS headers
func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ContentTypeMiddleware ensures proper content type
func ContentTypeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" || r.Method == "PUT" {
			contentType := r.Header.Get("Content-Type")
			if contentType != "application/json" && contentType != "application/x-protobuf" {
				writeProtoError(w, http.StatusBadRequest, &mpb.ErrorResponse{
					Code:    mpb.ErrorCode_ERROR_INVALID_CONTENT_TYPE,
					Message: "Unsupported content type. Must be application/json or application/x-protobuf",
				})
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

// Chain chains multiple middleware together
func Chain(handler http.Handler, middleware ...func(http.Handler) http.Handler) http.Handler {
	for i := len(middleware) - 1; i >= 0; i-- {
		handler = middleware[i](handler)
	}
	return handler
}
