import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {

  // ========================================
  // PROFILE DATA
  // ========================================

  const [profile, setProfile] = useState(null);

  const [originalProfile, setOriginalProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);


  // ========================================
  // EDIT MODE
  // ========================================

  const [isEditing, setIsEditing] = useState(false);


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

      const token = localStorage.getItem("token");

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


      // ====================================
      // FORMAT PROFILE
      // ====================================

      const formattedProfile = {
        ...user,

        location: {
          city: user.location?.city || "",
          state: user.location?.state || "",
          coordinates:
            user.location?.coordinates || [0, 0],
        },

        emergencyContact: {
          name:
            user.emergencyContact?.name || "",

          phone:
            user.emergencyContact?.phone || "",

          relationship:
            user.emergencyContact?.relationship || "",
        },
      };


      setProfile(formattedProfile);

      setOriginalProfile(formattedProfile);

    } catch (error) {

      console.error(
        "Fetch profile error:",
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
  // HANDLE EMERGENCY CONTACT
  // ========================================

  const handleEmergencyChange = (e) => {

    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,

      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value,
      },
    }));
  };


  // ========================================
  // EDIT PROFILE
  // ========================================

  const handleEdit = () => {

    setError("");

    setShowSuccess(false);

    setIsEditing(true);
  };


  // ========================================
  // CANCEL EDIT
  // ========================================

  const handleCancel = () => {

    // Restore original profile
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

      const token = localStorage.getItem("token");


      if (!token) {

        setError("Please login again.");

        return;
      }


      // ====================================
      // UPDATE PROFILE API
      // ====================================

      const response = await axios.put(

        "http://localhost:5000/api/users/profile",

        {
          name: profile.name,

          phone: profile.phone,

          city: profile.location.city,

          state: profile.location.state,

          emergencyContact:
            profile.emergencyContact,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );


      // ====================================
      // UPDATE LOCAL PROFILE
      // ====================================

      const updatedUser = response.data.user;


      const formattedProfile = {

        ...updatedUser,

        location: {
          city:
            updatedUser.location?.city || "",

          state:
            updatedUser.location?.state || "",

          coordinates:
            updatedUser.location?.coordinates ||
            [0, 0],
        },

        emergencyContact: {
          name:
            updatedUser.emergencyContact?.name ||
            "",

          phone:
            updatedUser.emergencyContact?.phone ||
            "",

          relationship:
            updatedUser.emergencyContact
              ?.relationship || "",
        },

      };


      setProfile(formattedProfile);

      setOriginalProfile(formattedProfile);

      setIsEditing(false);


      // ====================================
      // SHOW SUCCESS POPUP
      // ====================================

      setShowSuccess(true);


      // Hide popup after 3 seconds

      setTimeout(() => {

        setShowSuccess(false);

      }, 3000);


    } catch (error) {

      console.error(
        "Update profile error:",
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

      <div className="user-profile-page">

        <div className="profile-loading">

          Loading profile...

        </div>

      </div>

    );
  }


  // ========================================
  // ERROR / PROFILE NOT FOUND
  // ========================================

  if (!profile) {

    return (

      <div className="user-profile-page">

        <div className="profile-error">

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
      ?.toUpperCase() || "U";


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
  // UI
  // ========================================

  return (

    <div className="user-profile-page">


      {/* ====================================
          SUCCESS POPUP
      ==================================== */}

      {showSuccess && (

        <div className="profile-success-popup">

          <div className="profile-success-icon">

            ✓

          </div>


          <div className="profile-success-content">

            <strong>
              Profile updated successfully
            </strong>

            <span>
              Your profile changes have been saved.
            </span>

          </div>


          <button

            type="button"

            className="profile-success-close"

            onClick={() =>
              setShowSuccess(false)
            }

          >

            ×

          </button>

        </div>

      )}


      {/* ====================================
          HEADER
      ==================================== */}

      <div className="user-profile-header">

        <div>

          <span className="profile-eyebrow">

            ACCOUNT

          </span>


          <h1>

            My Profile

          </h1>


          <p>

            Manage your personal information and
            account details.

          </p>

        </div>

      </div>


      {/* ====================================
          ERROR MESSAGE
      ==================================== */}

      {error && (

        <div className="profile-error">

          {error}

        </div>

      )}


      {/* ====================================
          PROFILE HERO
      ==================================== */}

      <div className="user-profile-hero">

        <div className="profile-avatar">

          {profileInitial}

        </div>


        <div className="profile-hero-info">

          <h2>

            {profile.name || "Your Name"}

          </h2>


          <p>

            {profile.email}

          </p>


          <span className="profile-role">

            {profile.role}

          </span>

        </div>

      </div>


      {/* ====================================
          PERSONAL INFORMATION
      ==================================== */}

      <div className="profile-card">

        <div className="profile-card-header">

          <div>

            <h2>
              Personal Information
            </h2>

            <p>
              Your basic account information.
            </p>

          </div>

        </div>


        <div className="profile-form-grid">


          {/* NAME */}

          <div className="profile-form-group">

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

          <div className="profile-form-group">

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

          <div className="profile-form-group">

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
          LOCATION
      ==================================== */}

      <div className="profile-card">

        <div className="profile-card-header">

          <div>

            <h2>
              Location
            </h2>

            <p>
              Used to provide relevant local
              services.
            </p>

          </div>

        </div>


        <div className="profile-form-grid">


          {/* CITY */}

          <div className="profile-form-group">

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

          <div className="profile-form-group">

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
          EMERGENCY CONTACT
      ==================================== */}

      <div className="profile-card">

        <div className="profile-card-header">

          <div>

            <h2>
              Emergency Contact
            </h2>

            <p>
              Someone we can contact if necessary
              during a service.
            </p>

          </div>

        </div>


        <div className="profile-form-grid">


          {/* CONTACT NAME */}

          <div className="profile-form-group">

            <label>
              Contact Name
            </label>

            <input

              type="text"

              name="name"

              value={
                profile.emergencyContact?.name ||
                ""
              }

              onChange={handleEmergencyChange}

              placeholder="Enter contact name"

              disabled={!isEditing}

            />

          </div>


          {/* CONTACT PHONE */}

          <div className="profile-form-group">

            <label>
              Contact Phone
            </label>

            <input

              type="tel"

              name="phone"

              value={
                profile.emergencyContact?.phone ||
                ""
              }

              onChange={handleEmergencyChange}

              placeholder="Enter contact phone"

              disabled={!isEditing}

            />

          </div>


          {/* RELATIONSHIP */}

          <div className="profile-form-group">

            <label>
              Relationship
            </label>

            <select

              name="relationship"

              value={
                profile.emergencyContact
                  ?.relationship || ""
              }

              onChange={handleEmergencyChange}

              disabled={!isEditing}

            >

              <option value="">
                Select relationship
              </option>

              <option value="Parent">
                Parent
              </option>

              <option value="Spouse">
                Spouse
              </option>

              <option value="Sibling">
                Sibling
              </option>

              <option value="Friend">
                Friend
              </option>

              <option value="Relative">
                Relative
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>

        </div>

      </div>


      {/* ====================================
          ACCOUNT INFORMATION
      ==================================== */}

      <div className="profile-card">

        <div className="profile-card-header">

          <div>

            <h2>
              Account
            </h2>

            <p>
              Information about your account.
            </p>

          </div>

        </div>


        <div className="profile-account-grid">


          {/* ACCOUNT TYPE */}

          <div className="profile-account-item">

            <span>
              ACCOUNT TYPE
            </span>

            <strong>
              {profile.role}
            </strong>

          </div>


          {/* MEMBER SINCE */}

          <div className="profile-account-item">

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

      <div className="profile-actions">


        {!isEditing ? (

          <button

            type="button"

            className="profile-edit-button"

            onClick={handleEdit}

          >

            Edit Profile

          </button>

        ) : (

          <>

            <button

              type="button"

              className="profile-save-button"

              onClick={handleSave}

              disabled={saving}

            >

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>


            <button

              type="button"

              className="profile-cancel-button"

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

export default UserProfile;