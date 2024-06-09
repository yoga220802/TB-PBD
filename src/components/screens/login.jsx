import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { z } from "zod";
import { loginUser } from "../../api/authAPI";

import "../../styles/login.css";
import loginImage from "../../assets/images/login/loginImage.png";
import loginBG from "../../assets/images/login/loginBG.jpg";

const loginSchema = z.object({
  username: z.string().nonempty("Username is required"),
  password: z.string().nonempty("Password is required"),
});

const Login = ({ setToken, setRole, setUserDetails }) => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      handleLoginSuccess(role);
    }
  }, [navigate]);

  const handleLoginSuccess = (role) => {
    switch (role) {
      case "APOTKR":
        navigate("/apoteker");
        break;
      case "PSTOK":
        navigate("/gudang");
        break;
      case "KAPOT":
        navigate("/kepala-apoteker");
        break;
      case "ADMIN":
        navigate("/admin");
        break;
      default:
        navigate("/"); // Default route jika role tidak dikenali
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      loginSchema.parse({ username, password });
    } catch (err) {
      setErrors(
        err.errors.reduce((acc, current) => {
          acc[current.path[0]] = current.message;
          return acc;
        }, {})
      );
      return;
    }

    try {
      const response = await loginUser({ username, password });
      console.log("Server response:", response);

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('userDetails', JSON.stringify({ username: response.username, fullname: response.fullname }));

        setToken(response.token);
        setRole(response.role);
        setUserDetails({
          username: response.username,
          fullname: response.fullname,
        });
        handleLoginSuccess(response.role);
      } else {
        setErrors({ general: "Login failed!" });
      }
    } catch (error) {
      setErrors({ general: "Login gagal, pastikan username dan password valid." });
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
            {errors.username && (
              <span className='error-message'>{errors.username}</span>
            )}

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
            {errors.password && (
              <span className='error-message'>{errors.password}</span>
            )}

            <div className='wrapper-button'>
              <button type='submit'>LOGIN</button>
            </div>
            {errors.general && <div className='error-message'>{errors.general}</div>}
          </form>
        </div>
        <div className='login-image'>
          <img src={loginImage} alt='Login' />
        </div>
      </div>
    </div>
  );
};

export default Login;
