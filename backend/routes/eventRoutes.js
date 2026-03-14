const express = require("express");
const router = express.Router();
const supabase = require("../configs/supabaseClient");

const {
  createEvent,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getAllEvents
} = require("../controllers/eventController");

router.post("/create", createEvent);
router.get("/organizer/:organizer_id", getMyEvents);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);
router.get("/", getAllEvents); 

router.put("/updateTickets/:id", async (req, res) => {
  const { id } = req.params;
  const { total_tickets } = req.body;

  console.log(`Updating tickets for event id: ${id}, total_tickets: ${total_tickets}`);

  try {
    const { error } = await supabase
      .from("events")
      .update({ total_tickets })
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error("Error updating tickets:", err);
    res.status(500).json({ success: false, error: "Failed to update tickets" });
  }
});

module.exports = router;