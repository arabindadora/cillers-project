import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_POKEMONS, ADD_POKEMON, REMOVE_POKEMON, POKEMON_ADDED_SUBSCRIPTION} from '../graphql/operations';
import { getAccessToken, signOut } from '../services/authService';
import PokemonCard from '../components/PokemonCard';
import {Pokemon} from '../components/PokemonCard';

interface GetPokemonQuery {
  pokemons: Pokemon[];
}

const HomePage: React.FC = () => {
  const [newPokemon, setNewPokemon] = useState('');
  const [pushToKafka, setPushToKafka] = useState(false);
  const { data, loading, error, subscribeToMore } = useQuery(GET_POKEMONS);
  const [addPokemon] = useMutation(ADD_POKEMON);
  const [removePokemon] = useMutation(REMOVE_POKEMON);

  useEffect(() => {
    subscribeToMore({
      document: POKEMON_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newPokemon = subscriptionData.data.pokemonAdded;

        if (prev.pokemons.some((pokemon: Pokemon) => pokemon.id === newPokemon.id)) {
          return prev;
        }
        return Object.assign({}, prev, {
          pokemons: [...prev.pokemons, newPokemon]
        });
      },
    });
  }, [subscribeToMore]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-base-300">
      <button className="btn">
        <span className="loading loading-spinner"></span>
        Loading...
      </button>
    </div>
  );
  if (error) return <p>{'Error: ' + error}</p>;

  const handleAddPokemon = async () => {
    if (!newPokemon.trim()) return;
    if (pushToKafka) {
      const token = await getAccessToken();
      const response = await fetch('/input/add_pokemon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ name: newPokemon }),
      });
      if (response.ok) {
        setNewPokemon('');
      } else {
        const errorText = await response.text();
        console.error('Failed to add pokemon:', errorText);
      }
    } else {
      await addPokemon({ variables: { name: newPokemon } });
      setNewPokemon('');
    }
  };

  const handleRemovePokemon = async (id: string) => {
    await removePokemon({
      variables: { id },
      update(cache) {
        const existingProducts = cache.readQuery<GetPokemonQuery>({ query: GET_POKEMONS });
        if (existingProducts?.pokemons) {
          cache.writeQuery({
            query: GET_POKEMONS,
            data: {
              pokemons: existingProducts.pokemons.filter(pokemon => pokemon.id !== id),
            },
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <a href="/" className="p-2 normal-case text-xl">Home</a>
        </div>
        <div className="flex-none">
          <button className="btn" onClick={signOut}>
          Sign out
          </button>
        </div>
      </div>

      <div className="flex flex-grow justify-center items-center bg-neutral">
        <div className="card card-compact w-full max-w-lg bg-base-100 shadow-xl">
          <div className="card-body items-stretch text-center">
            <h1 className="card-title self-center text-2xl font-bold mb-4">Search for pokemon</h1>
            <div className="form-control w-full">
              <div className="join">
                <input
                  type="text"
                  placeholder="Add new pokemon..."
                  className="join-item flex-grow input input-bordered input-md input-primary"
                  value={newPokemon}
                  onChange={(e) => setNewPokemon(e.target.value)}
                />
                <button className="join-item btn btn-square btn-md btn-primary" onClick={handleAddPokemon}>
                  Add
                </button>
              </div>
            </div>
            <div className="form-control w-full flex flex-row justify-center items-center">
              <label className="join-item label">Submit directly</label>
              <input type="checkbox" className="toggle mx-2" checked={pushToKafka} onChange={() => setPushToKafka(!pushToKafka)} />
              <label className="join-item label">Submit via Kafka</label>
            </div>
            <div className="space-y-2 w-full">
              {data && Array.isArray(data.pokemons) && data.pokemons.map((pokemon: Pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
