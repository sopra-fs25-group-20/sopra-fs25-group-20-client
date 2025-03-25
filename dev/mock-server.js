// Mock server to test the front-end WebSocket chat
// Prints the response and sends "Hey!" back to the client
// Start it with "node mock-server.js"

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8082 });

wss.on("connection", (ws) => {
  console.log("Frontend connected");

  ws.on("message", (message) => {
    const parsed = JSON.parse(message);
    console.log("Received:", parsed);
    ws.send(JSON.stringify({ nickname: "Marc", message: "Hey!" }));
  });

  ws.on("close", () => console.log("Frontend disconnected"));
});

console.log("Mock WebSocket server running at ws://localhost:8082");
