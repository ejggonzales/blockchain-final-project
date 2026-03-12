import React from 'react'
import Navigation from "../../components/Navigation";


const Events = () => {

    const role = localStorage.getItem("role");

    return (
        <div>
            <Navigation role={role} />

            <div className="p-6">
                <h1 className="text-2xl font-bold">Events</h1>
                <p>This is the page where events will be listed for users.</p>
            </div>
        </div>
    )
}

export default Events