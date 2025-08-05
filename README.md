# Advanced Event Management System

A full-stack web application for managing events with user authentication, role-based access control, event registration, and comprehensive admin functionality.

## Features

### User Features
- **Authentication**: Register and login with JWT-based authentication
- **Event Browsing**: View all available events with detailed information
- **Event Filtering**: Filter events by date, category, and location
- **Event Registration**: Register for events and manage registrations
- **My Registrations**: View and manage personal event registrations
- **Pagination**: Navigate through events with 5 events per page

### Admin Features
- **Event Management**: Create, edit, and delete events
- **Admin Dashboard**: Comprehensive view of all events with management controls
- **Event Details**: View registration counts and event statistics
- **Role-based Access**: Admin-only access to management features
- **Confirmation Modals**: Safe deletion with confirmation prompts

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Context API for state management
- **Form Validation**: Client-side validation with user-friendly error messages
- **Date Formatting**: Using date-fns for consistent date display
- **RESTful API**: Well-structured backend API with proper HTTP methods
- **Database Relationships**: Properly normalized database with foreign keys

## Technology Stack

### Backend
- **Node.js** with **Express.js**
- **MySQL** database with **Knex.js** query builder
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS**, **Helmet**, **Morgan** for security and logging

### Frontend
- **React** with **TypeScript**
- **Context API** for state management
- **date-fns** for date formatting
- **CSS-in-JS** with inline styles
- No external UI libraries (custom styled components)

## Database Schema

### Tables
1. **users** - User accounts with roles
2. **locations** - Event venues and locations
3. **events** - Event information with relationships
4. **event_registrations** - User event registrations

### Relationships
- Events belong to locations (many-to-one)
- Events are created by users (many-to-one)
- Users can register for multiple events (many-to-many)

## Project Structure

```
├── backend/
│   ├── database/
│   │   └── connection.js
│   ├── middleware/
│   │   └── auth.js
│   ├── migrations/
│   │   ├── 20250805000001_create_users_table.js
│   │   ├── 20250805000002_create_locations_table.js
│   │   ├── 20250805000003_create_events_table.js
│   │   └── 20250805000004_create_event_registrations_table.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── locations.js
│   │   └── registrations.js
│   ├── seeds/
│   │   ├── 01_users.js
│   │   ├── 02_locations.js
│   │   ├── 03_events.js
│   │   └── 04_event_registrations.js
│   ├── .env
│   ├── knexfile.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmationModal.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventFilters.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Pagination.tsx
│   │   ├── context/
│   │   │   ├── AuthContext.tsx
│   │   │   └── EventsContext.tsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── MyRegistrations.tsx
│   │   │   └── Register.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── react-app-env.d.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 Quick Start

For the fastest setup, use our automated scripts:

```bash
# Start the entire application
./start-app.sh

# Stop the application
./stop-app.sh
```

The script will:
- Check MySQL is running
- Install dependencies
- Run database migrations and seeds
- Start both backend and frontend servers

**Access the application**: http://localhost:3000

## Setup Instructions (Manual)

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Database Setup

1. **Install MySQL** and create a database:
```sql
CREATE DATABASE event_management;
```

2. **Create a MySQL user** (optional but recommended):
```sql
CREATE USER 'event_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON event_management.* TO 'event_user'@'localhost';
FLUSH PRIVILEGES;
```

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
Edit the `.env` file with your database credentials:
```env
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=event_management
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

4. **Run database migrations**:
```bash
npm run migrate
```

5. **Seed the database with sample data**:
```bash
npm run seed
```

6. **Start the backend server**:
```bash
npm run dev
```

The backend server will start on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the frontend development server**:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Demo Accounts

The system comes with pre-seeded demo accounts:

### Admin Account
- **Email**: alice.admin@example.com
- **Password**: password123
- **Role**: Admin (can create, edit, delete events)

### User Account
- **Email**: bob.user@example.com
- **Password**: password123
- **Role**: User (can register for events)

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Events
- `GET /events` - Get all events (with optional filters and pagination)
- `GET /events/:id` - Get specific event details
- `POST /events` - Create new event (admin only)
- `PUT /events/:id` - Update event (admin only)
- `DELETE /events/:id` - Delete event (admin only)

### Event Registration
- `POST /events/:id/register` - Register for an event
- `DELETE /events/:id/register` - Cancel registration
- `GET /events/registrations` - Get user's registrations
- `GET /events/:id/registrations` - Get event registrations (admin only)

### Locations
- `GET /locations` - Get all locations

## Features in Detail

### Authentication & Authorization
- JWT-based authentication with secure password hashing
- Role-based access control (admin vs regular user)
- Protected routes and API endpoints
- Automatic token management with localStorage

### Event Management
- CRUD operations for events
- Rich event details with location information
- Category-based organization
- Date-based scheduling with validation

### Event Registration System
- One-click event registration
- Registration status tracking
- Registration cancellation
- User registration history

### Advanced UI Features
- Responsive design for all screen sizes
- Modal-based forms and confirmations
- Real-time form validation
- Loading states and error handling
- Pagination with smart page navigation
- Filter system with multiple criteria

### Database Features
- Normalized database design
- Foreign key relationships
- Data integrity constraints
- Efficient queries with joins
- Transaction support for data consistency

## Development Notes

### Code Organization
- **Context API**: Used for global state management instead of Redux
- **TypeScript**: Full type safety across the application
- **Component Structure**: Modular, reusable components
- **API Layer**: Centralized API client with error handling
- **Database Layer**: Knex query builder for database operations

### Security Features
- Password hashing with bcrypt
- JWT token expiration
- CORS configuration
- Helmet for security headers
- Input validation and sanitization
- SQL injection prevention

### Performance Considerations
- Pagination for large datasets
- Efficient database queries with joins
- Lazy loading of components
- Optimized re-renders with React Context
- Caching of location data

## Future Enhancements

- Email notifications for event registrations
- Calendar integration
- Event capacity limits
- Payment integration for paid events
- Event search functionality
- User profile management
- Event rating and reviews
- Social media sharing
- Export functionality for admin reports
- Real-time updates with WebSockets

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Kill processes using the port

3. **npm Install Issues**:
   - Try deleting `node_modules` and `package-lock.json`
   - Run `npm install` again
   - Check Node.js version compatibility

4. **Frontend API Calls Failing**:
   - Ensure backend server is running
   - Check proxy configuration in `package.json`
   - Verify API endpoints are correct
