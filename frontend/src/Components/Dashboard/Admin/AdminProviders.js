import React, { useEffect, useState } from "react";
import { getProviders } from "../../../Services/providerService";

const AdminProviders = () => {

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProviders = async () => {
    try {
      setLoading(true);

      const data = await getProviders();

      console.log("PROVIDERS:", data);

      setProviders(
        Array.isArray(data)
          ? data
          : data.providers || []
      );

    } catch (error) {
      console.error("Failed to load providers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  return (
    <section className="admin-providers-section">

      <div className="admin-section-header">

        <div>
          <span className="admin-label">
            PROVIDER MANAGEMENT
          </span>

          <h2>
            Service Providers
          </h2>

          <p>
            View and manage registered service providers.
          </p>
        </div>

      </div>

      {loading ? (

        <div className="admin-empty-state">
          <h3>Loading providers...</h3>
        </div>

      ) : providers.length === 0 ? (

        <div className="admin-empty-state">

          <div className="admin-empty-icon">
            👥
          </div>

          <h3>
            No Providers Found
          </h3>

          <p>
            Registered providers will appear here.
          </p>

        </div>

      ) : (

<div className="admin-providers-grid">

  {providers.map((provider) => (

    <div
      className="admin-provider-card"
      key={provider._id}
    >

      <div className="provider-card-icon">
        👤
      </div>

      <div className="provider-card-info">

        <h3>
          {provider.name}
        </h3>

        <p>
          {provider.email}
        </p>

        <span className="provider-role">
          Provider
        </span>

      </div>

      <div className="provider-card-actions">

        <button
          type="button"
          className="provider-view-btn"
          onClick={() =>
            alert(`Provider: ${provider.name}`)
          }
        >
          View
        </button>

      </div>

    </div>

  ))}

</div>

      )}

    </section>
  );
};

export default AdminProviders;