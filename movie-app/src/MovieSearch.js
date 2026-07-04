import React, { useState, useRef, useEffect } from 'react';
import MovieCard from './MovieCard';
import { useTheme } from './ThemeContext';

const MovieSearch = ({ movies, loading, onSearch, onToggleFavorite, favoritos }) => {
  const [busqueda, setBusqueda] = useState('');
  const [genero, setGenero] = useState('');
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

  // Filtramos por género desde este componente para que la práctica quede simple.
  const peliculasFiltradas = genero
    ? movies.filter((movie) => movie.genero.includes(genero))
    : movies;

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
      <select
        value={genero}
        onChange={(e) => setGenero(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '12px',
          borderRadius: '6px',
          border: `1px solid ${colores.inputBorde}`,
          backgroundColor: colores.inputFondo,
          color: colores.texto,
        }}
      >
        <option value="">Todos</option>
        <option value="Action">Acción</option>
        <option value="Drama">Drama</option>
        <option value="Fantasy">Fantasía</option>
        <option value="Sci-Fi">Ciencia Ficción</option>
      </select>
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
      {peliculasFiltradas.map((movie) => (
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
