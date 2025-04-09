const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());

const AUTH_TOKEN = "Bearer POKDF34FGV";
const PROVIDER_CODE = "pYDcVbgviAOyXjaXsarT";

app.get("/push-booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  console.log("📥 Booking ID received:", bookingId);

  const fetchUrl = `https://www.eglobe-solutions.com/webapichannelmanager/bookings_v2/vAKdYUDIX6q4Q3jkw6Cq/`;

  try {
    // 1. Fetch booking from eGlobe
    const bookingRes = await fetch(fetchUrl, {
      headers: {
        Authorization: AUTH_TOKEN,
        ProviderCode: PROVIDER_CODE,
      },
    });

    if (!bookingRes.ok) {
      console.error("❌ Error fetching booking:", bookingRes.statusText);
      return res.status(500).json({ error: "Failed to fetch booking data" });
    }

    const bookingData = await bookingRes.json();
    console.log("✅ Booking Data fetched");

    const pushUrl = `https://analysishms.com/eglobetohms/vAKdYUDIX6q4Q3jkw6Cq/booking`;

    // 2. Push to HMS
    const hmsRes = await fetch(pushUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData.Result),
    });

    const hmsResponseData = await hmsRes.text();
    console.log("✅ Pushed to HMS");

    res.status(200).send({
      message: "Booking pushed successfully",
      hmsResponse: hmsResponseData,
    });

  } catch (error) {
    console.error("❌ Server error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server started on port", PORT);
});
