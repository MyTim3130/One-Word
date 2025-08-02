const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { v4 } = require("uuid");

const app = express();
app.get("/", (req, res) => res.send("Socket.io server is running"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET","POST"], credentials: true }
});

const games = [];

// Helper to find game by socket id
function findGameBySocket(socket) {
  return games.find(g => g.players.some(p => p.id === socket.id));
}

io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  socket.on("createRoom", data => {
    const game = {
      id: ("" + Math.floor(1000 + Math.random()*9000)),
      players: [{ id: socket.id, name: data.playerName, host: true, words: [] }],
      words: [],
      settings: { time: 10, maxWords: 15 },
      currentPlayer: 0,
      // new rating state:
      ratingsByRater: {},    // { raterId: { rateeId:score, ... } }
      results: null          // set after aggregation
    };
    games.push(game);
    socket.join(game.id);
    socket.emit("roomCreated", { player: game.players[0], id: game.id });
  });

  socket.on("joinRoom", data => {
    const game = games.find(g => g.id === data.gameCode);
    if (!game) return;
    game.players.push({ id: socket.id, name: data.playerName, host: false, words: [] });
    socket.join(game.id);
    io.to(game.id).emit("updatePlayers", { players: game.players });
    socket.emit("roomJoined", {
      player: game.players.at(-1),
      id: game.id,
      players: game.players,
      settings: game.settings
    });
  });

  socket.on("updateSettings", data => {
    const game = findGameBySocket(socket);
    if (!game) return;
    game.settings = data.settings;
    io.to(game.id).emit("updateSettings", { settings: game.settings });
  });

  socket.on("startGame", data => {
    const game = games.find(g => g.id === data.lobbyCode);
    if (!game) return;
    io.to(game.id).emit("redirect", {
       url: `/app/game/${game.id}`,
      currentPlayer: game.players[game.currentPlayer].id
    });
  });

  socket.on("sendWord", data => {
    const game = findGameBySocket(socket);
    if (!game) return;
    game.words.push(data.word);
    game.players[game.currentPlayer].words.push(data.word);
    // advance or end
    const ended = data.word.includes(".") || game.words.length >= data.maxWords;
    if (ended) {
      game.currentPlayer = null;
      io.to(game.id).emit("updateWords", { words: game.words, currentPlayer: null });
      return io.to(game.id).emit("redirect", { url: "/voting" });
    }
    // normal turn
    game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
    io.to(game.id).emit("updateWords", {
      words: game.words,
      currentPlayer: game.players[game.currentPlayer].id
    });
  });

socket.on("getVotingData", () => {
  const game = findGameBySocket(socket);
  if (!game) return;
  // current code only sends players:
  // const contribs = game.players.map(p => ({ id: p.id, name: p.name, host: p.host, words: p.words }));
  // socket.emit("ratingData", { players: contribs });

  // → new code: also include the words array
  const contribs = game.players.map(p => ({
    id: p.id,
    name: p.name,
    host: p.host,
    words: p.words
  }));
  socket.emit("ratingData", {
    players: contribs,
    words: game.words     // <-- add this line
  });
});

  // 2) Client submits their ratings
  //    payload: { ratings: { [rateeId]: score, ... } }
  socket.on("submitRatings", payload => {
    const game = findGameBySocket(socket);
    if (!game) return;
    game.ratingsByRater[socket.id] = payload.ratings;

    // once everyone has rated:
    if (Object.keys(game.ratingsByRater).length === game.players.length) {
      // aggregate per ratee
      const totals = {};
      game.players.forEach(p => totals[p.id] = 0);
      for (let rater in game.ratingsByRater) {
        for (let ratee in game.ratingsByRater[rater]) {
          totals[ratee] += game.ratingsByRater[rater][ratee];
        }
      }

      // build results array
      const results = game.players
        .map(p => ({
          id: p.id,
          name: p.name,
          host: p.host,
          words: p.words,
          points: totals[p.id],
        }))
        .sort((a,b) => b.points - a.points)
        .map((p,i) => ({ ...p, place: i+1 }));

      game.results = { words: game.words, players: results };
      io.to(game.id).emit("votingData", game.results);
    }
  });

  socket.on("updatePlayers", data => {
    const game = findGameBySocket(socket);
    if (!game) return;
    game.players = data.players;
    io.to(game.id).emit("updatePlayers", { players: game.players });
  });

  socket.on("disconnect", () => {
    console.log("disconnect", socket.id);
    const game = findGameBySocket(socket);
    if (!game) return;
    game.players = game.players.filter(p => p.id !== socket.id);
    delete game.ratingsByRater[socket.id];
    io.to(game.id).emit("updatePlayers", { players: game.players });
  });



    // Handle play–again
  socket.on("resetGame", () => {
    const game = findGameBySocket(socket);
    if (!game) return;
    // Reset the round
    game.words = [];
    game.players.forEach(p => (p.words = []));
    game.currentPlayer = 0;
    game.ratingsByRater = {};
    game.results = null;
    // Redirect everyone back into the game screen
  io.to(game.id).emit("redirect", {
  url: `/app/lobby/${game.id}`,
  currentPlayer: game.players[0].id
});
  });

});

server.listen(3002, () => console.log("Server listening on port 3002"));
