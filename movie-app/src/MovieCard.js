import React from 'react';
import { useTheme } from './ThemeContext';

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const { colores } = useTheme();

  const cardStyle = {
    backgroundColor: colores.card,
    border: `1px solid ${colores.cardBorder}`,
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    color: colores.texto,
  };

  const botonStyle = {
    backgroundColor: isFavorite ? colores.botonFavorito : colores.chip,
    color: isFavorite ? '#fff' : colores.texto,
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  return (
    <div style={cardStyle}>
      <h3>{movie.titulo}</h3>
      <p>
        <strong>Año:</strong> {movie.anio} | <strong>Género:</strong>{' '}
        {movie.genero}
      </p>
      <button style={botonStyle} onClick={() => onToggleFavorite(movie.id)}>
        {isFavorite ? '★ Favorito' : '☆ Marcar favorito'}
      </button>
    </div>
  );
};

export default MovieCard;
