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
// REASON LABEL
// Converts backend enum values into readable labels.
// =====================================================

const getReasonLabel = (reason) => {
  switch (reason) {
    case "service_quality":
      return "Service Quality";

    case "provider_no_show":
      return "Provider No Show";

    case "service_not_provided":
      return "Service Not Provided";

    case "payment_issue":
      return "Payment Issue";

    case "inappropriate_behavior":
      return "Inappropriate Behavior";

    case "other":
      return "Other";

    default:
      return reason;
  }
};


// =====================================================
// CUSTOM TOOLTIP
// =====================================================

const ComplaintTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="analytics-complaint-tooltip">

      <span>
        {item.reasonLabel}
      </span>

      <strong>
        {item.count}
      </strong>

      <small>
        {item.count === 1
          ? "complaint"
          : "complaints"}
      </small>

    </div>
  );
};


// =====================================================
// COMPLAINT REASON CHART
// =====================================================

const ComplaintReasonChart = ({ data }) => {

  const chartData = (
    data?.reasonBreakdown || []
  ).map((item) => ({
    reasonLabel: getReasonLabel(item._id),
    count: item.count,
  }));

  return (
    <div className="analytics-complaint-chart-card">

      {/* Header */}

      <div className="analytics-chart-header">

        <div>

          <span className="analytics-chart-label">
            COMPLAINT REASONS
          </span>

          <h3>
            Why customers report issues
          </h3>

        </div>

        <span className="analytics-chart-description">
          Issue volume
        </span>

      </div>


      {/* Chart */}

      <div className="analytics-complaint-chart-wrapper">

        {chartData.length === 0 ? (

          <div className="analytics-complaint-empty">
            No complaint data available
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
              barCategoryGap="24%"
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
                dataKey="reasonLabel"
                axisLine={false}
                tickLine={false}
                width={150}
                tick={{
                  fill: "#52525b",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              />

              <Tooltip
                content={<ComplaintTooltip />}
                cursor={{
                  fill: "rgba(24, 24, 27, 0.035)",
                }}
              />

              <Bar
                dataKey="count"
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

export default ComplaintReasonChart;