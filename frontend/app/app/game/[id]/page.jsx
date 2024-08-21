"use client";
import React, { useEffect, useState } from "react";
import useSettingsStore from "@/app/_store/settings.store";
import usePlayersStore from "@/app/_store/players.store";
import useCurrentPlayerStore from "@/app/_store/currentPlayer.store";
import useUserStore from "@/app/_store/user.store";
import { socket } from "@/app/variables";
import { useRouter } from "next/navigation";

const Game = () => {
  const settings = useSettingsStore().settings;
  const { players, setPlayers } = usePlayersStore();
  const { currentPlayer, setCurrentPlayer } = useCurrentPlayerStore();
  const { user, setUser } = useUserStore();
  const [words, setWords] = useState([]);
  const [timer, setTimer] = useState(settings.time || 5); // Use settings.time or default to 5
  const [inputValue, setInputValue] = useState("");
  const [progressWidth, setProgressWidth] = useState("100%");

  const roomCode = window.location.pathname.split("/")[3];

  const router = useRouter();

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          handleSendWord(); // Automatically send the word when timer hits 0
          return settings.time || 5; // Reset timer to settings.time or 5
        } else {
          return prevTimer - 1;
        }
      });

      setProgressWidth((prevWidth) => {
        const newWidth = ((timer - 1) / (settings.time || 5)) * 100;
        return `${newWidth}%`;
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, [settings.time, timer]);

  const handleSendWord = () => {
    if (currentPlayer === user.id && inputValue.trim() !== "") {
      console.log(inputValue);
      socket.emit("sendWord", { word: inputValue });
      setWords((prevWords) => [...prevWords, inputValue]);
      setInputValue("");
      setTimer(settings.time || 5); // Reset the timer to settings.time or 5
      setProgressWidth("100%"); // Reset progress bar
    }
  };

  useEffect(() => {
    socket.on("updateWords", (data) => {
      setWords(data.words);
      setCurrentPlayer(data.currentPlayer);
    })}
    );

  useEffect(() => {
    socket.on("redirect", (data) => {
      setTimeout(() => {
        router.push("/app/game/" + roomCode + "/" +  data.url);
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

  return (
    <main>
      <section className="w-screen h-5 bg-[#95D5B2] fixed top-0 left-0">
        <div
          className="h-full bg-[#1B4332] transition-all duration-1000 ease-linear"
          style={{ width: progressWidth }}
        ></div>
      </section>
      <section className="w-screen h-screen flex flex-col items-center justify-evenly">
        <section className="w-4/6 h-fit flex justify-center items-center bg-[#95D5B2] rounded-xl p-5">
          <p className="text-4xl font-medium">{words.join(" ")}</p>
        </section>
        <section className="flex flex-col justify-between items-center w-full h-36">
          <div className="flex justify-center items-center ">
            <input
              type="text"
              className="bg-[#95D5B2] rounded-xl px-10 py-3 text-2xl focus:outline-none transition-all text-center"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
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
