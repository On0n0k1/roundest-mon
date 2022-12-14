import type { NextPage } from 'next';
import React, { useState, useEffect, useMemo, MouseEventHandler } from 'react';

import { trpc } from '@/utils/trpc';
import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { inferQueryResponse } from '@/pages/api/trpc/[trpc]';


type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">;

const LoadingImage = () => {
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
    </div>
  )
}

const LoadingButton = () => {
  return (
    <button
      type="button"
      disabled
      data-mdb-ripple="true"
      data-mdb-ripple-color="light"
      className='
        inline-block
        px-6 py-2.5 bg-gray-400 
        select-none text-black font-bold text-xs leading-tight uppercase
        rounded shadow-md
        focus:shadow-lg focus:outline-none focus:ring-0'
      >
        Loading...
    </button>
  )
}

const LoadingPokemon = () => {
  return (
    <div className='w-auto h-auto flex flex-col select-none'>
      <LoadingImage />
      <div className='text-xl text-center capitalize select-all'>
        'Loading...'
      </div>
      <div className='p-3 grid place-items-center'>
        <LoadingButton />
      </div>
    </div>)
}

const ErrorPokemon = () => {
  return (
    <div className='w-auto h-auto flex flex-col select-none'>
      <LoadingImage />
      <div className='text-xl text-center capitalize select-all'>
        'Error'
      </div>
      <div className='p-3 grid place-items-center'>
        <LoadingButton />
      </div>
    </div>)
}

// function Pokemon(props: {name: string | undefined, sprite: string | undefined, updateIDs: MouseEventHandler<HTMLButtonElement>}){
const Pokemon: React.FC<{pokemons: PokemonFromServer, vote: (arg0: number) => void, index: number }> = (props) =>{

  function PokeImage(){
    return props.pokemons[props.index].pokeSprite
      ? (<img src={props.pokemons[props.index].pokeSprite} className={'w-64 h-64'}/>)
      : (<LoadingImage />);
  }

  return (
    <div className='w-auto h-auto flex flex-col select-none'>
      <PokeImage />
      <div className='text-xl text-center capitalize select-all'>
        {props.pokemons[props.index].pokeName ?? 'Loading...'}
      </div>
      <div className='p-3 grid place-items-center'>
        { props.pokemons[props.index].pokeName
          ? (
          <button onClick={()=>{ props.vote(props.index) }}
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
              {props.pokemons[props.index].pokeName} is Roundest
          </button>)
          : <LoadingButton />
        }
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

  const vote: (arg0: number) => void = (index) => {
    // TODO: something with index
    updateIDs();
  }

  useEffect(()=>{
    updateIDs();
  },[]);
  

  const pokemons = trpc.useQuery(["get-pokemon-by-id", IDs], { 
    staleTime: Infinity,
  });

  if (!pokemons || pokemons.isLoading){
    return (
      <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
        <div className='text-2xl text-center select-none'>Which Pok??mon is Rounder</div>
        <div className='p-2'/>
        <div className='border rounded p-8 flex justify-between max-w-2xl'>
          <LoadingPokemon />          
          <div className='p-8 grid place-content-center text-center select-none'>VS</div>
          <LoadingPokemon />
        </div>
      </div>
    );
  }

  if (pokemons.data && pokemons.isSuccess){
    return (
      <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
        <div className='text-2xl text-center select-none'>Which Pok??mon is Rounder</div>
        <div className='p-2'/>
        <div className='border rounded p-8 flex justify-between max-w-2xl'>
          <Pokemon pokemons={pokemons.data} index={0} vote={vote}/>
          <div className='p-8 grid place-content-center text-center select-none'>VS</div>
          <Pokemon pokemons={pokemons.data} index={1} vote={vote}/>
        </div>
      </div>
    );
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center align-middle'>
      <div className='text-2xl text-center select-none'>Which Pok??mon is Rounder</div>
      <div className='p-2'/>
      <div className='border rounded p-8 flex justify-between max-w-2xl'>
        <ErrorPokemon />
        <div className='p-8 grid place-content-center text-center select-none'>VS</div>
        <ErrorPokemon />
      </div>
    </div>
  );
}


