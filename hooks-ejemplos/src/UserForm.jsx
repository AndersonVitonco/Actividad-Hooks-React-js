import React, { useState } from 'react';
import { useUser } from './UserContext';

const colores = ['#007bff', '#28a745', '#dc3545', '#ffc107', '#6f42c1'];

function UserForm() {
  const { user, cambiarNombre, cambiarColor } = useUser();
  const [inputValue, setInputValue] = useState(user.nombre);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      cambiarNombre(inputValue.trim());
    }
  };

  return (
    <div>
      <h3>Cambiar usuario:</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
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
            backgroundColor: user.color,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Guardar
        </button>
      </form>

      <h4>Elige un color:</h4>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {colores.map((color) => (
          <button
            key={color}
            onClick={() => cambiarColor(color)}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: color,
              border: color === user.color ? '3px solid #333' : '2px solid transparent',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default UserForm;
