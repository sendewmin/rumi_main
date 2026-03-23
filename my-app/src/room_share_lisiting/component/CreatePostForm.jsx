import { useState } from "react";
import roomSharePostApi from "../../api/roomSharePostApi";

const CreatePostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    rent_per_person: "",
    gender_preference: "",
    total_spots: "",
    available_spots: "",
    move_in_date: "",
    poster_name: "",
    contact_number: "",
    description: "",
    preferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await roomSharePostApi.createPost({
        ...formData,
        rent_per_person: parseInt(formData.rent_per_person),
        total_spots: parseInt(formData.total_spots),
        available_spots: parseInt(formData.available_spots),
      });
      setSuccess(true);
      setFormData({
        title: "", location: "", rent_per_person: "", gender_preference: "",
        total_spots: "", available_spots: "", move_in_date: "",
        poster_name: "", contact_number: "", description: "", preferences: "",
      });
      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
      <h2 style={{ marginBottom: "16px", color: "#1E293B" }}>Post a Room Sharing Ad</h2>

      {success && <p style={{ color: "green", marginBottom: "12px" }}>✅ Post created successfully!</p>}
      {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

          <div>
            <label>Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required
              placeholder="e.g. Looking for female roommate near IIT"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Location *</label>
            <input name="location" value={formData.location} onChange={handleChange} required
              placeholder="e.g. Colombo 07"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Rent per Person (LKR) *</label>
            <input name="rent_per_person" type="number" value={formData.rent_per_person} onChange={handleChange} required
              placeholder="e.g. 15000"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Gender Preference *</label>
            <select name="gender_preference" value={formData.gender_preference} onChange={handleChange} required
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Any">Any</option>
            </select>
          </div>

          <div>
            <label>Total Spots *</label>
            <input name="total_spots" type="number" value={formData.total_spots} onChange={handleChange} required
              placeholder="e.g. 3"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Available Spots *</label>
            <input name="available_spots" type="number" value={formData.available_spots} onChange={handleChange} required
              placeholder="e.g. 1"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Move In Date *</label>
            <input name="move_in_date" type="date" value={formData.move_in_date} onChange={handleChange} required
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Your Name *</label>
            <input name="poster_name" value={formData.poster_name} onChange={handleChange} required
              placeholder="e.g. Akshaiaan"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Contact Number *</label>
            <input name="contact_number" value={formData.contact_number} onChange={handleChange} required
              placeholder="e.g. 0771234567"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div>
            <label>Preferences</label>
            <input name="preferences" value={formData.preferences} onChange={handleChange}
              placeholder="e.g. Students only, no pets"
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required
              placeholder="Describe the room, facilities, location details..."
              rows={3}
              style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
          </div>

        </div>

        <button type="submit" disabled={loading}
          style={{ marginTop: "16px", background: "#2563eb", color: "white", padding: "10px 24px",
            border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
          {loading ? "Posting..." : "Post Ad"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;