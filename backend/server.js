// server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.get("/", (req, res) => res.send("Socket.io server is running"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"], credentials: true }
});

// In-memory storage
const games = [];
const challenges = new Map(); // gameId → { originalWord, originalAuthor, challenger, newWord, votes: {}, voters: [] }

// Helper to find the game for a given socket
function findGameBySocket(socket) {
  return games.find(g => g.players.some(p => p.id === socket.id));
}

// Helper to get player object
function getPlayerById(game, playerId) {
  return game.players.find(p => p.id === playerId);
}

io.on("connection", socket => {
  console.log("A user connected:", socket.id);

  // —————————————
  // Lobby & Game setup
  // —————————————

  socket.on("createRoom", data => {
    const game = {
      id: "" + Math.floor(1000 + Math.random() * 9000),
      players: [{
        id: socket.id,
        name: data.playerName,
        host: true,
        words: [],
        usedAnfechten: false,
        penalties: 0
      }],
      words: [],
      settings: { time: 10, maxWords: 15 },
      currentPlayer: 0,
      ratingsByRater: {},
      results: null
    };
    games.push(game);
    socket.join(game.id);
    socket.emit("roomCreated", { player: game.players[0], id: game.id });
  });

  socket.on("joinRoom", data => {
    const game = games.find(g => g.id === data.gameCode);
    if (!game) return;
    const newPlayer = {
      id: socket.id,
      name: data.playerName,
      host: false,
      words: [],
      usedAnfechten: false,
      penalties: 0
    };
    game.players.push(newPlayer);
    socket.join(game.id);
    io.to(game.id).emit("updatePlayers", { players: game.players });
    socket.emit("roomJoined", {
      player: newPlayer,
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

  // ———————————————————
  // Word Submission & Anfechten
  // ———————————————————

  socket.on("submitWord", ({ word }) => {
    const game = findGameBySocket(socket);
    if (!game) return;
    const player = getPlayerById(game, socket.id);
    if (!player) return;

    game.words.push({ word, author: player.id });
    player.words.push(word);

    //. ends game
const ended = word.includes(".") || game.words.length >= game.settings.maxWords;
    if (ended) {
      game.currentPlayer = null;
      io.to(game.id).emit("updateWords", { words: game.words, currentPlayer: null });
      return io.to(game.id).emit("redirect", { url:`/app/game/${game.id}` + "/voting" });
    }

    game.currentPlayer = (game.currentPlayer + 1) % game.players.length;
    io.to(game.id).emit("newWord", { word, author: player.id });
    io.to(game.id).emit("nextTurn", {
      currentPlayer: game.players[game.currentPlayer].id
    });
    
  });

  socket.on("anfechten", () => {
    const game = findGameBySocket(socket);
    if (!game) return;
    const challenger = getPlayerById(game, socket.id);
    if (!challenger || challenger.usedAnfechten) return;

    const lastWordEntry = game.words[game.words.length - 1];
    if (!lastWordEntry) return;

    // Register challenge
    challenges.set(game.id, {
      originalWord: lastWordEntry.word,
      originalAuthor: lastWordEntry.author,
      challenger: socket.id,
      newWord: null,
      votes: {},
      voters: []
    });

    challenger.usedAnfechten = true; // only once per game

    // Send original author’s name for the modal
    const origPlayer = getPlayerById(game, lastWordEntry.author);
    io.to(socket.id).emit("anfechtenReady", {
      originalWord: lastWordEntry.word,
      originalAuthor: { id: origPlayer.id, name: origPlayer.name }
    });
  });

  socket.on("submitAnfechtWord", ({ newWord }) => {
    const game = findGameBySocket(socket);
    if (!game) return;

    const challenge = challenges.get(game.id);
    if (!challenge || challenge.challenger !== socket.id) return;

    challenge.newWord = newWord;

    // Broadcast voting screen
    const voters = game.players.filter(
      p => p.id !== challenge.challenger && p.id !== challenge.originalAuthor
    );
    challenge.voters = voters.map(p => p.id);

    io.to(game.id).emit("startWordVote", {
      originalWord: challenge.originalWord,
      challengerWord: newWord,
      voterIds: challenge.voters
    });
  });

  socket.on("voteWord", ({ selectedWord }) => {
    const game = findGameBySocket(socket);
    if (!game) return;

    const challenge = challenges.get(game.id);
    if (!challenge || !challenge.voters.includes(socket.id)) return;

    if (challenge.votes[socket.id]) return; // Already voted
    challenge.votes[socket.id] = selectedWord;

    // Check if voting is complete
    if (Object.keys(challenge.votes).length === challenge.voters.length) {
      const votes = Object.values(challenge.votes);
      const originalVotes = votes.filter(v => v === "original").length;
      const challengerVotes = votes.filter(v => v === "new").length;

      if (challengerVotes > originalVotes) {
        // Challenger wins
        game.words[game.words.length - 1].word = challenge.newWord;
        const penalized = getPlayerById(game, challenge.originalAuthor);
        penalized.penalties += 2;
        const winner = getPlayerById(game, challenge.challenger);
        io.to(game.id).emit("updateWords", { words: game.words, currentPlayer: game.currentPlayer });

        io.to(game.id).emit("voteResult", {
          winner: "new",
          replacedWord: challenge.newWord,
          winnerName: winner.name,
          penalizedName: penalized.name
        });
      } else {
        // Original wins or tie
        const penalized = getPlayerById(game, challenge.challenger);
        penalized.penalties += 2;
        const winner = getPlayerById(game, challenge.originalAuthor);

        io.to(game.id).emit("voteResult", {
          winner: "original",
          retainedWord: challenge.originalWord,
          winnerName: winner.name,
          penalizedName: penalized.name
        });
      }

      challenges.delete(game.id);
      io.to(game.id).emit("nextTurn", {
        currentPlayer: game.players[game.currentPlayer].id
      });
    }
  });


  // ———————————————
  // Voting & Results
  // ———————————————
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

  // Handle player ratings

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

  socket.on("disconnect", () => {
    const game = findGameBySocket(socket);
    if (!game) return;
    game.players = game.players.filter(p => p.id !== socket.id);
    io.to(game.id).emit("updatePlayers", { players: game.players });
  });
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});
