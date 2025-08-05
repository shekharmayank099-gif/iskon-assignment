import React from 'react';
import { format } from 'date-fns';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: number) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onViewDetails }) => {
  return (
    <div className="card" style={{ cursor: 'pointer' }} onClick={() => onViewDetails(event.id)}>
      <div className="card-body">
        <h3 style={{ 
          fontSize: '20px', 
          marginBottom: '8px',
          color: '#333'
        }}>
          {event.title}
        </h3>
        
        <p style={{ 
          color: '#666', 
          fontSize: '14px',
          marginBottom: '12px'
        }}>
          {event.description}
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '8px',
          fontSize: '14px',
          color: '#555'
        }}>
          <div>
            <strong>Date:</strong> {format(new Date(event.date), 'PPP')}
          </div>
          
          <div>
            <strong>Category:</strong> {event.category}
          </div>
          
          <div>
            <strong>Location:</strong> {event.location_name}
          </div>
          
          <div>
            <strong>City:</strong> {event.city}, {event.state}
          </div>
        </div>
        
        {event.registrations_count !== undefined && (
          <div style={{ 
            marginTop: '12px',
            fontSize: '14px',
            color: '#007bff'
          }}>
            <strong>Registrations:</strong> {event.registrations_count}
          </div>
        )}
        
        <div style={{ 
          marginTop: '16px',
          textAlign: 'right'
        }}>
          <button 
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(event.id);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};