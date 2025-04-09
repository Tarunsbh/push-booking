const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("🟢 Booking Push Server is Live!");
});

app.get("/push-booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required." });
  }

  try {
    // Simulate fetched booking data
    const bookingData = {
      bookingId,
      guestName: "John Doe",
      checkInDate: "2025-04-10",
      checkOutDate: "2025-04-12",
      roomType: "Deluxe",
      totalAmount: 2500,
      email: "john@example.com",
      phone: "9876543210"
    };

    // Clean empty values
    const cleanedData = Object.fromEntries(
      Object.entries(bookingData).filter(([_, v]) => v != null && v !== "")
    );

    const postUrl = "https://analysishms.com/eglobetohms/vAKdYUDIX6q4Q3jkw6Cq/booking";

    const headers = {
      "Authorization": "Bearer POKDF34FGV",
      "ProviderCode": "pYDcVbgviAOyXjaXsarT",
      "Content-Type": "application/json"
    };

    const response = await axios.post(postUrl, cleanedData, { headers });

    res.json({
      message: "Booking pushed successfully ✅",
      pmsResponse: response.data
    });
  } catch (error) {
    console.error("❌ Error pushing booking:", error.message);
    res.status(500).json({ error: "Failed to push booking", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
