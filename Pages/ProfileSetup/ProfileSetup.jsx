import React, { useState } from "react";
import { supabase } from "../../src/lib/helper/supabaseClient";
import { useNavigate } from "react-router-dom";

function ProfileSetup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    businessName: "",
    businessNumber: "",
    businessType: "",
    address: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(""); // State for the profile image URL
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    try {
      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading image:", error);
        throw error;
      }

      // Generate the image URL
      const url = `https://jackylkenbhvhszghcra.supabase.co/storage/v1/object/public/profile-images/${fileName}`;
      return url;
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      let uploadedImageUrl = "";

      if (imageFile) {
        uploadedImageUrl = await handleImageUpload(imageFile);
        if (!uploadedImageUrl) throw new Error("Error uploading image");
        setProfileImageUrl(uploadedImageUrl); // Update the state with the image URL
      }

      if (user) {
        const { data: existingProfile, error: fetchError } = await supabase
          .from("business_owner")
          .select("*")
          .eq("id", user.id) // Ensure column and data type match
          .single();

        if (fetchError) throw fetchError;

        const { error } = await supabase.from("business_owner").upsert([
          {
            id: user.id, // Ensure this matches your table schema
            email: user.email, // Ensure this matches your table schema
            first_name: formData.firstName,
            last_name: formData.lastName,
            business_name: formData.businessName,
            business_number: formData.businessNumber,
            business_type: formData.businessType,
            address: formData.address,
            profile_image_url: uploadedImageUrl,
          },
        ]);

        if (error) throw error;

        navigate("/dashboard");
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <label htmlFor="firstName">First Name:</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="businessName">Business Name:</label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="businessNumber">Business Number:</label>
        <input
          id="businessNumber"
          name="businessNumber"
          type="text"
          value={formData.businessNumber}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="businessType">Business Type:</label>
        <input
          id="businessType"
          name="businessType"
          type="text"
          value={formData.businessType}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="address">Address:</label>
        <input
          id="address"
          name="address"
          type="text"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <label htmlFor="profileImage">Profile Image:</label>
        <input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
      {profileImageUrl && (
        <div>
          <h2>Profile Image:</h2>
          <img
            src={profileImageUrl}
            alt="Profile"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </div>
      )}
    </>
  );
}

export default ProfileSetup;
