import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
import { getOptionsForVote } from '@/utils/getRandomPokemon';

import { trpc } from '@/utils/trpc';




function Pokemon(props: {name: string, sprite: string}){
  return (
    <div className='w-64 h-64 flex flex-col'>
      <img src={props.sprite} className='w-full'/>
      <div className='text-xl text-center capitalize'>
        {props.name}
      </div>
    </div>
  );
}

export default function Home() {
  console.log("Rendering");
  const [firstId, setFirstId] = useState(0);
  const [secondId, setSecondId] = useState(0);
  // const [firstPokemon, setFirstPokemon] = useState({
  //   name: 'Loading...',
  //   sprite: '',
  // });
  // const [secondPokemon, setSecondPokemon] = useState({
  //   name: 'Loading...',
  //   sprite: '',
  // });

  const first = trpc.useQuery(["get-pokemon-by-id", firstId], { 
    staleTime: Infinity,
  });

  const second = trpc.useQuery(["get-pokemon-by-id", secondId], { 
    staleTime: Infinity,
   });


  useEffect(()=>{
    // console.log('First render');
    let ids = getOptionsForVote();
    setFirstId(ids[0]);
    setSecondId(ids[1]);
  },[]);

  const parseQuery = (pokeQuery: any) => {
    if(pokeQuery.isLoading){
      return {
        name: 'Loading',
        sprite: '',
      };
    } 
    
    if(!pokeQuery.isSuccess){
      return {
        name: 'Error Loading',
        sprite: '',
      };
    }

    if (pokeQuery.data){
      return {
        name: pokeQuery.data.pokeName,
        sprite: pokeQuery.data.pokeSprite,
      };
    }

    console.warn('Unexpected branch reached');
    return {
      name: 'unexpected branch error',
      sprite: '',
    };
  };

  let firstData = parseQuery(first);
  let secondData = parseQuery(second);

  // useEffect(()=>{

  //   if(first.isLoading){
  //     setFirstPokemon( {
  //       name: 'Loading',
  //       sprite: '',
  //     });
  //     return;
  //   } 
    
  //   if(!first.isSuccess){
  //     setFirstPokemon({
  //       name: 'Error Loading',
  //       sprite: '',
  //     });

  //     return;
  //   }

  //   if (first.data){
  //     setFirstPokemon( {
  //       name: first.data.pokeName,
  //       sprite: first.data.pokeSprite,
  //     });

  //     return;
  //   }

  //   console.warn('Unexpected branch reached');
  //   setFirstPokemon({
  //     name: 'unexpected branch error',
  //     sprite: '',
  //   });
  // }, [first]);

  // useEffect(()=>{}, [first]);

  // useEffect(()=>{
  //   if(second.isLoading){
  //     setSecondPokemon({
  //       name: 'Loading',
  //       sprite: '',
  //     });

  //     return;
  //   }

  //   if(!second.isSuccess){
  //     setSecondPokemon({
  //       name: 'Error Loading',
  //       sprite: '',
  //     });

  //     return;
  //   }

  //   if (second.data){
  //     setSecondPokemon({
  //       name: second.data.pokeName,
  //       sprite: second.data.pokeSprite,
  //     });

  //     return;
  //   }

  //   console.warn('Unexpected branch reached');
  //   setSecondPokemon({
  //     name: 'unexpected branch error',
  //     sprite: '',
  //   });
  // }, [second]);

  // console.log('Rendering');

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
      <div className='text-2xl text-center'>Which Pokémon is Rounder</div>
      <div className='p-2'/>
      <div className='border rounded p-8 flex justify-between max-w-2xl'>
        {/* <div className='w-64 h-64 flex flex-col'>
          <img src={firstPokemon.sprite} className='w-full'/>
          <div className='text-xl text-center capitalize'>
            {firstPokemon.name}
          </div>
        </div> */}
        <Pokemon name={firstData.name} sprite={firstData.sprite}/>
        <div className='p-8 grid place-content-center'>VS</div>
        {/* <div className='w-64 h-64 flex flex-col'>
          <img src={secondPokemon.sprite} className='w-full'/>
          <div className='text-xl text-center capitalize'>
            {secondPokemon.name}
          </div>
        </div> */}
        <Pokemon name={secondData.name} sprite={secondData.sprite}/>
      </div>
    </div>
  );
}




