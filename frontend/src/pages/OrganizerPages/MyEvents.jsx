import React from "react";
import Navigation from "../../components/Navigation";

const MyEvents = () => {

  const role = localStorage.getItem("role");

  return (
    <div>

      <Navigation role={role} />

      <div className="p-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <p>This is the organizer dashboard where events will be managed.</p>
      </div>

    </div>
  );
};

export default MyEvents;