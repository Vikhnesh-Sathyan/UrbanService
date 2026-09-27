import React from "react";

import { FaTools } from "react-icons/fa";


const ServiceUsage = ({ data }) => {

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (data.length === 0) {
    return (
      <div className="user-analytics-panel">

        <div className="user-analytics-panel-header">

          <div>
            <h2>Service Usage</h2>

            <p>
              See which services you book most often.
            </p>
          </div>

        </div>


        <div className="user-analytics-empty">

          <div className="user-analytics-empty-icon">
            <FaTools />
          </div>

          <h3>No service usage data yet</h3>

          <p>
            Your most frequently booked services will appear here.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // FIND MAXIMUM BOOKINGS
  // =====================================================

  const maxBookings = Math.max(
    ...data.map((service) => service.bookingCount)
  );


  // =====================================================
  // SERVICE USAGE
  // =====================================================

  return (
    <div className="user-analytics-panel">

      <div className="user-analytics-panel-header">

        <div>

          <h2>Service Usage</h2>

          <p>
            See which services you book most often.
          </p>

        </div>

      </div>


      <div className="user-service-usage-list">

        {data.map((service) => {

          const percentage =
            maxBookings > 0
              ? (service.bookingCount / maxBookings) * 100
              : 0;

          return (
            <div
              className="user-service-usage-item"
              key={service._id}
            >

              <div className="user-service-usage-info">

                <div className="user-service-usage-name">

                  <span className="user-service-usage-icon">
                    <FaTools />
                  </span>

                  <span>
                    {service.serviceName}
                  </span>

                </div>


                <strong>
                  {service.bookingCount}
                </strong>

              </div>


              <div className="user-service-usage-bar">

                <div
                  className="user-service-usage-bar-fill"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};


export default ServiceUsage;