
import './App.css';
// room listing_page import
import ListingPage from "./room_listing/listing_page";
import RoomImageUpload from './components/room_image_upload';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TenantSignup from './components/TenantSignup';
import LandlordSignup from './components/LandlordSignup';
import LandlordPage from './user_roles/page/land_lord';
import Homepage from './components/Homepage';

function App() {
  return (
    <div className="App">


      <Homepage />


      <ListingPage/>
      {/* <RoomImageUpload/> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandlordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/tenant" element={<TenantSignup />} />
          <Route path="/signup/landlord" element={<LandlordSignup />} />
          <Route path="/landlord" element={<LandlordPage />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;