import React from "react";
import Navigation from "../../components/Navigation";

const MyTickets = () => {
  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen bg-[#C7D8D2]">
      
      <Navigation role={role} />

      <div className="pt-32 px-6">
        <h1 className="text-2xl font-bold mb-2">My Tickets</h1>

        <p className="text-gray-700">
          This is the page where users will be able to see which events they bought tickets from and how many tickets they bought.
        </p>
      </div>

    </div>
  );
};

export default MyTickets;