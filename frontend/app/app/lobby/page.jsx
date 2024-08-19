"use client";
import React, {useState} from "react";
import { useRouter } from "next/navigation";
import {socket} from "../../variables"; 
import useUserStore from '@/app/_store/store';


const LobbyName = () => {
    const {user, setUser} = useUserStore();
  const router = useRouter();
    const [playerName, setPlayerName] = useState("");

  const handleSubmit = () => {

    socket.on("roomCreated", (data) => {
        setUser(data.player);
        router.push(`lobby/${data}`);
        });
    
    socket.emit("createRoom", {playerName});
   
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
