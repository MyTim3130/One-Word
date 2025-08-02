// useAnfechten.js
'use client';

import { useState, useCallback, useEffect } from 'react';
import { socket } from '../socket/socket';

export const useAnfechten = (gameId) => {
  const [isChallengeOpen, setIsChallengeOpen] = useState(false);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const [originalWord, setOriginalWord] = useState('');
  const [originalAuthor, setOriginalAuthor] = useState(null);
  const [challengerWord, setChallengerWord] = useState('');
  const [canVote, setCanVote] = useState(false);
  const [voteResult, setVoteResult] = useState(null);

  // Socket event listeners
  useEffect(() => {
    // When a challenge is ready, open the challenge modal
    socket.on('anfechtenReady', (data) => {
      setOriginalWord(data.originalWord);
      setOriginalAuthor(data.originalAuthor);
      setIsChallengeOpen(true);
    });

    // When voting starts, open the voting screen
    socket.on('startWordVote', (data) => {
      setOriginalWord(data.originalWord);
      setChallengerWord(data.challengerWord);
      setCanVote(data.voterIds.includes(socket.id));
      setIsVotingOpen(true);
    });

    // When vote results come in, show the result modal
    socket.on('voteResult', (data) => {
      setIsVotingOpen(false);
      setVoteResult(data);
      setIsResultOpen(true);
    });

    return () => {
      socket.off('anfechtenReady');
      socket.off('startWordVote');
      socket.off('voteResult');
    };
  }, []);

  // Start an anfechten challenge
  const startChallenge = useCallback(() => {
    socket.emit('anfechten');
  }, []);

  // Submit the challenger’s replacement word
  const submitChallenge = useCallback((newWord) => {
    setIsChallengeOpen(false);
    socket.emit('submitAnfechtWord', { newWord });
  }, []);

  // If time runs out without a submission
  const handleChallengeTimeout = useCallback(() => {
    setIsChallengeOpen(false);
    // You could emit a timeout event here if desired:
    // socket.emit('anfechtenTimeout');
  }, []);

  // Cast a vote ('original' or 'new')
  const handleVote = useCallback((voteType) => {
    socket.emit('voteWord', { selectedWord: voteType });
  }, []);

  // Close the voting screen (e.g. on timeout)
  const closeVoting = useCallback(() => {
    setIsVotingOpen(false);
  }, []);

  // Close the result modal and clear the result
  const closeResult = useCallback(() => {
    setIsResultOpen(false);
    setVoteResult(null);
  }, []);

  // Reset all challenge/vote state (e.g. when a new game loads)
  const resetChallenge = useCallback(() => {
    setIsChallengeOpen(false);
    setIsVotingOpen(false);
    setIsResultOpen(false);
    setOriginalWord('');
    setOriginalAuthor(null);
    setChallengerWord('');
    setCanVote(false);
    setVoteResult(null);
  }, []);

  return {
    // State
    isChallengeOpen,
    isVotingOpen,
    isResultOpen,
    originalWord,
    originalAuthor,
    challengerWord,
    canVote,
    voteResult,

    // Actions
    startChallenge,
    submitChallenge,
    handleChallengeTimeout,
    handleVote,
    closeVoting,
    closeResult,
    resetChallenge
  };
};
