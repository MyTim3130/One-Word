'use client'
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePlayersStore from '@/app/_store/players.store'
import useUserStore from '@/app/_store/user.store'
import { socket } from '@/app/socket/socket'

const gptObject = {
  "gpt": {
      "words": [
          "Viele",
          "Egypter",
          "inhalieren",
          "vapes",
          "weswegen",
          "ihre",
          "Mächte",
          "schwinden."
      ],
      "players": [
          {
              "id": "FQCvSbP7FOI41U0GAAAv",
              "name": "Tim",
              "host": true,
              "words": [
                  "Viele",
                  "vapes",
                  "Mächte"
              ],
              "points": 350,
              "place": 1
          },
          {
              "id": "CALqV-Fs5g_VAo1oAAAz",
              "name": "Timo",
              "host": false,
              "words": [
                  "Egypter",
                  "weswegen",
                  "schwinden."
              ],
              "points": 300,
              "place": 2
          },
          {
              "id": "hTBraO74JfRCNPMuAAA5",
              "name": "Alex",
              "host": false,
              "words": [
                  "inhalieren",
                  "ihre"
              ],
              "points": 150,
              "place": 3
          }
      ]
  }
}

const Voting = () => {
  const { players, setPlayers } = usePlayersStore()
  const { user, setUser } = useUserStore()
  const [votingData, setVotingData] = useState(null)

  useEffect(() => {
    socket.emit("getVotingData",)

    socket.on("votingData", (data) => {
      console.log(data)
      setVotingData(data)
    })
  }, [])

  const getPodiumPosition = (place) => {
    switch (place) {
      case 1: return { height: 'h-32', color: 'from-yellow-400 to-yellow-600', icon: '🥇' };
      case 2: return { height: 'h-24', color: 'from-gray-300 to-gray-500', icon: '🥈' };
      case 3: return { height: 'h-16', color: 'from-amber-600 to-amber-800', icon: '🥉' };
      default: return { height: 'h-12', color: 'from-white/20 to-white/10', icon: '🏅' };
    }
  };


  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-black text-white mb-12 text-center"
      >
        🏆 Final Results
      </motion.h1>

      <AnimatePresence>
        {votingData === null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-strong rounded-3xl p-12 shadow-glass-strong"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <div className="text-2xl text-white font-medium">Loading results...</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-6xl"
          >
            {/* Podium View for Top 3 */}
            <div className="flex justify-center items-end mb-12 space-x-8">
              {votingData.gpt.players
                .filter(player => player.place <= 3)
                .sort((a, b) => a.place - b.place)
                .map((player, index) => {
                  const podium = getPodiumPosition(player.place);
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <div className="glass-strong rounded-2xl p-6 mb-4 text-center shadow-glass-strong">
                        <div className="text-4xl mb-2">{podium.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
                        <div className="text-3xl font-black text-white mb-2">{player.points}</div>
                        <div className="text-white/60 text-sm">points</div>
                      </div>
                      <div className={`w-24 ${podium.height} bg-gradient-to-t ${podium.color} rounded-t-xl shadow-glass`} />
                    </motion.div>
                  );
                })}
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {votingData.gpt.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`
                    glass-strong rounded-3xl p-6 shadow-glass-strong relative overflow-hidden
                    ${player.place === 1 ? 'ring-2 ring-yellow-400/50' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white
                        ${player.place <= 3 
                          ? 'bg-primary-gradient shadow-glow' 
                          : 'bg-gradient-to-br from-white/20 to-white/10'
                        }
                      `}>
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{player.name}</h3>
                        <div className="text-white/60 text-sm">
                          #{player.place} • {player.host ? 'Host' : 'Player'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">{player.points}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-white/80 font-medium mb-3">Contributed Words:</h4>
                    <div className="flex flex-wrap gap-2">
                      {player.words.map((word, wordIndex) => (
                        <motion.span
                          key={wordIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: wordIndex * 0.1 }}
                          className="glass rounded-full px-3 py-1 text-sm text-white font-medium"
                        >
                          {word}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  {player.place === 1 && (
                    <div className="absolute top-4 right-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="text-2xl"
                      >
                        ⭐
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Story Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 glass-strong rounded-3xl p-8 shadow-glass-strong"
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">📖 Your Story</h2>
              <p className="text-lg text-white leading-relaxed text-center">
                {votingData.gpt.words.join(" ")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Voting;