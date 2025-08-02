'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Vote } from 'lucide-react';

const WordVotingScreen = ({
  isOpen,
  originalWord,
  challengerWord,
  canVote,
  onVote,
  onClose
}) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(20);
      setHasVoted(false);
      setMyVote(null);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onClose]);

  const handleVote = (voteType) => {
    if (hasVoted) return;
    setHasVoted(true);
    setMyVote(voteType);
    onVote(voteType);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-4xl bg-[var(--bg-glass-strong)] backdrop-blur-xl border border-white/20 rounded-3xl shadow-[var(--shadow-glass)] p-8">
              
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <Vote className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                  Word Duel Vote
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Which word is better for the sentence?
                </p>
              </div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center mb-6"
              >
                <Clock className="w-5 h-5 text-[var(--text-muted)] mr-2" />
                <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                  {timeLeft}s
                </span>
              </motion.div>

              {/* Word Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {/* Original Word */}
                <div className="glass rounded-2xl p-6 text-center">
                  <p className="text-[var(--text-muted)] text-sm mb-2">Original Word</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                    "{originalWord}"
                  </p>
                  {canVote && !hasVoted ? (
                    <motion.button
                      onClick={() => handleVote('original')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Vote Original
                    </motion.button>
                  ) : (
                    <div className="w-full px-6 py-3 bg-gray-400/20 text-gray-500 rounded-2xl font-semibold">
                      {hasVoted && myVote === 'original' ? 'Your Vote ✓' : 'Original Word'}
                    </div>
                  )}
                </div>

                {/* New Word */}
                <div className="glass rounded-2xl p-6 text-center">
                  <p className="text-[var(--text-muted)] text-sm mb-2">Challenge Word</p>
                  <p className="text-3xl font-bold text-[var(--text-primary)] mb-4">
                    "{challengerWord}"
                  </p>
                  {canVote && !hasVoted ? (
                    <motion.button
                      onClick={() => handleVote('new')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Vote New
                    </motion.button>
                  ) : (
                    <div className="w-full px-6 py-3 bg-gray-400/20 text-gray-500 rounded-2xl font-semibold">
                      {hasVoted && myVote === 'new' ? 'Your Vote ✓' : 'New Word'}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Status Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                {!canVote ? (
                  <p className="text-[var(--text-muted)]">
                    You cannot vote (you are involved in this duel)
                  </p>
                ) : hasVoted ? (
                  <p className="text-[var(--text-secondary)]">
                    Vote submitted! Waiting for other players...
                  </p>
                ) : (
                  <p className="text-[var(--text-secondary)]">
                    Choose which word fits better in the sentence
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WordVotingScreen;
