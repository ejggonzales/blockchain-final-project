const express = require("express");
const router = express.Router();

const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

router.post("/create", createEvent);
router.get("/organizer/:organizer_id", getMyEvents);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

module.exports = router;