import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/privateRoute';
import Login from './components/screens/login';
import ApotekerScreen from './components/screens/usersScreens/apotekerScreen';
import PustakawanScreen from './components/screens/usersScreens/kelolaObat/kelolaStokScreen';
import KepalaApotekerScreen from './components/screens/usersScreens/kepalaApotekScreen';
import AdminScreen from './components/screens/usersScreens/admin/adminScreen';
import ShowUsers from './components/screens/usersScreens/admin/showUsers';
import '@fontsource/poppins';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem('userDetails')) || { username: '', fullname: '' });

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      setRole(localStorage.getItem('role'));
      setUserDetails(JSON.parse(localStorage.getItem('userDetails')) || { username: '', fullname: '' });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserDetails({ username: '', fullname: '' });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} setRole={setRole} setUserDetails={setUserDetails} />} />
        <Route path="/apoteker" element={<PrivateRoute><ApotekerScreen setToken={setToken} setRole={setRole} userDetails={userDetails} /></PrivateRoute>} />
        <Route path="/gudang" element={<PrivateRoute><PustakawanScreen setToken={setToken} setRole={setRole} userDetails={userDetails} logout={logout} /></PrivateRoute>} />
        <Route path="/kepala-apoteker" element={<PrivateRoute><KepalaApotekerScreen setToken={setToken} setRole={setRole} /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminScreen setToken={setToken} setRole={setRole} userDetails={userDetails} logout={logout}/></PrivateRoute>} />
        <Route path="/show-users" element={<PrivateRoute><ShowUsers setToken={setToken} setRole={setRole} username={userDetails.username} logout={logout} /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;