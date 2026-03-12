const { createEvent, getEventsByOrganizer } = require("../models/eventModel");

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