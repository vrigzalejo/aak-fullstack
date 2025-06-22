# AAK Fullstack

A modern fullstack application with Django REST Framework backend and React TypeScript frontend.

## Features

- **Backend**: Django REST Framework with custom User model
- **Frontend**: React with TypeScript and Redux Toolkit
- **Database**: PostgreSQL with custom 'users' table
- **Authentication**: User registration with comprehensive validation
- **Error Handling**: Client-side and server-side validation
- **Logging**: Comprehensive logging throughout the application
- **Docker**: Containerized development environment with live reload support
- **Live Reload**: Hot reloading for both frontend and backend development

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aak-fullstack
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/auth/signup
   - Database: PostgreSQL on localhost:5432

## Development with Live Reload

### Quick Development Restart

Use the provided restart script for easy development setup:

```bash
# Make script executable (first time only)
chmod +x restart-dev.sh

# Restart development environment with fresh builds
./restart-dev.sh
```

This script will:
- Stop all containers
- Remove old images to force rebuild
- Rebuild and start containers with live reload enabled

### Live Reload Features

- **Frontend Live Reload**: Changes to React components automatically refresh the browser
- **Backend Live Reload**: Django development server restarts automatically on Python file changes
- **File Watching**: Optimized for Docker on Windows with polling enabled
- **Hot Module Replacement**: React Fast Refresh for instant component updates

## Manual Setup

### Prerequisites

- Docker and Docker Compose
- Git

### Setup Steps

1. **Build and start containers**
   ```bash
   docker-compose up --build -d
   ```

2. **Run migrations**
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/auth/signup
   - Database: PostgreSQL on localhost:5432

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - User registration
  - Accepts both `/api/auth/signup` and `/api/auth/signup/`
  - Required fields: username, email, first_name, last_name, password, password_confirm
  - Returns: User data with timestamps

## Database Schema

### Users Table (PostgreSQL)

The application uses a custom User model that creates a 'users' table in PostgreSQL with the following fields:

- `id` - Primary key (BigAutoField)
- `username` - Unique username (CharField)
- `email` - Unique email address (EmailField)
- `first_name` - User's first name (CharField)
- `last_name` - User's last name (CharField)
- `password` - Hashed password (CharField)
- `is_active` - Account status (BooleanField)
- `is_staff` - Staff status (BooleanField)
- `is_superuser` - Superuser status (BooleanField)
- `date_joined` - Account creation date (DateTimeField)
- `last_login` - Last login timestamp (DateTimeField)
- `created_at` - Custom timestamp field (DateTimeField)
- `updated_at` - Custom timestamp field (DateTimeField)

### Database Configuration

- **Database**: PostgreSQL 15
- **Database Name**: aak_fullstack
- **Username**: postgres
- **Password**: postgres
- **Host**: db (Docker container)
- **Port**: 5432

## Development

### Docker Development Environment

The development environment is optimized for live reload with the following features:

- **File Watching**: Uses polling for reliable file change detection on Windows
- **Volume Mounting**: Source code is mounted for instant updates
- **Environment Variables**: Configured for optimal development experience
- **Network Configuration**: Proper Docker networking between services

### Development Commands

```bash
# Start development environment
docker-compose up --build

# Restart with fresh builds (recommended for development)
./restart-dev.sh

# View real-time logs (using service names)
docker-compose logs -f frontend
docker-compose logs -f backend

# View real-time logs (using container names)
docker logs -f aak-fullstack-frontend
docker logs -f aak-fullstack-backend
docker logs -f aak-fullstack-db

# Stop all services
docker-compose down
```

### Running Tests

```bash
# Test API endpoints
./test_api.sh

# View logs (using service names)
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# View logs (using container names)
docker logs -f aak-fullstack-backend
docker logs -f aak-fullstack-frontend
docker logs -f aak-fullstack-db
```

### Database Management

```bash
# Connect to PostgreSQL (using service name)
docker-compose exec db psql -U postgres -d aak_fullstack

# Connect to PostgreSQL (using container name)
docker exec -it aak-fullstack-db psql -U postgres -d aak_fullstack

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d

# View database logs
docker-compose logs -f db
# or using container name
docker logs -f aak-fullstack-db
```

