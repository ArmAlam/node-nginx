FROM golang:1.24-alpine as builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o go-worker

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/go-worker .

CMD ["./go-worker"]
