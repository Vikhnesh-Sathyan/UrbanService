import React from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


// =====================================================
// BOOKING ACTIVITY CHART
// Displays the provider's booking count by date.
// =====================================================

const BookingActivityChart = ({ data }) => {

  // Convert backend data into chart-friendly data.
  const chartData = data.map((item) => ({
    date: item._id,
    bookings: item.count,
  }));


  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (chartData.length === 0) {
    return (
      <div className="provider-analytics-panel">

        <div className="provider-analytics-panel-header">
          <div>
            <h2>Booking Activity</h2>
            <p>
              Your booking activity over time
            </p>
          </div>
        </div>

        <div className="provider-analytics-empty">

          <div className="provider-analytics-empty-icon">
            <LineChart />
          </div>

          <h3>
            No booking activity yet
          </h3>

          <p>
            Booking activity will appear here once customers book your services.
          </p>

        </div>

      </div>
    );
  }


  // =====================================================
  // CHART
  // =====================================================

  return (
    <div className="provider-analytics-panel">

      <div className="provider-analytics-panel-header">

        <div>
          <h2>
            Booking Activity
          </h2>

          <p>
            Your booking activity over time
          </p>
        </div>

      </div>


      <div className="provider-booking-activity-chart">

        <ResponsiveContainer width="100%" height={320}>

          <LineChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
            />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#111827"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default BookingActivityChart;