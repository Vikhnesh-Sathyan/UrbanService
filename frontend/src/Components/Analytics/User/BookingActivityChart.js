import React from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const BookingActivityChart = ({ data }) => {

  // =====================================================
  // BOOKING STATUS ORDER
  // Keeps the chart consistent
  // =====================================================

  const statusOrder = [
    "pending",
    "accepted",
    "in_progress",
    "completed",
    "cancelled",
    "rejected",
  ];

  // =====================================================
  // CREATE CHART DATA
  // =====================================================

  const chartData = statusOrder.map((status) => {

    const matchingStatus = data.find(
      (item) => item._id === status
    );

    return {
      status: status
        .replace("_", " ")
        .replace(/\b\w/g, (letter) =>
          letter.toUpperCase()
        ),

      count: matchingStatus
        ? matchingStatus.count
        : 0,
    };
  });

  // =====================================================
  // EMPTY STATE
  // =====================================================

  const hasBookings = chartData.some(
    (item) => item.count > 0
  );

  if (!hasBookings) {
    return (
      <div className="user-analytics-panel">

        <div className="user-analytics-panel-header">
          <div>
            <h2>Booking Status Overview</h2>

            <p>
              Overview of your current booking statuses
            </p>
          </div>
        </div>

        <div className="user-analytics-empty">

          <h3>No booking data yet</h3>

          <p>
            Your booking status will appear here once
            you make a booking.
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // CHART
  // =====================================================

  return (
    <div className="user-analytics-panel">

      <div className="user-analytics-panel-header">

        <div>

          <h2>
            Booking Status Overview
          </h2>

          <p>
            Overview of your current booking statuses
          </p>

        </div>

      </div>


      <div className="user-booking-activity-chart">

        <ResponsiveContainer
          width="100%"
          height={320}
        >

          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="status"
            />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="count"
              name="Bookings"
              fill="#c9a227"
              radius={[6, 6, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default BookingActivityChart;