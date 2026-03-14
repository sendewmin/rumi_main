import { useState } from "react";
import { supabase } from "./supabaseClient";

const ROLES = ["Student", "Teacher", "Admin", "Developer", "Manager", "Other"];

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

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
    if (error) setMessage(error.message);
  };

  const handleSubmit = async () => {
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!form.firstName || !form.lastName)
          return setMessage("Please enter your first and last name.");
        if (!form.age || +form.age < 1 || +form.age > 120)
          return setMessage("Please enter a valid age.");
        if (!form.role) return setMessage("Please select a role.");
        if (!form.email || !form.password)
          return setMessage("Email and password are required.");
        if (form.password.length < 6)
          return setMessage("Password must be at least 6 characters.");

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) return setMessage(error.message);
        if (!data.user) return setMessage("Could not create user. Try again.");

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

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (signInError) {
          setMessage("Account created! Please sign in.");
          setMode("login");
        }
      } else {
        if (!form.email || !form.password)
          return setMessage("Email and password are required.");

        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) return setMessage(error.message);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
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

      {/* Tabs */}
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

      {/* Google Sign In */}
      <button
        onClick={handleGoogleSignIn}
        style={{
          ...input,
          background: "#fff",
          border: "1px solid #ccc",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontWeight: "500",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.2 0 9.9-1.8 13.6-4.7l-6.3-5.2C29.4 35.6 26.8 36 24 36c-5.2 0-9.6-2.9-11.3-7.1l-6.6 4.9C9.6 39.6 16.3 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.4-4.7 5.8l6.3 5.2C41 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #eee" }} />
        <span style={{ fontSize: 12, color: "#aaa" }}>or</span>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #eee" }} />
      </div>

      {/* Sign Up fields */}
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

      {/* Shared fields */}
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

      {/* Error message */}
      {message && (
        <p style={{ color: "red", fontSize: 13, marginBottom: 12 }}>
          {message}
        </p>
      )}

      {/* Submit */}
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

      {/* Switch mode */}
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
