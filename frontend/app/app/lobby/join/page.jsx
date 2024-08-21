"use client";
import React, { useState } from "react";
import { socket } from "../../../variables";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/_store/user.store";
import usePlayersStore from "@/app/_store/players.store";
import useSettingsStore from "@/app/_store/settings.store";

const Join = () => {
  const [gameCode, setGameCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const router = useRouter();

  const { user, setUser } = useUserStore();
  const { players, setPlayers } = usePlayersStore();
  const { settings, setSettings } = useSettingsStore();

  const handleSubmit = () => {
    socket.emit("joinRoom", { gameCode, playerName });

    socket.on("roomJoined", (data) => {
      setUser(data.player);
      setPlayers(data.players);
      setSettings(data.settings);
      router.push(`/app/lobby/${data.id}`);
    });
  };

  const handleChange = (e) => {
    setGameCode(e.target.value);
  };

  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  return (
    <main className="w-screen h-[80vh] flex flex-col pt-20 gap-10 items-center justify-center">
      <h1 className="text-3xl text-[#081C15]">Join</h1>
      <div className="flex flex-col w-full">
        <div className="w-full h-full flex justify-center">
          <input
            type="text"
            placeholder="Name..."
            onChange={handleNameChange}
            className="px-5 py-2 w-2/6 h-14 rounded-3xl text-xl bg-[#95D5B2] text-[#081C15] placeholder:text-[#081C15] focus:outline-none focus:scale-[1.01] transition-all"
          />
        </div>
        <div className="flex flex-col w-full items-center gap-10 mt-5">
          <input
            type="text"
            placeholder="Code..."
            onChange={handleChange}
            className="px-5 py-2 w-1/12 h-14 rounded-3xl text-xl bg-[#95D5B2] text-[#081C15] placeholder:text-[#081C15] focus:outline-none focus:scale-[1.01] transition-all text-center"
          />
          <button className='text-xl px-10 py-2 bg-[#95D5B2] rounded-xl hover:scale-90 transition-all' onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </main>
  );
};

export default Join;
