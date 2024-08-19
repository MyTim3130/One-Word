const { Server } = require("socket.io");

const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(3002, {
  cors: {
    origin: "*",
  },
});

const {v4} = require("uuid");

const games = [];

// Socket.io implementation
io.on("connection", (socket) => {
  console.log("A user connected");

    // Handle createRoom event
    socket.on("createRoom", (data) => {
        console.log("createRoom event received:", data);
        let code = Math.floor(1000 + Math.random() * 9000);
        while (games.find((game) => game.code === code)) {
            code = Math.floor(1000 + Math.random() * 9000);
        }
        const game = { code, players: [{name:data.playerName, id:v4(), socket, host: true, words:[]}] };
        games.push(game)
        socket.emit("roomCreated", {code, player:game.players[0]} );
    }
);
  
    

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
