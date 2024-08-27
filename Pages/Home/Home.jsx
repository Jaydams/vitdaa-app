import React, { useState, useEffect } from "react";
import Navbar from "../../src/components/Navbar/Navbar.jsx";
import Profile from "../../src/components/Profile/Profile";
import GoogleMap from "../../src/components/GoogleMap/GoogleMap.jsx";
import { supabase } from "../../src/lib/helper/supabaseClient.js";

function Home() {
  const [businesses, setBusinesses] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for filtering profiles
  const [place, setPlace] = useState("Kaduna"); // State for GoogleMap location

  // Fetch all business details on component mount
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data: businesses, error: fetchError } = await supabase
          .from("business_owner")
          .select("id, business_name, address, profile_image_url");

        if (fetchError) throw fetchError;
        setBusinesses(businesses);
        console.log(businesses);
      } catch (error) {
        setError("Error fetching businesses: " + error.message);
      }
    };

    fetchBusinesses();
  }, []);

  // Function to update the search term state
  const updatedSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  // Function to update the map location
  const updatedPlace = (newPlace) => {
    setPlace(newPlace);
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} updatedSearch={updatedSearch} />
      <div className="main-body">
        <div className="inner-container">
          <h1 className="page-title">Welcome to Vitdaa</h1>
          <p className="page-description">Where order and booking is fun</p>
          <div className="profiles">
            {businesses
              .filter((business) =>
                business.business_name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .map((business) => (
                <Profile
                  key={business.id}
                  name={business.business_name}
                  address={business.address}
                  profileImageUrl={business.profile_image_url}
                  updatedPlace={updatedPlace}
                />
              ))}
          </div>
        </div>

        <div className="map">
          <GoogleMap newplace={place} />
        </div>
      </div>
    </>
  );
}

export default Home;
