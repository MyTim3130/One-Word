"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from "../../../socket/socket";
import usePlayersStore from "@/app/_store/players.store";
import useSettingsStore from "@/app/_store/settings.store";
import useCurrentPlayerStore from "@/app/_store/currentPlayer.store";
import { useRouter } from "next/navigation";
import GameModes from "@/app/_components/GameModes.jsx";

const Lobby = () => {
  const { players, setPlayers } = usePlayersStore();
  const { settings, setSettings } = useSettingsStore();
  const [lobbyCode, setLobbyCode] = useState("");
  const { currentPlayer, setCurrentPlayer } = useCurrentPlayerStore();

  const router = useRouter();

  useEffect(() => {
    setLobbyCode(window.location.pathname.split("/")[3]);
  }, []);

  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, []);

  const handleTimeChange = (e) => {
    socket.emit("updateSettings", {
      settings: { ...settings, time: e.target.value },
    });
  };

  const handleMaxWordsChange = (e) => {
    socket.emit("updateSettings", {
      settings: { ...settings, maxWords: e.target.value },
    });
  };

  useEffect(() => {
    socket.on("updateSettings", (data) => {
      setSettings(data.settings);
      console.log(data.settings);
    });
    return () => {
      socket.off("updateSettings");
    };
  });

  const handleStartGame = () => {
    socket.emit("startGame", { lobbyCode });
  };

  useEffect(() => {
    socket.on("redirect", (data) => {
      console.log(data);
      setCurrentPlayer(data.currentPlayer);
      router.push(data.url);
    });
    return () => {
      socket.off("redirect");
    };
  });

  return (
    <main className="min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-8 h-full"
        >
          {/* Players Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-80 glass-strong rounded-3xl p-6 shadow-glass-strong"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Players</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="glass rounded-2xl p-4 text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {player.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-white font-medium">{player.name}</div>
                    {player.host && (
                      <div className="text-xs text-white/60 mt-1">Host</div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col xl:flex-row gap-8 flex-1">
              {/* Settings Panel */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex-1 glass-strong rounded-3xl p-8 shadow-glass-strong"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Settings</h2>
                
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="time" className="block text-white/80 text-lg font-medium mb-3">
                        Time per Turn
                      </label>
                      <input
                        onChange={handleTimeChange}
                        value={settings.time}
                        type="number"
                        id="time"
                        className="input-glass w-full px-4 py-3 rounded-xl text-lg font-medium"
                        min="5"
                        max="60"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="maxWords" className="block text-white/80 text-lg font-medium mb-3">
                        Max Words
                      </label>
                      <input
                        onChange={handleMaxWordsChange}
                        value={settings.maxWords}
                        type="number"
                        id="maxWords"
                        className="input-glass w-full px-4 py-3 rounded-xl text-lg font-medium"
                        min="5"
                        max="50"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">Game Modes</h3>
                    <GameModes />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <motion.button
                    onClick={handleStartGame}
                    className="btn-primary text-xl px-8 py-4 rounded-2xl font-semibold shadow-glass"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    Start Game
                  </motion.button>
                </div>
              </motion.div>

              {/* Canvas Panel */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="xl:w-96 min-h-96 glass-strong rounded-3xl p-8 shadow-glass-strong flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <p className="text-white/60 text-lg font-medium">Drawing Canvas</p>
                  <p className="text-white/40 text-sm mt-2">Coming Soon</p>
                </div>
              </motion.div>
            </div>

            {/* Room Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-strong rounded-3xl p-6 shadow-glass-strong text-center"
            >
              <p className="text-white/60 text-sm font-medium mb-2">Room Code</p>
              <p className="text-4xl md:text-5xl font-black text-white tracking-widest">
                {lobbyCode}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Lobby;
