import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TenantSignup from './components/TenantSignup';
import LandlordSignup from './components/LandlordSignup';
import LandlordDashboard from './components/LandlordDashboard';
import Homepage from './components/Homepage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandlordDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup/tenant" element={<TenantSignup />} />
          <Route path="/signup/landlord" element={<LandlordSignup />} />
          <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
