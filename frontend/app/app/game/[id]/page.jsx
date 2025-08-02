'use client';
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import useSettingsStore from "@/app/_store/settings.store";
import usePlayersStore from "@/app/_store/players.store";
import useCurrentPlayerStore from "@/app/_store/currentPlayer.store";
import useUserStore from "@/app/_store/user.store";
import { socket } from "@/app/socket/socket";
import { useRouter } from "next/navigation";
import AnfechtenButton from "@/app/_components/AnfechtenButton";
import ChallengeModal from "@/app/_components/ChallengeModal";
import WordVotingScreen from "@/app/_components/WordVotingScreen";
import VoteResultModal from "@/app/_components/VoteResultModal";
import { useAnfechten } from "@/app/_hooks/useAnfechten";

const Game = () => {
  const { settings } = useSettingsStore();
  const { players, setPlayers } = usePlayersStore();
  const { currentPlayer, setCurrentPlayer } = useCurrentPlayerStore();
  const { user } = useUserStore();

  const [words, setWords] = useState([]);
  const [timer, setTimer] = useState(settings.time || 5);
  const [inputValue, setInputValue] = useState("");
  const [gameWords, setGameWords] = useState([]);

  const router = useRouter();
  const roomCode = typeof window !== "undefined"
    ? window.location.pathname.split("/")[3]
    : "";

  const {
    isChallengeOpen,
    isVotingOpen,
    isResultOpen,
    originalWord,
    originalAuthor,
    challengerWord,
    canVote,
    voteResult,
    startChallenge,
    submitChallenge,
    handleChallengeTimeout,
    handleVote,
    closeVoting,
    closeResult,
    resetChallenge
  } = useAnfechten(roomCode);

  const isCurrent = currentPlayer === user.id;
  const currentUserData = players.find(p => p.id === user.id);
  const hasUsedAnfechten = currentUserData?.usedAnfechten || false;
  const canUseAnfechten = gameWords.length > 0;

  // Progress timer & turn indicator
  useEffect(() => {
    if (!currentPlayer) return;

    setTimer(settings.time || 5);
    const indicator = document.getElementById("progress");
    if (indicator) {
      indicator.style.removeProperty("animation");
      // trigger reflow
      void indicator.offsetWidth;
      indicator.style.animation = `progress ${settings.time || 5}s linear infinite`;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [currentPlayer, settings.time]);

  // Auto-submit when timer hits zero
  useEffect(() => {
    if (timer <= 0 && isCurrent) {
      socket.emit("submitWord", { word: inputValue });
      setInputValue("");
    }
  }, [timer, isCurrent, inputValue]);

  // Socket listeners: new word & next turn
  useEffect(() => {
    socket.on("newWord", ({ word, author }) => {
      setGameWords(prev => [...prev, { word, author }]);
      setWords(prev => [...prev, word]);
    });
    socket.on("nextTurn", ({ currentPlayer: next }) => {
      setCurrentPlayer(next);
    });

      // Final‐words update (end of story)
   socket.on("updateWords", ({ words: fullEntries, currentPlayer }) => {
     // fullEntries is [ { word, author }, … ]
     setGameWords(fullEntries);
    setWords(fullEntries.map(e => e.word));
     setCurrentPlayer(currentPlayer); // will be null
  });


    return () => {
      socket.off("newWord");
      socket.off("nextTurn");
      socket.off("updateWords");
    };


  }, [setCurrentPlayer]);

  // Handle redirects from lobby→game
  useEffect(() => {
    socket.on("redirect", (data) => {
      setTimeout(() => {
        router.push(data.url);
      }, 3000);
    });
    return () => socket.off("redirect");
  }, [router]);

  // Update players list
  useEffect(() => {
    socket.on("updatePlayers", ({ players: updated }) => {
      setPlayers(updated);
    });
    return () => socket.off("updatePlayers");
  }, [setPlayers]);

  // Reset challenge state on room change
  useEffect(() => {
    resetChallenge();
  }, [roomCode, resetChallenge]);

  const handleSendWord = useCallback(() => {
    if (!isCurrent) return;
    socket.emit("submitWord", { word: inputValue });
    setInputValue("");
  }, [isCurrent, inputValue]);

  const handleInputChange = (e) => setInputValue(e.target.value);
  const handleKeyDown = (e) => { if (e.key === "Enter") handleSendWord(); };

  return (
    <main>
      {/* Progress Bar */}
      <section className="w-screen h-2 bg-white/10 fixed top-0 left-0 z-50">
        <motion.div
          id="progress"
          className="h-full bg-gradient-to-r from-accent-400 to-primary-700 rounded-r-full shadow-glow"
          initial={{ width: "100%" }}
        />
      </section>

      {/* Story Display */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8 pt-16">
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
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[var(--text-primary)] leading-relaxed text-center"
                >
                  {words.join(" ")}
                </motion.p>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-[var(--text-muted)] text-center"
                >
                  Waiting for the story to begin...
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Input & Anfechten */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-lg mb-12"
        >
          <div className="text-center mb-4">
            <motion.div
              key={timer}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-[var(--text-primary)] mb-2"
            >
              {timer}
            </motion.div>
            <p className="text-[var(--text-muted)] text-sm">seconds remaining</p>
          </div>

          <div className="space-y-4">
            <motion.input
              type="text"
              className="input-glass w-full px-6 py-4 rounded-2xl text-xl font-medium text-center focus:outline-none transition-all duration-300"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your word..."
              disabled={!isCurrent}
              whileFocus={{ scale: 1.02 }}
            />

            {canUseAnfechten && (
              <div className="flex justify-center">
                <AnfechtenButton
                  isCurrentPlayer={isCurrent}
                  hasUsedAnfechten={hasUsedAnfechten}
                  onChallenge={startChallenge}
                  disabled={isChallengeOpen || isVotingOpen || isResultOpen}
                  canUseAnfechten={canUseAnfechten}
                />
              </div>
            )}
          </div>

          { !isCurrent && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[var(--text-muted)] text-center mt-3 text-sm"
            >
              Waiting for your turn...
            </motion.p>
          )}
        </motion.section>

        {/* Players List */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-4xl"
        >
          <div className="glass-strong rounded-3xl p-8 shadow-glass-strong relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {players.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`flex flex-col items-center relative z-20 transition-all duration-500 ${
                    currentPlayer === player.id ? 'scale-110' : ''
                  }`}
                >
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center text-xl lg:text-2xl font-bold text-white transition-all duration-500 ${
                    currentPlayer === player.id 
                      ? 'bg-[var(--gradient-accent)] shadow-[var(--shadow-glow)] pulse-glow'
                      : 'bg-gradient-to-br from-white/20 to-white/10'
                  }`}>
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <p id={player.id} className="text-lg lg:text-xl font-medium text-[var(--text-primary)] mt-2 text-center">
                    {player.name}
                  </p>
                  {player.usedAnfechten && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
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

      {/* Modals */}
      <ChallengeModal
        isOpen={isChallengeOpen}
        originalWord={originalWord}
        originalAuthor={originalAuthor}
        onSubmit={submitChallenge}
        onTimeout={handleChallengeTimeout}
        onClose={handleChallengeTimeout}
      />

      <WordVotingScreen
        isOpen={isVotingOpen}
        originalWord={originalWord}
        challengerWord={challengerWord}
        canVote={canVote}
        onVote={handleVote}
        onClose={closeVoting}
      />

      <VoteResultModal
        isOpen={isResultOpen}
        result={voteResult}
        onClose={closeResult}
      />
    </main>
  );
};

export default Game;
