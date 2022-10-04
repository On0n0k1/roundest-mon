import * as trpc from '@trpc/server';
import { z } from 'zod';

import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { PokemonClient } from 'pokenode-ts';




export const appRouter = trpc
  .router()
  .query("get-pokemon-by-id", {
    async resolve() {
      const api = new PokemonClient();
      const [first, second] = getOptionsForVote();

      const firstPromise = api.getPokemonById(first);
      const secondPromise = api.getPokemonById(second);

      const pokemons = await Promise.all([firstPromise, secondPromise]).then((values)=>{
        const [firstP, secondP] = values;

        return [
          {
            name: firstP.name, 
            sprite: firstP.sprites.front_default
          }, 
          {
            name: secondP.name, 
            sprite: secondP.sprites.front_default
          }
        ];
      });
      return pokemons;
    }
  });
// export type definition of API
export type AppRouter = typeof appRouter;
