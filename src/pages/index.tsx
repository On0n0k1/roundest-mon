import type { NextPage } from 'next';
import { useState, useEffect, useMemo } from 'react';
import { getOptionsForVote } from '@/utils/getRandomPokemon';

import { trpc } from '@/utils/trpc';

export default function Home() {
  const [firstId, setFirstId] = useState(0);
  const [secondId, setSecondId] = useState(0);
  
  const [firstData, setFirstData] = useState({
    name:'',
    sprite: '',
  });

  const [secondData, setSecondData] = useState({
    name: '',
    sprite: '',
  })

  trpc.useQuery(["get-pokemon-by-id", firstId], { 
    staleTime: Infinity,
    onSuccess: (data) => {
      // console.log('Setting %cfirst%c as %c%s',"color:cyan","color:white","color:cyan", data.pokeName);
        setFirstData({
          name: data.pokeName,
          sprite: data.pokeSprite,
        });      
    },
    onError: (err) => {
      console.error(err);
    }
  });

  trpc.useQuery(["get-pokemon-by-id", secondId], { 
    staleTime: Infinity,
    onSuccess: (data)=>{
      // console.log('Setting %csecond%c as %c%s',"color:yellow","color:white","color:yellow", data.pokeName);
      setSecondData({
        name:data.pokeName,
        sprite: data.pokeSprite,
      })
    },
    onError: (err) => {
      console.error(err);
    }
   });


  useEffect(()=>{
    console.log('First render');
    let ids = getOptionsForVote();
    setFirstId(ids[0]);
    setSecondId(ids[1]);
  },[])


  // console.log('Rendering');

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
      <div className='text-2xl text-center'>Which Pokémon is Rounder</div>
      <div className='p-2'/>
      <div className='border rounded p-8 flex justify-between max-w-2xl'>
        <div className='w-64 h-64 flex flex-col'>
          <img src={firstData.sprite} className='w-full'/>
          <div className='text-xl text-center capitalize'>
            {firstData.name}
          </div>
        </div>
        <div className='p-8 grid place-content-center'>VS</div>
        <div className='w-64 h-64 flex flex-col'>
          <img src={secondData.sprite} className='w-full'/>
          <div className='text-xl text-center capitalize'>
            {secondData.name}
          </div>
        </div>
      </div>
    </div>
  );
}


