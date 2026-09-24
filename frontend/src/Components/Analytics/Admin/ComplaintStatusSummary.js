import React from "react";

// =====================================================
// COMPLAINT STATUS SUMMARY
// Displays complaint counts by current status.
// =====================================================

const ComplaintStatusSummary = ({ data }) => {
  const statusBreakdown = data?.statusBreakdown || [];

  // Convert backend aggregation into easy lookup data.
  const getStatusCount = (status) => {
    const item = statusBreakdown.find(
      (entry) => entry._id === status
    );

    return item?.count || 0;
  };

  const statuses = [
    {
      label: "Open",
      value: "open",
    },
    {
      label: "Under Review",
      value: "under_review",
    },
    {
      label: "Resolved",
      value: "resolved",
    },
    {
      label: "Rejected",
      value: "rejected",
    },
  ];

  return (
    <div className="analytics-complaint-summary">

      {/* Total */}
      <div className="analytics-complaint-total">

        <span>
          TOTAL COMPLAINTS
        </span>

        <strong>
          {data?.totalComplaints || 0}
        </strong>

      </div>


      {/* Status cards */}
      <div className="analytics-complaint-status-grid">

        {statuses.map((status) => (

          <div
            className="analytics-complaint-status-card"
            key={status.value}
          >

            <span>
              {status.label}
            </span>

            <strong>
              {getStatusCount(status.value)}
            </strong>

          </div>

        ))}

      </div>

    </div>
  );
};

export default ComplaintStatusSummary;