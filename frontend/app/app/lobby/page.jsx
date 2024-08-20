"use client";
import React, {useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import {socket} from "../../variables"; 
import useUserStore from '@/app/_store/user.store';
import usePlayersStore from '@/app/_store/players.store';


const LobbyName = () => {
    const {user, setUser} = useUserStore();
    const {players, setPlayers} = usePlayersStore();
  const router = useRouter();
    const [playerName, setPlayerName] = useState("");

  const handleSubmit = () => {

    socket.emit("createRoom", {playerName});


    socket.on("roomCreated", (data) => {
        setUser(data.player);
        setPlayers([data.player]);
        router.push(`lobby/${data.id}`);
        });

  };

  

    const handleChange = (e) => {
    setPlayerName(e.target.value);

    };

  return (
    <main>
      <h1>Name</h1>
      
      <input type="text" onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
    </main>
  );
};

export default LobbyName;
