#!/bin/bash

echo "Testing Signup API with PostgreSQL Database..."

# Test signup endpoint - Valid data
echo "1. Testing signup endpoint with valid data..."
echo "   Expected: Should see successful signup logs and PostgreSQL users table entry"
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "validuser123",
    "email": "valid@example.com",
    "first_name": "Valid",
    "last_name": "User",
    "password": "validpassword123",
    "password_confirm": "validpassword123"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test signup endpoint with trailing slash
echo "2. Testing signup endpoint with trailing slash..."
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser456",
    "email": "test2@example.com",
    "first_name": "Test2",
    "last_name": "User2",
    "password": "testpassword456",
    "password_confirm": "testpassword456"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test signup endpoint - Empty fields (frontend validation)
echo "3. Testing signup with empty fields..."
echo "   Expected: Should see validation error logs"
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "",
    "email": "",
    "first_name": "",
    "last_name": "",
    "password": "",
    "password_confirm": ""
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test signup endpoint - Invalid email format
echo "4. Testing signup with invalid email..."
echo "   Expected: Should see email validation error"
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser789",
    "email": "invalid-email-format",
    "first_name": "Test",
    "last_name": "User",
    "password": "testpassword123",
    "password_confirm": "testpassword123"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test signup endpoint - Password mismatch
echo "5. Testing signup with password mismatch..."
echo "   Expected: Should see password validation error"
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser999",
    "email": "test999@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "password123",
    "password_confirm": "differentpassword"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test duplicate username (backend validation)
echo "6. Testing signup with duplicate username..."
echo "   Expected: Should see backend duplicate username error from PostgreSQL users table"
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "validuser123",
    "email": "different@example.com",
    "first_name": "Duplicate",
    "last_name": "User",
    "password": "testpassword789",
    "password_confirm": "testpassword789"
  }' \
  -w "\nStatus: %{http_code}\n\n"

# Test short password (backend validation)
echo "7. Testing signup with short password..."
echo "   Expected: Should see password length validation error"
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "shortpass",
    "email": "shortpass@example.com",
    "first_name": "Short",
    "last_name": "Pass",
    "password": "123",
    "password_confirm": "123"
  }' \
  -w "\nStatus: %{http_code}\n\n"

echo "API testing complete!"
echo ""
echo "PostgreSQL Database Implementation Summary:"
echo "   - Custom User model created with 'users' table name in PostgreSQL"
echo "   - Added created_at and updated_at timestamps"
echo "   - All user data now stored in PostgreSQL 'users' table"
echo "   - Response includes additional timestamp fields"
echo "   - Database: PostgreSQL 15 with persistent data storage"
echo ""
echo "Error Validation Testing Summary:"
echo "   - Frontend validation: Empty fields, email format, password mismatch"
echo "   - Backend validation: Duplicate username, password requirements"
echo "   - All errors should now display properly in the frontend form"
echo ""
echo "Logging Information:"
echo "   - Backend logs: Check Django console output and django.log file"
echo "   - Frontend logs: Check browser console for detailed error handling"
echo "   - Database: Users stored in PostgreSQL 'users' table with custom fields"
echo "   - PostgreSQL logs: Check database container logs"
echo ""
echo "Log File Locations:"
echo "   - Django logs: ./backend/django.log"
echo "   - Console logs: Visible in terminal where Django server is running"
echo "   - PostgreSQL logs: docker-compose logs db"
echo ""
echo "Database Connection:"
echo "   - Connect to PostgreSQL: docker-compose exec db psql -U postgres -d aak_fullstack"
echo "   - View users: SELECT * FROM users;" 
