import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "../../../styles/AdminProviderDetails.css";

const AdminProviderDetails = () => {

  const { providerId } = useParams();
  const navigate = useNavigate();

  // ========================================
  // STATE
  // ========================================

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // ========================================
  // FETCH PROVIDER
  // ========================================

  useEffect(() => {
    fetchProvider();
  }, [providerId]);


const fetchProvider = async () => {
  try {

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    const response = await axios.get(
      `http://localhost:5000/api/users/providers/${providerId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "PROVIDER DETAILS:",
      response.data
    );

    setProvider({
      ...response.data.provider,
      services: response.data.services || [],
    });

  } catch (error) {

    console.error(
      "Fetch provider details error:",
      error
    );

    setError(
      error.response?.data?.message ||
      "Failed to load provider details."
    );

  } finally {

    setLoading(false);

  }
};


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <section className="admin-provider-details-page">

        <div className="admin-provider-details-loading">

          Loading provider details...

        </div>

      </section>
    );

  }


  // ========================================
  // ERROR
  // ========================================

  if (error) {

    return (
      <section className="admin-provider-details-page">

        <div className="admin-provider-details-error">

          <h2>
            Unable to Load Provider
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/providers")
            }
          >
            Back to Providers
          </button>

        </div>

      </section>
    );

  }


  // ========================================
  // NO PROVIDER
  // ========================================

  if (!provider) {
    return null;
  }


  // ========================================
  // MAIN UI
  // ========================================

  return (

    <section className="admin-provider-details-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="admin-provider-details-header">


        {/* =================================================
            TOP ACTIONS
        ================================================= */}

        <div className="admin-provider-top-actions">


          {/* BACK */}

          <button
            type="button"
            className="admin-provider-back-btn"
            onClick={() =>
              navigate("/admin/providers")
            }
          >
            ← Back to Providers
          </button>


          {/* BLOCK / UNBLOCK */}

          {provider.isActive === false ? (

            <button
              type="button"
              className="admin-unblock-btn"
              onClick={() => {
                console.log(
                  "UNBLOCK PROVIDER:",
                  provider._id
                );
              }}
            >
              Unblock Provider
            </button>

          ) : (

            <button
              type="button"
              className="admin-block-btn"
              onClick={() => {
                console.log(
                  "BLOCK PROVIDER:",
                  provider._id
                );
              }}
            >
              Block Provider
            </button>

          )}

        </div>


        {/* =================================================
            PROVIDER TITLE
        ================================================= */}

        <div className="admin-provider-title">


          {/* AVATAR */}

          <div className="admin-provider-avatar">

            {provider.name
              ?.charAt(0)
              ?.toUpperCase() || "P"}

          </div>


          {/* PROVIDER NAME */}

          <div>

            <span className="admin-label">
              PROVIDER DETAILS
            </span>

            <h1>
              {provider.name ||
                "Unknown Provider"}
            </h1>

            <p>
              {provider.email ||
                "No email"}
            </p>

          </div>

        </div>

      </div>



      {/* =================================================
          ACCOUNT STATUS
      ================================================= */}

      <div className="admin-provider-status-card">

        <div>

          <span>
            ACCOUNT STATUS
          </span>

          <strong>
            {provider.isActive === false
              ? "Blocked"
              : "Active"}
          </strong>

        </div>


        <span
          className={
            provider.isActive === false
              ? "status-badge blocked"
              : "status-badge active"
          }
        >

          {provider.isActive === false
            ? "Blocked"
            : "Active"}

        </span>

      </div>



      {/* =================================================
          BASIC INFORMATION
      ================================================= */}

      <div className="admin-provider-section">


        <div className="admin-provider-section-header">

          <div>

            <h2>
              Basic Information
            </h2>

            <p>
              Provider account information
            </p>

          </div>

        </div>


        <div className="admin-provider-info-grid">


          {/* NAME */}

          <div className="admin-provider-info-item">

            <span>
              Name
            </span>

            <strong>
              {provider.name ||
                "Not provided"}
            </strong>

          </div>


          {/* EMAIL */}

          <div className="admin-provider-info-item">

            <span>
              Email
            </span>

            <strong>
              {provider.email ||
                "Not provided"}
            </strong>

          </div>


          {/* PHONE */}

          <div className="admin-provider-info-item">

            <span>
              Phone
            </span>

            <strong>
              {provider.phone ||
                "Not provided"}
            </strong>

          </div>


          {/* ROLE */}

          <div className="admin-provider-info-item">

            <span>
              Role
            </span>

            <strong>
              {provider.role ||
                "Provider"}
            </strong>

          </div>


          {/* EXPERIENCE */}

          <div className="admin-provider-info-item">

            <span>
              Experience
            </span>

            <strong>
              {provider.experience ||
                "Not provided"}
            </strong>

          </div>


          {/* LOCATION */}

          <div className="admin-provider-info-item">

            <span>
              Location
            </span>

            <strong>

              {provider.location?.city ||
                "Not provided"}

            </strong>

          </div>

        </div>

      </div>



      {/* =================================================
          PROFESSIONAL INFORMATION
      ================================================= */}

      <div className="admin-provider-section">


        <div className="admin-provider-section-header">

          <div>

            <h2>
              Professional Information
            </h2>

            <p>
              About the provider and their professional background
            </p>

          </div>

        </div>


        <div className="admin-provider-description">

          {provider.professionalDescription ||
            "No professional description provided."}

        </div>

      </div>



      {/* =================================================
          AVAILABILITY
      ================================================= */}

      <div className="admin-provider-section">


        <div className="admin-provider-section-header">

          <div>

            <h2>
              Availability
            </h2>

            <p>
              Provider working availability
            </p>

          </div>

        </div>


        <div className="admin-provider-availability">


          {provider.availability ? (

            <pre>

              {JSON.stringify(
                provider.availability,
                null,
                2
              )}

            </pre>

          ) : (

            <p>
              Availability not provided.
            </p>

          )}

        </div>

      </div>



      {/* =================================================
          SERVICES
      ================================================= */}

      <div className="admin-provider-section">


        {/* SERVICES HEADER */}

        <div className="admin-provider-section-header">


          <div>

            <h2>
              Services
            </h2>

            <p>
              Services offered by this provider
            </p>

          </div>


          <strong className="service-count">

            {provider.services?.length || 0}

          </strong>

        </div>



        {/* SERVICES */}

        {provider.services?.length > 0 ? (

          <div className="admin-provider-services-list">


            {provider.services.map(
              (service) => (

                <div
                  className="admin-provider-service-card"
                  key={service._id}
                >


                  {/* SERVICE INFORMATION */}

                  <div>

                    <h3>
                      {service.name ||
                        "Unknown Service"}
                    </h3>


                    <p>
                      {service.category ||
                        "General Service"}
                    </p>


                    <span>

                      {service.description ||
                        "No description provided."}

                    </span>

                  </div>



                  {/* SERVICE RIGHT */}

                  <div className="admin-provider-service-right">


                    {/* PRICE */}

                    <strong>

                      ₹
                      {service.price ??
                        "0"}

                    </strong>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="admin-no-services">

            No services found.

          </div>

        )}

      </div>

    </section>
  );
};

export default AdminProviderDetails;