import React, { useEffect, useMemo, useReducer, useState, useCallback } from 'react';
import MovieSearch from './MovieSearch';
import { useTheme } from './ThemeContext';
import movieReducer, { SET_LOADING, SET_MOVIES } from './movieReducer';
import useLocalStorage from './useLocalStorage';

const initialState = {
  movies: [],
  loading: false,
};

const genreOptions = [
  '',
  'Acción',
  'Drama',
  'Fantasía',
  'Ciencia Ficción',
  'Comedia',
];

function App() {
  const [state, dispatch] = useReducer(movieReducer, initialState);
  const { tema, toggleTema, colores } = useTheme();
  const [favoritos, setFavoritos] = useLocalStorage('favoritos', []);
  const [genero, setGenero] = useState('');
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [termino, setTermino] = useState('');

  // Buscamos en OMDb cada vez que cambia el término escrito.
  useEffect(() => {
    if (termino.trim() === '') {
      dispatch({ type: SET_MOVIES, payload: [] });
      return;
    }

    const consultarPeliculas = async () => {
      dispatch({ type: SET_LOADING, payload: true });

      try {
        const respuesta = await fetch(
          `https://www.omdbapi.com/?apikey=833075c7&s=${encodeURIComponent(termino)}`
        );
        const datos = await respuesta.json();

        if (datos.Search) {
          const peliculasConGenero = await Promise.all(
            datos.Search.map(async (pelicula) => {
              const respuestaDetalle = await fetch(
                `https://www.omdbapi.com/?apikey=833075c7&i=${pelicula.imdbID}`
              );
              const detalle = await respuestaDetalle.json();

              return {
                id: pelicula.imdbID,
                titulo: pelicula.Title,
                anio: pelicula.Year,
                genero: detalle.Genre || 'Sin género',
              };
            })
          );

          dispatch({ type: SET_MOVIES, payload: peliculasConGenero });
        } else {
          dispatch({ type: SET_MOVIES, payload: [] });
        }
      } catch {
        dispatch({ type: SET_MOVIES, payload: [] });
      }
    };

    consultarPeliculas();
  }, [termino]);

  // Recibimos el texto que escribe el usuario desde MovieSearch.
  const handleSearch = useCallback((nuevoTermino) => {
    setTermino(nuevoTermino);
  }, []);

  // Guardamos y quitamos favoritos con una lista de IDs.
  const handleToggleFavorite = useCallback(
    (id) => {
      setFavoritos((prev) =>
        prev.includes(id)
          ? prev.filter((favoriteId) => favoriteId !== id)
          : [...prev, id]
      );
    },
    [setFavoritos]
  );

  const peliculasFiltradas = useMemo(() => {
    if (!genero) {
      return state.movies;
    }

    return state.movies.filter((movie) => movie.genero === genero);
  }, [genero, state.movies]);

  const soloFavoritos = useMemo(() => {
    return peliculasFiltradas.filter((movie) => favoritos.includes(movie.id));
  }, [favoritos, peliculasFiltradas]);

  const peliculasAMostrar = verFavoritos ? soloFavoritos : peliculasFiltradas;

  const favoritesCount = favoritos.length;

  const appStyle = {
    backgroundColor: colores.fondo,
    color: colores.texto,
    minHeight: '100vh',
    padding: '24px',
    fontFamily: 'Trebuchet MS, Verdana, sans-serif',
    backgroundImage: `linear-gradient(135deg, ${colores.fondo} 0%, ${colores.fondoSecundario} 100%)`,
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  };

  const botonTemaStyle = {
    backgroundColor: colores.boton,
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  const panelStyle = {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '18px',
  };

  const selectStyle = {
    minWidth: '220px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${colores.inputBorde}`,
    backgroundColor: colores.inputFondo,
    color: colores.texto,
  };

  const toggleFavoritosStyle = {
    ...botonTemaStyle,
    backgroundColor: verFavoritos ? colores.botonFavorito : colores.boton,
  };

  return (
    <div style={appStyle}>
      <div style={headerStyle}>
        <div>
          <h1>🎬 Buscador de Películas</h1>
          <p style={{ margin: 0, opacity: 0.85 }}>
            Buscá por título, filtrá por género y guardá tus favoritas.
          </p>
        </div>
        <button style={botonTemaStyle} onClick={toggleTema}>
          {tema === 'claro' ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
      </div>
      <div style={panelStyle}>
        <label>
          <span style={{ display: 'block', marginBottom: '6px' }}>Género</span>
          <select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            style={selectStyle}
          >
            {genreOptions.map((option) => (
              <option key={option || 'todos'} value={option}>
                {option || 'Todos'}
              </option>
            ))}
          </select>
        </label>
        <button
          style={toggleFavoritosStyle}
          onClick={() => setVerFavoritos((prev) => !prev)}
        >
          {verFavoritos ? 'Mostrar todos' : 'Mostrar solo favoritos'}
        </button>
        <p style={{ margin: 0 }}>
          Favoritos: {favoritesCount}{' '}
          {state.movies.length > 0 ? `(de ${state.movies.length} resultados)` : ''}
        </p>
      </div>
      <MovieSearch
        movies={peliculasAMostrar}
        loading={state.loading}
        onSearch={handleSearch}
        onToggleFavorite={handleToggleFavorite}
        favoritos={favoritos}
      />
    </div>
  );
}

export default App;
