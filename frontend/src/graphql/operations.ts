import { gql } from '@apollo/client';

export const GET_POKEMONS = gql`
  query GetPokemons {
    products { name, id, description, image}
  }
`;

export const ADD_POKEMON = gql`
  mutation AddPokemon($name: String!) {
    addPokemon(name: $name) { name, id }
  }
`;

export const REMOVE_POKEMON = gql`
  mutation RemovePokemon($id: String!) {
    removePokemon(id: $id)
  }
`;

export const POKEMON_ADDED_SUBSCRIPTION = gql`
  subscription OnPokemonAdded {
    pokemonAdded { name, id }
  }
`;
