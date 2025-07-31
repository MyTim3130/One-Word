"use client";
import React, { useState, useEffect } from "react";
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { socket } from "../../socket/socket";
import useUserStore from '@/app/_store/user.store';
import usePlayersStore from '@/app/_store/players.store';


const LobbyName = () => {
  const { user, setUser } = useUserStore();
  const { players, setPlayers } = usePlayersStore();
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = () => {
    socket.emit("createRoom", { playerName });

    socket.on("roomCreated", (data) => {
      setUser(data.player);
      setPlayers([data.player]);
      router.push(`lobby/${data.id}`);
    });
  };

  const handleChange = (e) => {
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
          Create Room
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
              onChange={handleChange}
              placeholder="Enter your name..."
              className="input-glass w-full px-6 py-4 rounded-2xl text-lg font-medium focus:outline-none transition-all duration-300"
              value={playerName}
            />
          </div>

          <motion.button
            onClick={handleSubmit}
            className="btn-primary w-full text-xl py-4 rounded-2xl font-semibold shadow-glass transition-all duration-300"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            disabled={!playerName.trim()}
          >
            Create Room
          </motion.button>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default LobbyName;
