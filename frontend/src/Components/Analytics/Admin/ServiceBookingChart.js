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


// =====================================================
// CUSTOM TOOLTIP
// =====================================================

const ServiceTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="analytics-service-tooltip">

      <span className="analytics-service-tooltip-name">
        {item.serviceName}
      </span>

      <div className="analytics-service-tooltip-value">
        <strong>{item.bookingCount}</strong>

        <span>
          {item.bookingCount === 1
            ? "booking"
            : "bookings"}
        </span>
      </div>

    </div>
  );
};


// =====================================================
// SERVICE BOOKING CHART
// Shows the most booked services.
// =====================================================

const ServiceBookingChart = ({ data }) => {

  const chartData = (data || []).slice(0, 6);

  return (
    <div className="analytics-service-chart-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="analytics-chart-header">

        <div>

          <span className="analytics-chart-label">
            SERVICE DEMAND
          </span>

          <h3>
            Most booked services
          </h3>

        </div>

        <span className="analytics-chart-description">
          Booking volume
        </span>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div className="analytics-service-chart-wrapper">

        {chartData.length === 0 ? (

          <div className="analytics-service-empty">
            <span>
              No booking data available
            </span>
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 8,
                right: 24,
                left: 10,
                bottom: 8,
              }}
              barCategoryGap="28%"
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
                dataKey="serviceName"
                axisLine={false}
                tickLine={false}
                width={125}
                tick={{
                  fill: "#52525b",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />

              <Tooltip
                content={<ServiceTooltip />}
                cursor={{
                  fill: "rgba(24, 24, 27, 0.035)",
                }}
              />

              <Bar
                dataKey="bookingCount"
                fill="#18181b"
                radius={[0, 5, 5, 0]}
                maxBarSize={28}
                animationDuration={700}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>
  );
};

export default ServiceBookingChart;