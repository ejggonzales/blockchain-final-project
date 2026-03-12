import { Link, useNavigate } from "react-router-dom";

function Navigation({ role }) {

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");
    };

    return (
        <nav className="bg-gray-900 text-white p-4 flex justify-between">

            <h1 className="font-bold text-lg">LaufTicks</h1>

            <div className="space-x-4">

                {role === "organizer" && (
                    <Link
                        to="/my-events"
                        className="hover:text-gray-300"
                    >
                        My Events
                    </Link>
                )}

                {role === "user" && (
                    <>
                        <Link
                            to="/events"
                            className="hover:text-gray-300"
                        >
                            Events
                        </Link>

                        <Link
                            to="/my-tickets"
                            className="hover:text-gray-300"
                        >
                            My Tickets
                        </Link>
                    </>
                )}

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navigation;