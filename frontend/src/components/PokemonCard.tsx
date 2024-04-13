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
    <div className="pokemon-card">
      <img src={pokemon.image} alt={pokemon.name} className="pokemon-image" />
      <div className="pokemon-info">
        <h2 className="pokemon-name">{pokemon.name}</h2>
        <p className="pokemon-description">{pokemon.description}</p>
      </div>
      <div className="pokemon-actions">
        <button onClick={onAdd} className="btn btn-primary">Add</button>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

export default PokemonCard;
