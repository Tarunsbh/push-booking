const express = require("express");
const axios = require("axios");
const app = express();

const PORT = process.env.PORT || 3000;

// Home route – helpful for testing if the server is live
app.get("/", (req, res) => {
  res.send("🟢 Booking Push Server is Live!");
});

app.get("/push-booking/:bookingId", async (req, res) => {
  const bookingId = req.params.bookingId;

  const fetchUrl = `https://www.eglobe-solutions.com/webapichannelmanager/bookings_v2/vAKdYUDIX6q4Q3jkw6Cq/`;

  const fetchHeaders = {
    Authorization: "Bearer POKDF34FGV",
    Providercode: "pYDcVbgviAOyXjaXsarT"
  };

  try {
    const fetchResponse = await axios.get(fetchUrl, { headers: fetchHeaders });
    const bookingData = fetchResponse.data?.Result;

    if (!bookingData) {
      return res.status(404).json({ error: "No booking data found." });
    }

    // Push to PMS
    const pushUrl = `https://analysishms.com/eglobetohms/vAKdYUDIX6q4Q3jkw6Cq/booking`;
    const pushResponse = await axios.post(pushUrl, bookingData);

    res.json({
      message: "✅ Booking fetched & pushed successfully",
      bookingId,
      pmsResponse: pushResponse.data
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
