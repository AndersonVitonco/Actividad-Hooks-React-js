// Componente de busqueda con debounce
import React, { useState, useRef, useEffect, useCallback } from 'react';
import MovieCard from './MovieCard';
import { useTheme } from './ThemeContext';

function MovieSearch({ onSearch, movies, loading, favorites, onToggleFavorite }) {
  const [termino, setTermino] = useState('');
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const { tema } = useTheme();

  // Enfocar el input al cargar el componente
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Debounce: espera 300ms antes de buscar
  const handleSearch = useCallback((value) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  }, [onSearch]);

  const onChange = (e) => {
    const val = e.target.value;
    setTermino(val);
    handleSearch(val);
  };

  const fondoInput = tema === 'oscuro' ? '#444' : '#fff';
  const colorTexto = tema === 'oscuro' ? '#eee' : '#111';
  const colorBorde = tema === 'oscuro' ? '#666' : '#ccc';

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        value={termino}
        onChange={onChange}
        placeholder="Buscar película..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '6px',
          border: `1px solid ${colorBorde}`,
          background: fondoInput,
          color: colorTexto,
          boxSizing: 'border-box',
          marginBottom: '15px',
        }}
      />

      {loading && <p style={{ color: colorTexto }}>Cargando...</p>}

      {/* Mostrar mensaje si no hay resultados */}
      {!loading && termino && movies.length === 0 && (
        <p style={{ color: colorTexto }}>No se encontraron películas.</p>
      )}

      {/* Grilla de películas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '12px',
      }}>
        {movies.map(pelicula => (
          <MovieCard
            key={pelicula.id}
            pelicula={pelicula}
            isFavorite={favorites.includes(pelicula.id)}
            onToggle={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieSearch;
