import { useAuth } from "./AuthContext";
import { supabase } from "./supabaseClient";

export default function Dashboard() {
  const { profile, loading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "80px auto",
        fontFamily: "sans-serif",
        padding: "0 16px",
      }}
    >
      <h2 style={{ marginBottom: 4 }}>Welcome, {profile?.first_name}!</h2>
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
        Here are your details
      </p>

      <table
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}
      >
        {[
          { label: "First Name", value: profile?.first_name },
          { label: "Last Name", value: profile?.last_name },
          { label: "Email", value: profile?.email },
          { label: "Age", value: profile?.age },
          { label: "Role", value: profile?.role },
        ].map((row) => (
          <tr key={row.label} style={{ borderBottom: "1px solid #eee" }}>
            <td
              style={{
                padding: "10px 8px",
                color: "#888",
                width: "40%",
                fontSize: 14,
              }}
            >
              {row.label}
            </td>
            <td style={{ padding: "10px 8px", fontWeight: 600, fontSize: 14 }}>
              {row.value}
            </td>
          </tr>
        ))}
      </table>

      <button
        onClick={handleSignOut}
        style={{
          width: "100%",
          padding: "10px 0",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 14,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Sign Out
      </button>
    </div>
  );
}
