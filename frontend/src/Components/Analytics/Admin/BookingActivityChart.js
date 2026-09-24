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
// FORMAT DATE
// Converts YYYY-MM-DD into a clean display format.
// Example: 2026-09-17 → Sep 17
// =====================================================

const formatDate = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};


// =====================================================
// CUSTOM TOOLTIP
// =====================================================

const BookingTooltip = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="analytics-booking-tooltip">

      <span className="analytics-booking-tooltip-date">
        {formatDate(label)}
      </span>

      <div className="analytics-booking-tooltip-value">

        <strong>
          {payload[0].value}
        </strong>

        <span>
          bookings
        </span>

      </div>

    </div>
  );
};


// =====================================================
// BOOKING ACTIVITY CHART
// =====================================================

const BookingActivityChart = ({ data }) => {

  const chartData = (data || []).map((item) => ({
    date: item._id,
    bookings: item.bookings,
  }));


  return (
    <div className="analytics-chart-card">

      {/* =================================================
          HEADER
      ================================================= */}

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


      {/* =================================================
          CHART
      ================================================= */}

      <div className="analytics-chart-wrapper">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={chartData}
            margin={{
              top: 12,
              right: 16,
              left: -18,
              bottom: 8,
            }}
          >

            {/* Grid */}

            <CartesianGrid
              stroke="#eeeeec"
              vertical={false}
            />


            {/* X Axis */}

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tickFormatter={formatDate}
              tick={{
                fill: "#9ca3af",
                fontSize: 11,
              }}
              tickMargin={10}
            />


            {/* Y Axis */}

            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              width={40}
              tick={{
                fill: "#9ca3af",
                fontSize: 11,
              }}
            />


            {/* Tooltip */}

            <Tooltip
              content={<BookingTooltip />}
              cursor={{
                stroke: "#d4d4d8",
                strokeWidth: 1,
              }}
            />


            {/* Line */}

            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#18181b"
              strokeWidth={2.2}
              dot={{
                r: 3.5,
                fill: "#18181b",
                stroke: "#18181b",
                strokeWidth: 1,
              }}
              activeDot={{
                r: 5,
                fill: "#18181b",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              animationDuration={700}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default BookingActivityChart;