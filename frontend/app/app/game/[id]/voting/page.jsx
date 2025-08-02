'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import useUserStore from '@/app/_store/user.store';
import { socket } from '@/app/socket/socket';
import { Star } from 'lucide-react';

export default function Voting() {
  
  const { user } = useUserStore();
  const router = useRouter();
  const { id: gameId } = useParams();

  const [stage, setStage]         = useState('loading');
  const [toRate, setToRate]       = useState([]);    // players to rate
  const [rateIdx, setRateIdx]     = useState(0);
  const [myRatings, setMyRatings] = useState({});    // rateeId → score
  const [sentence, setSentence]   = useState([]);    // full sentence
  const [results, setResults]     = useState(null);  // final leaderboard

  // 1) fetch contributions & listen for final votingData
  useEffect(() => {
    socket.emit('getVotingData');
    socket.on('ratingData', data => {
      console.log('ratingData', data);
      setToRate(data.players.filter(p => p.id !== user.id));
      setSentence(data.words || []);
      setStage('rating');

    });
    socket.on('votingData', data => {
      setResults(data);
      setStage('results');
    });
    return () => {
      socket.off('ratingData');
      socket.off('votingData');
    };
  }, [user.id]);

  // 2) listen for server redirect (used by resetGame)
  useEffect(() => {
    socket.on('redirect', ({ url }) => {
      router.push(url);
    });
    return () => {
      socket.off('redirect');
    };
  }, [router]);

  // star‐rating handler
  const handleRate = score => {
    const ratee = toRate[rateIdx].id;
    setMyRatings(prev => ({ ...prev, [ratee]: score }));
  };

  // next or submit
  const handleNext = () => {
    if (rateIdx + 1 < toRate.length) {
      setRateIdx(i => i + 1);
    } else {
      socket.emit('submitRatings', { ratings: myRatings });
      setStage('loading');
    }
  };

  // Download JSON
  const handleDownload = () => {
    if (!results) return;
    const payload = {
      sentence: results.words,
      players: results.players
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `game_${gameId}_results.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple star row
  const StarRow = ({ value, onChange }) => (
    <div className="flex space-x-1 justify-center">
      {[1,2,3,4,5].map(n => (
        <Star
          key={n}
          className={`w-8 h-8 cursor-pointer ${n <= value ? 'text-yellow-400' : 'text-white/40'}`}
          onClick={() => onChange(n)}
        />
      ))}
    </div>
  );

  // — Loading —
  if (stage === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </main>
    );
  }

  // — Rating —
  if (stage === 'rating') {
    const curr = toRate[rateIdx];
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-[var(--text-primary)] mb-6"
        >
          Rate {curr.name}
        </motion.h2>

        {/* full sentence with highlights */}
        <div className="glass-strong rounded-3xl p-6 shadow-glass-strong mb-8">
          <p className="text-lg text-[var(--text-primary)] text-center flex flex-wrap gap-2 justify-center">
            {sentence.map((word, idx) => {
              const isCurr = curr.words.includes(word.word);
              return (
                <span
                  key={idx}
                  className={
                    isCurr
                      ? 'bg-[var(--gradient-accent)] text-[var(--text-primary)] px-3 py-1 rounded-2xl shadow-[var(--shadow-glow)]'
                      : 'text-[var(--text-muted)]'
                  }
                >
                  {word.word}
                </span>
              );
            })}
          </p>
        </div>

        <StarRow
          value={myRatings[curr.id] || 0}
          onChange={handleRate}
        />

        <button
          onClick={handleNext}
          className="mt-8 px-8 py-3 rounded-2xl bg-[var(--gradient-accent)] text-[var(--text-primary)] font-semibold shadow-[var(--shadow-glow)]"
        >
          {rateIdx + 1 < toRate.length ? 'Next' : 'Submit'}
        </button>
      </main>
    );
  }

  // — Final Results —
  return (
    <main className="min-h-screen px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-12 text-center"
      >
        🏆 Final Leaderboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.players.map((p,i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="glass-strong rounded-3xl p-6 shadow-glass-strong"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-[var(--text-primary)] font-bold">
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{p.name}</h3>
              </div>
              <div className="text-3xl font-black text-[var(--text-primary)]">{p.points} pt</div>
            </div>
            <div className="text-[var(--text-muted)] mb-4">#{p.place}</div>
            <div className="space-y-1">
              <div className="text-[var(--text-secondary)] font-medium">Your words:</div>
              <div className="flex flex-wrap gap-2">
                {p.words.map((w,j) => (
                  <span
                    key={j}
                    className="glass rounded-full px-3 py-1 text-sm text-[var(--text-primary)]"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* action buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => router.push('/app')}
          className="px-6 py-2 rounded-2xl bg-[var(--bg-glass)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-glass-strong)] transition"
        >
          Home
        </button>
        <button
          onClick={() => socket.emit('resetGame')}
          className="px-6 py-2 rounded-2xl bg-[var(--gradient-primary)] text-[var(--text-primary)] font-medium hover:opacity-90 transition"
        >
          Play Again
        </button>
        <button
          onClick={handleDownload}
          className="px-6 py-2 rounded-2xl bg-[var(--bg-glass)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-glass-strong)] transition"
        >
          Download Results
        </button>
      </div>
    </main>
  );
}