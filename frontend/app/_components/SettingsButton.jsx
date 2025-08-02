'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import SettingsModal from './SettingsModal';

const SettingsButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-6 right-6 z-40 p-3 bg-[var(--bg-glass-strong)] backdrop-blur-xl border border-white/20 rounded-2xl shadow-[var(--shadow-glass)] text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all duration-300"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      <SettingsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default SettingsButton;