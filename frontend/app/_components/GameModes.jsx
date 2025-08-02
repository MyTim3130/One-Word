'use client'
import React, { useState } from "react";
import { motion } from 'framer-motion';

const GameModes = () => {
  const [selectedMode, setSelectedMode] = useState("");

  const handleModeChange = (mode) => {
    setSelectedMode(mode);
  };

  const modes = [
    { id: "normal", name: "Normal", icon: "🎯" },
    { id: "usernames", name: "Usernames", icon: "👤" },
    { id: "celebrities", name: "Celebrities", icon: "⭐" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {modes.map((mode, index) => (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={`
            relative cursor-pointer rounded-2xl p-6 text-center transition-all duration-300
            ${selectedMode === mode.id 
              ? 'bg-[var(--gradient-accent)] shadow-[var(--shadow-glow)]' 
              : 'glass hover:glass-strong'
            }
          `}
          onClick={() => handleModeChange(mode.id)}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-3xl mb-3">{mode.icon}</div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">{mode.name}</p>
          
          {selectedMode === mode.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--gradient-accent)] rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-[var(--text-primary)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default GameModes;