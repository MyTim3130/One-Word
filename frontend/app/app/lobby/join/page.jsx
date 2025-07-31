"use client";
import React, { useState } from "react";
import { motion } from 'framer-motion';
import { socket } from "../../../socket/socket";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/_store/user.store";
import usePlayersStore from "@/app/_store/players.store";
import useSettingsStore from "@/app/_store/settings.store";

const Join = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const { user, setUser } = useUserStore();
  const { players, setPlayers } = usePlayersStore();
  const { settings, setSettings } = useSettingsStore();

  const handleSubmit = () => {
    socket.emit("joinRoom", { gameCode, playerName });

    socket.on("roomJoined", (data) => {
      setUser(data.player);
      setPlayers(data.players);
      setSettings(data.settings);
      router.push(`/app/lobby/${data.id}`);
    });
  };

  const handleChange = (e) => {
    setGameCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-strong rounded-3xl p-8 md:p-12 w-full max-w-md shadow-glass-strong"
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-white text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Join Room
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name..."
              onChange={handleNameChange}
              className="input-glass w-full px-6 py-4 rounded-2xl text-lg font-medium focus:outline-none transition-all duration-300"
              value={playerName}
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Room Code
            </label>
            <input
              type="text"
              placeholder="Enter room code..."
              onChange={handleChange}
              className="input-glass w-full px-6 py-4 rounded-2xl text-lg font-medium text-center focus:outline-none transition-all duration-300 tracking-widest uppercase"
              value={gameCode}
            />
          </div>

          <motion.button
            onClick={handleSubmit}
            className="btn-primary w-full text-xl py-4 rounded-2xl font-semibold shadow-glass transition-all duration-300"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            disabled={!playerName.trim() || !gameCode.trim()}
          >
            Join Room
          </motion.button>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Join;
