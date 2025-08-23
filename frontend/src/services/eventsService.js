import axios from 'axios';
import API_BASE_URL from '../api/config';

// Helper function to fix poster URLs
const fixPosterUrl = (posterPath) => {
  if (!posterPath || posterPath === 'null' || posterPath === '') return null;
  
  // Remove extra spaces and fix the path
  let cleanPath = posterPath.replace(/\s+/g, '');
  
  // Fix the artist ID from 3_Thando_9144 to 3_Thando_8146
  cleanPath = cleanPath.replace('/artists/3_Thando_9144/', '/artists/3_Thando_8146/');
  
  // Handle different path formats
  if (cleanPath.startsWith('/artists/') && cleanPath.includes('/events/')) {
    // Path is already in the correct format
    return cleanPath;
  } else if (cleanPath.includes('/artists/events/events/')) {
    // Fix duplicate events in path
    cleanPath = cleanPath.replace('/artists/events/events/', '/artists/3_Thando_8146/events/');
    return cleanPath;
  } else if (cleanPath.includes('/events/events/')) {
    // Fix duplicate events in path (without artists prefix)
    cleanPath = cleanPath.replace('/events/events/', '/artists/3_Thando_8146/events/');
    return cleanPath;
  } else if (cleanPath.includes('/events/event_poster/')) {
    // Handle legacy format - extract event folder from path if possible
    const pathParts = cleanPath.split('/');
    const eventsIndex = pathParts.indexOf('events');
    if (eventsIndex !== -1 && pathParts[eventsIndex + 1]) {
      const eventFolder = pathParts[eventsIndex + 1];
      cleanPath = `/artists/3_Thando_8146/events/${eventFolder}/event_poster/${pathParts[pathParts.length - 1]}`;
    } else {
      // Fallback to hardcoded path
      cleanPath = cleanPath.replace('/events/event_poster/', '/events/5_freya_ball/event_poster/');
    }
  }
  
  // Ensure path starts with forward slash
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  return cleanPath;
};

// Helper function to check if event is upcoming (today or later)
const isUpcoming = (eventDate) => {
  if (!eventDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of today
  const eventDateTime = new Date(eventDate);
  eventDateTime.setHours(0, 0, 0, 0); // Set to start of event day
  
  return eventDateTime >= today;
};

// Fetch all events from the API
export const fetchAllEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/events`);
    
    // Transform the data to match the expected format
    const transformedEvents = response.data.map(event => ({
      id: event.id,
      name: event.name || event.event_name,
      description: event.description,
      date: event.date || event.event_date,
      time: event.time,
      category: event.category || 'concert', // Default category
      price: event.price || event.ticket_price || 0,
      poster: fixPosterUrl(event.poster), // Fix poster URL
      venue: event.venue || { name: event.venue_name || 'TBD' },
      venue_id: event.venue_id,
      capacity: event.capacity,
      status: event.status || 'active',
      rating: Math.floor(Math.random() * 2) + 4, // Random rating for demo
      attendees: Math.floor(Math.random() * 500) + 50 // Random attendees for demo
    }));
    
    return transformedEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

// Get upcoming events only (for home page)
export const fetchUpcomingEvents = async (limit = 10) => {
  try {
    const allEvents = await fetchAllEvents();
    const upcomingEvents = allEvents
      .filter(event => isUpcoming(event.date))
      .slice(0, limit);
    
    return upcomingEvents;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

// Get filtered events (for events page)
export const fetchFilteredEvents = async (filters = {}) => {
  try {
    const allEvents = await fetchAllEvents();
    
    let filteredEvents = allEvents;
    
    // Apply search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        (event.venue?.name || '').toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === filters.category);
    }
    
    // Apply date filter
    if (!filters.showPastEvents) {
      filteredEvents = filteredEvents.filter(event => isUpcoming(event.date));
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredEvents.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(a.date) - new Date(b.date);
          case 'price':
            return (a.price || 0) - (b.price || 0);
          case 'name':
            return a.name.localeCompare(b.name);
          case 'popularity':
            return (b.attendees || 0) - (a.attendees || 0);
          default:
            return new Date(a.date) - new Date(b.date);
        }
      });
    }
    
    return filteredEvents;
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    throw error;
  }
};

export { isUpcoming, fixPosterUrl };
