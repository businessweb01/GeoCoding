import express from 'express';
import cors from 'cors';
import { geocodeLocation, autocompleteLocation } from './geoCoding.js'; // Adjust path if needed

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/route', async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;
  try {
    const route = await getRoute(
      { lat: startLat, lng: startLng },
      { lat: endLat, lng: endLng }
    );
    res.json(route);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});
