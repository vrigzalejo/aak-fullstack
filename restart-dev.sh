#!/bin/bash

echo "Stopping and removing containers..."
docker-compose down

echo "Removing frontend image to force rebuild..."
docker rmi $(docker images -q aak-fullstack_frontend 2>/dev/null) 2>/dev/null || true

echo "Removing backend image to force rebuild..."
docker rmi $(docker images -q aak-fullstack_backend 2>/dev/null) 2>/dev/null || true

echo "Building and starting containers..."
docker-compose up --build

echo "Development environment restarted with live reload support!"
echo ""
echo "Container names:"
echo "  - Database:  aak-fullstack-db"
echo "  - Backend:   aak-fullstack-backend"
echo "  - Frontend:  aak-fullstack-frontend"
echo ""
echo "Access URLs:"
echo "  - Frontend:  http://localhost:3000"
echo "  - Backend:   http://localhost:8000"
echo "  - Database:  localhost:5432" 
