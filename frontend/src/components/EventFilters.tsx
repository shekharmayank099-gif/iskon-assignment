import React, { useState, useEffect } from 'react';
import { useEvents } from '../context/EventsContext';

interface EventFiltersProps {
  onFilterChange: () => void;
}

export const EventFilters: React.FC<EventFiltersProps> = ({ onFilterChange }) => {
  const { filters, setFilters, locations, fetchLocations } = useEvents();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFilters = {
      ...localFilters,
      [e.target.name]: e.target.value,
    };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setFilters(localFilters);
    onFilterChange();
  };

  const handleClearFilters = () => {
    const clearedFilters = { date: '', category: '', location: '' };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    onFilterChange();
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
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <h3>Filter Events</h3>
      </div>
      <div className="card-body">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              className="form-control"
              value={localFilters.date}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="form-control"
              value={localFilters.category}
              onChange={handleChange}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="location">Location</label>
            <select
              id="location"
              name="location"
              className="form-control"
              value={localFilters.location}
              onChange={handleChange}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location.id} value={location.name}>
                  {location.name} - {location.city}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-primary"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};