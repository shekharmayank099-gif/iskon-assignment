#!/bin/bash

# Event Management System Stop Script
echo "🛑 Stopping Advanced Event Management System..."

# Stop backend
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill $BACKEND_PID 2>/dev/null; then
        echo "✅ Backend stopped (PID: $BACKEND_PID)"
    else
        echo "⚠️  Backend process not found or already stopped"
    fi
    rm -f logs/backend.pid
fi

# Stop frontend
if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill $FRONTEND_PID 2>/dev/null; then
        echo "✅ Frontend stopped (PID: $FRONTEND_PID)"
    else
        echo "⚠️  Frontend process not found or already stopped"
    fi
    rm -f logs/frontend.pid
fi

# Kill any remaining processes
pkill -f "node server.js" 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true

echo "🏁 Application stopped successfully!"