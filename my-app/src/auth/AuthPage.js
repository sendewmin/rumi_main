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
