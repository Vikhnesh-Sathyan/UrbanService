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

const BookingActivityChart = ({ data }) => {
  const chartData = data.map((item) => ({
    date: item._id,
    bookings: item.bookings,
  }));

  return (
    <div className="analytics-chart-card">

      {/* Header */}
      <div className="analytics-chart-header">

        <div>
          <span className="analytics-chart-label">
            BOOKING ACTIVITY
          </span>

          <h3>
            Booking trend
          </h3>
        </div>

        <span className="analytics-chart-description">
          Daily booking volume
        </span>

      </div>

      {/* Chart */}
      <div className="analytics-chart-wrapper">

        <ResponsiveContainer
          width="100%"
          height={320}
        >
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 5,
            }}
          >

            <CartesianGrid
              stroke="#eeeeec"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />

            <Tooltip
              cursor={{
                stroke: "#d4d4d8",
                strokeWidth: 1,
              }}
              contentStyle={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                background: "#ffffff",
                boxShadow:
                  "0 8px 24px rgba(0,0,0,0.08)",
              }}
              labelStyle={{
                color: "#6b7280",
                fontSize: 11,
                marginBottom: 4,
              }}
            />

            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#18181b"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#18181b",
              }}
              activeDot={{
                r: 5,
              }}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default BookingActivityChart;