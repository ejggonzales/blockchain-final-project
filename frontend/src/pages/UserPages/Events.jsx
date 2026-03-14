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

    const contractAddress = "0xfEa8b30718FC87208aD682C6Aefd789fD21F80dF"

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

            setSelectedEvent(prev => ({
                ...prev,
                total_tickets: updatedTickets,
            }));

            setEvents(prevEvents =>
                prevEvents.map(e =>
                    e.id === event.id ? { ...e, total_tickets: updatedTickets } : e
                )
            );

            await axios.put(`http://localhost:5000/api/events/updateTickets/${event.id}`, {
                total_tickets: updatedTickets
            });
        } catch (err) {
            console.error("Ticket purchase failed:", err);
            alert("Ticket purchase failed. Check console for details.");
        }
    };

    // based from our activities on connecting metamask account
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected! Please install MetaMask.");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
            alert(`Connected: ${accounts[0]}`);
        } catch (err) {
            console.error(err);
            alert("Failed to connect wallet");
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        alert("Wallet disconnected");
    };

    const filteredEvents = events.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navigation role="user" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Events</h1>

                <input
                    type="text"
                    placeholder="Search events..."
                    className="w-50 p-2 mb-4 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="grid grid-cols-3 gap-4">
                    {filteredEvents.map((event) => (
                        <div key={event.id} className="border p-4 rounded shadow">
                            {event.image_url && (
                                <img
                                    src={event.image_url}
                                    alt={event.title}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                            )}
                            <h2 className="text-xl font-bold">{event.title}</h2>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedEvent && (
                    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded w-96">
                            <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>

                            {selectedEvent.image_url && (
                                <img
                                    src={selectedEvent.image_url}
                                    alt={selectedEvent.title}
                                    className="w-full h-48 object-cover rounded mb-2"
                                />
                            )}

                            <p>{selectedEvent.description}</p>
                            <p className="text-sm text-gray-500">{selectedEvent.location}</p>
                            <p className="text-sm">Date: {new Date(selectedEvent.event_date).toLocaleDateString()}</p>
                            <p className="text-sm">Time: {new Date(`1970-01-01T${selectedEvent.event_time}`).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}</p>
                            <p className="font-semibold mb-2">Price: {selectedEvent.ticket_price} Wei</p>
                            <p className="mb-2">Tickets Available: {selectedEvent.total_tickets}</p>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="number"
                                    min={1}
                                    max={selectedEvent.total_tickets}
                                    value={ticketsToBuy}
                                    onChange={(e) => setTicketsToBuy(Number(e.target.value))}
                                    className="border px-2 py-1 rounded w-20"
                                />
                                {!account ? (
                                    <button
                                        onClick={connectWallet}
                                        className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
                                    >
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm text-green-600">Connected: {account}</p>
                                        <button
                                            onClick={disconnectWallet}
                                            className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={() => buyTickets(selectedEvent, ticketsToBuy)}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Buy Tickets
                                </button>
                            </div>

                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;