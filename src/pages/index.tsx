import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { getOptionsForVote } from '@/utils/getRandomPokemon';

export default function Home() {
  // const { data, isLoading } = trpc.useQuery(["hello", {text: "Theo"}]);

  // if (isLoading) return (<div>Loading...</div>);

  // if (data) return (<div>{ data.greeting }</div>)
  // const [first, second] = getOptionsForVote();
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);

  useEffect(()=>{
    const [poke1, poke2] = getOptionsForVote();
    setFirst(poke1);
    setSecond(poke2);
  }, []);

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <div className='text-2xl text-center'>Which Pokémon is Rounder</div>
      <div className='p-2'/>
      <div className='border rounded p-8 flex justify-between max-w-2xl'>
        <div className='w-16 h-16 bg-red-800'>{ first }</div>
        <div className='p-8'>VS</div>
        <div className='w-16 h-16 bg-red-800'>{ second }</div>
      </div>
    </div>
  )
}


