# Quick Start Guide

## 🚀 Get Started in 30 seconds

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd aak-fullstack
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Access your application**
   ```
   # Frontend: http://localhost:3000
   # Backend: http://localhost:8000/api/auth/signup/
   ```

3. **Test the signup**
   - Open http://localhost:3000
   - Fill out the signup form
   - Check the browser console for logs

## 🔧 Manual Commands

```bash
# Start containers
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop containers
docker-compose down
```

That's it! 🎉 
