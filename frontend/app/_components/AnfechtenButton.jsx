'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, X } from 'lucide-react';

const AnfechtenButton = ({ 
  isCurrentPlayer, 
  hasUsedAnfechten = false,
  onChallenge, 
  disabled = false,
  canUseAnfechten = true
}) => {
  const canChallenge = isCurrentPlayer && !hasUsedAnfechten && !disabled && canUseAnfechten;

  const handleClick = () => {
    if (canChallenge) {
      onChallenge();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={!canChallenge}
      className={`
        relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300
        ${canChallenge
          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-orange-500/25 cursor-pointer'
          : 'bg-gray-400/20 text-gray-500 cursor-not-allowed'
        }
      `}
      whileHover={canChallenge ? { scale: 1.05, y: -2 } : {}}
      whileTap={canChallenge ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-2">
        {canChallenge ? (
          <Zap className="w-4 h-4" />
        ) : (
          <X className="w-4 h-4" />
        )}
        <span>Anfechten!</span>
      </div>
      
      {hasUsedAnfechten && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        />
      )}
      
      {!canChallenge && (
        <motion.div
          className="absolute inset-0 bg-black/10 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
};

export default AnfechtenButton;
