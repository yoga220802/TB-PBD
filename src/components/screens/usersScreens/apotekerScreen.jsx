import React from 'react';
import { useNavigate } from 'react-router-dom';

function ApotekerScreen({setToken, setRole}) {

    const navigate = useNavigate()

    const handleLogout = () => {
        setToken(null)
        setRole(null)
        navigate('/')
    }

  return (
    <div>
      <h1>Dashboard Apoteker</h1>
      <p>Selamat datang di area Apoteker.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default ApotekerScreen;