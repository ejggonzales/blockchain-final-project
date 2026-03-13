const {
  createEvent,
  getEventsByOrganizer,
  updateEvent: updateEventModel,
  deleteEvent: deleteEventModel
} = require("../models/eventModel");

exports.createEvent = async (req, res) => {

  try {

    const {
      title,
      description,
      location,
      event_date,
      ticket_price,
      total_tickets,
      organizer_id
    } = req.body;

    const event = {
      title,
      description,
      location,
      event_date,
      ticket_price,
      total_tickets,
      organizer_id
    };

    const newEvent = await createEvent(event);

    res.status(201).json(newEvent);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

exports.getMyEvents = async (req, res) => {
  try {
    const { organizer_id } = req.params;
    const events = await getEventsByOrganizer(organizer_id);

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = req.body;
    const result = await updateEventModel(id, updatedEvent);
    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteEventModel(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {

    res.status(500).json({ error: error.message });
  }
};