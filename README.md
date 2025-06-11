# Node.js Microservices with NGINX API Gateway and Load Balancer

This project demonstrates a production-like setup of Node.js microservices using **NGINX** as an API Gateway and Load Balancer. It includes:

- Multiple instances of a Node.js service
- NGINX configured to route and balance traffic between services
- Static file hosting via NGINX (optional)
- Docker & Docker Compose for container orchestration

---

## 📦 Project Structure

├── nginx/
│ └── default.conf # NGINX config (gateway, load balancer, static)
├── user-service/
│ ├── src/
│ └── Dockerfile # Node.js service container
├── static/ # Optional: static HTML/CSS/JS files
├── docker-compose.yml
└── README.md

---

## 🚀 Features

- 🔁 **Load Balancing**: Routes traffic across multiple instances of `user-service`.
- 🔐 **API Gateway**: Acts as a single entry point for all microservices.
- 🗂 **Static Content Hosting**: Serve static files via NGINX (optional).
- 🐳 **Dockerized Setup**: Simple to run using Docker Compose.

---

## 🧪 How to Run

1. **Clone the Repo**

```bash
git clone https://github.com/your/repo.git
cd your-project-directory

docker-compose up --build
```

## Access Services

API: http://localhost/users/ — Proxied to user-service containers

Static (if configured): http://localhost/

## Tech Stack

Node.js (with Express)

NGINX (API Gateway + Load Balancer)

Docker

Docker Compose

## Tips

You can scale services by duplicating service definitions in docker-compose.yml.

Static content served from /usr/share/nginx/html.

Each service can send its container ID for debugging and load testing.

## License

MIT — Feel free to use, modify, and share.
