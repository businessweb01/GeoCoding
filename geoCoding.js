import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.LOCATIONIQ_TOKEN;

export async function geocodeLocation(address) {
  const url = `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(address)}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      throw new Error(`LocationIQ API Error: ${data.error}`);
    }
    
    if (!data || data.length === 0) {
      throw new Error('No results found');
    }
    
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      display_name: data[0].display_name
    };
  } catch (error) {
    console.error('Geocoding failed:', error);
    throw error;
  }
}

export async function autocompleteLocation(query) {
  const url = `https://us1.locationiq.com/v1/autocomplete.php?key=${token}&q=${encodeURIComponent(query)}&format=json`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Check for API errors first
    if (data.error) {
      console.error('LocationIQ autocomplete API returned:', data);
      throw new Error(`LocationIQ API Error: ${data.error}`);
    }
    
    if (!Array.isArray(data)) {
      console.error('LocationIQ autocomplete API returned:', data);
      throw new Error('Autocomplete response is not an array');
    }
    
    return data;
  } catch (error) {
    console.error('Autocomplete failed:', error);
    throw error;
  }
}

// Enhanced autocomplete with retry logic for rate limiting
export async function autocompleteLocationWithRetry(query, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await autocompleteLocation(query);
    } catch (error) {
      if (error.message.includes('Rate Limited') && attempt < maxRetries) {
        const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error; // Re-throw if not rate limited or max retries reached
    }
  }
}

export async function getRoute(start, end) {
  const url = `https://us1.locationiq.com/v1/directions/driving/${start.lng},${start.lat};${end.lng},${end.lat}?key=${token}&overview=full&geometries=geojson`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Check for API errors
    if (data.error) {
      throw new Error(`LocationIQ Routing Error: ${data.error}`);
    }
    
    if (!data.routes || !data.routes[0] || !data.routes[0].geometry) {
      throw new Error('Invalid route response format');
    }
    
    const coordinates = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng
    }));
    
    return coordinates;
  } catch (error) {
    console.error('Route fetch failed:', error);
    throw error;
  }
}

// Utility function to check API quota/usage
export async function checkLocationIQStatus() {
  const url = `https://us1.locationiq.com/v1/balance.php?key=${token}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('LocationIQ API Status:', data);
    return data;
  } catch (error) {
    console.error('Failed to check LocationIQ status:', error);
    return null;
  }
}
