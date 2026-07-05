// Contexto para manejar el tema (claro/oscuro)
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Cargar el tema guardado o usar 'claro' por defecto
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'claro';
  });

  // Guardar el tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('tema', tema);
  }, [tema]);

  const toggleTema = useCallback(() => {
    setTema(prev => prev === 'claro' ? 'oscuro' : 'claro');
  }, []);

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
