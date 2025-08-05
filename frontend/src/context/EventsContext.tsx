import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EventsContextType, Event, Location, Registration } from '../types';
import { api } from '../utils/api';

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 0,
  });
  const [filters, setFiltersState] = useState({
    date: '',
    category: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (page: number = 1, newFilters = filters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: pagination.limit,
        ...newFilters,
      };

      const response = await api.get('/events', params);
      setEvents(response.events);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvent = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get(`/events/${id}`);
      setCurrentEvent(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.post('/events', eventData);
      await fetchEvents(pagination.page, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (id: number, eventData: Partial<Event>) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.put(`/events/${id}`, eventData);
      
      if (currentEvent?.id === id) {
        await fetchEvent(id);
      }
      await fetchEvents(pagination.page, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.delete(`/events/${id}`);
      await fetchEvents(pagination.page, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const registerForEvent = async (eventId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.post(`/events/${eventId}/register`);
      
      if (currentEvent?.id === eventId) {
        await fetchEvent(eventId);
      }
      await fetchRegistrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register for event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRegistration = async (eventId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.delete(`/events/${eventId}/register`);
      
      if (currentEvent?.id === eventId) {
        await fetchEvent(eventId);
      }
      await fetchRegistrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel registration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await api.get('/events/registrations');
      setRegistrations(response.registrations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations');
      setLocations(response.locations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch locations');
    }
  };

  const setFilters = (newFilters: any) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const clearError = () => {
    setError(null);
  };

  const value: EventsContextType = {
    events,
    currentEvent,
    locations,
    registrations,
    pagination,
    filters,
    isLoading,
    error,
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    fetchRegistrations,
    fetchLocations,
    setFilters,
    clearError,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};