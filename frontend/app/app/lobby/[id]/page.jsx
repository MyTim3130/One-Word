"use client";
import React, { useState, useEffect } from "react";
import { socket } from "../../../variables";
import useUserStore from "@/app/_store/user.store";
import usePlayersStore from "@/app/_store/players.store";
import useSettingsStore from "@/app/_store/settings.store";

const Lobby = () => {
  const { user, setUser } = useUserStore();
  const { players, setPlayers } = usePlayersStore();
  const { settings, setSettings } = useSettingsStore();

  useEffect(() => {
    socket.on("updatePlayers", (data) => {
      setPlayers(data.players);
    });

 

    return () => {
      socket.off("updatePlayers");
    };
  }, []);

  const handleTimeChange = (e) => {
    
    socket.emit("updateSettings", { settings: {...settings, time: e.target.value} });
  };

  const handleMaxWordsChange = (e) => {
    socket.emit("updateSettings", { settings: {...settings, maxWords: e.target.value} });
  };

  

  useEffect(() => {
    socket.on("updateSettings", (data) => {
      setSettings(data.settings);
      console.log(data.settings);
    }
    );
    return () => {
      socket.off("updateSettings");
    };
  }
    );

  return (
    <main>
      <div>
        {players.map((player) => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
      <section>
        <h2>Settings</h2>
        <div>
          <label htmlFor="time">Time:</label>
          <input onChange={handleTimeChange} value={settings.time} type="number" id="time" />
        </div>
        <div>
          <label htmlFor="maxWords">Max Words:</label>
          <input onChange={handleMaxWordsChange} value={settings.maxWords} type="number" id="maxWords" />
        </div>
      </section>
    </main>
  );
};

export default Lobby;
