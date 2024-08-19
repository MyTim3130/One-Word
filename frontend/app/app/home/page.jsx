'use client';
import React from 'react'
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';


const Home = () => {
  const router = useRouter();

  const handleCreateRoom = () => {
   
    router.push('./lobby');
  }


  return (
    <main className='h-screen w-screen flex flex-col justify-center items-center gap-10'>
        <div>
            <h1>ONE WORD</h1>
        </div>
        <div className='w-full flex justify-center'>
            <div className='w-2/4 flex justify-evenly'>
                <button onClick={handleCreateRoom}>Create Room</button>
                <button>Join Room</button>
            </div>
        </div>
    </main>
  )
}

export default Home