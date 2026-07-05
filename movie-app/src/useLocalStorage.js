// Hook personalizado para guardar datos en localStorage
import { useState, useEffect } from 'react';

function useLocalStorage(key, valorInicial) {
  // Cargar valor guardado o usar el inicial
  const [valor, setValor] = useState(() => {
    const guardado = localStorage.getItem(key);
    return guardado ? JSON.parse(guardado) : valorInicial;
  });

  // Guardar cada vez que el valor cambie
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(valor));
  }, [key, valor]);

  return [valor, setValor];
}

export default useLocalStorage;
