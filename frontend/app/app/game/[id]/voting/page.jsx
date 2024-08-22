'use client'
import React, {useEffect, useState} from 'react'
import usePlayersStore from '@/app/_store/players.store'
import useUserStore from '@/app/_store/user.store'
import {socket} from '@/app/variables'

const gptObject = {
  "words": [
      "Übermorgen",
      "unternehme",
      "ich",
      "nichts",
      ", deshalb",
      "unternehme",
      "ich",
      "übermorgen",
      "nichts."
  ],
  "players": [
      {
          "id": "NBj4q2o48QY4fT6DAAAr",
          "name": "Timo",
          "host": true,
          "words": [
              "Übermorgen",
              "ich",
              ", deshalb",
              "ich",
              "nichts."
          ],
          "points": 100,
          "place": 2
      },
      {
          "id": "8WRpyB8AuWQcHXH8AAAp",
          "name": "Tim",
          "host": false,
          "words": [
              "unternehme",
              "nichts",
              "unternehme",
              "übermorgen"
          ],
          "points": 450,
          "place": 1
      }
  ]
}

const Voting = () => {
  const {players, setPlayers} = usePlayersStore()
  const {user, setUser} = useUserStore()
  const [votingData, setVotingData] = useState(gptObject)

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
    
        <div className='flex w-fit justify-around p-20 gap-36 bg-[#95D5B2] rounded-xl'>

       
        {votingData.players.map((player) => (
          <section key={player.id} className='flex flex-col justify-between'>
            <div>
          <div>
            <h2 className='text-xl mb-3'>{player.name}</h2>
            <div>
              {votingData.players.find((p) => p.id === player.id).words.map((word, index) => (
                <div key={index}>- {word}</div>
              ))}
             
            </div>
           
          </div>
          </div>
           <div className='text-lg font-medium mt-5'>Points: {player.points}</div>
           </section>
        ))}
 
      </div>

    </main>
  )
}

export default Voting