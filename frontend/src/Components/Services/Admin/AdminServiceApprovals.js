import React, { useEffect, useState } from "react";
import axios from "axios";

import { useToast } from "../../../Context/ToastContext";
import ConfirmModal from "../../common/modal/ConfirmModal";

const API = "https://urbanservice-backend-x1op.onrender.com/api/services";

const AdminServiceApprovals = () => {

  const { showToast } = useToast();

  // ========================================
  // STATE
  // ========================================

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reject form state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectServiceId, setRejectServiceId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Suggested materials state
const [materialServiceId, setMaterialServiceId] = useState(null);
const [suggestedMaterials, setSuggestedMaterials] = useState([]);
const [savingMaterials, setSavingMaterials] = useState(false);


const [showApproveModal, setShowApproveModal] = useState(false);
const [selectedServiceId, setSelectedServiceId] = useState(null);
const [approving, setApproving] = useState(false);

  // ========================================
  // AUTH CONFIG
  // ========================================

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ========================================
  // LOAD PENDING SERVICES
  // ========================================

  const loadPendingServices = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API}/pending`,
        authConfig
      );

      console.log(
        "PENDING SERVICES:",
        response.data
      );

      setServices(
        Array.isArray(response.data)
          ? response.data
          : response.data.services || []
      );

    } catch (error) {
      console.error(
        "Failed to load pending services:",
        error
      );

      setServices([]);

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD ON PAGE OPEN
  // ========================================

  useEffect(() => {
    loadPendingServices();
  }, []);




  const openApproveModal = (serviceId) => {
  setSelectedServiceId(serviceId);
  setShowApproveModal(true);
}; 

const closeApproveModal = () => {
  if (approving) return;

  setSelectedServiceId(null);
  setShowApproveModal(false);
};
  // ========================================
  // APPROVE SERVICE
  // ========================================

const handleApprove = async () => {
  if (!selectedServiceId) return;

  try {
    setApproving(true);

    await axios.patch(
      `${API}/${selectedServiceId}/approve`,
      {},
      authConfig
    );

    showToast("Service approved successfully.", "success");

    setShowApproveModal(false);
    setSelectedServiceId(null);

    await loadPendingServices();

  } catch (error) {
    console.error("Approve service error:", error);

    showToast(
      error.response?.data?.message ||
        "Failed to approve service.",
      "error"
    );

  } finally {
    setApproving(false);
  }
};

  // ========================================
  // OPEN REJECT FORM
  // ========================================

  const openRejectForm = (serviceId) => {
    setRejectServiceId(serviceId);
    setRejectionReason("");
    setShowRejectForm(true);
  };

  // ========================================
  // CLOSE REJECT FORM
  // ========================================

  const closeRejectForm = () => {
    setShowRejectForm(false);
    setRejectServiceId(null);
    setRejectionReason("");
  };

  // ========================================
// OPEN MATERIAL CONFIGURATION
// ========================================

const openMaterialConfiguration = (service) => {
  setMaterialServiceId(service._id);

  setSuggestedMaterials(
    service.suggestedMaterials || []
  );
};

// ========================================
// CLOSE MATERIAL CONFIGURATION
// ========================================

const closeMaterialConfiguration = () => {
  setMaterialServiceId(null);
  setSuggestedMaterials([]);
};

// ========================================
// ADD SUGGESTED MATERIAL
// ========================================

const handleAddSuggestedMaterial = () => {
  setSuggestedMaterials([
    ...suggestedMaterials,
    {
      name: "",
      defaultQuantity: 1,
      unit: "piece",
    },
  ]);
};

// ========================================
// UPDATE SUGGESTED MATERIAL
// ========================================

const handleSuggestedMaterialChange = (
  index,
  field,
  value
) => {
  const updatedMaterials = [
    ...suggestedMaterials,
  ];

  updatedMaterials[index] = {
    ...updatedMaterials[index],
    [field]: value,
  };

  setSuggestedMaterials(updatedMaterials);
};

// ========================================
// REMOVE SUGGESTED MATERIAL
// ========================================

const handleRemoveSuggestedMaterial = (index) => {
  const updatedMaterials =
    suggestedMaterials.filter(
      (_, materialIndex) =>
        materialIndex !== index
    );

  setSuggestedMaterials(updatedMaterials);
};

// ========================================
// SAVE SUGGESTED MATERIALS
// ========================================

const handleSaveSuggestedMaterials = async () => {
  try {
    setSavingMaterials(true);

    const invalidMaterial =
      suggestedMaterials.some(
        (material) =>
          !material.name.trim() ||
          !material.defaultQuantity ||
          material.defaultQuantity < 1 ||
          !material.unit.trim()
      );

    if (invalidMaterial) {
     showToast(
  "Please enter valid details for every material.",
  "warning"
);

      return;
    }

    await axios.patch(
      `${API}/${materialServiceId}/suggested-materials`,
      {
        suggestedMaterials,
      },
      authConfig
    );

   showToast("Suggested materials saved successfully.", "success");

    closeMaterialConfiguration();

    await loadPendingServices();

  } catch (error) {
    console.error(
      "Save suggested materials error:",
      error
    );

  showToast(
  error.response?.data?.message ||
    "Failed to save suggested materials.",
  "error"
);

  } finally {
    setSavingMaterials(false);
  }
};

  // ========================================
  // REJECT SERVICE
  // ========================================

  const handleReject = async () => {

    // Validate reason
    if (!rejectionReason.trim()) {
     showToast("Please enter a rejection reason.", "warning");
      return;
    }

    try {

     await axios.patch(
  `${API}/${rejectServiceId}/reject`,
  {
    adminComment: rejectionReason.trim(),
  },
  authConfig
);

     showToast("Service rejected successfully.", "success");

      // Close form
      closeRejectForm();

      // Reload pending services
      await loadPendingServices();

    } catch (error) {

      console.error(
        "Reject service error:",
        error
      );

      showToast(
  error.response?.data?.message ||
    "Failed to reject service.",
  "error"
);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="admin-page-content">

        <h1>
          Service Approvals
        </h1>

        <p>
          Loading pending services...
        </p>

      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="admin-page-content">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="admin-page-header">

        <div>

          <span className="admin-label">
            SERVICE MANAGEMENT
          </span>

          <h1>
            Service Approvals
          </h1>

          <p>
            Review and manage services
            submitted by providers.
          </p>

        </div>

        <span className="pending-count">
          {services.length} Pending
        </span>

      </div>

      {/* ========================================
          REJECT FORM
      ======================================== */}

      {showRejectForm && (

        <div className="reject-form-card">

          <div className="reject-form-header">

            <div>

              <h2>
                Reject Service
              </h2>

              <p>
                Please provide a reason for
                rejecting this service.
              </p>

            </div>

            <button
              type="button"
              className="btn-close"
              onClick={closeRejectForm}
            >
              ×
            </button>

          </div>

          <div className="form-group">

            <label>
              Rejection Reason
            </label>

            <textarea
              value={rejectionReason}
              onChange={(e) =>
                setRejectionReason(
                  e.target.value
                )
              }
              placeholder="Example: Please provide more details about the service."
              rows="4"
            />

          </div>

          <div className="reject-form-actions">

            <button
              type="button"
              className="btn-secondary"
              onClick={closeRejectForm}
            >
              Cancel
            </button>

            <button
              type="button"
              className="admin-reject-btn"
              onClick={handleReject}
            >
              ✕ Reject Service
            </button>

          </div>

        </div>

      )}

      {/* ========================================
          NO SERVICES
      ======================================== */}

      {services.length === 0 ? (

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            ✓
          </div>

          <h2>
            All Clear!
          </h2>

          <p>
            No services are currently
            waiting for approval.
          </p>

        </div>

      ) : (

        /* ========================================
           SERVICES
        ======================================== */

        <div className="admin-services-grid">

          {services.map((service) => (

            <div
              className="admin-service-card"
              key={service._id}
            >

              {/* ========================================
                  IMAGE
              ======================================== */}

              {service.image ? (

                <img
                src={
                  service.image?.startsWith("http")
                  ? service.image
                  : `https://urbanservice-backend-x1op.onrender.com/uploads/${service.image}`
                  }
                  alt={service.name}
                  className="admin-service-image"
                />

              ) : (

                <div className="admin-service-image-placeholder">
                  📷
                </div>

              )}

              {/* ========================================
                  CONTENT
              ======================================== */}

              <div className="admin-service-content">

                {/* SERVICE TOP */}

                <div className="admin-service-top">

                  <div>

                    <h2>
                      {service.name}
                    </h2>

                    <p>
                      {service.category}
                    </p>

                  </div>

                  <span className="admin-pending-badge">
                    Pending
                  </span>

                </div>

                {/* DESCRIPTION */}

                <p className="admin-service-description">
                  {service.description}
                </p>

                {/* PRICE */}

                <h3>
                  ₹{service.price}
                </h3>

                {/* PROVIDER */}

                <p className="admin-provider">

                  <strong>
                    Provider:
                  </strong>{" "}

                  {service.provider?.name ||
                    "Unknown Provider"}

                </p>
                      {/* ========================================
    SUGGESTED MATERIALS
======================================== */}

