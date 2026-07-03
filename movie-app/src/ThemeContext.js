import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [tema, setTema] = useState('claro');

  useEffect(() => {
    // aquí cargamos el tema guardado al iniciar
    const temaGuardado = localStorage.getItem('tema');

    if (temaGuardado) {
      setTema(temaGuardado);
    }
  }, []);

  useEffect(() => {
    // aquí guardamos el tema en localStorage
    localStorage.setItem('tema', tema);
  }, [tema]);

  const toggleTema = () => {
    setTema((prev) => (prev === 'claro' ? 'oscuro' : 'claro'));
  };

  const estilos = {
    claro: {
      fondo: '#f3f1ea',
      fondoSecundario: '#e7dfcf',
      texto: '#201a17',
      card: 'rgba(255, 255, 255, 0.9)',
      cardBorder: 'rgba(32, 26, 23, 0.12)',
      inputFondo: '#fffaf3',
      inputBorde: 'rgba(32, 26, 23, 0.2)',
      boton: '#5b3a29',
      botonFavorito: '#c26a2d',
      chip: '#efe5d8',
    },
    oscuro: {
      fondo: '#121418',
      fondoSecundario: '#1b1f26',
      texto: '#f5f1ea',
      card: 'rgba(25, 29, 36, 0.92)',
      cardBorder: 'rgba(255, 255, 255, 0.08)',
      inputFondo: '#181d24',
      inputBorde: 'rgba(255, 255, 255, 0.14)',
      boton: '#8f6a41',
      botonFavorito: '#d89b4f',
      chip: '#2b313c',
    },
  };

  const theme = {
    tema,
    toggleTema,
    colores: estilos[tema],
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
