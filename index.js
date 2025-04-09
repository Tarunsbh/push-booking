const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// ✅ Serve static files from /public folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Set Content Security Policy headers to allow fonts
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// ✅ Environment configs (fallback if .env not used)
const BASE_URL = 'https://www.eglobe-solutions.com/webapichannelmanager/bookings_v2/vAKdYUDIX6q4Q3jkw6Cq';
const PUSH_URL = 'https://analysishms.com/eglobetohms/vAKdYUDIX6q4Q3jkw6Cq/booking';
const AUTH_TOKEN = process.env.AUTH_TOKEN || 'POKDF34FGV';
const PROVIDER_CODE = process.env.PROVIDER_CODE || 'pYDcVbgviAOyXjaXsarT';

// ✅ Booking push route
app.post('/push-booking', async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    return res.status(400).json({ error: 'Missing bookingId' });
  }

  try {
    // 1. Fetch booking details from eGlobe API
    const fetchRes = await axios.get(`${BASE_URL}/${bookingId}`);
    const data = fetchRes.data;

    if (data.IsError) {
      return res.status(500).json({ error: 'eGlobe API Error', message: data.Message });
    }

    // 2. Push to HMS API
    const result = data.Result;

    const pushRes = await axios.post(PUSH_URL, result, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
        'Providercode': PROVIDER_CODE,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      message: 'Booking pushed successfully',
      response: pushRes.data
    });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
