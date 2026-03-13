<<<<<<< HEAD
import Hero from './Components/Hero';
import CategoryCarousel from './Components/CategoryCarousel';
import PlaceScroller from './Components/PlaceScroller';
import PlaceScroller_1 from './Components/PlaceScroller_1';
import Home_statement from './Components/Home_statement';
=======
>>>>>>> 8989b5c21f8ec848872d1cc2e6d436c5455c2238

import logo from './logo.svg';
import './App.css';
// room listing_page import
import ListingPage from "./room_listing/listing_page";

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <Hero />
      <CategoryCarousel />
      <Home_statement />
      <PlaceScroller />
      <PlaceScroller_1 />

=======
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <ListingPage/>
>>>>>>> 8989b5c21f8ec848872d1cc2e6d436c5455c2238
    </div>
  );


}

export default App;