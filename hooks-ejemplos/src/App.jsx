import React, { useState, useEffect } from 'react';
import { UserProvider } from './UserContext';
import UserDisplay from './UserDisplay';
import UserForm from './UserForm';

function App() {
  // ---------- CONTADOR CON USESTATE ----------
  const [contador, setContador] = useState(0);

  // ---------- USEEFFECT: mensaje cuando cambia el contador ----------
  useEffect(() => {
    console.log('El contador cambió a:', contador);
  }, [contador]);

  // ---------- FORMULARIO CON USESTATE ----------
  const [nombre, setNombre] = useState('');
  const [nombreMostrado, setNombreMostrado] = useState('');

  const manejarSubmit = (e) => {
    e.preventDefault();
    setNombreMostrado(nombre);
    setNombre('');
  };

  // ---------- ESTILOS ----------
  const appStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  };

  const seccionStyle = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '20px',
  };

  return (
    <div style={appStyle}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>
        Ejemplos de Hooks en React
      </h1>

      {/* ---------- CONTADOR ---------- */}
      <div style={seccionStyle}>
        <h2>useState + useEffect</h2>
        <p>
          <strong>Contador:</strong> {contador}
        </p>
        <button
          onClick={() => setContador(contador + 1)}
          style={{ marginRight: '10px', padding: '8px 15px', cursor: 'pointer' }}
        >
          + Aumentar
        </button>
        <button
          onClick={() => setContador(contador - 1)}
          style={{ padding: '8px 15px', cursor: 'pointer' }}
        >
          - Disminuir
        </button>
        <p style={{ fontSize: '12px', color: '#888' }}>
          (Abrí la consola para ver el mensaje de useEffect)
        </p>
      </div>

      {/* ---------- FORMULARIO BASICO ---------- */}
      <div style={seccionStyle}>
        <h2>useState + Formulario</h2>
        <form onSubmit={manejarSubmit}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribe tu nombre"
            style={{
              padding: '8px',
              fontSize: '14px',
              marginRight: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '8px 15px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Mostrar
          </button>
        </form>
        {nombreMostrado && (
          <p>
            <strong>Nombre ingresado:</strong> {nombreMostrado}
          </p>
        )}
      </div>

      {/* ---------- CONTEXTO CON USECONTEXT ---------- */}
      <div style={seccionStyle}>
        <h2>useContext</h2>
        <UserProvider>
          <UserForm />
          <UserDisplay />
        </UserProvider>
      </div>
    </div>
  );
}

export default App;
