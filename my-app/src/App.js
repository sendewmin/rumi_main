import logo from "./logo.svg";
import "./App.css";
// room listing page import
import ListingPage from "./room_listing/listing_page";
// auth import
import AuthPage from "./auth/authpage";

function App() {
  return (
    <div className="App">
      <AuthPage />
    </div>
  );
}

export default App;
