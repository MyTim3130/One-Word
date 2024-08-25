'use client'
import React, { createContext, useEffect, useState } from 'react';

// Create a context for the audio
export const AudioContext = createContext();

const AudioProvider = ({ children }) => {
  const [audio] = useState(new Audio('/music/backgroundMusic.wav'));

  useEffect(() => {
    audio.loop = true;
    audio.play().catch((error) => {
      console.log('Autoplay was prevented, user interaction is required');
    });

    return () => {
      audio.pause();
    };
  }, [audio]);

  return (
    <AudioContext.Provider value={{ audio }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
