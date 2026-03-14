import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import supabaseStorage from "../../supabaseStorage";
import { ethers } from "ethers";
import EventTicketABI from "../../EventTicketABI.json";

const contractAddress = "0xfEa8b30718FC87208aD682C6Aefd789fD21F80dF";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [event_date, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [ticket_price, setTicketPrice] = useState("");
  const [total_tickets, setTotalTickets] = useState("");
  const [image, setImage] = useState(null);

  const organizerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/events/organizer/${organizerId}`
    );
    setEvents(res.data);
  };

  const openCreateModal = () => {
    setEditingEventId(null);
    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate("");
    setEventTime("");
    setTicketPrice("");
    setTotalTickets("");
    setImage(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
    setEventDate(event.event_date.split("T")[0]);
    setEventTime(event.event_time);
    setTicketPrice(event.ticket_price);
    setTotalTickets(event.total_tickets);
    setEditingEventId(event.id);
    setShowModal(true);
  };

  const createEventOnBlockchain = async (totalTickets) => {
    if (!window.ethereum) throw new Error("MetaMask not detected");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, EventTicketABI, signer);

      const tx = await contract.createEvent(totalTickets);
      await tx.wait();

      const nextEventId = await contract.nextEventId();
      const blockchain_event_id = (BigInt(nextEventId) - 1n).toString();

      return blockchain_event_id;
    } catch (err) {
      console.error("Blockchain event creation failed:", err);
      throw err;
    }
  };

  const createEvent = async () => {
    if (!title || !event_date || !total_tickets) {
      alert("Please fill in all required fields");
      return;
    }

    const formattedDate = event_date + "T00:00:00";

    try {
      const blockchain_event_id = await createEventOnBlockchain(parseInt(total_tickets));

      let imageUrl = null;
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabaseStorage.storage
          .from("event-images")
          .upload(fileName, image);

        if (error) {
          console.error(error);
          alert("Image upload failed");
          return;
        }

        imageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/event-images/${fileName}`;
      }

    await axios.post("http://localhost:5000/api/events/create", {
      title,
      description,
      location,
      event_date: formattedDate,
      event_time: eventTime,
      ticket_price: parseFloat(ticket_price) || 0,
      total_tickets: parseInt(total_tickets) || 0,
      image_url: imageUrl,
      organizer_id: organizerId,
      blockchain_event_id
    });

    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate("");
    setEventTime("");
    setTicketPrice("");
    setTotalTickets("");

    setShowModal(false);
    fetchEvents();
  } catch (err) {
      console.error("Error creating event:", err.response?.data || err.message);
      alert("Failed to create event. Check console for details.");
    }
  };

  const updateEvent = async () => {
    const formattedDate = event_date + "T00:00:00";

    await axios.put(
      `http://localhost:5000/api/events/update/${editingEventId}`,
      {
        title,
        description,
        location,
        event_date: formattedDate,
        event_time: eventTime,
        ticket_price: parseFloat(ticket_price) || 0,
        total_tickets: parseInt(total_tickets) || 0,
      }
    );

    setShowModal(false);
    setEditingEventId(null);
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await axios.delete(`http://localhost:5000/api/events/delete/${id}`);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-[#C7D8D2]">
      {/* Floating Navbar */}
      <Navigation role="organizer" />

      {/* Main Content */}
      <div className="pt-32 max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">My Events</h1>
          <button
            onClick={openCreateModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg shadow-md transition cursor-pointer"
          >
            + Create Event
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
              style={{ border: "1px solid #f0f0f0" }}
            >

              <div className="relative bg-gray-100" style={{ height: "220px" }}>
                {event.image_url ? (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <div
                  className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#111827" }}
                >
                  {event.total_tickets} TICKETS
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">
                  {event.title}
                </h2>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {event.ticket_price} Wei
                  </span>

                  <div className="flex items-center gap-1 ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded"
                      style={{ backgroundColor: "#FDE68A", color: "#92400E" }}
                    >
                      {new Date(event.event_date).toLocaleDateString()}
                    </span>
                  </div>

                </div>

                <div className="space-y-1.5 text-gray-600 text-sm mb-5">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.event_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>{event.total_tickets} total tickets</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mt-1">
                    {event.description}
                  </p>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => openEditModal(event)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer"
                    style={{ backgroundColor: "#111827", color: "#fff" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1f2937"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#111827"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Event
                  </button>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-xl border-2 transition cursor-pointer"
                    style={{ borderColor: "#EF4444", color: "#EF4444" }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#EF4444"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#EF4444"; }}
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingEventId ? "Edit Event" : "Create Event"}
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                editingEventId ? updateEvent() : createEvent();
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={event_date}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ticket Price (Wei)
                  </label>
                  <input
                    type="number"
                    value={ticket_price}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Tickets
                  </label>
                  <input
                    type="number"
                    value={total_tickets}
                    onChange={(e) => setTotalTickets(e.target.value)}
                    min={0}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEventId(null);
                    setImage(null);
                  }}
                  className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer"
                >
                  {editingEventId ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;