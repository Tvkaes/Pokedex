import client from '../apollo-client';
import { GET_POKEMONS } from '../querys/pokemon';


export interface Pokemon {
    id: number;
    name: string;
    stats: { name: string; base_stat: number }[];
    flavorText: string;
    types: { name: string }[];
    weight: number;
    height: number;
    image:string;
    shiny:string;
}

interface RawPokemon {
    id: number;
    name: string;
    pokemon_v2_pokemonstats: { base_stat: number; pokemon_v2_stat: { name: string } }[];
    pokemon_v2_pokemonspecy: {
      pokemon_v2_pokemonspeciesflavortexts: { flavor_text: string }[];
    };
    pokemon_v2_pokemontypes: { pokemon_v2_type: { name: string } }[];
    weight: number;
    height: number;
  }

const cacheKey = 'pokemons'

const getPokemons = async(): Promise<Pokemon[]> => {


    //comprobar si ya tenemos los datos almacenados en localstorage
    const cacheData = localStorage.getItem(cacheKey);
    

    if(cacheData){
       return JSON.parse(cacheData);
      
    }

    //si tenemos los datos en localStorage hacer la consulta 
    const {data} = await client.query({
        query:GET_POKEMONS,
        fetchPolicy:'cache-first'
    })

    

    const newArray: Pokemon[] = data.pokemon_v2_pokemon.map((pokemon: RawPokemon) => {
        const { id, name, pokemon_v2_pokemonstats, pokemon_v2_pokemonspecy, pokemon_v2_pokemontypes, weight, height } = pokemon;
      
        return {
          id,
          name,
          stats: pokemon_v2_pokemonstats.map((stat) => ({ name: stat.pokemon_v2_stat.name, base_stat: stat.base_stat })),
          flavorText: pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesflavortexts[0].flavor_text,
          types: pokemon_v2_pokemontypes.map((type) => ({ name: type.pokemon_v2_type.name })),
          weight,
          height,
          image:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
          shiny:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
        };
      });
      
    //almacenar los datos en localstorage para la proxima vez
    localStorage.setItem(cacheKey,JSON.stringify(newArray));
    
    return newArray;
}


export default getPokemons

