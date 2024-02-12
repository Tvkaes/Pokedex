import { gql } from "@apollo/client";


export const GET_POKEMONS = gql`
query GetPokemon {
    pokemon_v2_pokemon(where: {id: {_lte: 386}}) {
        id
        name
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
          }
        }
        pokemon_v2_pokemonspecy {
          pokemon_v2_pokemonspeciesflavortexts(limit: 1,where: {pokemon_v2_version: {name: {_eq: "emerald"}}}) {
            flavor_text
          }
        }
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
        weight
        height
      }   
}
`

export const GET_POKEMON_BY_NAME = gql`
query GetPokemon($name:String) {
  pokemon_v2_pokemon(where: {name: {_like: $name}}, limit: 1) {
    id
    name
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
    pokemon_v2_pokemonspecy {
      pokemon_v2_pokemonspeciesflavortexts(limit: 1,where: {pokemon_v2_version: {name: {_eq: "red"}}}) {
        flavor_text
      }
    }
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
    height
    weight
  }
  
} `;