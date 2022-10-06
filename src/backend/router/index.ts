import * as trpc from '@trpc/server';
import { z } from 'zod';


import { PokemonClient } from 'pokenode-ts';



export const appRouter = trpc.router().query("get-pokemon-by-id", {
  input: z.number(),
  async resolve(data) {
    if(!data.input){
      // console.log('First Render...');
      return {
        pokeName: '',
        pokeSprite: '',
      };
    }

    // console.log('get-pokemon-id with IDs %d', data.input);
    const api = new PokemonClient();

    const pokemon = await api.getPokemonById(data.input);

    if(!pokemon.sprites.front_default){
      return {
        pokeName: pokemon.name,
        pokeSprite: '',
      }
    }
    
    return {
      pokeName: pokemon.name,
      pokeSprite: pokemon.sprites.front_default,
    };
  }
});

export type AppRouter = typeof appRouter;
