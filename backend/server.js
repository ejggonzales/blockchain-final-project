// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

// Example API route for events (mock data)
app.get("/api/events", (req, res) => {
  const events = [
    { id: 1, name: "Blockchain Concert", date: "2026-04-01" },
    { id: 2, name: "NFT Art Expo", date: "2026-04-15" },
  ];
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});