const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Health check route
app.get("/", (req, res) => {
  res.send("🟢 Booking Push Server is Live!");
});

// Main route to fetch from eGlobe & push to PMS
app.get("/push-booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    // 🔄 Step 1: Fetch booking from eGlobe API
    const eGlobeUrl = `https://eglobe-solutions.com/api/bookings/${bookingId}`; // Replace with actual eGlobe API endpoint
    const eGlobeHeaders = {
      "Authorization": "Bearer YOUR_EGLOBE_TOKEN", // Replace with actual token if required
    };

    console.log("📥 Fetching booking from eGlobe...");
    const fetchResponse = await axios.get(eGlobeUrl, { headers: eGlobeHeaders });
    const bookingData = fetchResponse.data;

    if (!bookingData || Object.keys(bookingData).length === 0) {
      return res.status(404).json({ error: "Booking not found in eGlobe." });
    }

    // 🧹 Step 2: Clean null/empty values
    const cleanedData = Object.fromEntries(
      Object.entries(bookingData).filter(([_, v]) => v !== null && v !== undefined && v !== "")
    );

    // 🚀 Step 3: Push to PMS
    const pmsUrl = "https://analysishms.com/eglobetohms/vAKdYUDIX6q4Q3jkw6Cq/booking";
    const pmsHeaders = {
      "Authorization": "Bearer POKDF34FGV",
      "Providercode": "pYDcVbgviAOyXjaXsarT",
    };

    console.log("📡 Posting booking to PMS...");
    const pushResponse = await axios.post(pmsUrl, cleanedData, {
      headers: pmsHeaders
    });

    res.json({
      message: "✅ Booking pushed successfully to PMS",
      response: pushResponse.data
    });
  } catch (error) {
    console.error("❌ Error occurred:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to push booking",
      details: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
