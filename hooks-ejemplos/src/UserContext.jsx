import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

// Hook personalizado para usar el contexto facilmente
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe usarse dentro de UserProvider');
  }
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    nombre: 'Invitado',
    color: '#007bff',
  });

  const cambiarNombre = (nombre) => {
    setUser((prev) => ({ ...prev, nombre }));
  };

  const cambiarColor = (color) => {
    setUser((prev) => ({ ...prev, color }));
  };

  return (
    <UserContext.Provider value={{ user, cambiarNombre, cambiarColor }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
