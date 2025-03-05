// server.js
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

let policies = {
  GUEST: [],
  USER: ["VIEW_DASHBOARD", "VIEW_ORDERS", "VIEW_PRODUCTS", "EDIT_SETTINGS"],
  STAFF: [
    "VIEW_DASHBOARD",
    "VIEW_CUSTOMERS",
    "VIEW_ORDERS",
    "EDIT_PRODUCTS",
    "VIEW_SETTINGS",
    "EDIT_USERS",
  ],
  ADMIN: [
    "EDIT_DASHBOARD",
    "EDIT_CUSTOMERS",
    "EDIT_ORDERS",
    "EDIT_PRODUCTS",
    "EDIT_REPORTS",
    "EDIT_SETTINGS",
    "EDIT_USERS",
  ],
};

const roleSubscriptions = {};

function subscribeConnection(ws, role) {
  if (!roleSubscriptions[role]) {
    roleSubscriptions[role] = new Set();
  }
  roleSubscriptions[role].add(ws);
  if (!ws.roles) {
    ws.roles = new Set();
  }
  ws.roles.add(role);
}

// Unsubscribe a connection from all roles
function unsubscribeConnection(ws) {
  if (ws.roles) {
    ws.roles.forEach((role) => {
      if (roleSubscriptions[role]) {
        roleSubscriptions[role].delete(ws);
      }
    });
  }
}

wss.on("connection", (ws) => {
  console.log("WebSocket client connected.");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "SUBSCRIBE_USER" && data.role) {
        subscribeConnection(ws, data.role);
        console.log(`Client subscribed to role: ${data.role}`);
        const policy = policies[data.role] || [];

        ws.send(JSON.stringify({ type: "POLICY_UPDATE", newPolicies: policy }));
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", () => {
    unsubscribeConnection(ws);
    console.log("WebSocket client disconnected.");
  });
});

app.post("/updatePolicy", (req, res) => {
  const { role, policy } = req.body;

  if (!role || !policy) {
    return res
      .status(400)
      .json({ error: "Provide both a role and policy object." });
  }

  policies[role] = policy;
  console.log(`Policy for role ${role} updated:`, policy);

  if (roleSubscriptions[role]) {
    roleSubscriptions[role].forEach((ws) => {
      ws.send(JSON.stringify({ type: "POLICY_UPDATE", newPolicies: policy }));
    });
  }

  res.json({ message: `Policy for role ${role} updated successfully.` });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
