
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let leaderboard = [];

// Serve static files (optional, for game frontend)
app.use(express.static("."));

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    // Send the current leaderboard to the new client
    socket.emit("leaderboard-update", leaderboard);

    // Handle new score submissions
    socket.on("submit-score", (data) => {
        leaderboard.push(data);
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Keep the top 10 scores

        // Broadcast updated leaderboard to all clients
        io.emit("leaderboard-update", leaderboard);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
