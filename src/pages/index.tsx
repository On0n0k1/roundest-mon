import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo } from 'react';
// import { getOptionsForVote } from '@/utils/getRandomPokemon';

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

  const pokemons = trpc.useQuery(["get-pokemon-by-id"], { 
    staleTime: Infinity,
  });


  const parseQuery = (index: number) => {
    if(pokemons.isLoading){
      return {
        name: 'Loading',
        sprite: '',
      };
    } 
    
    if(!pokemons.isSuccess){
      return {
        name: 'Error Loading',
        sprite: '',
      };
    }

    if (pokemons.data){
      return {
        name: pokemons.data[index].pokeName,
        sprite: pokemons.data[index].pokeSprite,
      };
    }

    console.warn('Unexpected branch reached');
    return {
      name: 'unexpected branch error',
      sprite: '',
    };
  };

  let firstData = parseQuery(0);
  let secondData = parseQuery(1);

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
      <div className='text-2xl text-center'>Which Pokémon is Rounder</div>
      <div className='p-2'/>
      <div className='border rounded p-8 flex justify-between max-w-2xl'>
        <Pokemon name={firstData.name} sprite={firstData.sprite}/>
        <div className='p-8 grid place-content-center'>VS</div>
        <Pokemon name={secondData.name} sprite={secondData.sprite}/>
      </div>
    </div>
  );
}




