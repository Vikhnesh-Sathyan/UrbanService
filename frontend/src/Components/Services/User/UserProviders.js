import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../../styles/UserProviders.css";

const UserProviders = () => {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // FETCH PROVIDERS
  // ========================================

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/users/providers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProviders(response.data.providers || []);
    } catch (error) {
      console.error("Fetch providers error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load service providers."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // VIEW PROVIDER PROFILE
  // ========================================

  const handleViewProfile = (providerId) => {
    navigate(`/user/providers/${providerId}`);
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="user-providers-page">
        <div className="user-providers-loading">
          Loading providers...
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <div className="user-providers-page">
        <div className="user-providers-error">
          <h2>Unable to Load Providers</h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={fetchProviders}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="user-providers-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="user-providers-header">

        <div>
          <span className="user-providers-eyebrow">
            PROFESSIONAL NETWORK
          </span>

          <h1>
            Browse Providers
          </h1>

          <p>
            Discover trusted professionals and
            explore the services they offer.
          </p>
        </div>

        <div className="user-providers-count">
          <strong>
            {providers.length}
          </strong>

          <span>
            Providers
          </span>
        </div>

      </div>


      {/* ====================================
          EMPTY STATE
      ==================================== */}

      {providers.length === 0 ? (

        <div className="user-providers-empty">

          <div className="user-providers-empty-icon">
            ◉
          </div>

          <h2>
            No Providers Available
          </h2>

          <p>
            There are no service providers
            available at the moment.
          </p>

        </div>

      ) : (

        /* ====================================
            PROVIDER GRID
        ==================================== */

        <div className="user-providers-grid">

          {providers.map((provider) => {

            const providerInitial =
              provider.name
                ?.charAt(0)
                ?.toUpperCase() || "P";

            const approvedServices =
              provider.services?.filter(
                (service) =>
                  service.status === "approved"
              ) || [];

            return (
              <div
                key={provider._id}
                className="user-provider-card"
              >

                {/* ================================
                    PROVIDER HEADER
                ================================= */}

                <div className="user-provider-card-header">

                  <div className="user-provider-avatar">
                    {providerInitial}
                  </div>

                  <div className="user-provider-card-info">

                    <h2>
                      {provider.name ||
                        "Provider"}
                    </h2>

                    <span>
                      Service Provider
                    </span>

                  </div>

                </div>


                {/* ================================
                    DESCRIPTION
                ================================= */}

                <p className="user-provider-description">
                  {provider.professionalDescription ||
                    "Professional service provider offering local services."}
                </p>


                {/* ================================
                    DETAILS
                ================================= */}

                <div className="user-provider-details">

                  <div className="user-provider-detail">

                    <span>
                      LOCATION
                    </span>

                    <strong>
                      {provider.location?.city ||
                        "Not provided"}
                    </strong>

                  </div>


                  <div className="user-provider-detail">

                    <span>
                      EXPERIENCE
                    </span>

                    <strong>
                      {provider.experience ||
                        "Not provided"}
                    </strong>

                  </div>

                </div>


                {/* ================================
                    SERVICES
                ================================= */}

                <div className="user-provider-services">

                  <span className="user-provider-services-label">
                    SERVICES
                  </span>

                  <strong className="user-provider-services-count">
                    {approvedServices.length}
                  </strong>

                </div>


                {/* ================================
                    ACTION
                ================================= */}

                <button
                  type="button"
                  className="user-provider-view-button"
                  onClick={() =>
                    handleViewProfile(
                      provider._id
                    )
                  }
                >
                  View Profile
                  <span>→</span>
                </button>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
};

export default UserProviders;