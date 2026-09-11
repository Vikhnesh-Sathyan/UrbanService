import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProviderProfile.css";

const ProviderProfile = () => {

  // ========================================
  // PROFILE DATA
  // ========================================

  const [profile, setProfile] = useState(null);

  const [originalProfile, setOriginalProfile] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showSuccess, setShowSuccess] =
    useState(false);

  // ========================================
  // EDIT MODE
  // ========================================

  const [isEditing, setIsEditing] =
    useState(false);

  // ========================================
  // FETCH PROFILE
  // ========================================

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.user;

      // Make sure nested objects exist
      const formattedProfile = {
        ...user,

        location: {
          city:
            user.location?.city || "",

          state:
            user.location?.state || "",
        },

        availability: {
          days:
            user.availability?.days || [],

          startTime:
            user.availability?.startTime || "09:00",

          endTime:
            user.availability?.endTime || "18:00",
        },
      };

      setProfile(formattedProfile);

      setOriginalProfile(formattedProfile);

    } catch (error) {

      console.error(
        "Fetch provider profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to load profile."
      );

    } finally {

      setLoading(false);

    }
  };

  // ========================================
  // HANDLE BASIC INPUT
  // ========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE LOCATION INPUT
  // ========================================

  const handleLocationChange = (e) => {

    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,

      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  // ========================================
  // EDIT PROFILE
  // ========================================

  const handleEdit = () => {

    setError("");

    setIsEditing(true);
  };

  // ========================================
  // CANCEL EDIT
  // ========================================

  const handleCancel = () => {

    setProfile(originalProfile);

    setError("");

    setIsEditing(false);
  };

  // ========================================
  // SAVE PROFILE
  // ========================================

  const handleSave = async () => {

    try {

      setSaving(true);

      setError("");

      const token =
        localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        {
          name: profile.name,
          phone: profile.phone,

          professionalDescription:
            profile.professionalDescription,

          experience:
            profile.experience,

          city:
            profile.location.city,

          state:
            profile.location.state,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const updatedUser =
        response.data.user;

      const formattedProfile = {
        ...updatedUser,

        location: {
          city:
            updatedUser.location?.city || "",

          state:
            updatedUser.location?.state || "",
        },

        availability: {
          days:
            updatedUser.availability?.days || [],

          startTime:
            updatedUser.availability?.startTime ||
            "09:00",

          endTime:
            updatedUser.availability?.endTime ||
            "18:00",
        },
      };

      setProfile(formattedProfile);

      setOriginalProfile(formattedProfile);

      setIsEditing(false);

      // Show success popup
      setShowSuccess(true);

      // Hide popup automatically
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (error) {

      console.error(
        "Update provider profile error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to update profile."
      );

    } finally {

      setSaving(false);

    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (
      <div className="provider-profile-page">

        <div className="provider-profile-loading">
          Loading profile...
        </div>

      </div>
    );
  }

  // ========================================
  // PROFILE NOT FOUND
  // ========================================

  if (!profile) {

    return (
      <div className="provider-profile-page">

        <div className="provider-profile-error">
          {error || "Profile not found."}
        </div>

      </div>
    );
  }

  // ========================================
  // PROFILE INITIAL
  // ========================================

  const profileInitial =
    profile.name
      ?.charAt(0)
      ?.toUpperCase() || "P";

  // ========================================
  // MEMBER SINCE
  // ========================================

  const memberSince = profile.createdAt
    ? new Date(
        profile.createdAt
      ).toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      )
    : "—";

  // ========================================
  // FORMAT TIME
  // ========================================

  const formatTime = (time) => {

    if (!time) {
      return "—";
    }

    const [hours, minutes] =
      time.split(":");

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
  // UI
  // ========================================

  return (
    <div className="provider-profile-page">

      {/* ====================================
          HEADER
      ==================================== */}

      <div className="provider-profile-header">

        <div>

          <span className="provider-profile-eyebrow">
            PROFESSIONAL ACCOUNT
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your professional information
            and account details.
          </p>

        </div>

      </div>


      {/* ====================================
          SUCCESS POPUP
      ==================================== */}

      {showSuccess && (

        <div className="provider-success-popup">

          <div className="provider-success-icon">
            ✓
          </div>

          <div className="provider-success-content">

            <strong>
              Profile updated successfully
            </strong>

            <span>
              Your profile changes have been saved.
            </span>

          </div>

          <button
            type="button"
            className="provider-success-close"
            onClick={() =>
              setShowSuccess(false)
            }
          >
            ×
          </button>

        </div>
      )}


      {/* ====================================
          ERROR
      ==================================== */}

      {error && (

        <div className="provider-profile-error">
          {error}
        </div>

      )}


      {/* ====================================
          PROFILE HERO
      ==================================== */}

      <div className="provider-profile-hero">

        <div className="provider-profile-avatar">
          {profileInitial}
        </div>

        <div className="provider-profile-hero-info">

          <h2>
            {profile.name || "Your Name"}
          </h2>

          <p>
            {profile.email}
          </p>

          <span className="provider-profile-role">
            Service Provider
          </span>

        </div>

      </div>


      {/* ====================================
          PERSONAL INFORMATION
      ==================================== */}

      <div className="provider-profile-card">

        <div className="provider-profile-card-header">

          <div>

            <h2>
              Personal Information
            </h2>

            <p>
              Your basic account information.
            </p>

          </div>

        </div>


        <div className="provider-profile-form-grid">

          {/* NAME */}

          <div className="provider-profile-form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />

          </div>


          {/* EMAIL */}

          <div className="provider-profile-form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              value={profile.email || ""}
              disabled
            />

            <small>
              Email cannot be changed here.
            </small>

          </div>


          {/* PHONE */}

          <div className="provider-profile-form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              placeholder="Enter phone number"
              disabled={!isEditing}
            />

          </div>

        </div>

      </div>


      {/* ====================================
          PROFESSIONAL INFORMATION
      ==================================== */}

      <div className="provider-profile-card">

        <div className="provider-profile-card-header">

          <div>

            <h2>
              Professional Information
            </h2>

            <p>
              Information customers can use to
              understand your professional background.
            </p>

          </div>

        </div>


        <div className="provider-profile-form-grid">

          {/* EXPERIENCE */}

          <div className="provider-profile-form-group">

            <label>
              Experience
            </label>

            <select
              name="experience"
              value={profile.experience || ""}
              onChange={handleChange}
              disabled={!isEditing}
            >

              <option value="">
                Select experience
              </option>

              <option value="Less than 1 year">
                Less than 1 year
              </option>

              <option value="1 - 2 years">
                1 - 2 years
              </option>

              <option value="3 - 5 years">
                3 - 5 years
              </option>

              <option value="5 - 10 years">
                5 - 10 years
              </option>

              <option value="10+ years">
                10+ years
              </option>

            </select>

          </div>


          {/* PROFESSIONAL DESCRIPTION */}

          <div className="provider-profile-form-group provider-description-group">

            <label>
              Professional Description
            </label>

            <textarea
              name="professionalDescription"
              value={
                profile.professionalDescription || ""
              }
              onChange={handleChange}
              placeholder="Tell customers about your professional experience and expertise."
              disabled={!isEditing}
              rows="5"
            />

          </div>

        </div>

      </div>


      {/* ====================================
          LOCATION
      ==================================== */}

      <div className="provider-profile-card">

        <div className="provider-profile-card-header">

          <div>

            <h2>
              Location
            </h2>

            <p>
              Your service location.
            </p>

          </div>

        </div>


        <div className="provider-profile-form-grid">

          {/* CITY */}

          <div className="provider-profile-form-group">

            <label>
              City
            </label>

            <input
              type="text"
              name="city"
              value={
                profile.location?.city || ""
              }
              onChange={handleLocationChange}
              placeholder="Enter your city"
              disabled={!isEditing}
            />

          </div>


          {/* STATE */}

          <div className="provider-profile-form-group">

            <label>
              State
            </label>

            <input
              type="text"
              name="state"
              value={
                profile.location?.state || ""
              }
              onChange={handleLocationChange}
              placeholder="Enter your state"
              disabled={!isEditing}
            />

          </div>

        </div>

      </div>


      {/* ====================================
          AVAILABILITY
      ==================================== */}

      <div className="provider-profile-card">

        <div className="provider-profile-card-header">

          <div>

            <h2>
              Availability
            </h2>

            <p>
              Your current working schedule.
              Manage this from the Availability page.
            </p>

          </div>

        </div>


        {/* WORKING DAYS */}

        <div className="provider-working-days">

          <span className="provider-section-label">
            WORKING DAYS
          </span>

          <div className="provider-day-list">

            {profile.availability?.days?.length > 0
              ? profile.availability.days.map(
                  (day) => (
                    <span
                      key={day}
                      className="provider-day-badge"
                    >
                      {day}
                    </span>
                  )
                )
              : (
                <span className="provider-no-data">
                  No working days set
                </span>
              )}

          </div>

        </div>


        {/* TIME */}

        <div className="provider-availability-time">

          <div className="provider-time-item">

            <span>
              START TIME
            </span>

            <strong>
              {formatTime(
                profile.availability?.startTime
              )}
            </strong>

          </div>


          <div className="provider-time-item">

            <span>
              END TIME
            </span>

            <strong>
              {formatTime(
                profile.availability?.endTime
              )}
            </strong>

          </div>

        </div>

      </div>


      {/* ====================================
          ACCOUNT
      ==================================== */}

      <div className="provider-profile-card">

        <div className="provider-profile-card-header">

          <div>

            <h2>
              Account
            </h2>

            <p>
              Information about your account.
            </p>

          </div>

        </div>


        <div className="provider-profile-account-grid">

          <div className="provider-profile-account-item">

            <span>
              ACCOUNT TYPE
            </span>

            <strong>
              Provider
            </strong>

          </div>


          <div className="provider-profile-account-item">

            <span>
              MEMBER SINCE
            </span>

            <strong>
              {memberSince}
            </strong>

          </div>

        </div>

      </div>


      {/* ====================================
          ACTIONS
      ==================================== */}

      <div className="provider-profile-actions">

        {!isEditing ? (

          <button
            type="button"
            className="provider-profile-edit-button"
            onClick={handleEdit}
          >
            Edit Profile
          </button>

        ) : (

          <>

            <button
              type="button"
              className="provider-profile-save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              type="button"
              className="provider-profile-cancel-button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </>

        )}

      </div>

    </div>
  );
};

export default ProviderProfile;