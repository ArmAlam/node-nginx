# Node.js Microservices with Go Lang, RABBIT MQ, NGINX API Gateway and Load Balancer

This project demonstrates a production-like setup of Node.js microservices using **RABBITMQ** as a message broker, **NGINX** as an API Gateway and Load Balancer. It includes:

- Multiple instances of a Node.js service to simulate load balancing service
- Publish message to RABBIT-MQ using Node service
- Consume message using Go lang and operate CPU intensive task
- Publish to Rabbit MQ from Go and consuem the result using Nodejs.
- NGINX configured to route and balance traffic between services
- Static file hosting via NGINX (optional)
- Docker & Docker Compose for container orchestration

---

## Project Structure

    project-root/
    |-- docker-compose.yml
    |-- nginx/
        |-- default.conf
        |-- Dockerfile
        |-- nginx.conf
        |-- static/
        |-- index.html
        |-- script.js
        |-- style.css

    |-- services/
        |-- go-worker/
        |-- consumer/
        |-- task_consumer.go
        |-- models/
        |-- models.go
        |-- processor/
        |-- prime.go
        |-- utils/
        |-- amqp.go
        |-- logger.go
        |-- Dockerfile
        |-- go.mod
        |-- go.sum
        |-- main.go

    |-- user-service/
        |-- Dockerfile
        |-- jest.config.js
        |-- package.json
        |-- tsconfig.json
        |-- yarn.lock
        |-- src/
            |-- index.ts
            |-- messageQueue.ts
            |-- __tests__/
                |-- index.test.ts
    |-- README.md

---

## Features

- **Load Balancing**: Routes traffic across multiple instances of `user-service`.
- **RABBIT MQ**: Message queue for handling async operations using `node-service` and `go worker`.
- **API Gateway**: Acts as a single entry point for all microservices.
- **Static Content Hosting**: Serve static files via NGINX (optional).
- **Dockerized Setup**: Simple to run using Docker Compose.

---

## How to Run

1. **Clone the Repo**

```bash
git clone https://github.com/ArmAlam/node-nginx.git
cd node-nginx

docker compose up --build
```

## Access Services

API: http://localhost/users/ — Proxied to user-service containers

Static (if configured): http://localhost/

## Tech Stack

Node.js (with Express & TypeScript)

Rabbit-MQ

NGINX (API Gateway + Load Balancer)

Docker

Docker Compose

## Tips

You can scale services by duplicating service definitions in docker-compose.yml.

Static content served from /usr/share/nginx/html.

Each service can send its container ID for debugging and load testing.

## License

MIT — Feel free to use, modify, and share.
