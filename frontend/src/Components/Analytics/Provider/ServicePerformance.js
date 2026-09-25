import React from "react";

import { FaBriefcase, FaCheckCircle, FaChartLine } from "react-icons/fa";

const ServicePerformance = ({ data }) => {
  return (
    <div className="provider-analytics-panel">
      <div className="provider-analytics-panel-header">
        <div>
          <h2>Service Performance</h2>
          <p>Track the performance of each service you offer.</p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="provider-analytics-empty">
          <div className="provider-analytics-empty-icon">
            <FaBriefcase />
          </div>

          <h3>No service performance data yet</h3>

          <p>
            Service performance will appear here once customers
            book your services.
          </p>
        </div>
      ) : (
        <div className="provider-service-performance-grid">
          {data.map((service) => (
            <div
              className="provider-service-performance-card"
              key={service._id}
            >
              <div className="provider-service-performance-header">
                <div className="provider-service-performance-icon">
                  <FaBriefcase />
                </div>

                <div>
                  <h3>{service.serviceName}</h3>
                  <p>Service performance</p>
                </div>
              </div>

              <div className="provider-service-performance-stats">
                <div>
                  <span>
                    <FaChartLine />
                  </span>

                  <strong>{service.totalBookings}</strong>

                  <small>Total Bookings</small>
                </div>

                <div>
                  <span>
                    <FaCheckCircle />
                  </span>

                  <strong>{service.completedBookings}</strong>

                  <small>Completed</small>
                </div>

                <div>
                  <span>
                    <FaChartLine />
                  </span>

                  <strong>{service.completionRate}%</strong>

                  <small>Completion Rate</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicePerformance;