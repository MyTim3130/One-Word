"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import useSettingsStore from "@/app/_store/settings.store";
import usePlayersStore from "@/app/_store/players.store";
import useCurrentPlayerStore from "@/app/_store/currentPlayer.store";
import useUserStore from "@/app/_store/user.store";
import { socket } from "@/app/socket/socket";
import { useRouter } from "next/navigation";

const Game = () => {
  const { settings, setSettings } = useSettingsStore();
  const { players, setPlayers } = usePlayersStore();
  const { currentPlayer, setCurrentPlayer } = useCurrentPlayerStore();
  const { user, setUser } = useUserStore();
  const [words, setWords] = useState([]);
  const [timer, setTimer] = useState(settings.time || 5); // Use settings.time or default to 5
  const [inputValue, setInputValue] = useState("");

  const roomCode = window.location.pathname.split("/")[3];

  const router = useRouter();
  
  console.log(user)

  useEffect(() => {

    const currPlayer = document.getElementById(currentPlayer);
    if (!currPlayer) return;
    const playerIndicator = document.getElementById("playerIndicator");
    const playerRect = currPlayer.getBoundingClientRect();
    playerIndicator.style.left = `${playerRect.left + playerRect.width / 2}px`;
    playerIndicator.style.top = `${playerRect.top + playerRect.height / 2}px`;
    playerIndicator.style.width = `${playerRect.width + 30}px`;
    playerIndicator.style.height = `${playerRect.height + 10}px`;  


    setTimer(settings.time || 5);
    const indicator = document.getElementById("progress");
    indicator.style.removeProperty("animation");
    void indicator.offsetWidth;
    indicator.style.animation = `progress ${
      settings.time || 5
    }s linear infinite`;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer]);

  useEffect(() => {
    if (timer === 0 && currentPlayer === user.id) {
      handleSendWord();
    }
  }, [timer]);

  const handleSendWord = () => {
    console.log(currentPlayer == user.id);
    if (currentPlayer === user.id) {
      console.log(inputValue);
      socket.emit("sendWord", {
        word: inputValue,
        maxWords: settings.maxWords,
      });
      setWords((prevWords) => [...prevWords, inputValue]);
      setInputValue("");
    }
  };

  useEffect(() => {
    socket.on("updateWords", (data) => {
      setWords(data.words);
      setCurrentPlayer(data.currentPlayer);
    });
  });

  useEffect(() => {
    socket.on("redirect", (data) => {
      setTimeout(() => {
        router.push("/app/game/" + roomCode + "/" + data.url);
      }, 3000);
    });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendWord(); // Trigger send word logic on Enter key press
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    socket.on("disconnect", () => {
      socket.emit("updatePlayers", {
        players: players.filter((player) => player.id !== user.id),
      });
    });
  }, []);

  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      setPlayers(data.players);
    });
  }, []);

  return (
    <main>
      <section className="w-screen h-2 bg-white/10 fixed top-0 left-0 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary-500 to-secondary-gradient rounded-r-full shadow-glow" 
          id="progress"
          initial={{ width: "100%" }}
        />
      </section>
      
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 pt-16">
        {/* Story Display */}
        <motion.section
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl mb-12"
        >
          <div className="glass-strong rounded-3xl p-8 md:p-12 shadow-glass-strong min-h-32">
            <AnimatePresence mode="wait">
              {words.length > 0 ? (
                <motion.p
                  key={words.join(" ")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white leading-relaxed text-center"
                >
                  {words.join(" ")}
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white/60 text-center"
                >
                  Waiting for the story to begin...
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mb-12"
        >
          <div className="text-center mb-4">
            <motion.div
              key={timer}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {timer}
            </motion.div>
            <p className="text-white/60 text-sm">seconds remaining</p>
          </div>
          
          <motion.input
            type="text"
            className="input-glass w-full px-6 py-4 rounded-2xl text-xl font-medium text-center focus:outline-none transition-all duration-300"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your word..."
            disabled={currentPlayer !== user.id}
            whileFocus={{ scale: 1.02 }}
          />
          
          {currentPlayer !== user.id && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/60 text-center mt-3 text-sm"
            >
              Waiting for your turn...
            </motion.p>
          )}
        </motion.section>

        {/* Players Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-4xl"
        >
          <div className="glass-strong rounded-3xl p-8 shadow-glass-strong relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex flex-col items-center relative z-20 transition-all duration-500 ${
                    currentPlayer === player.id ? 'transform scale-110' : ''
                  }`}
                >
                  <div className={`
                    w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold text-white transition-all duration-500
                    ${currentPlayer === player.id 
                      ? 'bg-primary-gradient shadow-glow pulse-glow' 
                      : 'bg-gradient-to-br from-white/20 to-white/10'
                    }
                  `}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <p id={player.id} className="text-lg lg:text-xl font-medium text-white mt-2 text-center">
                    {player.name}
                  </p>
                  
                  {currentPlayer === player.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-primary-gradient rounded-full flex items-center justify-center shadow-glow"
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12l-4-4 1.41-1.41L10 9.17l2.59-2.58L14 8l-4 4z"/>
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div
              id="playerIndicator"
              className="absolute duration-500 bottom-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl z-10 opacity-0"
            />
          </div>
        </motion.section>
      </div>
    </main>
  );
};

export default Game;