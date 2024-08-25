'use client';
import React from 'react'
import { useRouter } from 'next/navigation';


const Home = () => {
  const router = useRouter();

  const handleCreateRoom = () => {
   
    router.push('./lobby');
  }

  const handleJoinRoom = () => {
    router.push('./lobby/join');
  }


  return (
    <main className='h-screen w-screen flex flex-col gap-10'>
        <div className='w-full flex justify-center mt-60'>
            <h1 className='text-4xl md:text-5xl lg:text-7xl text-[#081C15] font-bold'>ONE WORD...</h1>
        </div>
        <div className='w-full flex justify-center'>
            <div className='w-full lg:w-2/4 flex justify-evenly h-[30vh] items-center'>
                <button onClick={handleCreateRoom} className='text-xl md:text-2xl px-5 lg:px-10 py-5 bg-[#95D5B2] rounded-3xl hover:scale-90 transition-all'>Create Room</button>
                <button onClick={handleJoinRoom} className='text-xl md:text-2xl px-5 lg:px-10 py-5 bg-[#95D5B2] rounded-3xl hover:scale-90 transition-all'> Join Room</button>
            </div>
        </div>
    </main>
  )
}

export default Home