<div className="admin-suggested-materials">

  <div className="admin-material-header">

    <div>
      <h3>
        Suggested Materials
      </h3>

      <p>
        Configure the default materials
        for this service.
      </p>
    </div>

    <button
      type="button"
      onClick={() =>
        openMaterialConfiguration(service)
      }
    >
      Configure
    </button>

  </div>

  {service.suggestedMaterials?.length > 0 ? (

    <div className="admin-material-preview">

      {service.suggestedMaterials.map(
        (material, index) => (

          <div
            key={index}
            className="admin-material-preview-item"
          >
            <span>
              {material.name}
            </span>

            <span>
              {material.defaultQuantity}{" "}
              {material.unit}
            </span>
          </div>

        )
      )}

    </div>

  ) : (

    <p className="admin-no-materials">
      No materials configured yet.
    </p>

  )}

</div>
                {/* ========================================
                    ACTIONS
                ======================================== */}

                <div className="admin-service-actions">

                  {/* APPROVE */}

                  <button
                    type="button"
                    className="admin-approve-btn"
                    onClick={() =>
                      openApproveModal(service._id)
                    }
                  >
                    ✓ Approve
                  </button>

                  {/* REJECT */}

                  <button
                    type="button"
                    className="admin-reject-btn"
                    onClick={() =>
                      openRejectForm(
                        service._id
                      )
                    }
                  >
                    ✕ Reject
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ========================================
    MATERIAL CONFIGURATION PANEL
