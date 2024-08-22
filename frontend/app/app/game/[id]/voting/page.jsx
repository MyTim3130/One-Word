'use client'
import React, {useEffect, useState} from 'react'
import usePlayersStore from '@/app/_store/players.store'
import useUserStore from '@/app/_store/user.store'
import {socket} from '@/app/variables'

const gptObject = {
  "gpt": {
      "words": [
          "Viele",
          "Egypter",
          "inhalieren",
          "vapes",
          "weswegen",
          "ihre",
          "Mächte",
          "schwinden."
      ],
      "players": [
          {
              "id": "FQCvSbP7FOI41U0GAAAv",
              "name": "Tim",
              "host": true,
              "words": [
                  "Viele",
                  "vapes",
                  "Mächte"
              ],
              "points": 350,
              "place": 1
          },
          {
              "id": "CALqV-Fs5g_VAo1oAAAz",
              "name": "Timo",
              "host": false,
              "words": [
                  "Egypter",
                  "weswegen",
                  "schwinden."
              ],
              "points": 300,
              "place": 2
          },
          {
              "id": "hTBraO74JfRCNPMuAAA5",
              "name": "Alex",
              "host": false,
              "words": [
                  "inhalieren",
                  "ihre"
              ],
              "points": 150,
              "place": 3
          }
      ]
  }
}

const Voting = () => {
  const {players, setPlayers} = usePlayersStore()
  const {user, setUser} = useUserStore()
  const [votingData, setVotingData] = useState(null)

useEffect(() => {
 socket.emit("getVotingData",)

  socket.on("votingData", (data) => {
    console.log(data)
    setVotingData(data)
  })
}, [])



  return (
    <main className='flex justify-between items-center flex-col'>
      <h1 className='text-3xl p-10'>Leaderboard</h1>
    
      {votingData === null ? (
        <div className='text-2xl'>Loading...</div>
      ) : (
        <div className='flex w-fit justify-around p-20 gap-36 bg-[#95D5B2] rounded-xl'>
          {votingData.gpt.players.map((player) => (
            <section key={player.id} className='flex flex-col justify-between'>
              <div>
                <div>
                  <h2 className='text-xl mb-3'>{player.name}</h2>
                  <div>
                    {votingData.gpt.players.find((p) => p.id === player.id).words.map((word, index) => (
                      <div key={index}>- {word}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='text-lg font-medium mt-5'>Points: {player.points}</div>
            </section>
          ))} 
        </div>
      )}
    </main>
  )
}

export default Voting