import type { NextPage } from 'next';
import { useState, useEffect, useMemo } from 'react';
import { getOptionsForVote } from '@/utils/getRandomPokemon';

import { trpc } from '@/utils/trpc';

export default function Home() {
  
  const pokemons = trpc.useQuery(["get-pokemon-by-id"], { 
    retryDelay: 1000,
    // initialData: [0, 0],
  });

  const [first, second] = useMemo(()=>{
    let pokemonData = pokemons?.data;

    if (pokemonData){
      const [firstPokemon, secondPokemon] = pokemonData;
      // console.log(firstPokemon);

      return [firstPokemon, secondPokemon];
    }
    return [null, null];
  },[]);

  const firstImage = useMemo(()=>{
    let sprite = first?.sprite;
    if (!sprite){
      return '';
    }

    return sprite;
  }, [first]);
  // const [secondImage, setSecondImage] = useState('');
  const secondImage = useMemo(()=>{
    let sprite = second?.sprite;
    if (!sprite){
      return '';
    }

    return sprite;
  },[second]);

  const firstName = useMemo(() => {
    let name = first?.name;
    if (!name) {
      return 'Loading...';
    }

    return name;
  }, [first]);

  const secondName = useMemo(() => {
    let name = second?.name;
    if(!name) {
      return 'Loading...';
    }

    return name;
  }, [second]);

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
      <div className='text-2xl text-center'>Which Pokémon is Rounder</div>
      <div className='p-2'/>
      <div className='border rounded p-8 flex justify-between max-w-2xl'>
        <div className='w-64 h-64 flex flex-col'>
          <img src={firstImage} className='w-full'/>
          <div className='text-xl text-center capitalize'>
            {firstName}
          </div>
        </div>
        <div className='p-8'>VS</div>
        <div className='w-64 h-64 flex flex-col'>
          <img src={secondImage} className='w-full'/>
          <div className='text-xl text-center capitalize'>
            {secondName}
          </div>
        </div>
        
      </div>
    </div>
  )
}


