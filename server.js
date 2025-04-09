// server.js

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Constants
const PMS_URL =
  "https://analysishms.com/eglobetohms/vAKdYUDIX6q4Q3jkw6Cq/booking";
const HEADERS = {
  Authorization: "Bearer POKDF34FGV",
  ProviderCode: "pYDcVbgviAOyXjaXsarT",
  "Content-Type": "application/json",
};

app.get("/push-booking/:bookingId", async (req, res) => {
  const bookingId = req.params.bookingId;

  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required." });
  }

  try {
    // Simulate booking data
    const bookingData = {
      bookingId: bookingId,
      guestName: "John Doe",
      checkInDate: "2025-04-10",
      checkOutDate: "2025-04-12",
      roomType: "Deluxe",
      totalAmount: 2500,
      email: "john@example.com",
      phone: "9876543210",
    };

    // Remove empty or undefined fields
    const cleanedData = Object.fromEntries(
      Object.entries(bookingData).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ""
      )
    );

    // Send to PMS
    const response = await axios.post(PMS_URL, cleanedData, {
      headers: HEADERS,
    });

    res.status(200).json({
      message: "✅ Booking pushed to PMS successfully.",
      sentData: cleanedData,
      pmsResponse: response.data,
    });
  } catch (err) {
    res.status(500).json({
      error: "❌ Error while pushing booking to PMS.",
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
