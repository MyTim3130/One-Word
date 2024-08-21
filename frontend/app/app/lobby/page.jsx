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
    <main className="flex flex-col items-center pt-20 gap-10">
      <h1 className="text-3xl text-[#081C15]">Create</h1>      
      <input type="text" onChange={handleChange} placeholder="Name..."  className="px-5 py-2 w-2/6 h-14 rounded-3xl text-xl bg-[#95D5B2] text-[#081C15] placeholder:text-[#081C15] focus:outline-none focus:scale-[1.01] transition-all" />
      <button onClick={handleSubmit} className='text-xl px-10 py-2 bg-[#95D5B2] rounded-xl hover:scale-90 transition-all'>Submit</button>
    </main>
  );
};

export default LobbyName;
