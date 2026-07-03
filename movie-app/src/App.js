import React, { useReducer, useEffect, useCallback, useMemo, useState } from 'react';
import MovieSearch from './MovieSearch';
import { useTheme } from './ThemeContext';
import movieReducer, { SET_MOVIES } from './movieReducer';
import useLocalStorage from './useLocalStorage';

const moviesFake = [
  { id: 1, titulo: 'El Padrino', anio: 1972, genero: 'Crimen' },
  { id: 2, titulo: 'Interestelar', anio: 2014, genero: 'Ciencia Ficción' },
  { id: 3, titulo: 'Toy Story', anio: 1995, genero: 'Comedia' },
  { id: 4, titulo: 'Volver al Futuro', anio: 1985, genero: 'Ciencia Ficción' },
  { id: 5, titulo: 'Pulp Fiction', anio: 1994, genero: 'Crimen' },
  { id: 6, titulo: 'El Señor de los Anillos', anio: 2001, genero: 'Fantasía' },
  { id: 7, titulo: 'Matrix', anio: 1999, genero: 'Acción' },
  { id: 8, titulo: 'Forrest Gump', anio: 1994, genero: 'Drama' },
];

const initialState = {
  movies: [],
  loading: false,
};

const genreOptions = [
  '',
  'Drama',
  'Fantasía',
  'Crimen',
  'Comedia',
  'Ciencia Ficción',
  'Acción',
  'Animación',
  'Romance',
];

function App() {
  const [state, dispatch] = useReducer(movieReducer, initialState);
  const { tema, toggleTema, colores } = useTheme();
  const [favoritos, setFavoritos] = useLocalStorage('favoritos', []);
  const [genero, setGenero] = useState('');
  const [verFavoritos, setVerFavoritos] = useState(false);
  const [termino, setTermino] = useState('');

  useEffect(() => {
    const buscarPeliculas = async () => {
      const texto = termino.trim();

      if (texto === '') {
        dispatch({ type: SET_MOVIES, payload: [] });
        return;
      }

      dispatch({ type: 'SET_LOADING', payload: true });

      // aquí va tu API key de OMDB
      const apiKey = process.env.REACT_APP_OMDB_API_KEY;

      if (!apiKey) {
        // si todavía no hay key, usamos datos simples para que la app siga funcionando
        const resultadosLocales = moviesFake.filter((movie) =>
          movie.titulo.toLowerCase().includes(texto.toLowerCase())
        );

        setTimeout(() => {
          dispatch({ type: SET_MOVIES, payload: resultadosLocales });
        }, 400);

        return;
      }

      try {
        const respuesta = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(texto)}`
        );
        const datos = await respuesta.json();

        if (!datos.Search) {
          dispatch({ type: SET_MOVIES, payload: [] });
          return;
        }

        const resultados = await Promise.all(
          datos.Search.map(async (item) => {
            const detalleResponse = await fetch(
              `https://www.omdbapi.com/?apikey=${apiKey}&i=${item.imdbID}`
            );
            const detalle = await detalleResponse.json();

            return {
              id: item.imdbID,
              titulo: item.Title,
              anio: item.Year,
              genero: detalle.Genre || item.Type,
            };
          })
        );

        dispatch({ type: SET_MOVIES, payload: resultados });
      } catch {
        dispatch({ type: SET_MOVIES, payload: [] });
      }
    };

    buscarPeliculas();
  }, [termino]);

  const handleSearch = useCallback((texto) => {
    setTermino(texto);
  }, []);

  const handleToggleFavorite = useCallback(
    (id) => {
      // aquí marcamos o desmarcamos una película como favorita
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

    // aquí filtramos por género
    return state.movies.filter((movie) => movie.genero === genero);
  }, [genero, state.movies]);

  const soloFavoritos = useMemo(() => {
    // aquí nos quedamos solo con las favoritas
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
          {verFavoritos ? 'Ver todos' : 'Ver solo favoritos'}
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
