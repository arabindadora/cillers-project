import { gql } from "@apollo/client";

export const GET_POKEMONS = gql`
  query GetPokemons {
    pokemons {
      name
      id
      description
      image
    }
  }
`;

export const ADD_POKEMON = gql`
  mutation AddPokemon($name: String!, $description: String!, $image: String!) {
    addPokemon(name: $name, description: $description, image: $image) {
      name
      description
      image
    }
  }
`;

export const REMOVE_POKEMON = gql`
  mutation RemovePokemon($id: String!) {
    removePokemon(id: $id)
  }
`;

export const POKEMON_ADDED_SUBSCRIPTION = gql`
  subscription OnPokemonAdded {
    pokemonAdded {
      name
      id
      description
      image
    }
  }
`;
