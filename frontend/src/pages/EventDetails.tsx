import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';

interface EventDetailsProps {
  eventId: number;
  onNavigate: (page: string) => void;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ eventId, onNavigate }) => {
  const { 
    currentEvent, 
    fetchEvent, 
    registerForEvent, 
    cancelRegistration,
    registrations,
    fetchRegistrations,
    isLoading, 
    error, 
    clearError 
  } = useEvents();
  
  const { user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEvent(eventId);
    if (user) {
      fetchRegistrations();
    }
  }, [eventId, user]);

  const isUserRegistered = registrations.some(
    reg => reg.event_id === eventId && reg.status === 'registered'
  );

  const handleRegister = async () => {
    if (!user) {
      onNavigate('login');
      return;
    }

    try {
      setIsRegistering(true);
      setMessage('');
      await registerForEvent(eventId);
      setMessage('Successfully registered for the event!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      setIsRegistering(true);
      setMessage('');
      await cancelRegistration(eventId);
      setMessage('Registration cancelled successfully!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to cancel registration');
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">Loading event details...</div>
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

  if (!currentEvent) {
    return (
      <div className="container">
        <div className="alert alert-error">
          Event not found
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button 
        className="btn btn-secondary"
        onClick={() => onNavigate('home')}
        style={{ marginBottom: '20px' }}
      >
        ← Back to Events
      </button>

      <div className="card">
        <div className="card-header">
          <h1 style={{ fontSize: '28px', margin: 0 }}>
            {currentEvent.title}
          </h1>
        </div>
        
        <div className="card-body">
          {message && (
            <div className={`alert ${message.includes('Success') || message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '30px'
          }}>
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Event Details</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <strong>Description:</strong>
                <p style={{ margin: '8px 0', lineHeight: '1.5' }}>
                  {currentEvent.description}
                </p>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Date:</strong> {format(new Date(currentEvent.date), 'PPP')}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Category:</strong> {currentEvent.category}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Created by:</strong> {currentEvent.created_by_name}
              </div>
              
              {currentEvent.registrations_count !== undefined && (
                <div style={{ marginBottom: '12px' }}>
                  <strong>Total Registrations:</strong> {currentEvent.registrations_count}
                </div>
              )}
            </div>
            
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>Location</h3>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Venue:</strong> {currentEvent.location_name}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Address:</strong> {currentEvent.address}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>City:</strong> {currentEvent.city}, {currentEvent.state}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <strong>Country:</strong> {currentEvent.country}
              </div>
            </div>
          </div>
          
          {user && (
            <div style={{ 
              borderTop: '1px solid #eee', 
              paddingTop: '20px',
              textAlign: 'center'
            }}>
              {isUserRegistered ? (
                <div>
                  <p style={{ 
                    color: '#28a745', 
                    fontWeight: '500',
                    marginBottom: '16px'
                  }}>
                    ✓ You are registered for this event
                  </p>
                  <button
                    className="btn btn-danger"
                    onClick={handleCancelRegistration}
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Cancelling...' : 'Cancel Registration'}
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '16px' }}>
                    Ready to join this event?
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={handleRegister}
                    disabled={isRegistering}
                    style={{ fontSize: '16px', padding: '12px 24px' }}
                  >
                    {isRegistering ? 'Registering...' : 'Register for Event'}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {!user && (
            <div style={{ 
              borderTop: '1px solid #eee', 
              paddingTop: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '16px' }}>
                Please log in to register for this event
              </p>
              <button
                className="btn btn-primary"
                onClick={() => onNavigate('login')}
                style={{ fontSize: '16px', padding: '12px 24px' }}
              >
                Login to Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};