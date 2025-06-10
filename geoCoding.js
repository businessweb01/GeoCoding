import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.LOCATIONIQ_TOKEN;

export async function geocodeLocation(address) {
  const url = `https://us1.locationiq.com/v1/search?key=${token}&q=${encodeURIComponent(address)}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

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
  const url = `https://us1.locationiq.com/v1/autocomplete?key=${token}&q=${encodeURIComponent(query)}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Autocomplete response is not an array');
    }

    return data; // return full suggestion list
  } catch (error) {
    console.error('Autocomplete failed:', error);
    throw error;
  }
}
export async function getRoute(start, end) {
  const token = process.env.LOCATIONIQ_TOKEN;
  const url = `https://us1.locationiq.com/v1/directions/driving/${start.lng},${start.lat};${end.lng},${end.lat}?key=${token}&overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();

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

