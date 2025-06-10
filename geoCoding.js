import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function geocodeLocation(address) {
  const token = process.env.LOCATIONIQ_TOKEN;
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
