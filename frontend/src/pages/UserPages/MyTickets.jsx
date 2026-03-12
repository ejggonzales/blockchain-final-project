import React from 'react'
import Navigation from "../../components/Navigation";


const MyTickets = () => {
  const role = localStorage.getItem("role");

    return (
        <div>
            <Navigation role={role} />

            <div className="p-6">
                <h1 className="text-2xl font-bold">My Tickets</h1>
                <p>This is the page where users will be able to see which events they bought tickets from and how many tickets they bought.</p>
            </div>
        </div>
    )
}

export default MyTickets