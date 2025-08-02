'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, UserX, AlertTriangle } from 'lucide-react';

const VoteResult = ({ 
  isOpen, 
  result, 
  onClose 
}) => {
  if (!result) return null;

  const isWordRemoved = result.outcome === 'removed';
  const Icon = isWordRemoved ? XCircle : CheckCircle;
  const iconColor = isWordRemoved ? 'text-red-500' : 'text-green-500';
  const bgGradient = isWordRemoved 
    ? 'from-red-500/20 to-red-600/20' 
    : 'from-green-500/20 to-green-600/20';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Result Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className={`
              bg-gradient-to-br ${bgGradient} backdrop-blur-xl border border-white/20 
              rounded-3xl shadow-2xl p-8 max-w-md w-full text-center
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
                  ${isWordRemoved ? 'shadow-red-500/25' : 'shadow-green-500/25'} shadow-lg
                `}>
                  <Icon className={`w-10 h-10 ${iconColor}`} />
                </div>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-[var(--text-primary)] mb-4"
              >
                {isWordRemoved ? 'Word Removed!' : 'Word Accepted!'}
              </motion.h3>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mb-6"
              >
                <p className="text-[var(--text-secondary)] text-lg">
                  "{result.challengedWord}"
                </p>
                
                <div className="glass rounded-xl p-4">
                  <p className="text-[var(--text-primary)] font-medium mb-2">
                    Vote Results:
                  </p>
                  <div className="flex justify-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-[var(--text-secondary)]">
                        Richtig: {result.votes.richtig || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-[var(--text-secondary)]">
                        Falsch: {result.votes.falsch || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {isWordRemoved && result.blockedPlayer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center space-x-2 text-[var(--text-muted)] text-sm"
                  >
                    <UserX className="w-4 h-4" />
                    <span>{result.blockedPlayer.name} is blocked this round</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Continue Button */}
              <motion.button
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="btn-primary px-8 py-3 rounded-2xl font-semibold transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Game
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VoteResult;