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

const BookingStatusChart = ({ data }) => {
  const bookingStatuses = data?.bookingStatuses || [];

  const statusData = bookingStatuses.map((item) => ({
    status: item._id
      ? item._id
          .replace("_", " ")
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          )
      : "Unknown",
    bookings: item.count,
  }));

  return (
    <div className="analytics-breakdown-card">

      {/* Header */}
      <div className="analytics-chart-header">

        <div>
          <span className="analytics-chart-label">
            BOOKING STATUS
          </span>

          <h3>
            Booking outcomes
          </h3>
        </div>

        <span className="analytics-chart-description">
          Current distribution
        </span>

      </div>

      {/* Chart */}
      <div className="analytics-status-chart">

        <ResponsiveContainer
          width="100%"
          height={250}
        >
          <BarChart
            data={statusData}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 10,
              bottom: 5,
            }}
          >

            <CartesianGrid
              stroke="#eeeeec"
              horizontal={false}
            />

            <XAxis
              type="number"
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />

            <YAxis
              type="category"
              dataKey="status"
              width={90}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#6b7280",
                fontSize: 11,
              }}
            />

            <Tooltip
              cursor={{
                fill: "#fafafa",
              }}
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.08)",
              }}
            />

            <Bar
              dataKey="bookings"
              fill="#18181b"
              radius={[0, 5, 5, 0]}
              barSize={18}
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default BookingStatusChart;