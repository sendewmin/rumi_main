import Hero from './Components/Hero';
import CategoryCarousel from './Components/CategoryCarousel';
import PlaceScroller from './Components/PlaceScroller';
import PlaceScroller_1 from './Components/PlaceScroller_1';
import Home_statement from './Components/Home_statement';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Hero />
      <CategoryCarousel />
      <Home_statement />
      <PlaceScroller />
      <PlaceScroller_1 />

    </div>
  );
}

export default App;
