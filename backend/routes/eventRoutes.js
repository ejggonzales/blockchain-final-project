const express = require("express");
const router = express.Router();

const {
  createEvent,
  getMyEvents
} = require("../controllers/eventController");

router.post("/create", createEvent);
router.get("/organizer/:organizer_id", getMyEvents);

module.exports = router;