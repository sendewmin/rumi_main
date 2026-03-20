
import React from "react";
import Kandy from "./Kandy.png";
import Colombo from "./Colombo.png";
import Galle from "./Galle.png";
import Negombo from "./Negombo.png";
import "./PlaceScroller.css";


const images = [
  Kandy,
  Colombo,
  Galle,
  Negombo
];

const PlaceScroller = () => {
  return (
    
    <div className="scroller-container">
      <div className="scroller-track-left">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`place-${index}`} className="scroller-image" />
        ))}
        
        {/* Duplicate images */}
        {images.map((img, index) => (
          <img key={index + images.length} src={img} alt={`place-duplicate-${index}`} className="scroller-image" />
        ))}
      </div>
    </div>
  );
};

export default PlaceScroller;

