import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventsContext';
import { Event } from '../types';

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
  onSubmit: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ event, onClose, onSubmit }) => {
  const { createEvent, updateEvent, locations, fetchLocations, isLoading, error } = useEvents();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    location_id: '',
  });
  
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchLocations();
    
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        category: event.category || '',
        location_id: event.location_id?.toString() || '',
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.date) return 'Date is required';
    if (!formData.category) return 'Category is required';
    if (!formData.location_id) return 'Location is required';
    
    const eventDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (eventDate < today) {
      return 'Event date cannot be in the past';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const eventData = {
        ...formData,
        location_id: parseInt(formData.location_id),
      };

      if (event) {
        await updateEvent(event.id, eventData);
      } else {
        await createEvent(eventData);
      }
      
      onSubmit();
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save event');
    }
  };

  const categories = [
    'Workshop',
    'Seminar',
    'Conference',
    'Meetup',
    'Training',
    'Webinar',
  ];

  return (
    <form onSubmit={handleSubmit}>
      {(formError || error) && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          {formError || error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Event Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="form-group">
          <label htmlFor="date">Event Date</label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            className="form-control"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="location_id">Location</label>
        <select
          id="location_id"
          name="location_id"
          className="form-control"
          value={formData.location_id}
          onChange={handleChange}
          required
        >
          <option value="">Select location</option>
          {locations.map(location => (
            <option key={location.id} value={location.id}>
              {location.name} - {location.city}, {location.state}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
        </button>
      </div>
    </form>
  );
};