import express from 'express';
import cors from 'cors';
import { geocodeLocation, autocompleteLocation, getRoute } from './geoCoding.js'; // Added getRoute import

const app = express();
app.use(cors());

app.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    const location = await geocodeLocation(q);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/autocomplete', async (req, res) => {
  const { q } = req.query;
  try {
    const results = await autocompleteLocation(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Autocomplete failed' });
  }
});

// Move route endpoint BEFORE app.listen()
app.get('/route', async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;
  try {
    const route = await getRoute(
      { lat: parseFloat(startLat), lng: parseFloat(startLng) },
      { lat: parseFloat(endLat), lng: parseFloat(endLng) }
    );
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
