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
// Displays the provider's booking activity for the
// last 7 days.
// =====================================================

const BookingActivityChart = ({ data }) => {

  // =====================================================
  // CREATE LAST 7 DAYS
  // =====================================================

  const today = new Date();

  const lastSevenDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);

    date.setDate(today.getDate() - i);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const dateKey = `${year}-${month}-${day}`;

    lastSevenDays.push({
      dateKey,
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      bookings: 0,
    });
  }


  // =====================================================
  // ADD BACKEND BOOKING DATA
  // =====================================================

  data.forEach((item) => {

    const matchingDay = lastSevenDays.find(
      (day) => day.dateKey === item._id
    );

    if (matchingDay) {
      matchingDay.bookings = item.count;
    }
  });


  // =====================================================
  // EMPTY STATE
  // =====================================================

  const hasBookings = lastSevenDays.some(
    (day) => day.bookings > 0
  );


  if (!hasBookings) {
    return (
      <div className="provider-analytics-panel">

        <div className="provider-analytics-panel-header">
          <div>
            <h2>Booking Activity</h2>

            <p>
              Your booking activity over the last 7 days
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
            Booking activity from the last 7 days
            will appear here.
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
            Your booking activity over the last 7 days
          </p>
        </div>

      </div>


      <div className="provider-booking-activity-chart">

        <ResponsiveContainer width="100%" height={320}>

          <LineChart data={lastSevenDays}>

            <CartesianGrid
              strokeDasharray="3 3"
            />

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
              stroke="#4f46e5"
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