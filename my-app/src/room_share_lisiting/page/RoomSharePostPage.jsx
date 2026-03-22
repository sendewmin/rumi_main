import { useState, useEffect } from "react";
import CreatePostForm from "../component/CreatePostForm";
import roomSharePostApi from "../../api/roomSharePostApi";
import "../styles/share.css";

const RoomSharePostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomSharePostApi.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError("Could not load posts. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 120px", background: "#f8fafc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ color: "#1E293B", margin: 0 }}>Room Sharing Board</h1>
          <p style={{ color: "#64748B", margin: 0 }}>Find or post room sharing ads</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: "#2563eb", color: "white", padding: "10px 24px",
            border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>
          {showForm ? "Hide Form" : "+ Post an Ad"}
        </button>
      </div>

      {/* Create Post Form */}
      {showForm && (
        <CreatePostForm onPostCreated={() => {
          fetchPosts();
          setShowForm(false);
        }} />
      )}

      {/* Posts List */}
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading posts...</p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : posts.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {posts.map((post) => (
            <div key={post.id} style={{
              background: "white", borderRadius: "16px", padding: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "#1E293B" }}>{post.title}</h3>
                  <p style={{ color: "#2563eb", margin: "0 0 4px 0" }}>📍 {post.location}</p>
                  <p style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>LKR {post.rent_per_person?.toLocaleString()} / person</p>
                  <p style={{ color: "#555", margin: "0 0 8px 0" }}>{post.description}</p>
                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ background: "#EFF6FF", color: "#2563eb", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>
                      👤 {post.gender_preference}
                    </span>
                    <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>
                      🏠 {post.available_spots}/{post.total_spots} spots available
                    </span>
                    <span style={{ background: "#FFF7ED", color: "#EA580C", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>
                      📅 Move in: {post.move_in_date}
                    </span>
                    {post.preferences && (
                      <span style={{ background: "#F8FAFC", color: "#64748B", padding: "4px 10px", borderRadius: "20px", fontSize: "13px" }}>
                        ✨ {post.preferences}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: "150px" }}>
                  <p style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>{post.poster_name}</p>
                  <p style={{ color: "#555", margin: "0 0 8px 0" }}>📞 {post.contact_number}</p>
                  <button style={{ background: "#2563eb", color: "white", padding: "8px 16px",
                    border: "none", borderRadius: "8px", cursor: "pointer" }}>
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ fontSize: "18px", color: "#64748B" }}>No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  );
};

export default RoomSharePostPage;