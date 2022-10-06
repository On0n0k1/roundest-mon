import * as trpc from '@trpc/server';
import { z } from 'zod';
import { getOptionsForVote } from '@/utils/getRandomPokemon';


import { PokemonClient } from 'pokenode-ts';



export const appRouter = trpc.router().query("get-pokemon-by-id", {
  async resolve() {
    const [first, second] = getOptionsForVote();

    console.log('get-pokemon-id with IDs %c%d and %d',"color: yellow", first, second);
    const api = new PokemonClient();

    let pokemons = await Promise.all([api.getPokemonById(first), api.getPokemonById(second)]);

    return pokemons.map((pokemon)=>{
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
    });
    
  }
});

export type AppRouter = typeof appRouter;
