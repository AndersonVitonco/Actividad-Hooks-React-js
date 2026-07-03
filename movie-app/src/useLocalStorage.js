import { useEffect, useState } from 'react';

function readStoredValue(key, initialValue) {
  if (typeof window === 'undefined') {
    return initialValue;
  }

  try {
    const savedValue = window.localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : initialValue;
  } catch {
    return initialValue;
  }
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStoredValue(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignoramos errores de almacenamiento para no romper la UI.
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;