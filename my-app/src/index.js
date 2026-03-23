import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { runDiagnostics, insertTestRoom, clearAndReseedRooms } from "./api/supabaseDiagnostics";

// Expose diagnostic functions to browser console
window.supabase_diagnostics = {
  runDiagnostics,
  insertTestRoom,
  clearAndReseedRooms,
  help: () => {
    console.log(`
🔧 Supabase Diagnostic Tools Available:

1. window.supabase_diagnostics.runDiagnostics()
   - Checks connection, table structure, room count, and IDs

2. window.supabase_diagnostics.insertTestRoom()
   - Manually inserts a single test room

3. window.supabase_diagnostics.clearAndReseedRooms()
   - Clears all rooms and inserts fresh sample data

Run any of these in the browser console (F12).
    `);
  }
};

// Show help on startup
console.log('💡 Supabase tools available! Type: window.supabase_diagnostics.help()');

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
);
