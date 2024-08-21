"use client";
import React, { useEffect, useState } from "react";
import useSettingsStore from "@/app/_store/settings.store";
import usePlayersStore from "@/app/_store/players.store";
import useCurrentPlayerStore from "@/app/_store/currentPlayer.store";
import useUserStore from "@/app/_store/user.store";
import { socket } from "@/app/variables";

const Game = () => {
  const settings = useSettingsStore().settings;
  const { players, setPlayers } = usePlayersStore();
  const { currentPlayer, setCurrentPlayer } = useCurrentPlayerStore();
  const { user, setUser } = useUserStore();
  const [words, setWords] = useState([]);


  const handleSendWord = (e) => {
    if (e.key === "Enter" && currentPlayer === user.id) {
      console.log(e.target.value);
      socket.emit("sendWord", {word: e.target.value});
    }
  }

  useEffect(() => {
    socket.on("updateWords", (data) => {
      console.log(data);
      setCurrentPlayer(data.currentPlayer);
      setWords(data.words);
    });
  }, []);

  return (
    <main>
      <section className="w-screen h-screen flex flex-col items-center justify-evenly">
        <section className="w-4/6 h-fit flex justify-center items-center bg-[#95D5B2] rounded-xl p-5">
          <p className="text-4xl font-medium">
            {words.join(" ")}
          </p>
        </section>
        <section className="flex flex-col justify-between items-center w-full h-36">
          <div className="flex justify-center items-center ">
            <input type="text" className="bg-[#95D5B2] rounded-xl px-10 py-3 text-2xl focus:outline-none transition-all text-center" onKeyDown={handleSendWord} />
          </div>
          
            <div className="flex justify-evenly items-center w-fit gap-10 mt-10 bg-[#95D5B2] p-10 rounded-xl">
              {players.map((player) => (
                <div key={player.id} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-full"></div>
                  <p className="text-2xl font-medium">{player.name}</p>
                </div>
              ))}
            </div>
         
        </section>
      </section>
    </main>
  );
};

export default Game;
