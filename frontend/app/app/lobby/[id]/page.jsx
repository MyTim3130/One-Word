"use client";
import React, { useState, useEffect } from "react";
import { socket } from "../../../variables";
import usePlayersStore from "@/app/_store/players.store";
import useSettingsStore from "@/app/_store/settings.store";
import useCurrentPlayerStore from "@/app/_store/currentPlayer.store";
import { useRouter } from "next/navigation";

const Lobby = () => {
  const { players, setPlayers } = usePlayersStore();
  const { settings, setSettings } = useSettingsStore();
  const [lobbyCode, setLobbyCode] = useState("");
  const {currentPlayer, setCurrentPlayer} = useCurrentPlayerStore();

  const router = useRouter();

  useEffect(() => {
    setLobbyCode(window.location.pathname.split("/")[3]);
  }, []);


  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      setPlayers(data.players);
    });

    return () => {
      socket.off("updatePlayers");
    };
  }, []);

  const handleTimeChange = (e) => {
    socket.emit("updateSettings", {
      settings: { ...settings, time: e.target.value },
    });
  };

  const handleMaxWordsChange = (e) => {
    socket.emit("updateSettings", {
      settings: { ...settings, maxWords: e.target.value },
    });
  };

  useEffect(() => {
    socket.on("updateSettings", (data) => {
      setSettings(data.settings);
      console.log(data.settings);
    });
    return () => {
      socket.off("updateSettings");
    };
  });

  const handleStartGame = () => {
    socket.emit("startGame", { lobbyCode });

  };


  
useEffect(() => {
  socket.on("redirect", (data) => {
    console.log(data);
    setCurrentPlayer(data.currentPlayer);
    router.push(data.url);
  }
  );
  return () => {
    socket.off("redirect");
  }
}
);



  return (
    <main className="flex w-screen h-fit lg:h-screen gap-20 lg:flex-row p-10 flex-col items-center justify-center lg:justify-normal lg:items-stretch">
      <div className="h-full w-3/4 lg:w-1/4 bg-[#95D5B2] rounded-md flex flex-col gap-5 items-center pt-6 text-xl">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-[#ffffff9a] w-3/4 h-12 flex justify-center items-center rounded-md mb-5"
          >
            <div>{player.name}</div>
          </div>
        ))}
      </div>
      <section className="w-full flex flex-col gap-10">
        <section className="w-full h-full flex flex-col md:flex-row gap-10">
          <section className="w-full">
            <div className="h-fit w-full bg-[#95D5B2] rounded-md p-5 flex flex-col justify-between">
            <div>

           
              <h2 className="text-3xl">Settings:</h2>
              <div className="mt-10 flex flex-col justify-around h-2/5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="time" className="text-2xl">
                    Time:
                  </label>
                  <input
                    onChange={handleTimeChange}
                    value={settings.time}
                    type="number"
                    id="time"
                    className="h-11 text-xl bg-[#ffffff9a] rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="maxWords" className="text-2xl">
                    Max Words:
                  </label>
                  <input
                    onChange={handleMaxWordsChange}
                    value={settings.maxWords}
                    type="number"
                    id="maxWords"
                    className="h-11 text-xl bg-[#ffffff9a] rounded-md"
                  />
                </div>
              </div>
              </div>
              <section className="w-full flex justify-end">
              <button onClick={handleStartGame} className="bg-[#374e42] text-2xl rounded-md p-2 mt-5 text-white">
                Start Game
              </button>
            </section>
            </div>
          
          </section>

          <section className="w-full h-96 bg-[#95D5B2] rounded-md p-5">
            CANVAS
          </section>
        </section>
        <section className="w-full h-20 bg-[#95D5B2] rounded-md flex justify-center items-center text-4xl font-semibold">{lobbyCode}</section>
      </section>
    </main>
  );
};

export default Lobby;
