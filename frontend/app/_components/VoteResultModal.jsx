'use client';
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';

const VoteResultModal = ({
  isOpen,
  result,
  onClose
}) => {
  // Auto-close after 4 seconds
  useEffect(() => {
    if (isOpen && result) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, result, onClose]);

  if (!isOpen || !result) return null;

  const isNewWordWon = result.winner === 'new';
  const winningWord = isNewWordWon ? result.replacedWord : result.retainedWord;
  const winnerName = result.winnerName;
  const penalizedName = result.penalizedName;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />

      {/* Result Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className={`
          bg-gradient-to-br ${isNewWordWon ? 'from-orange-500/20 to-red-600/20' : 'from-blue-500/20 to-blue-600/20'} 
          backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center
        `}>
          
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div className={`
              w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center
              ${isNewWordWon ? 'shadow-orange-500/25' : 'shadow-blue-500/25'} shadow-lg
            `}>
              {isNewWordWon ? (
                <Zap className="w-10 h-10 text-orange-400" />
              ) : (
                <Trophy className="w-10 h-10 text-blue-400" />
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-[var(--text-primary)] mb-4"
          >
            {isNewWordWon ? 'Challenge Won!' : 'Original Word Wins!'}
          </motion.h3>

          {/* Winning Word */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-xl p-6 mb-6"
          >
            <p className="text-[var(--text-muted)] text-sm mb-2">Winning word:</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              "{winningWord}"
            </p>
            <p className="text-[var(--text-secondary)] font-medium">
              by {winnerName}
            </p>
          </motion.div>

          {/* Penalty Notice */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[var(--text-muted)] text-sm mb-6"
          >
            <span>{penalizedName} gets -2 points at game end</span>
          </motion.div>

          {/* Auto-close indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <div className="w-full bg-[var(--bg-glass)] rounded-full h-1">
              <motion.div
                className="bg-gradient-to-r from-[var(--accent-400)] to-[var(--accent-600)] h-1 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
            <p className="text-[var(--text-muted)] text-xs mt-2">
              Returning to game...
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoteResultModal;