### Project Structure

```
aak-fullstack/
├── backend/
│   ├── users/              # Custom users app
│   ├── backend/            # Django settings
│   ├── requirements.txt
│   ├── Dockerfile          # Optimized for development
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/         # Redux store
│   │   ├── setupProxy.js  # Docker-optimized proxy
│   │   └── App.tsx
│   ├── package.json
│   ├── Dockerfile         # Alpine-based with live reload
│   └── tsconfig.json
├── docker-compose.yml     # Live reload configuration
├── restart-dev.sh         # Development restart script
├── setup.sh
└── test_api.sh
```

### Key Features

- **URL Flexibility**: All endpoints accept both trailing slash and non-trailing slash URLs
- **Comprehensive Validation**: Both client-side and server-side validation
- **Error Handling**: Field-specific error display
- **Logging**: Detailed logging for debugging and monitoring
- **Custom User Model**: Enhanced user model with additional timestamp fields
- **PostgreSQL**: Production-ready database with persistent data storage
- **Live Reload**: Instant feedback during development
- **Docker Optimization**: Optimized Dockerfiles for development workflow

## Docker Configuration Details

### Frontend Container
- **Base Image**: `node:16-alpine` for smaller size and better performance
- **File Watching**: `CHOKIDAR_USEPOLLING=true` for reliable change detection
- **Hot Reload**: `FAST_REFRESH=true` for React Fast Refresh
- **WebSocket**: Configured for live reload WebSocket connections

### Backend Container
- **Base Image**: `python:3.9-slim` for optimized Python environment
- **Live Reload**: Django development server with auto-restart
- **Logging**: `PYTHONUNBUFFERED=1` for real-time log output
- **Volume Mounting**: Source code mounted for instant updates

### Volume Configuration
- **Named Volumes**: Separate volume for `node_modules` to prevent conflicts
- **Source Mounting**: Direct mounting of source directories for live updates
- **Database Persistence**: PostgreSQL data persisted across container restarts

### Container Names
- **Database**: `aak-fullstack-db`
- **Backend**: `aak-fullstack-backend`
- **Frontend**: `aak-fullstack-frontend`

These custom container names make it easier to identify and manage containers directly with Docker commands.

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000, 8000, and 5432 are available
2. **Docker issues**: Restart Docker service
3. **Database connection issues**: Wait for PostgreSQL to fully start (can take 30-60 seconds)
4. **Migration issues**: Run `docker-compose exec backend python manage.py migrate`
5. **Live reload not working**: Use `./restart-dev.sh` to restart with fresh configuration

### Live Reload Issues

If live reload isn't working:

```bash
# Force rebuild and restart
./restart-dev.sh

# Or manually:
docker-compose down
docker-compose up --build

# Check if file watching is enabled
docker-compose exec frontend env | grep CHOKIDAR
docker-compose exec frontend env | grep WATCHPACK
```

### Database Issues

```bash
# Check PostgreSQL status (using service name)
docker-compose exec db pg_isready -U postgres

# Check PostgreSQL status (using container name)
docker exec aak-fullstack-db pg_isready -U postgres

# View PostgreSQL logs
docker-compose logs db
# or using container name
docker logs aak-fullstack-db

# Reset database completely
docker-compose down -v
docker-compose up -d
```

### Logs

- Django logs: `./backend/django.log`
- Container logs: `docker-compose logs [service]`
- PostgreSQL logs: `docker-compose logs db`
- Real-time logs: `docker-compose logs -f [service]`

## Technology Stack

- **Backend**: Django 4.2.7, Django REST Framework 3.14.0
- **Frontend**: React 18, TypeScript, Redux Toolkit
- **Database**: PostgreSQL 15
- **Database Driver**: psycopg2-binary 2.9.7
- **Containerization**: Docker, Docker Compose
- **Development**: Live reload, Hot Module Replacement
- **Styling**: CSS3 
