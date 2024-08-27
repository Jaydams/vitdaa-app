import React from "react";

const GoogleMap = (props) => {
  const iframeSrc = `https://www.google.com/maps/embed/v1/place?q=${props.newplace}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8`;

  const mapStyles = {
    overflow: "hidden",
    resize: "none",
    maxWidth: "100%",
    width: "500px",
    height: "700px",
  };

  const iframeStyles = {
    height: "100%",
    width: "100%",
    border: 0,
  };

  const gmapCanvasStyles = {
    height: "100%",
    width: "100%",
    maxWidth: "100%",
  };

  return (
    <div style={mapStyles}>
      <div id="gmap-canvas" style={gmapCanvasStyles}>
        <iframe
          style={iframeStyles}
          frameBorder="0"
          src={iframeSrc}
          allowFullScreen
          title="Google Map"
        ></iframe>
      </div>
      <a
        className="googlemaps-made"
        href="https://www.bootstrapskins.com/themes"
        id="auth-map-data"
      >
        premium bootstrap themes
      </a>
      <style>{`
        #gmap-canvas img {
          max-width: none !important;
          background: none !important;
          font-size: inherit;
          font-weight: inherit;
        }
      `}</style>
    </div>
  );
};

export default GoogleMap;
