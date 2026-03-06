import { useState } from "react";
import { supabase } from "./supabaseClient";

const ROLES = ["Student", "Teacher", "Admin", "Developer", "Manager", "Other"];

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    role: "",
    email: "",
    password: "",
  });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setMessage("");

    if (mode === "signup") {
      // 1. Create the auth user
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });
      if (error) return setMessage("Error: " + error.message);

      // 2. Save extra profile info
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: data.user.id,
          first_name: form.firstName,
          last_name: form.lastName,
          age: parseInt(form.age),
          role: form.role,
          email: form.email,
        },
      ]);
      if (profileError)
        return setMessage("Profile error: " + profileError.message);

      setMessage("✅ Account created! Check your email to confirm.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) return setMessage("Error: " + error.message);
      setMessage("✅ Signed in successfully!");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "60px auto",
        fontFamily: "sans-serif",
        padding: "0 16px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        {mode === "login" ? "Sign In" : "Sign Up"}
      </h2>

      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          marginBottom: 24,
          borderBottom: "2px solid #eee",
        }}
      >
        {["login", "signup"].map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setMessage("");
            }}
            style={{
              flex: 1,
              padding: "10px",
              border: "none",
              cursor: "pointer",
              background: "none",
              fontWeight: mode === m ? "bold" : "normal",
              borderBottom: mode === m ? "2px solid #000" : "none",
              marginBottom: "-2px",
              fontSize: 15,
            }}
          >
            {m === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Sign Up only fields */}
      {mode === "signup" && (
        <>
          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={set("firstName")}
            style={inputStyle}
          />
          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={set("lastName")}
            style={inputStyle}
          />
          <input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={set("age")}
            style={inputStyle}
          />
          <select value={form.role} onChange={set("role")} style={inputStyle}>
            <option value="">Select Role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Shared fields */}
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        style={inputStyle}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={set("password")}
        style={inputStyle}
      />

      {/* Message */}
      {message && (
        <p
          style={{
            color: message.startsWith("✅") ? "green" : "red",
            fontSize: 14,
            marginBottom: 12,
          }}
        >
          {message}
        </p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 15,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
      </button>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  marginBottom: 12,
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 15,
  boxSizing: "border-box",
  fontFamily: "sans-serif",
};
