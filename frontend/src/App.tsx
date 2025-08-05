import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventsProvider } from './context/EventsContext';
import { Navigation } from './components/Navigation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { EventDetails } from './pages/EventDetails';
import { MyRegistrations } from './pages/MyRegistrations';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { user, isLoading } = useAuth();

  const handleNavigate = (page: string, eventId?: number) => {
    setCurrentPage(page);
    setSelectedEventId(eventId || null);
  };

  if (isLoading) {
    return (
      <div className="loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      
      case 'event-details':
        return selectedEventId ? (
          <EventDetails eventId={selectedEventId} onNavigate={handleNavigate} />
        ) : (
          <Home onNavigate={handleNavigate} />
        );
      
      case 'registrations':
        return user ? (
          <MyRegistrations onNavigate={handleNavigate} />
        ) : (
          <Login onNavigate={handleNavigate} />
        );
      
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminDashboard onNavigate={handleNavigate} />
        ) : (
          <div className="container">
            <div className="alert alert-error">
              Access denied. Admin privileges required.
            </div>
          </div>
        );
      
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EventsProvider>
        <AppContent />
      </EventsProvider>
    </AuthProvider>
  );
};

export default App;