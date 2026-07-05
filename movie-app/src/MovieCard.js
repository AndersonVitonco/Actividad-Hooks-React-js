// Tarjeta individual de cada pelicula
import React from 'react';
import { useTheme } from './ThemeContext';

function MovieCard({ pelicula, isFavorite, onToggle }) {
  const { tema } = useTheme();
  const cardStyle = {
    background: tema === 'oscuro' ? '#333' : 'white',
    color: tema === 'oscuro' ? '#eee' : '#111',
    borderRadius: '10px',
    padding: '12px',
    boxShadow: tema === 'oscuro'
      ? '0 2px 8px rgba(0,0,0,0.3)'
      : '0 2px 8px rgba(0,0,0,0.06)',
  };

  return (
    <div style={cardStyle}>
      <h5>{pelicula.titulo}</h5>
      <p style={{ fontSize: '0.85rem', color: tema === 'oscuro' ? '#aaa' : '#555' }}>
        {pelicula.año} · {pelicula.genero}
      </p>
      <button
        onClick={() => onToggle(pelicula.id)}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer',
        }}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
}

export default MovieCard;
