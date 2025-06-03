# Use the official Go image as build stage
FROM golang:1.24-alpine AS builder

# Set working directory
WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=1 GOOS=linux go build -a -installsuffix cgo -o main .

# Use alpine for the final image
FROM alpine:latest

# Install sqlite3 for CGO compatibility
RUN apk --no-cache add ca-certificates sqlite

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