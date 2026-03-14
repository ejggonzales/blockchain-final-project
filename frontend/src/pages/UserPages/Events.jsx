import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import EventTicketABI from "../../EventTicketABI.json";
import { ethers } from "ethers";

const Events = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [ticketsToBuy, setTicketsToBuy] = useState(1);
    const [account, setAccount] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const contractAddress = "0xfEa8b30718FC87208aD682C6Aefd789fD21F80dF";

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/events");
            setEvents(res.data);
        } catch (err) {
            console.error("Error fetching events:", err.response?.data || err.message);
        }
    };

    const getTicketsOnChain = async (blockchainEventId) => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, EventTicketABI, provider);
        const ticketsAvailable = await contract.eventTicketsAvailable(BigInt(blockchainEventId));
        return Number(ticketsAvailable);
    };

    const buyTickets = async (event, ticketsToBuy) => {
        if (!account || !window.ethereum) return alert("Connect wallet first");
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, EventTicketABI, signer);
            const blockchainEventIdBN = BigInt(event.blockchain_event_id);
            const pricePerTicketBN = ethers.parseUnits(event.ticket_price.toString(), "wei");
            const quantity = Number(ticketsToBuy);
            const tx = await contract.buyTicket(blockchainEventIdBN, quantity, pricePerTicketBN, {
                value: pricePerTicketBN * BigInt(quantity),
            });
            await tx.wait();
            alert(`Successfully bought ${quantity} ticket(s) for "${event.title}"`);
            const updatedTickets = await getTicketsOnChain(event.blockchain_event_id);
            setSelectedEvent(prev => ({ ...prev, total_tickets: updatedTickets }));
            setEvents(prevEvents =>
                prevEvents.map(e => e.id === event.id ? { ...e, total_tickets: updatedTickets } : e)
            );
            await axios.put(`http://localhost:5000/api/events/updateTickets/${event.id}`, {
                total_tickets: updatedTickets
            });
        } catch (err) {
            console.error("Ticket purchase failed:", err);
            alert("Ticket purchase failed. Check console for details.");
        }
    };

    const connectWallet = async () => {
        if (!window.ethereum) return alert("MetaMask not detected! Please install MetaMask.");
        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
        } catch (err) {
            console.error(err);
            alert("Failed to connect wallet");
        }
    };

    const disconnectWallet = () => setAccount(null);

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#C7D8D2]">
            <Navigation role="user" />

            {/* Main Content */}
            <div className="pt-32 max-w-7xl mx-auto p-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-semibold text-gray-800">Events</h1>

                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search events..."
                            className="pl-9 pr-4 py-2 rounded-lg border border-white/60 bg-white/50 backdrop-blur-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a7a72]/40 transition text-sm w-56"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <div
                            key={event.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
                            style={{ border: "1px solid #f0f0f0" }}
                        >

                            <div className="relative bg-gray-100" style={{ height: "220px" }}>
                                {event.image_url ? (
                                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#111827" }}>
                                    {event.total_tickets} TICKETS
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{event.title}</h2>

                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl font-bold text-gray-900">{event.ticket_price} Wei</span>
                                    <div className="flex items-center gap-1 ml-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#FDE68A", color: "#92400E" }}>
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
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition"
                                        style={{ backgroundColor: "#111827", color: "#fff" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#1f2937"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#111827"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                        View & Buy Tickets
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

                        {selectedEvent.image_url && (
                            <div className="relative h-56 w-full">
                                <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover rounded-t-2xl" />
                                <div className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: "#111827" }}>
                                    {selectedEvent.total_tickets} TICKETS LEFT
                                </div>
                            </div>
                        )}

                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedEvent.title}</h2>

                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl font-bold text-gray-900">{selectedEvent.ticket_price} Wei</span>
                                <div className="flex items-center gap-1 ml-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#FDE68A", color: "#92400E" }}>
                                        {new Date(selectedEvent.event_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5 text-gray-600 text-sm mb-4">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{selectedEvent.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{new Date(`1970-01-01T${selectedEvent.event_time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })}</span>
                                </div>
                            </div>

                            <p className="text-gray-500 text-sm leading-relaxed mb-5">{selectedEvent.description}</p>

                            <div className="border-t border-gray-100 pt-4">

                                {account ? (
                                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs text-emerald-700 font-medium truncate max-w-[200px]">{account}</span>
                                        </div>
                                        <button
                                            onClick={disconnectWallet}
                                            className="text-xs text-red-500 hover:text-red-600 font-semibold transition"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={connectWallet}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold mb-4 transition"
                                        style={{ backgroundColor: "#4a7a72", color: "#fff" }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3d6b63"}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "#4a7a72"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Connect MetaMask Wallet
                                    </button>
                                )}

                                <div className="flex gap-3">
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setTicketsToBuy(t => Math.max(1, t - 1))}
                                            className="px-3 py-2.5 text-gray-500 hover:bg-gray-100 transition text-lg font-bold"
                                        >−</button>
                                        <span className="px-4 py-2.5 text-sm font-semibold text-gray-800 min-w-[40px] text-center">{ticketsToBuy}</span>
                                        <button
                                            onClick={() => setTicketsToBuy(t => Math.min(selectedEvent.total_tickets, t + 1))}
                                            className="px-3 py-2.5 text-gray-500 hover:bg-gray-100 transition text-lg font-bold"
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => buyTickets(selectedEvent, ticketsToBuy)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                        </svg>
                                        Buy {ticketsToBuy} Ticket{ticketsToBuy > 1 ? "s" : ""}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;