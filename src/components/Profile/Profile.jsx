import React from "react";
import "./Profile.css";
import "font-awesome/css/font-awesome.min.css";

const Profile = ({ name, address, profileImageUrl, updatedPlace }) => {
  console.log(name, profileImageUrl);

  // This function handles the click event to update the map location
  function handleUpdatePlace(event) {
    event.preventDefault();
    updatedPlace(address); // Update the place for GoogleMap
  }

  return (
    <div className="profile">
      <div className="profile-images">
        <img src={profileImageUrl} alt={name} />
      </div>

      <div className="details-container">
        <h4>{name}</h4>
        <div className="details">
          <span>
            <a href="#" onClick={handleUpdatePlace} className="location-icon">
              <i className="fa fa-location-arrow fa-lg"></i>
            </a>
          </span>
          <span className="order price">
            <a href="#">Order Now</a>
          </span>
          <span className="order price">
            <a href="#">Reserve</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
