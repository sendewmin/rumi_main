
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import TenantSignup from './components/TenantSignup';
import LandlordSignup from './components/LandlordSignup';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup/tenant" element={<TenantSignup />} />
          <Route path="/signup/landlord" element={<LandlordSignup />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;