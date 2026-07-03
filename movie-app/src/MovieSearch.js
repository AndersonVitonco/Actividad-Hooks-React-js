import React, { useState, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';
import { useTheme } from './ThemeContext';

const MovieSearch = ({ movies, loading, onSearch, onToggleFavorite, favoritos }) => {
  const [busqueda, setBusqueda] = useState('');
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const { colores } = useTheme();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(valor);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: `1px solid ${colores.inputBorde}`,
    borderRadius: '6px',
    backgroundColor: colores.inputFondo,
    color: colores.texto,
    boxSizing: 'border-box',
    marginBottom: '20px',
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar película..."
        value={busqueda}
        onChange={handleChange}
        style={inputStyle}
      />
      {loading && <p style={{ color: colores.texto }}>Cargando...</p>}
      {!loading && movies.length === 0 && busqueda !== '' && (
        <p style={{ color: colores.texto }}>No se encontraron películas.</p>
      )}
      {!loading && movies.length === 0 && busqueda === '' && (
        <p style={{ color: colores.texto }}>Escribe algo para buscar películas.</p>
      )}
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favoritos.includes(movie.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

export default MovieSearch;
