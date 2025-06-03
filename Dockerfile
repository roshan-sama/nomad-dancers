# Use the official Go image as build stage
FROM golang:1.24-alpine AS builder

# Install build dependencies for CGO (needed for SQLite)
RUN apk add --no-cache gcc musl-dev sqlite-dev

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./
COPY ./modules ./modules

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Use alpine for the final image
FROM alpine:latest

# Install sqlite3 for CGO compatibility
RUN apk --no-cache add ca-certificates sqlite curl

# Set working directory
WORKDIR /root/

# Copy the binary from builder stage
COPY --from=builder /app/main .

# Create directory for database
RUN mkdir -p /root/data

# Expose port 8080
EXPOSE 8080

# Set environment variable for database path
ENV DATABASE_PATH=/root/data/mapMarkers.db

# Run the application
CMD ["./main"]