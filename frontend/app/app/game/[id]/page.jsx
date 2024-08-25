"use client";
import React, { useEffect, useState } from "react";
import useSettingsStore from "@/app/_store/settings.store";
import usePlayersStore from "@/app/_store/players.store";
import useCurrentPlayerStore from "@/app/_store/currentPlayer.store";
import useUserStore from "@/app/_store/user.store";
import { socket } from "@/app/variables";
import { useRouter } from "next/navigation";

const Game = () => {
  const { settings, setSettings } = useSettingsStore();
  const { players, setPlayers } = usePlayersStore();
  const { currentPlayer, setCurrentPlayer } = useCurrentPlayerStore();
  const { user, setUser } = useUserStore();
  const [words, setWords] = useState([]);
  const [timer, setTimer] = useState(settings.time || 5); // Use settings.time or default to 5
  const [inputValue, setInputValue] = useState("");

  const roomCode = window.location.pathname.split("/")[3];

  const router = useRouter();
  
  console.log(user)

  useEffect(() => {

    const currPlayer = document.getElementById(currentPlayer);
    if (!currPlayer) return;
    const playerIndicator = document.getElementById("playerIndicator");
    const playerRect = currPlayer.getBoundingClientRect();
    playerIndicator.style.left = `${playerRect.left + playerRect.width / 2}px`;
    playerIndicator.style.top = `${playerRect.top + playerRect.height / 2}px`;
    playerIndicator.style.width = `${playerRect.width + 30}px`;
    playerIndicator.style.height = `${playerRect.height + 10}px`;  


    setTimer(settings.time || 5);
    const indicator = document.getElementById("progress");
    indicator.style.removeProperty("animation");
    void indicator.offsetWidth;
    indicator.style.animation = `progress ${
      settings.time || 5
    }s linear infinite`;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPlayer]);

  useEffect(() => {
    if (timer === 0 && currentPlayer === user.id) {
      handleSendWord();
    }
  }, [timer]);

  const handleSendWord = () => {
    console.log(currentPlayer == user.id);
    if (currentPlayer === user.id) {
      console.log(inputValue);
      socket.emit("sendWord", {
        word: inputValue,
        maxWords: settings.maxWords,
      });
      setWords((prevWords) => [...prevWords, inputValue]);
      setInputValue("");
    }
  };

  useEffect(() => {
    socket.on("updateWords", (data) => {
      setWords(data.words);
      setCurrentPlayer(data.currentPlayer);
    });
  });

  useEffect(() => {
    socket.on("redirect", (data) => {
      setTimeout(() => {
        router.push("/app/game/" + roomCode + "/" + data.url);
      }, 3000);
    });
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendWord(); // Trigger send word logic on Enter key press
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    socket.on("disconnect", () => {
      socket.emit("updatePlayers", {
        players: players.filter((player) => player.id !== user.id),
      });
    });
  }, []);

  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      setPlayers(data.players);
    });
  }, []);

  return (
    <main>
      <section className="w-screen h-5 bg-[#95D5B2] fixed top-0 left-0">
        <div className="h-full bg-[#1B4332]" id="progress"></div>
      </section>
      <section className="w-screen h-screen flex flex-col items-center justify-evenly">
        <section className="w-4/6 h-fit flex justify-center items-center bg-[#95D5B2] rounded-xl p-5">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium">{words.join(" ")}</p>
        </section>
        <section className="flex flex-col justify-between items-center w-full h-36">
          <div className="flex justify-center items-center ">
            <input
              type="text"
              className="bg-[#95D5B2] rounded-xl px-1 lg:px-10 py-3 text-2xl focus:outline-none transition-all text-center"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="lg:flex justify-evenly items-center w-fit gap-10 mt-10 bg-[#95D5B2] p-10 rounded-xl grid grid-cols-2">
            {players.map((player) => (
              <div
            
                key={player.id}
                className="flex flex-col items-center z-20 relative"
              >
                <div className="lg:w-24 lg:h-24 h-16 w-16 bg-white rounded-full"></div>
                <p id={player.id} className="text-2xl font-medium">{player.name}</p>
              </div>
            ))}
            <div
              id="playerIndicator"
              className="bg-slate-300 absolute duration-500 bottom-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-xl z-10"
            />
          </div>
        </section>
      </section>
    </main>
  );
};

export default Game;
