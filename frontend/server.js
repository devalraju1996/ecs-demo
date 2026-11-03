// frontend/server.js
// Frontend service for ECS Service Connect demo.
// Sits behind the ALB, serves a page, and calls the backend over Service Connect.
// Service Connect config for this service: client-only (no clientAliases needed),
// joined to the same Cloud Map namespace as the backend.

const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 8080;

// Service Connect DNS name + port from the backend's clientAliases
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:3000";

// Health check for the ALB target group
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Server-side call to the backend via Service Connect
app.get("/api/items", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/items`); // Node 18+ has fetch built in
    if (!response.ok) throw new Error(`Backend returned ${response.status}`);
    const data = await response.json();
    res.json({ frontend: os.hostname(), backend: data });
  } catch (err) {
    console.error("Backend call failed:", err.message);
    res.status(502).json({ error: "Could not reach backend", detail: err.message });
  }
});

// Simple HTML page
app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html>
<head><meta charset="utf-8"><title>ECS Service Connect Demo</title>
<style>
  body { font-family: sans-serif; max-width: 640px; margin: 40px auto; padding: 0 16px; }
  button { padding: 8px 16px; cursor: pointer; }
  pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; }
</style>
</head>
<body>
  <h1>ECS Service Connect Demo</h1>
  <p>Frontend task: <b>${os.hostname()}</b></p>
  <button onclick="load()">Call backend</button>
  <pre id="out">Click the button...</pre>
  <script>
    async function load() {
      const out = document.getElementById("out");
      out.textContent = "Loading...";
      try {
        const r = await fetch("/api/items");
        out.textContent = JSON.stringify(await r.json(), null, 2);
      } catch (e) {
        out.textContent = "Error: " + e.message;
      }
    }
  </script>
</body>
</html>`);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend listening on port ${PORT}, backend at ${BACKEND_URL}`);
});
