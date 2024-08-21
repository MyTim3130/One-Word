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
      const game = {
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        players: [{id: socket.id, name: data.playerName, host: true, words: []}],
        words: [],
        settings: {
          time: 10,
          maxWords: 15,
        },
        currentPlayer: 0,
      };
      games.push(game);
      socket.join(game.id);
      socket.emit("roomCreated", {player: game.players[0], id: game.id});
    });

  // Handle joinRoom event
  socket.on("joinRoom", (data) => {
    const game = games.find((game) => game.id === data.gameCode);
    if (game) {
      game.players.push({id: socket.id, name: data.playerName, host: false, words: []});
      socket.join(game.id);
      socket.emit("roomJoined", {player: game.players[game.players.length - 1], id: game.id, players: game.players, settings: game.settings});
      io.to(game.id).emit("updatePlayers", {players: game.players});

    }
  });

    //Handle updateSettings event
    socket.on("updateSettings", (data) => {
      const game = games.find((game) => game.players.some((player) => player.id === socket.id));
      if (game) {
        game.settings = data.settings;
        io.to(game.id).emit("updateSettings", {settings: game.settings});
      }
    });

    // Handle startGame event
    socket.on("startGame", (data) => {
      const game = games.find((game) => game.id === data.lobbyCode);
      if (game) {
        // Perform any necessary game initialization or logic here
        // Redirect all players in the room to a new page
        io.to(game.id).emit("redirect", { url: "/app/game/" + game.id, currentPlayer: game.players[game.currentPlayer].id });

      }
    });


  // Handle sendWord event
  socket.on("sendWord", (data) => {
    const game = games.find((game) => game.players.some((player) => player.id === socket.id));
    if (game) {
      game.words.push(data.word);
      game.players[game.currentPlayer].words.push(data.word);
      game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
      io.to(game.id).emit("updateWords", { words: game.words, currentPlayer: game.players[game.currentPlayer].id });
      if (data.word.includes(".")) {
        game.currentPlayer = null;
        io.to(game.id).emit("updateWords", { words: game.words, currentPlayer: game.currentPlayer });
        io.to(game.id).emit("redirect", { url: "/voting" });

      }
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    const game = games.find((game) => game.players.some((player) => player.id === socket.id));
    if (game) {
      game.players = game.players.filter((player) => player.id !== socket.id);
      io.to(game.id).emit("updatePlayers", {players: game.players});
    }

  });
});

// Start the server

console.log("Server listening on port 3002");