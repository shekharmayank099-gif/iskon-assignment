import React, { useEffect } from 'react';
import { useEvents } from '../context/EventsContext';
import { EventCard } from '../components/EventCard';
import { EventFilters } from '../components/EventFilters';
import { Pagination } from '../components/Pagination';

interface HomeProps {
  onNavigate: (page: string, eventId?: number) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { 
    events, 
    pagination, 
    fetchEvents, 
    isLoading, 
    error, 
    clearError,
    filters
  } = useEvents();

  useEffect(() => {
    fetchEvents(1, filters);
  }, []);

  const handlePageChange = (page: number) => {
    fetchEvents(page, filters);
  };

  const handleFilterChange = () => {
    fetchEvents(1, filters);
  };

  const handleViewDetails = (eventId: number) => {
    onNavigate('event-details', eventId);
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
      <h1 style={{ marginBottom: '30px', fontSize: '32px', color: '#333' }}>
        Upcoming Events
      </h1>
      
      <EventFilters onFilterChange={handleFilterChange} />
      
      {isLoading ? (
        <div className="loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <h3>No events found</h3>
            <p>There are no events matching your current filters.</p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ 
            display: 'grid', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
          
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontSize: '14px',
            marginTop: '20px'
          }}>
            Showing {events.length} of {pagination.total} events
          </div>
        </>
      )}
    </div>
  );
};