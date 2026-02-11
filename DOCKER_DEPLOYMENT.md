# Docker Deployment Guide

This guide explains how to build and deploy the HiringTool application using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)

## Quick Start

### Using Docker Compose (Recommended)

1. Build and start the application:
```bash
docker compose up -d
```

2. Access the application at `http://localhost:4000`

3. Stop the application:
```bash
docker compose down
```

### Production Setup with Nginx (Recommended for Production)

For production deployments, we provide a setup with Nginx as a reverse proxy:

1. Start the application with Nginx:
```bash
docker compose -f docker-compose.prod.yml up -d
```

2. Access the application at `http://localhost:80`

This setup provides:
- Nginx reverse proxy for better performance
- Security headers
- Gzip compression
- Health check endpoint at `/health`
- Proper connection handling

### Using Docker CLI

1. Build the Docker image:
```bash
docker build -t hiring-tool:latest .
```

2. Run the container:
```bash
docker run -d -p 4000:4000 --name hiring-tool hiring-tool:latest
```

3. Access the application at `http://localhost:4000`

4. Stop and remove the container:
```bash
docker stop hiring-tool
docker rm hiring-tool
```

## Production Deployment

### Environment Variables

You can customize the application by passing environment variables:

```bash
docker run -d \
  -p 4000:4000 \
  -e PORT=4000 \
  -e NODE_ENV=production \
  --name hiring-tool \
  hiring-tool:latest
```

### Using Custom Port

To run the application on a different port:

```bash
docker run -d -p 8080:4000 --name hiring-tool hiring-tool:latest
```

The application will be accessible at `http://localhost:8080`

### Health Checks

The Docker Compose configuration includes health checks. You can check the container health:

```bash
docker-compose ps
```

### Logs

View application logs:

```bash
# Using Docker Compose
docker-compose logs -f

# Using Docker CLI
docker logs -f hiring-tool
```

## Cloud Deployment

### Docker Hub

1. Tag your image:
```bash
docker tag hiring-tool:latest your-username/hiring-tool:latest
```

2. Push to Docker Hub:
```bash
docker push your-username/hiring-tool:latest
```

### Cloud Providers

#### AWS ECS/Fargate

1. Tag for ECR:
```bash
docker tag hiring-tool:latest <aws-account-id>.dkr.ecr.<region>.amazonaws.com/hiring-tool:latest
```

2. Push to ECR:
```bash
aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <aws-account-id>.dkr.ecr.<region>.amazonaws.com
docker push <aws-account-id>.dkr.ecr.<region>.amazonaws.com/hiring-tool:latest
```

#### Google Cloud Run

```bash
gcloud builds submit --tag gcr.io/PROJECT-ID/hiring-tool
gcloud run deploy hiring-tool --image gcr.io/PROJECT-ID/hiring-tool --platform managed
```

#### Azure Container Instances

```bash
az acr build --registry <registry-name> --image hiring-tool:latest .
az container create --resource-group <resource-group> --name hiring-tool \
  --image <registry-name>.azurecr.io/hiring-tool:latest \
  --dns-name-label hiring-tool --ports 4000
```

## Troubleshooting

### Build Issues

If you encounter build issues, try clearing the Docker cache:
```bash
docker build --no-cache -t hiring-tool:latest .
```

### Container Won't Start

Check the logs:
```bash
docker logs hiring-tool
```

### Port Already in Use

If port 4000 is already in use, map to a different port:
```bash
docker run -d -p 3000:4000 --name hiring-tool hiring-tool:latest
```

## Development

For development purposes, you can mount the source code:

```bash
docker run -d \
  -p 4000:4200 \
  -v $(pwd):/app \
  -v /app/node_modules \
  --name hiring-tool-dev \
  node:20-alpine \
  sh -c "cd /app && npm install && npm start"
```

## Performance Optimization

The Dockerfile uses:
- Multi-stage builds to reduce image size
- Alpine Linux for smaller base image
- Production-only dependencies in final image
- Proper layer caching for faster rebuilds

## Security

- The application runs as a non-root user in production
- Only production dependencies are included
- Environment files are excluded via .dockerignore
- Health checks ensure the application is running correctly