======================================== */}

{materialServiceId && (

  <div className="admin-material-config-card">

    <div className="admin-material-config-header">

      <div>

        <span className="admin-label">
          SERVICE CONFIGURATION
        </span>

        <h2>
          Suggested Materials
        </h2>

        <p>
          Configure the default materials
          providers should prepare for this service.
        </p>

      </div>

      <button
        type="button"
        onClick={closeMaterialConfiguration}
      >
        ×
      </button>

    </div>

    <div className="admin-material-config-list">

      {suggestedMaterials.map(
        (material, index) => (

          <div
            key={index}
            className="admin-material-config-row"
          >

            <div>
              <label>
                Material
              </label>

              <input
                type="text"
                value={material.name}
                placeholder="e.g. Copper Pipe"
                onChange={(e) =>
                  handleSuggestedMaterialChange(
                    index,
                    "name",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <label>
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={
                  material.defaultQuantity
                }
                onChange={(e) =>
                  handleSuggestedMaterialChange(
                    index,
                    "defaultQuantity",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div>
              <label>
                Unit
              </label>

              <input
                type="text"
                value={material.unit}
                placeholder="piece"
                onChange={(e) =>
                  handleSuggestedMaterialChange(
                    index,
                    "unit",
                    e.target.value
                  )
                }
              />
            </div>

            <button
              type="button"
              onClick={() =>
                handleRemoveSuggestedMaterial(
                  index
                )
              }
            >
              Remove
            </button>

          </div>

        )
      )}

    </div>

    <button
      type="button"
      onClick={
        handleAddSuggestedMaterial
      }
    >
      + Add Material
    </button>

    <div className="admin-material-config-actions">

      <button
        type="button"
        onClick={
          closeMaterialConfiguration
        }
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={
          handleSaveSuggestedMaterials
        }
        disabled={savingMaterials}
      >
        {savingMaterials
          ? "Saving..."
          : "Save Materials"}
      </button>

    </div>

  </div>

)}

<ConfirmModal
  isOpen={showApproveModal}
  title="Approve Service?"
  message="Are you sure you want to approve this service? It will become available according to your existing service approval workflow."
  confirmText="Approve Service"
  cancelText="Cancel"
  variant="success"
  loading={approving}
  onConfirm={handleApprove}
  onClose={closeApproveModal}
/>

    </div>
  );
};

export default AdminServiceApprovals;