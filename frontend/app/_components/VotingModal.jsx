'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';

const VotingModal = ({ 
  isOpen, 
  challengedWord, 
  wordAuthor, 
  currentPlayer,
  players,
  onVote,
  onClose 
}) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [voteStatus, setVoteStatus] = useState({ votes: {}, totalVotes: 0, requiredVotes: 0 });

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto close voting
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Poll vote status
  useEffect(() => {
    if (!isOpen || hasVoted) return;

    const pollVotes = setInterval(async () => {
      try {
        // IMPLEMENT: Replace with actual API call
        const response = await fetch('/api/vote-status', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        setVoteStatus(data);
        
        // Check if voting is complete
        if (data.isComplete) {
          clearInterval(pollVotes);
          setTimeout(() => onClose(data), 1000);
        }
      } catch (error) {
        console.error('Error polling vote status:', error);
        // IMPLEMENT: Handle API error
      }
    }, 1000);

    return () => clearInterval(pollVotes);
  }, [isOpen, hasVoted, onClose]);

  const handleTimeUp = async () => {
    try {
      // IMPLEMENT: Submit timeout to backend
      const response = await fetch('/api/vote-timeout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengedWord, wordAuthor })
      });
      const result = await response.json();
      onClose(result);
    } catch (error) {
      console.error('Error handling vote timeout:', error);
      // IMPLEMENT: Handle API error
    }
  };

  const handleVote = async (voteType) => {
    if (hasVoted) return;

    try {
      // IMPLEMENT: Replace with actual API call
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerId: currentPlayer.id,
          vote: voteType, // 'richtig' or 'falsch'
          challengedWord,
          wordAuthor
        })
      });

      if (response.ok) {
        setHasVoted(true);
        setMyVote(voteType);
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      // IMPLEMENT: Handle API error
    }
  };

  // Calculate eligible voters (exclude word author)
  const eligibleVoters = players.filter(p => p.id !== wordAuthor.id);
  const progressPercentage = (voteStatus.totalVotes / eligibleVoters.length) * 100;

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
            <div className="w-full max-w-2xl bg-[var(--bg-glass-strong)] backdrop-blur-xl border border-white/20 rounded-3xl shadow-[var(--shadow-glass)] p-8">
              
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                  Word Challenge
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Vote whether this word fits the sentence
                </p>
              </div>

              {/* Challenged Word */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 mb-6 text-center"
              >
                <p className="text-[var(--text-muted)] text-sm mb-2">Challenged word by {wordAuthor.name}:</p>
                <p className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                  "{challengedWord}"
                </p>
              </motion.div>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center mb-6"
              >
                <Clock className="w-5 h-5 text-[var(--text-muted)] mr-2" />
                <span className="text-2xl font-bold text-[var(--text-primary)]">
                  {timeLeft}s
                </span>
              </motion.div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--text-secondary)] text-sm">
                    Votes: {voteStatus.totalVotes}/{eligibleVoters.length}
                  </span>
                  <Users className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
                <div className="w-full bg-[var(--bg-glass)] rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-[var(--accent-400)] to-[var(--accent-600)] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Voting Buttons */}
              {!hasVoted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.button
                    onClick={() => handleVote('richtig')}
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Richtig</span>
                  </motion.button>

                  <motion.button
                    onClick={() => handleVote('falsch')}
                    className="flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <XCircle className="w-6 h-6" />
                    <span>Falsch</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className={`
                    inline-flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold
                    ${myVote === 'richtig' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    }
                  `}>
                    {myVote === 'richtig' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    <span>You voted: {myVote === 'richtig' ? 'Richtig' : 'Falsch'}</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm mt-3">
                    Waiting for other players...
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VotingModal;