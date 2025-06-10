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
  try {
    const { q } = req.query;
    const suggestions = await autocompleteLocation(q);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
