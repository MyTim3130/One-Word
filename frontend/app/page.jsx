'use client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Page = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io('ws://localhost:3002');
    // Additional socket.io logic goes here

    // Update the connection status when the socket connects or disconnects
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('message', 'Hello, server!');
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <button>{connected ? 'Connected' : 'Not Connected'}</button>
    </div>
  );
};

export default Page;
