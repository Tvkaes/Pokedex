import {gql} from "@apollo/client"

export const GET_POKEMONS = gql`
query GetPokemon {
  pokemon_v2_pokemon(where: {id: {_lte: 151}}) {
    id
    name
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
  }
}

`;

// Gets all the pokemon belonging to generation 3
export const GET_ALL_POKEMONS = gql`
query  {
  gen1_species: pokemon_v2_pokemonspecies(where: {pokemon_v2_generation: {name: {_eq: "generation-i"}}}, order_by: {id: asc}) {
    name
    id
  }
  }`

export const GET_POKEMON_BY_ID = gql`
query($id:Int) {
  pokemon_v2_pokemon(where: {id: {_eq: $id}}) {
    id
    name
    pokemon_v2_pokemonstats {
      base_stat
      pokemon_v2_stat {
        name
      }
    }
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
  }
  pokemon_v2_pokemonspeciesflavortext(where: {id: {_eq: $id}}) {
    flavor_text
  }
}
`;

