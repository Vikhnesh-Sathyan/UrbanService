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

const ProviderTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="analytics-provider-tooltip">

      <span className="analytics-provider-tooltip-name">
        {item.providerName}
      </span>

      <div className="analytics-provider-tooltip-value">

        <strong>
          {item.completedBookings}
        </strong>

        <span>
          {item.completedBookings === 1
            ? "completed booking"
            : "completed bookings"}
        </span>

      </div>

    </div>
  );
};


// =====================================================
// PROVIDER PERFORMANCE CHART
// =====================================================

const ProviderPerformanceChart = ({ data }) => {

  const chartData = (data || []).slice(0, 6);

  return (
    <div className="analytics-provider-chart-card">

      <div className="analytics-chart-header">

        <div>

          <span className="analytics-chart-label">
            PROVIDER PERFORMANCE
          </span>

          <h3>
            Completed bookings by provider
          </h3>

        </div>

        <span className="analytics-chart-description">
          Top providers
        </span>

      </div>


      <div className="analytics-provider-chart-wrapper">

        {chartData.length === 0 ? (

          <div className="analytics-provider-empty">
            No completed booking data available
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
                dataKey="providerName"
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
                content={<ProviderTooltip />}
                cursor={{
                  fill: "rgba(24, 24, 27, 0.035)",
                }}
              />

              <Bar
                dataKey="completedBookings"
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

export default ProviderPerformanceChart;