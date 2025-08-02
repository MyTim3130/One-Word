'use client';
import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import HowToPlayModal from '../../_components/HowToPlayModal';


const Home = () => {
  const router = useRouter();
  const [isHowToPlayModalOpen, setIsHowToPlayModalOpen] = useState(false);

  const handleCreateRoom = () => {
    router.push('./lobby');
  };

  const handleJoinRoom = () => {
    router.push('./lobby/join');
  };

  return (
    <main className="min-h-screen w-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <motion.h1
          className="text-5xl md:text-6xl lg:text-8xl font-black text-[var(--text-primary)] mb-4 tracking-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        >
          ONE WORD
        </motion.h1>
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--text-primary)] to-transparent mx-auto opacity-60"
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <motion.button
          onClick={handleCreateRoom}
          className="btn-primary text-xl md:text-2xl px-8 py-4 rounded-2xl font-semibold shadow-glass transition-all duration-300 hover:shadow-glow-strong"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Create Room
        </motion.button>

        <motion.button
          onClick={handleJoinRoom}
          className="btn-secondary text-xl md:text-2xl px-8 py-4 rounded-2xl font-semibold glass shadow-glass transition-all duration-300"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          Join Room
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 text-center"
      >
        <p className="text-[var(--text-muted)] text-sm font-medium">
          Create or join a room to start playing
        </p>
      </motion.div>

      {/* How to Play Button */}
      <motion.button
        onClick={() => setIsHowToPlayModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-[var(--bg-glass-strong)] backdrop-blur-xl border border-white/20 rounded-full shadow-[var(--shadow-glass)] text-[var(--text-primary)] hover:bg-[var(--bg-glass)] transition-all duration-300"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      {/* How to Play Modal */}
      <HowToPlayModal 
        isOpen={isHowToPlayModalOpen} 
        onClose={() => setIsHowToPlayModalOpen(false)} 
      />
    </main>
  );
};

export default Home;