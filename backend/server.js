// backend/server.js
// Simple backend API for ECS Service Connect demo.
// Service Connect config for this service (in the ECS service definition):
//   portMappings name: "backend-http", containerPort: 3000
//   serviceConnectConfiguration.services[].clientAliases: [{ port: 3000, dnsName: "backend" }]
// Other services in the same namespace reach it at http://backend:3000

const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check for the ECS task / target group
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Sample data endpoint
app.get("/api/items", (req, res) => {
  res.json({
    servedBy: os.hostname(), // shows which task answered
    items: [
      { id: 1, name: "Alpha" },
      { id: 2, name: "Bravo" },
      { id: 3, name: "Charlie" },
    ],
  });
});

app.get("/api/info", (req, res) => {
  res.json({
    service: "backend",
    hostname: os.hostname(),
    time: new Date().toISOString(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend listening on port ${PORT}`);
});
