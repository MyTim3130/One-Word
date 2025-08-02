'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Send } from 'lucide-react';

const ChallengeModal = ({
  isOpen,
  originalWord,
  originalAuthor,
  onSubmit,
  onTimeout,
  onClose
}) => {
  const [newWord, setNewWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(15);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(15);
      setNewWord('');
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleTimeout = () => {
    if (newWord.trim()) {
      onSubmit(newWord.trim());
    } else {
      onTimeout();
    }
    onClose?.();
  };

  const handleSubmit = () => {
    if (!newWord.trim()) return;
    onSubmit(newWord.trim());
    onClose?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && newWord.trim()) {
      handleSubmit();
    }
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
            <div className="w-full max-w-2xl bg-[var(--bg-glass-strong)] backdrop-blur-xl border border-white/20 rounded-3xl shadow-[var(--shadow-glass)] p-8">
              
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                  Challenge Word!
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Propose a better word to replace "{originalWord}"
                </p>
              </div>

              {/* Original Word */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 mb-6 text-center"
              >
                {originalAuthor && (
                  <p className="text-[var(--text-muted)] text-sm mb-2">
                    Original word by {originalAuthor.name}:
                  </p>
                )}
                <p className="text-3xl font-bold text-[var(--text-primary)]">
                  "{originalWord}"
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
                <span className={`text-2xl font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-[var(--text-primary)]'}`}>
                  {timeLeft}s
                </span>
              </motion.div>

              {/* Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <input
                  type="text"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your better word..."
                  className="input-glass w-full px-6 py-4 rounded-2xl text-xl font-medium text-center focus:outline-none transition-all duration-300"
                  autoFocus
                  maxLength={50}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <motion.button
                  onClick={handleSubmit}
                  disabled={!newWord.trim() || timeLeft === 0}
                  className={`
                    flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 mx-auto
                    ${newWord.trim() && timeLeft > 0
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-orange-500/25'
                      : 'bg-gray-400/20 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  whileHover={newWord.trim() && timeLeft > 0 ? { scale: 1.02, y: -2 } : {}}
                  whileTap={newWord.trim() && timeLeft > 0 ? { scale: 0.98 } : {}}
                >
                  <Send className="w-5 h-5" />
                  <span>Submit Challenge</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChallengeModal;
