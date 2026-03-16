import { useState } from "react";
import { supabase } from "./supabaseClient";

// Only Tenant and Landlord roles are available in RUMI
const ROLES = ["Tenant", "Landlord"];

// Reusable input style used across all form fields
const input = {
  display: "block",
  width: "100%",
  padding: "10px 12px",
  marginBottom: 12,
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
  fontFamily: "sans-serif",
};

export default function AuthPage() {
  // Track whether user is on login or signup mode
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form state for all fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    role: "",
    email: "",
    password: "",
  });

  // Generic field updater — returns a change handler for a given key
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        // Validate all signup fields before sending to Supabase
        if (!form.firstName || !form.lastName)
          return setMessage("Please enter your first and last name.");
        if (!form.age || +form.age < 1 || +form.age > 120)
          return setMessage("Please enter a valid age.");
        if (!form.role) return setMessage("Please select a role.");
        if (!form.email || !form.password)
          return setMessage("Email and password are required.");
        if (form.password.length < 6)
          return setMessage("Password must be at least 6 characters.");

        // Create the auth user in Supabase
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) return setMessage(error.message);
        if (!data.user) return setMessage("Could not create user. Try again.");

        // Save extra profile details to the profiles table
        // Using upsert because the trigger already created a basic row on signup
        const { error: profileError } = await supabase.from("profiles").upsert([
          {
            id: data.user.id,
            first_name: form.firstName,
            last_name: form.lastName,
            age: parseInt(form.age),
            role: form.role,
            email: form.email,
          },
        ]);

        if (profileError) return setMessage(profileError.message);

        // Automatically sign the user in after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        // If auto sign in fails, ask user to sign in manually
        if (signInError) {
          setMessage("Account created! Please sign in.");
          setMode("login");
        }
        // Otherwise AuthContext detects the session and App.js redirects to /home
      } else {
        // Login — validate fields then sign in with Supabase
        if (!form.email || !form.password)
          return setMessage("Email and password are required.");

        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) return setMessage(error.message);
        // AuthContext detects new session, App.js redirects to /home automatically
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      // Always re-enable the button when done
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "80px auto",
        fontFamily: "sans-serif",
        padding: "0 16px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>RUMI</h2>

      {/* Tab switcher between Sign In and Sign Up */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #ccc",
          marginBottom: 20,
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
              padding: "10px 0",
              background: "none",
              border: "none",
              borderBottom:
                mode === m ? "2px solid #000" : "2px solid transparent",
              fontWeight: mode === m ? "bold" : "normal",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {m === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Extra fields only shown during signup */}
      {mode === "signup" && (
        <>
          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={set("firstName")}
            style={input}
          />
          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={set("lastName")}
            style={input}
          />
          <input
            placeholder="Age"
            type="number"
            value={form.age}
            onChange={set("age")}
            style={input}
          />
          <select value={form.role} onChange={set("role")} style={input}>
            <option value="" disabled>
              Select Role
            </option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Email and password shown for both login and signup */}
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={set("email")}
        style={input}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={set("password")}
        style={input}
      />

      {/* Show error or success message */}
      {message && (
        <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>
          {message}
        </p>
      )}

      {/* Submit button — disabled while loading */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          ...input,
          background: "#000",
          color: "#fff",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
      </button>

      {/* Toggle between login and signup */}
      <p style={{ textAlign: "center", fontSize: 13, marginTop: 12 }}>
        {mode === "login" ? "No account? " : "Have an account? "}
        <span
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
          style={{ cursor: "pointer", textDecoration: "underline" }}
        >
          {mode === "login" ? "Sign Up" : "Sign In"}
        </span>
      </p>
    </div>
  );
}
