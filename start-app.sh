#!/bin/bash

# Event Management System Startup Script
echo "🚀 Starting Advanced Event Management System..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Please start MySQL first."
    echo "   macOS: sudo /usr/local/mysql/support-files/mysql.server start"
    echo "   Linux: sudo systemctl start mysql"
    exit 1
fi

echo "✅ MySQL is running"

# Start backend server
echo "🔧 Starting backend server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install --cache /tmp/.npm
fi

# Run migrations if needed
echo "🗄️  Running database migrations..."
npm run migrate

# Seed database with sample data
echo "🌱 Seeding database..."
npm run seed

# Start backend in background
nohup node server.js > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID) on port 5001"

cd ..

# Start frontend server
echo "🎨 Starting frontend server..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install --cache /tmp/.npm
fi

# Start frontend in background
nohup npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID) on port 3000"

cd ..

# Create logs directory if it doesn't exist
mkdir -p logs

# Store PIDs for stopping later
echo $BACKEND_PID > logs/backend.pid
echo $FRONTEND_PID > logs/frontend.pid

echo ""
echo "🎉 Application is starting up!"
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5001"
echo ""
echo "📊 Demo Accounts:"
echo "   👨‍💼 Admin: alice.admin@example.com / password123"
echo "   👤 User:  bob.user@example.com / password123"
echo ""
echo "📋 To stop the application: ./stop-app.sh"
echo "📝 Logs: tail -f logs/backend.log or logs/frontend.log"