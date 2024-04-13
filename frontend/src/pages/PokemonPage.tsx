import React, {useEffect, useState} from 'react';
import PokemonCard from '../components/PokemonCard';
import {getUser, signOut} from '../services/authService';

const PokemonPage: React.FC = () => {
  const [user, setUser] = useState<any>(null); //state to store user data

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser();
      setUser(userData);
    };
      fetchUserData();
    }, []);

  // Fake Pokemon data
  const pokemon = {
    name: "Pikachu",
    description: "Pikachu is an Electric-type Pokémon and is the evolved form of Pichu.",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
  };

  // Handler for adding a Pokemon
  const handleAddPokemon = () => {
    console.log("Pokemon added!");
  };

  // Handler for cancelling
  const handleCancel = () => {
    console.log("Action cancelled!");
  };

  return (
    <div className="">
      <div className="navbar bg-base-300 text-neutral-content">
        <div className="flex-1">
          <a href="/" className="p-2 normal-case text-xl">My Pokemon</a>
        </div>
        <div className="flex-none">
          <button className="btn" onClick={signOut}>
          Sign out
          </button>
        </div>
      </div>
      <h2 className='flex justify-center' style={{marginTop: '120px'}}>Below is your pokemon:</h2>
      <div className='flex justify-center mt-5'>
      </div>
    </div>
  );
};

export default PokemonPage;
