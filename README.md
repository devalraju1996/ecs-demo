# ECS Demo – Frontend & Backend on AWS

A simple two-service Node.js app deployed to **Amazon ECS**, with a CI/CD pipeline using **AWS CodeBuild**.

## Project structure

```
ecs-demo/
├── backend/        # Node.js API (port 3000)
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/       # Node.js frontend
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── buildspec.yml   # CodeBuild: build images and push to ECR
```

## Tech stack
- Node.js 20 (Alpine)
- Docker
- Amazon ECR (image registry)
- Amazon ECS (container orchestration)
- AWS CodeBuild (CI/CD)

## Run locally with Docker

```bash
# Backend
cd backend
docker build -t ecs-demo-backend .
docker run -p 3000:3000 ecs-demo-backend

# Health check
curl http://localhost:3000/health
```

## Features
- Runs as a non-root user inside the container
- Container health check on `/health`
- Production-only dependencies for smaller images

## Author
Reddaiah Devalaraju – [GitHub](https://github.com/devalraju1996)