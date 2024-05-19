import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminScreen({ setToken, setRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <p>Selamat datang Admin.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default AdminScreen;