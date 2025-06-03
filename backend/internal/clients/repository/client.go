package repository

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

// Config holds the database configuration
type Config struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// DSN returns the PostgreSQL connection string
func (c *Config) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.Host, c.Port, c.User, c.Password, c.DBName, c.SSLMode,
	)
}

// Repository represents a database repository
type Repository struct {
	db *sql.DB
}

// NewRepository creates a new database repository with internal configuration
func NewRepository() (*Repository, error) {
	// Get configuration from environment variables
	cfg := &Config{
		Host:     getEnvOrDefault("DB_HOST", "localhost"),
		Port:     getEnvOrDefault("DB_PORT", "5432"),
		User:     getEnvOrDefault("DB_USER", "postgres"),
		Password: getEnvOrDefault("DB_PASSWORD", "postgres"),
		DBName:   getEnvOrDefault("DB_NAME", "marketplace"),
		SSLMode:  getEnvOrDefault("DB_SSL_MODE", "disable"),
	}

	db, err := sql.Open("postgres", cfg.DSN())
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Test the connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("Successfully connected to database")
	return &Repository{db: db}, nil
}

// getEnvOrDefault returns the value of the environment variable or a default value
func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// Close closes the database connection
func (r *Repository) Close() error {
	if r.db != nil {
		return r.db.Close()
	}
	return nil
}

// DB returns the underlying *sql.DB instance
func (r *Repository) DB() *sql.DB {
	return r.db
}

// Query executes a query that returns rows (with context)
func (r *Repository) Query(ctx context.Context, query string, args ...interface{}) (*sql.Rows, error) {
	return r.db.QueryContext(ctx, query, args...)
}

// QueryRow executes a query that is expected to return at most one row (with context)
func (r *Repository) QueryRow(ctx context.Context, query string, args ...interface{}) *sql.Row {
	return r.db.QueryRowContext(ctx, query, args...)
}

// Exec executes a query without returning any rows (with context)
func (r *Repository) Exec(ctx context.Context, query string, args ...interface{}) (sql.Result, error) {
	return r.db.ExecContext(ctx, query, args...)
}

// Begin starts a new transaction (with context)
func (r *Repository) Begin(ctx context.Context, opts *sql.TxOptions) (*sql.Tx, error) {
	return r.db.BeginTx(ctx, opts)
}
