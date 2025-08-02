'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Users, Edit3, Vote, Star, Trophy } from 'lucide-react';

const HowToPlayModal = ({ isOpen, onClose }) => {
  const sections = [
    {
      icon: Users,
      title: "📥 Joining the Game",
      content: [
        "Players join a shared room.",
        "Once all players are in, the host starts the game."
      ]
    },
    {
      icon: Edit3,
      title: "✍️ Building the Sentence",
      content: [
        "The game begins with the first player writing a single word.",
        "Each player, in turn, adds one word to the growing sentence.",
        "The round ends when:",
        "• A player ends their word with a \".\" (full stop), or",
        "• The maximum word limit is reached."
      ]
    },
    {
      icon: BookOpen,
      title: "🎯 Your Goal",
      content: [
        "Add words that are grammatically correct and fit the sentence context.",
        "Think creatively, but play fair — grammar matters!"
      ]
    },
    {
      icon: Vote,
      title: "⚔️ Disputes – \"Anfechten\"",
      content: [
        "If you think the last word was wrong or doesn't fit, click \"Anfechten\".",
        "A voting screen appears for all players.",
        "Each player votes \"richtig\" (correct) or \"falsch\" (wrong).",
        "If over 50% vote \"falsch\", the word is removed, and the player is blocked for this round.",
        "The next player must write a new word in its place."
      ]
    },
    {
      icon: Star,
      title: "🌟 End of Round – Rating Phase",
      content: [
        "When the sentence ends, you'll see who wrote which words.",
        "Rate each player's contribution from 1 to 5 stars (the more stars, the better).",
        "No self-voting allowed!"
      ]
    },
    {
      icon: Trophy,
      title: "🏆 Leaderboard",
      content: [
        "All points are added up.",
        "The leaderboard is shown with rankings based on your ratings.",
        "The most creative and grammatically correct players rise to the top!"
      ]
    }
  ];

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
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-24 z-50 flex items-center justify-center"
          >
            <div className="w-full max-w-4xl max-h-full bg-[var(--bg-glass-strong)] backdrop-blur-xl border border-white/20 rounded-3xl shadow-[var(--shadow-glass)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-6 h-6 text-[var(--text-primary)]" />
                  <h2 className="text-2xl font-bold text-[var(--text-primary)]">🕹️ How to Play</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-[var(--bg-glass)] hover:bg-[var(--bg-glass-strong)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--text-primary)]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg text-[var(--text-secondary)] mb-8 text-center"
                >
                  Welcome to the ultimate multiplayer word game! Here's how it works:
                </motion.p>

                <div className="space-y-8">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="glass rounded-2xl p-6"
                      >
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 rounded-xl bg-[var(--gradient-primary)]">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-[var(--text-primary)]">
                            {section.title}
                          </h3>
                        </div>
                        
                        <div className="space-y-2">
                          {section.content.map((item, itemIndex) => (
                            <p
                              key={itemIndex}
                              className="text-[var(--text-secondary)] leading-relaxed"
                            >
                              {item}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="mt-8 text-center"
                >
                  <div className="glass rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                      Ready to Play? 🚀
                    </h4>
                    <p className="text-[var(--text-secondary)]">
                      Create or join a room to start building amazing stories with your friends!
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HowToPlayModal;