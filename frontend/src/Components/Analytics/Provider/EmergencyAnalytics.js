import React from "react";

import {
  FaAmbulance,
  FaCheckCircle,
  FaClock,
  FaChartLine,
} from "react-icons/fa";

const EmergencyAnalytics = ({ data }) => {
  const {
    totalEmergencyBookings = 0,
    completedEmergencyBookings = 0,
    pendingEmergencyBookings = 0,
    acceptedEmergencyBookings = 0,
    inProgressEmergencyBookings = 0,
    completionRate = 0,
  } = data || {};

  return (
    <div className="provider-analytics-panel">
      <div className="provider-analytics-panel-header">
        <div>
          <h2>Emergency Analytics</h2>
          <p>
            Track your emergency booking workload and completion performance.
          </p>
        </div>
      </div>

      {totalEmergencyBookings === 0 ? (
        <div className="provider-analytics-empty">
          <div className="provider-analytics-empty-icon">
            <FaAmbulance />
          </div>

          <h3>No emergency bookings yet</h3>

          <p>
            Emergency booking analytics will appear here when
            you receive emergency service requests.
          </p>
        </div>
      ) : (
        <>
          <div className="provider-emergency-kpi-grid">
            <div className="provider-emergency-kpi">
              <span className="provider-emergency-kpi-icon">
                <FaAmbulance />
              </span>

              <strong>{totalEmergencyBookings}</strong>

              <small>Total Emergency</small>
            </div>

            <div className="provider-emergency-kpi">
              <span className="provider-emergency-kpi-icon">
                <FaCheckCircle />
              </span>

              <strong>{completedEmergencyBookings}</strong>

              <small>Completed</small>
            </div>

            <div className="provider-emergency-kpi">
              <span className="provider-emergency-kpi-icon">
                <FaClock />
              </span>

              <strong>{pendingEmergencyBookings}</strong>

              <small>Pending</small>
            </div>

            <div className="provider-emergency-kpi">
              <span className="provider-emergency-kpi-icon">
                <FaChartLine />
              </span>

              <strong>{completionRate}%</strong>

              <small>Completion Rate</small>
            </div>
          </div>

          <div className="provider-emergency-status">
            <div>
              <span>Accepted</span>
              <strong>{acceptedEmergencyBookings}</strong>
            </div>

            <div>
              <span>In Progress</span>
              <strong>{inProgressEmergencyBookings}</strong>
            </div>

            <div>
              <span>Completed</span>
              <strong>{completedEmergencyBookings}</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmergencyAnalytics;