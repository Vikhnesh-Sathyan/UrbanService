import React from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const BookingBreakdown = ({ data }) => {
  const bookingTypes = data?.bookingTypes || [];

  const typeData = bookingTypes.map((item) => ({
    name:
      item._id === "emergency"
        ? "Emergency"
        : "Normal",
    value: item.count,
  }));

  const TYPE_COLORS = ["#18181b", "#a1a1aa"];

  const totalBookings = typeData.reduce(
    (total, item) => total + item.value,
    0
  );

  return (
    <div className="analytics-breakdown-card">

      {/* Header */}
      <div className="analytics-chart-header">

        <div>
          <span className="analytics-chart-label">
            BOOKING TYPES
          </span>

          <h3>
            Normal vs emergency
          </h3>
        </div>

        <span className="analytics-chart-description">
          Booking distribution
        </span>

      </div>

      <div className="analytics-type-content">

        {/* Donut */}
        <div className="analytics-donut-wrapper">

          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <PieChart>

              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={88}
                paddingAngle={3}
                stroke="none"
              >
                {typeData.map((entry, index) => (
                  <Cell
                    key={`type-${index}`}
                    fill={
                      TYPE_COLORS[
                        index % TYPE_COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px",
                  background: "#ffffff",
                  boxShadow:
                    "0 8px 24px rgba(0,0,0,0.08)",
                }}
              />

            </PieChart>
          </ResponsiveContainer>

          <div className="analytics-donut-center">
            <strong>{totalBookings}</strong>
            <span>Total</span>
          </div>

        </div>

        {/* Legend */}
        <div className="analytics-type-legend">

          {typeData.map((item, index) => {

            const percentage =
              totalBookings > 0
                ? Math.round(
                    (item.value / totalBookings) * 100
                  )
                : 0;

            return (
              <div
                className="analytics-type-item"
                key={item.name}
              >

                <div className="analytics-type-name">

                  <span
                    className="analytics-type-dot"
                    style={{
                      background:
                        TYPE_COLORS[
                          index % TYPE_COLORS.length
                        ],
                    }}
                  />

                  <span>
                    {item.name}
                  </span>

                </div>

                <div className="analytics-type-value">

                  <strong>
                    {item.value}
                  </strong>

                  <span>
                    {percentage}%
                  </span>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default BookingBreakdown;