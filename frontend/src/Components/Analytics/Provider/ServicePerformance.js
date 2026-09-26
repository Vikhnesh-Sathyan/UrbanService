import React from "react";

import { FaBriefcase } from "react-icons/fa";

const ServicePerformance = ({ data }) => {
  return (
    <div className="provider-analytics-panel">
      <div className="provider-analytics-panel-header">
        <div>
          <h2>Service Performance</h2>
          <p>Compare the performance of your services.</p>
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
        <div className="provider-service-performance-table-wrapper">
          <table className="provider-service-performance-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Total Bookings</th>
                <th>Completed</th>
                <th>Completion</th>
              </tr>
            </thead>

            <tbody>
              {data.map((service) => (
                <tr key={service._id}>
                  <td>
                    <div className="provider-service-name">
                      <span className="provider-service-table-icon">
                        <FaBriefcase />
                      </span>

                      <span>{service.serviceName}</span>
                    </div>
                  </td>

                  <td>
                    <strong>{service.totalBookings}</strong>
                  </td>

                  <td>
                    <strong>{service.completedBookings}</strong>
                  </td>

                  <td>
                    <div className="provider-service-completion">
                      <span className="provider-service-completion-value">
                        {service.completedBookings} / {service.totalBookings}
                      </span>

                      <div className="provider-service-progress">
                        <div
                          className="provider-service-progress-bar"
                          style={{
                            width: `${service.completionRate}%`,
                          }}
                        />
                      </div>

                      <span className="provider-service-completion-rate">
                        {service.completionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ServicePerformance;