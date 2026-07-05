// Componente principal de la aplicacion
import React, { useReducer, useCallback, useMemo, useState } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { movieReducer } from './movieReducer';
import MovieSearch from './MovieSearch';
import useLocalStorage from './useLocalStorage';

// Lista de peliculas falsas por si no hay API key
const peliculasFake = [
  { id: 1, titulo: 'El Padrino', año: 1972, genero: 'Drama' },
  { id: 2, titulo: 'El Señor de los Anillos', año: 2001, genero: 'Fantasía' },
  { id: 3, titulo: 'Pulp Fiction', año: 1994, genero: 'Crimen' },
  { id: 4, titulo: 'Forrest Gump', año: 1994, genero: 'Comedia' },
  { id: 5, titulo: 'Inception', año: 2010, genero: 'Ciencia Ficción' },
  { id: 6, titulo: 'The Matrix', año: 1999, genero: 'Acción' },
  { id: 7, titulo: 'Titanic', año: 1997, genero: 'Romance' },
  { id: 8, titulo: 'Avatar', año: 2009, genero: 'Ciencia Ficción' },
];

// Opciones para el filtro de genero
const generos = ['', 'Drama', 'Fantasía', 'Crimen', 'Comedia', 'Ciencia Ficción', 'Acción', 'Romance'];

function AppContent() {
  const { tema, toggleTema } = useTheme();
  const [state, dispatch] = useReducer(movieReducer, {
    movies: [],
    loading: false,
  });

  // Hook personalizado para guardar favoritos en localStorage
  const [favoritos, setFavoritos] = useLocalStorage('favoritos', []);

  // useCallback para la busqueda (memoizada)
  const buscarPeliculas = useCallback((termino) => {
    if (!termino.trim()) {
      dispatch({ type: 'SET_MOVIES', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING' });

    // ==========================================
    // Para usar la API de OMDB necesitas una API key
    // Registrate en https://www.omdbapi.com/ y obtene tu key
    // Reemplaza 'tu_api_key' con tu key personal
    // ==========================================
    const apiKey = 'tu_api_key'; // <-- PONE TU API KEY ACA

    if (apiKey && apiKey !== 'tu_api_key') {
      // Llamada real a la API de OMDB
      fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(termino)}`)
        .then(res => res.json())
        .then(data => {
          if (data.Search) {
            const resultados = data.Search.map(peli => ({
              id: peli.imdbID,
              titulo: peli.Title,
              año: peli.Year,
              genero: peli.Type,
            }));
            dispatch({ type: 'SET_MOVIES', payload: resultados });
          } else {
            dispatch({ type: 'SET_MOVIES', payload: [] });
          }
        })
        .catch(() => {
          dispatch({ type: 'SET_MOVIES', payload: [] });
        });
    } else {
      // Buscar en la lista fake (para cuando no hay API key)
      setTimeout(() => {
        const resultados = peliculasFake.filter(p =>
          p.titulo.toLowerCase().includes(termino.toLowerCase())
        );
        dispatch({ type: 'SET_MOVIES', payload: resultados });
      }, 500);
    }
  }, []);

  // useCallback para marcar/desmarcar favoritos
  const toggleFavorito = useCallback((id) => {
    setFavoritos(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  }, [setFavoritos]);

  // useMemo para contar favoritos
  const totalFavoritos = useMemo(() => favoritos.length, [favoritos]);

  // ---- Actividad 1: Filtro por genero ----
  const [generoSeleccionado, setGeneroSeleccionado] = useState('');

  // useMemo para filtrar peliculas por genero
  const peliculasFiltradas = useMemo(() => {
    if (!generoSeleccionado) return state.movies;
    return state.movies.filter(p => p.genero === generoSeleccionado);
  }, [generoSeleccionado, state.movies]);

  // ---- Actividad 4: Mostrar solo favoritos ----
  const [verFavoritos, setVerFavoritos] = useState(false);

  // useMemo para filtrar solo las favoritas
  const soloFavoritas = useMemo(() => {
    return peliculasFiltradas.filter(p => favoritos.includes(p.id));
  }, [peliculasFiltradas, favoritos]);

  // Lista final a mostrar (todas filtradas o solo favoritas)
  const listaFinal = verFavoritos ? soloFavoritas : peliculasFiltradas;

  // Estilos segun el tema
  const fondo = tema === 'oscuro' ? '#222' : '#fff';
  const colorTexto = tema === 'oscuro' ? '#eee' : '#111';
  const fondoSelect = tema === 'oscuro' ? '#444' : '#fff';
  const bordeSelect = tema === 'oscuro' ? '#666' : '#ccc';

  return (
    <div style={{
      background: fondo,
      color: colorTexto,
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      {/* Header con boton de tema */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🎬 Buscador de Películas</h1>
        <button onClick={toggleTema} style={{
          padding: '8px 16px',
          cursor: 'pointer',
          borderRadius: '5px',
          border: '1px solid #999',
          background: tema === 'oscuro' ? '#444' : '#eee',
          color: colorTexto,
        }}>
          {tema === 'claro' ? '🌙 Oscuro' : '☀️ Claro'}
        </button>
      </div>

      {/* Contador de favoritos */}
      <p>Favoritos: {totalFavoritos}</p>

      {/* Filtros: genero y ver favoritos */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Actividad 1: Select para filtrar por genero */}
        <select
          value={generoSeleccionado}
          onChange={(e) => setGeneroSeleccionado(e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '5px',
            border: `1px solid ${bordeSelect}`,
            background: fondoSelect,
            color: colorTexto,
          }}
        >
          {generos.map(g => (
            <option key={g || 'todos'} value={g}>
              {g || 'Todos los géneros'}
            </option>
          ))}
        </select>

        {/* Actividad 4: Boton para ver solo favoritos */}
        <button
          onClick={() => setVerFavoritos(prev => !prev)}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: '1px solid #999',
            background: verFavoritos ? '#ffc107' : (tema === 'oscuro' ? '#444' : '#eee'),
            color: verFavoritos ? '#000' : colorTexto,
          }}
        >
          {verFavoritos ? 'Mostrar todas' : 'Solo favoritos'}
        </button>
      </div>

      {/* Componente de busqueda */}
      <MovieSearch
        onSearch={buscarPeliculas}
        movies={listaFinal}
        loading={state.loading}
        favorites={favoritos}
        onToggleFavorite={toggleFavorito}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
