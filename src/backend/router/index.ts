import * as trpc from '@trpc/server';
import { z } from 'zod';

// import { getOptionsForVote } from '@/utils/getRandomPokemon';
import { PokemonClient } from 'pokenode-ts';


export const appRouter = trpc.router().query("get-pokemon-by-id", {
  input: z.number(),
  async resolve(data) {
    if(!data.input){
      console.log('First Render...');
      return {
        pokeName: '',
        pokeSprite: '',
      };
    }

    console.log('get-pokemon-id with IDs %d', data.input);
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


// const apppRouter = trpc.router().query("get-pokemon-by-id", {
//     input: z.array(z.number(), z.number()),
//     async resolve(numbers) {
//       if(!numbers.input[0] || !numbers.input[1]){
//         console.log('First Render...');
//         return undefined;
//       }

//       console.log('get-pokemon-id with IDs %d %d', numbers.input[0], numbers.input[1]);
//       const api = new PokemonClient();

//       const firstPromise = api.getPokemonById(numbers.input[0]);
//       const secondPromise = api.getPokemonById(numbers.input[1]);

//       const pokemons = await Promise.all([firstPromise, secondPromise]).then((values)=>{
//         const [firstP, secondP] = values;
//         let [firstSprite, secondSprite] = [
//           firstP.sprites.front_default? firstP.sprites.front_default: '', 
//           secondP.sprites.front_default? secondP.sprites.front_default : '',
//         ];

//         console.log('Found %s and %s', firstP.name, secondP.name);

//         return [
//           {
//             name: firstP.name, 
//             sprite: firstSprite,
//           }, 
//           {
//             name: secondP.name, 
//             sprite: secondSprite,
//           }
//         ];
//       });

//       return pokemons;
//     }
//   });
// // export type definition of API
export type AppRouter = typeof appRouter;
