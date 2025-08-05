import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useEvents } from '../context/EventsContext';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Modal';
import { EventForm } from '../components/EventForm';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Event } from '../types';

interface AdminDashboardProps {
  onNavigate: (page: string, eventId?: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { 
    events, 
    fetchEvents, 
    deleteEvent, 
    isLoading, 
    error, 
    clearError 
  } = useEvents();
  
  const { user } = useAuth();
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchEvents();
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="container">
        <div className="alert alert-error">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setDeletingEvent(event);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletingEvent) return;

    try {
      setIsDeleting(true);
      await deleteEvent(deletingEvent.id);
      setShowDeleteConfirm(false);
      setDeletingEvent(null);
    } catch (err) {
      // Error handling is done in the context
    } finally {
      setIsDeleting(false);
    }
  };

  const closeEventForm = () => {
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setDeletingEvent(null);
  };

  const handleFormSubmit = () => {
    fetchEvents(); // Refresh the events list
  };

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

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '32px', color: '#333', margin: 0 }}>
          Admin Dashboard
        </h1>
        
        <button
          className="btn btn-primary"
          onClick={handleCreateEvent}
          style={{ fontSize: '16px', padding: '12px 20px' }}
        >
          Create New Event
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No Events Found</h3>
            <p>Start by creating your first event.</p>
            <button
              className="btn btn-primary"
              onClick={handleCreateEvent}
            >
              Create Event
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2>Manage Events ({events.length} total)</h2>
          </div>
          
          <div className="card-body" style={{ padding: 0 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #ddd',
                      fontWeight: '600'
                    }}>
                      Event Title
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #ddd',
                      fontWeight: '600'
                    }}>
                      Date
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #ddd',
                      fontWeight: '600'
                    }}>
                      Category
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'left', 
                      borderBottom: '1px solid #ddd',
                      fontWeight: '600'
                    }}>
                      Location
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'center', 
                      borderBottom: '1px solid #ddd',
                      fontWeight: '600'
                    }}>
                      Registrations
                    </th>
                    <th style={{ 
                      padding: '12px', 
                      textAlign: 'center', 
                      borderBottom: '1px solid #ddd',
                      fontWeight: '600',
                      width: '160px'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody>
                  {events.map(event => (
                    <tr key={event.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                            {event.title}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: '#666',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px'
                          }}>
                            {event.description}
                          </div>
                        </div>
                      </td>
                      
                      <td style={{ padding: '12px' }}>
                        {format(new Date(event.date), 'MMM dd, yyyy')}
                      </td>
                      
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: '#e9ecef',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          {event.category}
                        </span>
                      </td>
                      
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontSize: '13px' }}>
                          <div>{event.location_name}</div>
                          <div style={{ color: '#666' }}>
                            {event.city}, {event.state}
                          </div>
                        </div>
                      </td>
                      
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{
                          background: '#007bff',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {event.registrations_count || 0}
                        </span>
                      </td>
                      
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                          <button
                            className="btn btn-secondary"
                            onClick={() => onNavigate('event-details', event.id)}
                            style={{ 
                              fontSize: '12px', 
                              padding: '4px 8px',
                              minWidth: 'auto'
                            }}
                          >
                            View
                          </button>
                          
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditEvent(event)}
                            style={{ 
                              fontSize: '12px', 
                              padding: '4px 8px',
                              minWidth: 'auto'
                            }}
                          >
                            Edit
                          </button>
                          
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteEvent(event)}
                            style={{ 
                              fontSize: '12px', 
                              padding: '4px 8px',
                              minWidth: 'auto'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      <Modal
        isOpen={showEventForm}
        onClose={closeEventForm}
        title={editingEvent ? 'Edit Event' : 'Create New Event'}
      >
        <EventForm
          event={editingEvent}
          onClose={closeEventForm}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={closeDeleteConfirm}
        onConfirm={confirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone and will also remove all registrations for this event.`}
        confirmText="Delete Event"
        isLoading={isDeleting}
      />
    </div>
  );
};