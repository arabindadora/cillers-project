import React from 'react';

export interface Pokemon {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface Props {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<Props> = ({ pokemon}) => {
  return (
    <div className="card card-compact w-96 bg-white shadow-xl">
      <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
      <div className="p-5">
        <h2 className="text-black"><span className='font-semibold'>Pokemon name:</span> {pokemon.name}</h2>
        <div className="text-black"><span className='font-semibold'>Description:</span> {pokemon.description}</div>
      </div>
    </div>
  );
};

export default PokemonCard;
