import React from "react";

import ProviderBookingCard from "./ProviderBookingCard";


const ProviderBookingSection = ({
  title,
  bookings,
  onAccept,
  onReject,
  onStatusUpdate,
}) => {

  // ==========================================
  // NO BOOKINGS
  // ==========================================

  if (!bookings || bookings.length === 0) {
    return null;
  }


  return (

    <section className="provider-booking-section">

      {/* SECTION HEADER */}

      <div className="provider-section-header">

        <h2>
          {title}
        </h2>

        <span>
          {bookings.length}
        </span>

      </div>


      {/* BOOKING LIST */}

      <div className="provider-booking-list">

        {bookings.map((booking) => (

          <ProviderBookingCard
            key={booking._id}
            booking={booking}
            onAccept={onAccept}
            onReject={onReject}
            onStatusUpdate={onStatusUpdate}
          />

        ))}

      </div>

    </section>

  );

};


export default ProviderBookingSection;