import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../styles/login.css"; // Import file CSS untuk styling
import loginImage from "../../assets/images/login/loginImage.png";
import loginBG from "../../assets/images/login/loginBG.jpg";

// Function to perform login
async function loginUser(credentials) {
 const response = await fetch("http://localhost:8080/login", {
  method: "POST",
  headers: {
   "Content-Type": "application/json",
  },
  body: JSON.stringify(credentials),
 });

 if (!response.ok) {
  throw new Error("Network response was not ok");
 }

 return response.json();
}

function Login({ setToken, setRole }) {
 const [username, setUserName] = useState("");
 const [password, setPassword] = useState("");
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
   const response = await loginUser({
    username,
    password,
   });

   if (response.token) {
    setToken(response.token);
    setRole(response.role);
    handleLoginSuccess(response.role);
   } else {
    alert("Login failed!");
   }
  } catch (error) {
   alert("Login failed! Please check your credentials and try again.");
  }
 };

 const handleLoginSuccess = (roleId) => {
  switch (roleId) {
   case "APOTKR":
    navigate("/apoteker");
    break;
   case "PSTOK":
    navigate("/pustakawan");
    break;
   case "KAPOT":
    navigate("/kepala-apoteker");
    break;
   case "ADMIN":
    navigate("/admin");
    break;
   default:
    navigate("/"); // Default navigation jika roleId tidak dikenali
  }
 };

 return (
  <div
   className='login-container'
   style={{ backgroundImage: `url(${loginBG})` }}>
   <div className='login-form-container'>
    <div className='login-form'>
     <h1>USER LOGIN</h1>
     <form onSubmit={handleSubmit}>
      <label>
       <div className='input-container'>
        <Icon icon='ci:user-02' className='icon username' />
        <input
         type='text'
         value={username}
         onChange={(e) => setUserName(e.target.value)}
         placeholder='Username'
        />
       </div>
      </label>
      <label>
       <div className='input-container'>
        <Icon icon='carbon:password' className='icon password' />
        <input
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         placeholder="Password"
        />
       </div>
      </label>
      <div>
       <button type='submit'>LOGIN</button>
      </div>
     </form>
    </div>
    <div className='login-image'>
     <img src={loginImage} alt='Login'/>
    </div>
   </div>
  </div>
 );
}

export default Login;
