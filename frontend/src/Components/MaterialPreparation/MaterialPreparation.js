import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getMaterialPreparation,
  createMaterialPreparation,
  updateMaterialPreparation,
  updateMaterialItem,
} from "../../Services/materialPreparationService";

import "../../styles/MaterialPreparation.css";

// =====================================================
// MATERIAL PREPARATION PAGE
// Provider manages materials required for a booking
// =====================================================

const MaterialPreparation = () => {
  const { bookingId } = useParams();

  const [preparation, setPreparation] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [providerNotes, setProviderNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =====================================================
  // LOAD MATERIAL PREPARATION
  // =====================================================

 useEffect(() => {
  const loadMaterialPreparation = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMaterialPreparation(bookingId);

      setPreparation(response.data);
      setMaterials(response.data.materials || []);
      setProviderNotes(
        response.data.providerNotes || ""
      );
    } catch (error) {
      // Preparation does not exist yet
      if (error.response?.status === 404) {
        try {
          // Backend automatically loads
          // Admin-configured service materials
          const response =
            await createMaterialPreparation(
              bookingId,
              [],
              ""
            );

          setPreparation(response.data);
          setMaterials(response.data.materials || []);
          setProviderNotes(
            response.data.providerNotes || ""
          );
        } catch (createError) {
          console.error(
            "Create material preparation error:",
            createError
          );

          setError(
            createError.response?.data?.message ||
              "Failed to create material preparation"
          );
        }
      } else {
        console.error(
          "Load material preparation error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load material preparation"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (bookingId) {
    loadMaterialPreparation();
  }
}, [bookingId]);

 // =====================================================
// ADD ADDITIONAL MATERIAL
// Provider adds a material required specifically
// for this booking
// =====================================================

const handleAddMaterial = () => {
  setMaterials([
    ...materials,
    {
      name: "",
      quantity: 1,
      unit: "piece",
      source: "provider",
      status: "available",
    },
  ]);
};

  // =====================================================
  // UPDATE MATERIAL FIELD
  // =====================================================

  const handleMaterialChange = (
    index,
    field,
    value
  ) => {
    const updatedMaterials = [...materials];

    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    };

    setMaterials(updatedMaterials);
  };

  // =====================================================
  // REMOVE MATERIAL
  // =====================================================

  const handleRemoveMaterial = (index) => {
    const updatedMaterials = materials.filter(
      (_, materialIndex) => materialIndex !== index
    );

    setMaterials(updatedMaterials);
  };

  // =====================================================
  // UPDATE MATERIAL STATUS
  // =====================================================

  const handleStatusChange = async (
    material,
    status
  ) => {
    try {
      setMessage("");

      // Existing material already stored in database
      if (preparation && material._id) {
        const response = await updateMaterialItem(
          bookingId,
          material._id,
          status
        );

        if (response.success) {
          setPreparation(response.data);
          setMaterials(response.data.materials);
          setMessage(
            "Material status updated successfully."
          );
        }

        return;
      }

      // New material - only update local state
      const materialIndex = materials.findIndex(
        (item) => item === material
      );

      if (materialIndex !== -1) {
        handleMaterialChange(
          materialIndex,
          "status",
          status
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update material status."
      );
    }
  };

  // =====================================================
  // SAVE MATERIAL PREPARATION
  // =====================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");

      // Basic validation
      const invalidMaterial = materials.some(
        (material) =>
          !material.name.trim() ||
          !material.quantity ||
          material.quantity < 1
      );

      if (invalidMaterial) {
        setError(
          "Please enter valid details for every material."
        );
        setSaving(false);
        return;
      }

      let response;

      // Create new preparation
      if (!preparation) {
        response =
          await createMaterialPreparation(
            bookingId,
            materials,
            providerNotes
          );
      } else {
        // Update existing preparation
        response =
          await updateMaterialPreparation(
            bookingId,
            {
              materials,
              providerNotes,
            }
          );
      }

      if (response.success) {
        setPreparation(response.data);
        setMaterials(response.data.materials || []);
        setProviderNotes(
          response.data.providerNotes || ""
        );

        setMessage(
          "Material preparation saved successfully."
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to save material preparation."
      );
    } finally {
      setSaving(false);
    }
  };
// =====================================================
// SEPARATE MATERIALS BY SOURCE
// =====================================================

const adminMaterials = materials.filter(
  (material) => material.source === "admin"
);

const providerMaterials = materials.filter(
  (material) => material.source === "provider"
);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="material-preparation-page">
        <div className="material-loading">
          Loading material preparation...
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="material-preparation-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="material-page-header">
        <div>
          <p className="material-page-label">
            PROVIDER WORKSPACE
          </p>

          <h1>Material Preparation</h1>

          <p>
            Prepare and track the materials required
            for this service.
          </p>
        </div>

        <div
          className={`preparation-status ${
            preparation?.preparationStatus || "pending"
          }`}
        >
          {preparation?.preparationStatus ||
            "pending"}
        </div>
      </div>

      {/* =================================================
          ERROR / SUCCESS
      ================================================= */}

      {error && (
        <div className="material-message error">
          {error}
        </div>
      )}

      {message && (
        <div className="material-message success">
          {message}
        </div>
      )}

{/* =================================================
    MATERIAL LIST
================================================= */}

<section className="material-card">

  <div className="material-card-header">
    <div>
      <h2>Material Preparation</h2>

      <p>
        Review the standard materials configured by
        Admin and add any additional materials required
        for this specific job.
      </p>
    </div>
  </div>

  {/* =================================================
      ADMIN SUGGESTED MATERIALS
  ================================================= */}

  <div className="material-section">

    <div className="material-section-header">
      <div>
        <h3>Admin Suggested Materials</h3>

        <p>
          Standard materials configured for this service.
        </p>
      </div>
    </div>

    {adminMaterials.length === 0 ? (
      <div className="material-empty">
        <h3>No standard materials configured</h3>

        <p>
          Admin has not configured standard materials
          for this service.
        </p>
      </div>
    ) : (
      <div className="material-list">

        {adminMaterials.map((material) => {

          const index = materials.findIndex(
            (item) => item._id === material._id
          );

          return (
            <div
              className="material-row"
              key={material._id}
            >

              {/* Material name */}

              <div className="material-field">
                <label>Material</label>

                <input
                  type="text"
                  value={material.name}
                  onChange={(event) =>
                    handleMaterialChange(
                      index,
                      "name",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Quantity */}

              <div className="material-field quantity-field">
                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  value={material.quantity}
                  onChange={(event) =>
                    handleMaterialChange(
                      index,
                      "quantity",
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              {/* Unit */}

              <div className="material-field">
                <label>Unit</label>

                <input
                  type="text"
                  value={material.unit}
                  onChange={(event) =>
                    handleMaterialChange(
                      index,
                      "unit",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Status */}

              <div className="material-field">
                <label>Status</label>

                <select
                  value={
                    material.status || "available"
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      material,
                      event.target.value
                    )
                  }
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="need_to_buy">
                    Need to Buy
                  </option>

                  <option value="ready">
                    Ready
                  </option>
                </select>
              </div>

            </div>
          );
        })}

      </div>
    )}

  </div>


  {/* =================================================
      ADDITIONAL MATERIALS
  ================================================= */}

  <div className="material-section">

    <div className="material-section-header">

      <div>
        <h3>Additional Materials</h3>

        <p>
          Add any other materials required for this
          specific booking.
        </p>
      </div>

      <button
        type="button"
        className="add-material-btn"
        onClick={handleAddMaterial}
      >
        + Add Material
      </button>

    </div>

    {providerMaterials.length === 0 ? (

      <div className="material-empty">

        <h3>No additional materials</h3>

        <p>
          Add materials if the actual job requires
          something beyond the Admin suggestions.
        </p>

        <button
          type="button"
          onClick={handleAddMaterial}
        >
          Add Additional Material
        </button>

      </div>

    ) : (

      <div className="material-list">

        {providerMaterials.map((material) => {

          const index = materials.findIndex(
            (item) => item === material
          );

          return (
            <div
              className="material-row"
              key={
                material._id ||
                `provider-material-${index}`
              }
            >

              {/* Material name */}

              <div className="material-field">
                <label>Material</label>

                <input
                  type="text"
                  value={material.name}
                  placeholder="e.g. Drain Hose"
                  onChange={(event) =>
                    handleMaterialChange(
                      index,
                      "name",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Quantity */}

              <div className="material-field quantity-field">
                <label>Quantity</label>

                <input
                  type="number"
                  min="1"
                  value={material.quantity}
                  onChange={(event) =>
                    handleMaterialChange(
                      index,
                      "quantity",
                      Number(event.target.value)
                    )
                  }
                />
              </div>

              {/* Unit */}

              <div className="material-field">
                <label>Unit</label>

                <input
                  type="text"
                  value={material.unit}
                  placeholder="piece"
                  onChange={(event) =>
                    handleMaterialChange(
                      index,
                      "unit",
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Status */}

              <div className="material-field">
                <label>Status</label>

                <select
                  value={
                    material.status || "available"
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      material,
                      event.target.value
                    )
                  }
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="need_to_buy">
                    Need to Buy
                  </option>

                  <option value="ready">
                    Ready
                  </option>
                </select>
              </div>

              {/* Remove */}

              <button
                type="button"
                className="remove-material-btn"
                onClick={() =>
                  handleRemoveMaterial(index)
                }
              >
                Remove
              </button>

            </div>
          );
        })}

      </div>
    )}

  </div>

</section>

      {/* =================================================
          PROVIDER NOTES
      ================================================= */}

      <section className="material-card">

        <div className="material-card-header">
          <div>
            <h2>Provider Notes</h2>

            <p>
              Add any preparation notes for this
              service.
            </p>
          </div>
        </div>

        <textarea
          value={providerNotes}
          onChange={(event) =>
            setProviderNotes(event.target.value)
          }
          placeholder="Example: Purchase copper pipe before visiting the customer..."
          rows="5"
        />

      </section>

      {/* =================================================
          SAVE
      ================================================= */}

      <div className="material-actions">

        <button
          type="button"
          className="save-material-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Preparation"}
        </button>

      </div>

    </div>
  );
};

export default MaterialPreparation;