import { Link, useNavigate } from "react-router-dom";
import logoNav from "../assets/nav-logo.png"; 

function Navigation({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 mx-auto shadow-md rounded-2xl bg-[#7a9e96]/25 backdrop-blur-md border border-white/20 px-6 py-3 flex justify-between items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-white/5 to-transparent pointer-events-none rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#4a7a72] via-[#5f9189] to-[#4a7a72] opacity-75 -z-10 rounded-2xl" />

      {/* Logo */}
      <img
        src={logoNav}
        alt="LaufTicks Logo"
        className="relative h-8 min-w-[120px] w-auto object-contain object-left"
        onClick={() => navigate("/")}
      />

      {/* Nav Links */}
      <div className="relative flex items-center gap-2">
        {role === "organizer" && (
          <NavLink to="/my-events">My Events</NavLink>
        )}

        {role === "user" && (
          <>
            <NavLink to="/events">Events</NavLink>
            <NavLink to="/my-tickets">My Tickets</NavLink>
          </>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-red-500 border border-red-400 text-white hover:bg-red-600 hover:border-red-500 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest bg-[#4a7a72] border border-[#5f9189] text-white hover:bg-[#3d6b63] hover:border-[#4a7a72] transition-all"
    >
      {children}
    </Link>
  );
}

export default Navigation;