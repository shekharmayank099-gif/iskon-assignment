import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';

interface MyRegistrationsProps {
  onNavigate: (page: string, eventId?: number) => void;
}

export const MyRegistrations: React.FC<MyRegistrationsProps> = ({ onNavigate }) => {
  const { registrations, fetchRegistrations, isLoading, error, clearError } = useEvents();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Please log in to view your registrations.
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-error">
          {error}
          <button 
            onClick={clearError}
            style={{ 
              marginLeft: '10px', 
              background: 'none', 
              border: 'none', 
              color: '#721c24',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading your registrations...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>
        My Event Registrations
      </h1>
      
      {registrations.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No Registrations Found</h3>
            <p>You haven't registered for any events yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => onNavigate('home')}
            >
              Browse Events
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {registrations.map(registration => (
            <div key={registration.id} className="card">
              <div className="card-body">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '20px', 
                    margin: 0,
                    color: '#333'
                  }}>
                    {registration.title}
                  </h3>
                  
                  <span style={{ 
                    background: '#28a745',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Registered
                  </span>
                </div>
                
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>
                  {registration.description}
                </p>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  fontSize: '14px',
                  color: '#555',
                  marginBottom: '16px'
                }}>
                  <div>
                    <strong>Event Date:</strong> {registration.date && format(new Date(registration.date), 'PPP')}
                  </div>
                  
                  <div>
                    <strong>Category:</strong> {registration.category}
                  </div>
                  
                  <div>
                    <strong>Location:</strong> {registration.location_name}
                  </div>
                  
                  <div>
                    <strong>City:</strong> {registration.city}, {registration.state}
                  </div>
                  
                  <div>
                    <strong>Registered On:</strong> {format(new Date(registration.registration_date), 'PPp')}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => onNavigate('event-details', registration.event_id)}
                  >
                    View Event Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};