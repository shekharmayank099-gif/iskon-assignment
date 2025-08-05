export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
  location_id: number;
  location_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  registrations_count?: number;
}

export interface Registration {
  id: number;
  user_id: number;
  event_id: number;
  registration_date: string;
  status: 'registered' | 'cancelled';
  title?: string;
  description?: string;
  date?: string;
  category?: string;
  location_name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface EventsContextType {
  events: Event[];
  currentEvent: Event | null;
  locations: Location[];
  registrations: Registration[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    date: string;
    category: string;
    location: string;
  };
  isLoading: boolean;
  error: string | null;
  fetchEvents: (page?: number, filters?: any) => Promise<void>;
  fetchEvent: (id: number) => Promise<void>;
  createEvent: (eventData: Partial<Event>) => Promise<void>;
  updateEvent: (id: number, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: number) => Promise<void>;
  registerForEvent: (eventId: number) => Promise<void>;
  cancelRegistration: (eventId: number) => Promise<void>;
  fetchRegistrations: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  setFilters: (filters: any) => void;
  clearError: () => void;
}