import React from 'react';

interface Pokemon {
  name: string;
  description: string;
  image: string;
}

interface Props {
  pokemon: Pokemon;
  onAdd: () => void;
  onCancel: () => void;
}

const PokemonCard: React.FC<Props> = ({ pokemon, onAdd, onCancel }) => {
  return (
    <div className="card card-compact w-96 bg-white shadow-xl">
      <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
      <div className="p-5">
        <h2 className="text-black"><span className='font-semibold'>Pokemon name:</span> {pokemon.name}</h2>
        <div className="text-black"><span className='font-semibold'>Description:</span> {pokemon.description}</div>
      </div>
      <div className="flex justify-around mb-5">
        <button onClick={onAdd} className="btn btn-secondary">Add</button>
        <button onClick={onCancel} className="btn btn-outline btn-primary">Cancel</button>
      </div>
    </div>
  );
};

export default PokemonCard;
