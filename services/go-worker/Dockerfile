FROM golang:1.24-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
COPY main.go ./

RUN go mod download

RUN go build -o go-worker

CMD ["./go-worker"]
