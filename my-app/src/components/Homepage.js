import React from "react";
import Hero from './Hero';
import CategoryCarousel from './CategoryCarousel';
import PlaceScroller from './PlaceScroller';
import Home_statement from './Home_statement';


export default function Homepage() {
  return (
    <section className="homepage">
        <Hero />
        <CategoryCarousel />
        <Home_statement />
        <PlaceScroller />
      


    </section>
  );
}