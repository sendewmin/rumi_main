import React, { useState, useEffect } from "react";
import Room from './Room.png';
import Annex from './Annex.png';
import Home from './Home.png';
import Apartment from './Apartment.png';
import Boarding from './Boarding.png';
import "./CategoryCarousel.css";

const categories = [
  { img: Room,      name: 'Room' },
  { img: Annex,     name: 'Annex' },
  { img: Home,      name: 'House' },
  { img: Apartment, name: 'Apartment' },
  { img: Boarding,  name: 'Boarding' },
];

const CategoryCarousel = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % categories.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const getPos = (index) => {
    const diff = (index - active + categories.length) % categories.length;
    switch (diff) {
      case 0:                      return 'center';
      case 1:                      return 'right';
      case 2:                      return 'far-right';
      case categories.length - 1: return 'left';
      case categories.length - 2: return 'far-left';
      default:                     return '';
    }
  };

  return (
    <div className="cat-wrap">
      {/* 3-D coverflow */}
      <div className="cat-carousel" aria-label="Browse room categories">
        {categories.map(({ img, name }, i) => {
          const pos = getPos(i);
          return (
            <div
              key={name}
              className={`cat-item ${pos}`}
              onClick={() => setActive(i)}
              onKeyDown={e => e.key === 'Enter' && setActive(i)}
              role="button"
              tabIndex={0}
              aria-label={`Browse ${name}`}
              aria-pressed={pos === 'center'}
            >
              <img src={img} alt={name} className="cat-img" draggable={false} />
            </div>
          );
        })}
      </div>

      {/* Category tab pills */}
      <div className="cat-tabs" role="tablist" aria-label="Select category">
        {categories.map(({ name }, i) => (
          <button
            key={name}
            className={`cat-tab${i === active ? ' cat-tab--active' : ''}`}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={i === active}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
