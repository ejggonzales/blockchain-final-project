import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [event_date, setEventDate] = useState("");
  const [ticket_price, setTicketPrice] = useState("");
  const [total_tickets, setTotalTickets] = useState("");

  const organizerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/events/organizer/${organizerId}`
      );
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err.response?.data || err.message);
    }
  };

  const createEvent = async () => {
    if (!title || !event_date) {
      alert("Please fill in at least title and date.");
      return;
    }

    // Format event_date for Postgres timestamp
    const formattedDate = event_date + "T00:00:00";

    try {
      await axios.post("http://localhost:5000/api/events/create", {
        title,
        description,
        location,
        event_date: formattedDate,
        ticket_price: parseFloat(ticket_price) || 0,
        total_tickets: parseInt(total_tickets) || 0,
        organizer_id: organizerId,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setEventDate("");
      setTicketPrice("");
      setTotalTickets("");

      setShowModal(false);

      fetchEvents();
    } catch (err) {
      console.error("Error creating event:", err.response?.data || err.message);
      alert("Failed to create event. Check console for details.");
    }
  };

  return (
    <div>
      <Navigation role="organizer" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Events</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
        >
          Create New Event
        </button>

        <div className="grid grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p>{event.description}</p>
              <p className="text-sm text-gray-500">{event.location}</p>
              <p className="text-sm">
                {new Date(event.event_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Create Event</h2>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                placeholder="Event Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="date"
                placeholder="Event Date"
                value={event_date}
                onChange={(e) => setEventDate(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Ticket Price (ETH)"
                value={ticket_price}
                onChange={(e) => setTicketPrice(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="number"
                placeholder="Total Tickets"
                value={total_tickets}
                onChange={(e) => setTotalTickets(e.target.value)}
                className="border px-2 py-1 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={createEvent}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;