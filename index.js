import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { geocodeLocation } from './geoCoding.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/geocode', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const result = await geocodeLocation(address);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Geocoding failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
