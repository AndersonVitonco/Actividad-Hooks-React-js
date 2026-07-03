import React from 'react';
import { useUser } from './UserContext';

function UserDisplay() {
  const { user } = useUser();

  const cardStyle = {
    border: `2px solid ${user.color}`,
    borderRadius: '8px',
    padding: '15px',
    marginTop: '10px',
    textAlign: 'center',
  };

  return (
    <div style={cardStyle}>
      <h3>Usuario actual:</h3>
      <p style={{ color: user.color, fontSize: '24px', fontWeight: 'bold' }}>
        {user.nombre}
      </p>
      <p>Color favorito: <span style={{ color: user.color }}>{user.color}</span></p>
    </div>
  );
}

export default UserDisplay;
