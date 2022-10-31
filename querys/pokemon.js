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
    weight
    height
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
    weight
    height
  }
  pokemon_v2_pokemonspeciesflavortext(where: {language_id: {_eq: 9}, pokemon_species_id: {_eq: $id}, pokemon_v2_version: {name: {_eq: "red"}}}) {
    flavor_text
    language_id
    id
    
  }
}
`;

export const GET_DESCRIPTION = gql `
query($id:Int){
  pokemon_v2_pokemonspeciesflavortext_by_pk(id: $id) {
    language_id
    flavor_text
  }
}
`;

