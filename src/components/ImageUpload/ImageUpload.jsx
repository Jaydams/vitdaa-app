import React, { useState } from "react";
import { supabase } from "../../lib/helper/supabaseClient"; // Adjust the import path

const ImageUpload = ({ onUpload }) => {
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("No image selected");
      return;
    }

    const fileName = `${Date.now()}_${imageFile.name}`;
    try {
      const { data, error: uploadError } = await supabase.storage
        .from("menu-images") // Ensure this matches your bucket name
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        setError("Error uploading image: " + uploadError.message);
        return;
      }

      const url = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/menu-images/${fileName}`;
      onUpload(url); // Pass the image URL to parent component

      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("Error in handleUpload:", error);
      setError("Error uploading image: " + error.message);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ImageUpload;
