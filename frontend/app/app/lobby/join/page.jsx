'use client'
import React, {useState} from 'react'
import {socket} from "../../../variables";
import { useRouter } from 'next/navigation';
import useUserStore from '@/app/_store/user.store';
import usePlayersStore from '@/app/_store/players.store';
import useSettingsStore from '@/app/_store/settings.store';


const Join = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const {user, setUser} = useUserStore();
  const {players, setPlayers} = usePlayersStore();
  const {settings, setSettings} = useSettingsStore();



  const handleSubmit = () => {
    socket.emit("joinRoom", {gameCode, playerName});

    socket.on("roomJoined", (data) => {
      setUser(data.player);
      setPlayers(data.players);
      setSettings(data.settings);
      router.push(`/app/lobby/${data.id}`);
    });
  }

  const handleChange = (e) => {
    setGameCode(e.target.value);
  }

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  }

  return (
    <main>
      <h1>Join</h1>
      <div>
        <h2>name:</h2>
        <input type="text" onChange={handleNameChange} />
      </div>
        <input type="text" onChange={handleChange} />
        <button onClick={handleSubmit}>Submit</button>
    </main>    
)
}

export default Join