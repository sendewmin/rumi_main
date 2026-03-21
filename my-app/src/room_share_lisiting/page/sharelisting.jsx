import { useState } from "react";
import Header from "../component/shareheader";
import ShareFilterBar from "../component/ShareFilterBar";
import RoomShareCard from "../component/sharecard";
import roomShareData from "../data/sharedata";
import Footer from "../component/footer";
import Map from "../../map/Map";

import "../styles/share.css";
import "../styles/sharefilter.css";
import "../styles/shareheader.css";

const RoomShareListing = () => {
  const [filteredRooms, setFilteredRooms] = useState(roomShareData);
  const [highlightedRoom, setHighlightedRoom] = useState(null);
  const [showMap, setShowMap] = useState(false); // map hidden

  const handleSearch = (filters) => {
    const results = roomShareData.filter((room) => {
      const matchLocation =
        !filters.location ||
        room.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchBudget = () => {
        if (!filters.budget) return true;
        if (filters.budget === "below20000") return room.rent < 20000;
        if (filters.budget === "20000to30000") return room.rent >= 20000 && room.rent <= 30000;
        if (filters.budget === "above30000") return room.rent > 30000;
        return true;
      };

      const matchGender =
        !filters.gender || room.gender === filters.gender;

      return matchLocation && matchGender && matchBudget();
    });

    setFilteredRooms(results);
  };

  return (
    <>
      <Header />
      <ShareFilterBar onSearch={handleSearch} /> <br /><br /><br />

      <div className="listing-wrapper">
        {/* scrollable room list */}
        <div className="room-list" style={{ flex: showMap ? 1 : '100%' }}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                onMouseEnter={() => setHighlightedRoom(room.id)}
                onMouseLeave={() => setHighlightedRoom(null)}
              >
                <RoomShareCard room={room} />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No rooms found</p>
          )}
        </div>

        {/* Map container */}
        <div className={`map-container ${showMap ? 'show' : 'hide'}`}>
          <Map
            locations={filteredRooms.map((r) => ({
              id: r.id,
              lat: r.latitude,
              lng: r.longitude,
              location: r.location,
            }))}
            highlightId={highlightedRoom}
          />
        </div>

        {/* Toggle button */}
        <button
          className="toggle-map-btn"
          onClick={() => setShowMap(!showMap)}
        >
          {showMap ? '»' : '🌍'}
        </button>
      </div>

      <Footer />
    </>
  );
};

export default RoomShareListing;

