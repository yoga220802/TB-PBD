import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { z } from "zod";

import "../../styles/login.css";
import loginImage from "../../assets/images/login/loginImage.png";
import loginBG from "../../assets/images/login/loginBG.jpg";

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

const loginSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

const Login = ({ setToken, setRole }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      loginSchema.parse({ username, password });
    } catch (err) {
      setErrors(err.errors.reduce((acc, current) => {
        acc[current.path[0]] = current.message;
        return acc;
      }, {}));
      return;
    }

    try {
      const response = await loginUser({ username, password });

      if (response.token) {
        setToken(response.token);
        setRole(response.role);
        handleLoginSuccess(response.role);
      } else {
        setErrors({ general: "Login failed!" });
      }
    } catch (error) {
      setErrors({ general: "Login gagal, pastikan username dan password valid." });
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
        navigate("/"); 
    }
  };

  return (
    <div className='login-container' style={{ backgroundImage: `url(${loginBG})` }}>
      <div className='login-form-container'>
        <div className='login-form'>
          <h1>USER LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className='input-container'>
              <Icon icon='ci:user-02' className='icon username' />
              <input
                type='text'
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder=' '
                id='username'
              />
              <label htmlFor='username'>Username</label>
            </div>
            {errors.username && <span className="error-message">{errors.username}</span>}
            
            <div className='input-container'>
              <Icon icon='carbon:password' className='icon password' />
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=' '
                id='password'
              />
              <label htmlFor='password'>Password</label>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
            
            <div>
              <button type='submit'>LOGIN</button>
            </div>
            {errors.general && <div className="error-message">{errors.general}</div>}
          </form>
        </div>
        <div className='login-image'>
          <img src={loginImage} alt='Login' />
        </div>
      </div>
    </div>
  );
}

export default Login;
