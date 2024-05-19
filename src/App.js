import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/screens/login';
import LoginSuccess from './test/logintest';
import ApotekerScreen from './components/screens/usersScreens/apotekerScreen';
import PustakawanScreen from './components/screens/usersScreens/kelolaStokScreen';
import KepalaApotekerScreen from './components/screens/usersScreens/kepalaApotekScreen';
import AdminScreen from './components/screens/usersScreens/adminScreen';
import '@fontsource/poppins';


function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  console.log(token)
  console.log(role)
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<Login setToken={setToken} setRole={setRole} />} 
        />
        {/* <Route path="/login-success" element={<LoginSuccess setToken={setToken} setRole={setRole} />} /> */}
        <Route path="/apoteker" element={<ApotekerScreen setToken={setToken} setRole={setRole}/>} />
        <Route path="/pustakawan" element={<PustakawanScreen setToken={setToken} setRole={setRole}/>} />
        <Route path="/kepala-apoteker" element={<KepalaApotekerScreen setToken={setToken} setRole={setRole}/>} />
        <Route path="/admin" element={<AdminScreen setToken={setToken} setRole={setRole}/> } />
      </Routes>
    </Router>
  );
}

export default App;
