import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo, MouseEventHandler } from 'react';

import { trpc } from '@/utils/trpc';
import { getOptionsForVote } from '@/utils/getRandomPokemon';



function Pokemon(props: {name: string | undefined, sprite: string | undefined, updateIDs: MouseEventHandler<HTMLButtonElement>}){

  function PokeImage(){
    if(props.sprite){
      return (<img src={props.sprite} className={'w-64 h-64'}/>);
    }

    // Color for bg-gray-800
    const background: string = '#1f2937';

    return (
      <div className='w-64 h-64 grid place-content-center'>
        <svg className="animate-spin w-32 h-32" viewBox='0 0 100 100'>
          <circle cx="50" cy="50" r="40" stroke="red" strokeWidth="3" fill="cyan" />
          <rect width="100" height="50" fill={background} stroke={background} x="0" y="50" />
          <rect width="50" height="100" fill={background} stroke={background} x="0" y="0" />
          <circle cx="50" cy="50" r="37" stroke="cyan" strokeWidth="1" fill="cyan" />
          <text x="20" y="53" fill="black">Loading...</text>
          Loading...
        </svg>
      </div>);
  }

  return (
    <div className='w-auto h-auto flex flex-col select-none'>
      <PokeImage />
      <div className='text-xl text-center capitalize select-all'>
        {props.name ?? 'Loading...'}
      </div>
      <div className='p-3 grid place-items-center'>
        <button onClick={props.updateIDs}
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className='
            inline-block
            px-6 py-2.5 bg-cyan-600 
            select-none text-white font-bold text-xs leading-tight uppercase
            rounded shadow-md hover:bg-cyan-700 hover:shadow-lg
            focus:shadow-lg focus:outline-none focus:ring-0 
            active:bg-cyan-800 active:shadow-lg
            transition duration-150 ease-in-out'
          >
            {props.name} is Roundest
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  console.log("Rendering");

  const [IDs, setIDs] = useState([0, 0]);

  const updateIDs = ()=>{
    setIDs(getOptionsForVote());
  };

  useEffect(()=>{
    updateIDs();
  },[]);
  

  const pokemons = trpc.useQuery(["get-pokemon-by-id", IDs], { 
    staleTime: Infinity,
  });

  const parseQuery = (index: number) => {
    if(pokemons.isLoading){
      return {
        name: undefined,
        sprite: undefined,
      };
    } 
    
    if(!pokemons.isSuccess){
      return {
        name: 'Error Loading',
        sprite: undefined,
      };
    }

    if (pokemons.data){
      return {
        name: pokemons.data[index].pokeName,
        sprite: pokemons.data[index].pokeSprite,
      };
    }

    // This branch should be unreachable
    console.warn('Unexpected branch reached');
    return {
      name: 'unexpected branch error',
      sprite: undefined,
    };
  };

  let firstData = parseQuery(0);
  let secondData = parseQuery(1);





  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
      <div className='text-2xl text-center select-none'>Which Pokémon is Rounder</div>
      <div className='p-2'/>
      <div className='border rounded p-8 flex justify-between max-w-2xl'>
        <Pokemon name={firstData.name} sprite={firstData.sprite} updateIDs={updateIDs}/>
        <div className='p-8 grid place-content-center text-center select-none'>VS</div>
        <Pokemon name={secondData.name} sprite={secondData.sprite} updateIDs={updateIDs}/>
      </div>
    </div>
  );
}




