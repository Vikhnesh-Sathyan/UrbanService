import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

import "../../../styles/UserProviderProfile.css";

const UserProviderProfile = () => {
 const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH PROVIDER PROFILE
  // ========================================

 useEffect(() => {
  fetchProviderProfile();
}, [providerId]);

  const fetchProviderProfile = async () => {
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

      setProvider(response.data.provider);
      setServices(response.data.services || []);

    } catch (error) {
      console.error(
        "Fetch provider profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load provider profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (time) => {
    if (!time) {
      return "—";
    }

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  };

  // ========================================
  // PROFILE INITIAL
  // ========================================

  const providerInitial =
    provider?.name
      ?.charAt(0)
      ?.toUpperCase() || "P";

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="user-provider-profile-page">
        <div className="user-provider-profile-loading">
          Loading provider profile...
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !provider) {
    return (
      <div className="user-provider-profile-page">
        <div className="user-provider-profile-error">
          {error || "Provider profile not found."}
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="user-provider-profile-page">

      {/* ====================================
          BACK BUTTON
      ==================================== */}

      <button
        type="button"
        className="user-provider-back-button"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="user-provider-profile-header">

        <span className="user-provider-profile-eyebrow">
          SERVICE PROVIDER
        </span>

        <h1>
          Provider Profile
        </h1>

        <p>
          View professional information,
          availability and services.
        </p>

      </div>


      {/* ====================================
          PROFILE HERO
      ==================================== */}

      <div className="user-provider-profile-hero">

        <div className="user-provider-profile-avatar">
          {providerInitial}
        </div>

        <div className="user-provider-profile-hero-info">

          <h2>
            {provider.name || "Provider"}
          </h2>

          <p>
            {provider.professionalDescription ||
              "Professional service provider"}
          </p>

          <span className="user-provider-profile-role">
            Service Provider
          </span>

        </div>

      </div>


      {/* ====================================
          PROFESSIONAL INFORMATION
      ==================================== */}

      <div className="user-provider-profile-card">

        <div className="user-provider-profile-card-header">

          <h2>
            Professional Information
          </h2>

          <p>
            Information about this provider's
            professional background.
          </p>

        </div>


        <div className="user-provider-info-grid">

          <div className="user-provider-info-item">

            <span>
              EXPERIENCE
            </span>

            <strong>
              {provider.experience || "Not provided"}
            </strong>

          </div>


          <div className="user-provider-info-item">

            <span>
              PHONE
            </span>

            <strong>
              {provider.phone || "Not provided"}
            </strong>

          </div>

        </div>


        <div className="user-provider-description">

          <span>
            PROFESSIONAL DESCRIPTION
          </span>

          <p>
            {provider.professionalDescription ||
              "No professional description provided."}
          </p>

        </div>

      </div>


      {/* ====================================
          LOCATION
      ==================================== */}

      <div className="user-provider-profile-card">

        <div className="user-provider-profile-card-header">

          <h2>
            Service Location
          </h2>

          <p>
            Location where this provider offers
            services.
          </p>

        </div>


        <div className="user-provider-info-grid">

          <div className="user-provider-info-item">

            <span>
              CITY
            </span>

            <strong>
              {provider.location?.city ||
                "Not provided"}
            </strong>

          </div>


          <div className="user-provider-info-item">

            <span>
              STATE
            </span>

            <strong>
              {provider.location?.state ||
                "Not provided"}
            </strong>

          </div>

        </div>

      </div>


      {/* ====================================
          AVAILABILITY
      ==================================== */}

      <div className="user-provider-profile-card">

        <div className="user-provider-profile-card-header">

          <h2>
            Availability
          </h2>

          <p>
            Current working schedule of this
            provider.
          </p>

        </div>


        {/* WORKING DAYS */}

        <div className="user-provider-availability">

          <span className="user-provider-section-label">
            WORKING DAYS
          </span>

          <div className="user-provider-day-list">

            {provider.availability?.days?.length > 0 ? (

              provider.availability.days.map(
                (day) => (
                  <span
                    key={day}
                    className="user-provider-day-badge"
                  >
                    {day}
                  </span>
                )
              )

            ) : (

              <span className="user-provider-no-data">
                No working days set
              </span>

            )}

          </div>

        </div>


        {/* TIME */}

        <div className="user-provider-availability-time">

          <div className="user-provider-time-item">

            <span>
              START TIME
            </span>

            <strong>
              {formatTime(
                provider.availability?.startTime
              )}
            </strong>

          </div>


          <div className="user-provider-time-item">

            <span>
              END TIME
            </span>

            <strong>
              {formatTime(
                provider.availability?.endTime
              )}
            </strong>

          </div>

        </div>

      </div>


      {/* ====================================
          SERVICES
      ==================================== */}

      <div className="user-provider-profile-card">

        <div className="user-provider-profile-card-header">

          <h2>
            Services
          </h2>

          <p>
            Services currently offered by this
            provider.
          </p>

        </div>


        {services.length > 0 ? (

          <div className="user-provider-services-list">

            {services.map((service) => (

              <div
                key={service._id}
                className="user-provider-service-card"
              >

                <div className="user-provider-service-top">

                  <div>

                    <h3>
                      {service.name}
                    </h3>

                    <span className="user-provider-service-category">
                      {service.category}
                    </span>

                  </div>

                  <strong className="user-provider-service-price">
                    ₹{service.price}
                  </strong>

                </div>


                <p>
                  {service.description ||
                    "No description available."}
                </p>


                <button
                  type="button"
                  className="user-provider-book-button"
                  onClick={() =>
                    navigate(
                      `/user/services/${service._id}/book`
                    )
                  }
                >
                  Book Service
                </button>

              </div>

            ))}

          </div>

        ) : (

          <div className="user-provider-no-services">
            This provider has no approved services
            available at the moment.
          </div>

        )}

      </div>

    </div>
  );
};

export default UserProviderProfile;