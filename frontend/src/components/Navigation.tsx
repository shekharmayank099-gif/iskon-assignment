import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ 
      background: '#343a40', 
      color: 'white', 
      padding: '16px 0',
      marginBottom: '20px'
    }}>
      <div className="container" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => onNavigate('home')}>
          Event Management System
        </h1>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <>
              <button
                className={`btn ${currentPage === 'home' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('home')}
              >
                Events
              </button>
              
              <button
                className={`btn ${currentPage === 'registrations' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('registrations')}
              >
                My Registrations
              </button>
              
              {user.role === 'admin' && (
                <button
                  className={`btn ${currentPage === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => onNavigate('admin')}
                >
                  Admin Dashboard
                </button>
              )}
              
              <span style={{ fontSize: '14px' }}>
                Welcome, {user.name} ({user.role})
              </span>
              
              <button
                className="btn btn-secondary"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className={`btn ${currentPage === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('login')}
              >
                Login
              </button>
              
              <button
                className={`btn ${currentPage === 'register' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => onNavigate('register')}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};