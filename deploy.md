# Deployment Guide - Advanced Event Management System

## 🚀 Quick Deployment

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd event-management-system
```

### 2. Database Setup
```bash
# Start MySQL
sudo /usr/local/mysql/support-files/mysql.server start  # macOS
# sudo systemctl start mysql  # Linux

# Create database
mysql -u root -p
CREATE DATABASE event_management;
exit
```

### 3. Environment Configuration
Update `backend/.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=event_management
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your-secure-jwt-secret
```

### 4. Start Application
```bash
./start-app.sh
```

### 5. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 🏗️ Production Deployment

### Docker Deployment

1. **Create Dockerfile for Backend**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .
EXPOSE 5001
CMD ["node", "server.js"]
```

2. **Create Dockerfile for Frontend**:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

3. **Docker Compose**:
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: event_management
      MYSQL_ROOT_PASSWORD: rootpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    environment:
      DB_HOST: mysql
      DB_PASSWORD: rootpassword
    ports:
      - "5001:5001"
    depends_on:
      - mysql

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### Cloud Deployment Options

#### 1. Heroku
- Backend: Deploy as Node.js app with ClearDB MySQL addon
- Frontend: Deploy as static site or Node.js app

#### 2. AWS
- Backend: Elastic Beanstalk + RDS MySQL
- Frontend: S3 + CloudFront

#### 3. DigitalOcean
- Backend: App Platform Node.js
- Database: Managed MySQL
- Frontend: Static Site

#### 4. Vercel + PlanetScale
- Backend: Vercel Functions
- Database: PlanetScale MySQL
- Frontend: Vercel

## 📊 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5001
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=event_management
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com
```

## 🔧 Production Optimizations

### Backend
1. **Enable gzip compression**
2. **Add rate limiting**
3. **Set up SSL/HTTPS**
4. **Configure CORS properly**
5. **Add request logging**

### Frontend
1. **Build optimization** (already configured)
2. **CDN for static assets**
3. **Service worker for caching**
4. **Bundle analysis**

### Database
1. **Connection pooling**
2. **Indexing for performance**
3. **Regular backups**
4. **Monitor query performance**

## 🔐 Security Checklist

- [ ] Strong JWT secret in production
- [ ] Database credentials secured
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] SQL injection protection
- [ ] XSS protection headers

## 📈 Monitoring

### Recommended Tools
- **Application**: PM2 for Node.js process management
- **Database**: MySQL performance monitoring
- **Logs**: Winston for backend logging
- **Uptime**: Pingdom or UptimeRobot
- **Performance**: New Relic or DataDog

## 🛠️ Maintenance

### Regular Tasks
1. **Database backups**
2. **Dependency updates**
3. **Security patches**
4. **Log rotation**
5. **Performance monitoring**

### Scaling Considerations
- Load balancing for multiple backend instances
- Database read replicas
- CDN for frontend assets
- Caching layer (Redis)

## 🆘 Troubleshooting

### Common Issues
1. **Port conflicts**: Check if ports 3000/5001 are in use
2. **Database connection**: Verify MySQL is running and credentials
3. **CORS errors**: Check API URL configuration
4. **Build failures**: Clear node_modules and reinstall

### Health Checks
- Backend: GET /
- Database: Connection test in logs
- Frontend: Check browser console

## 📞 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Confirm all services are running

---

**Ready for production!** 🎉