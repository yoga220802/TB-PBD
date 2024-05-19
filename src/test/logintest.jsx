import React from 'react';
import { useNavigate } from 'react-router-dom'; // Tambahkan ini

function LoginSuccess({ setToken, setRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    navigate('/'); // Navigasi kembali ke halaman login
  };

  return (
    <div className="login-success">
      <h1>Login Berhasil!</h1>
      <p>Selamat datang di aplikasi kami.</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default LoginSuccess;
// export default LoginSuccess;