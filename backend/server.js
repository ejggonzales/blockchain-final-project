const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require("./routes/eventRoutes");

const app = express();

// THESE ARE THE ONES THAT ARE ONLY ALLOWED
const allowedOrigins = [
  "http://localhost:5173",         
  "https://laufticks.netlify.app"   
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true, 
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});