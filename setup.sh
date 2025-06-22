#!/bin/bash

echo "Setting up AAK Fullstack with PostgreSQL..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

echo "Building and starting containers..."
docker-compose down
docker-compose up --build -d

echo "Waiting for PostgreSQL to be ready..."
echo "   This may take a few moments for the first run..."
sleep 20

echo "Running database migrations..."
docker-compose exec backend python manage.py migrate

echo "Checking container status..."
docker-compose ps

echo "Checking logs..."
echo "Database logs:"
docker-compose logs db | tail -5
echo ""
echo "Backend logs:"
docker-compose logs backend | tail -5
echo ""
echo "Frontend logs:"
docker-compose logs frontend | tail -5

echo ""
echo "Setup complete!"
echo ""
echo "Access your application:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000/api/auth/signup/"
echo "- Database: PostgreSQL on localhost:5432"
echo ""
echo "Useful commands:"
echo "- View logs: docker-compose logs -f [service]"
echo "- Stop services: docker-compose down"
echo "- Reset database: docker-compose down -v"
echo "- Restart services: docker-compose restart" 
