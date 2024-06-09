import React, { useState } from "react";
import Select from "react-select";
import "../../../../styles/dashboard/admin/addUser.css";

const AddUser = ({ onSave, onCancel }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState({ value: "APOTKR", label: "Apoteker" });

  const handleSave = () => {
    const userData = { 
      username, 
      password, 
      fullname, 
      phone, 
      position: position.value 
    };
    fetch("http://localhost:8080/user/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}` // Pastikan token diambil dari localStorage dan dikirim
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User created successfully") {
          onSave(userData);
        } else {
          console.error("Error:", data.error || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const positionOptions = [
    { value: "APOTKR", label: "Apoteker" },
    { value: "PSTOK", label: "Pengelola Stok" },
    { value: "KAPOT", label: "Kepala Apotek" },
    { value: "ADMIN", label: "Admin" }
  ];

  return (
    <div className='overlay'>
      <div className='form-container'>
        <div className='form-header'>
          <h2>Add User</h2>
        </div>
        <div className='form-body'>
          <div className='addUsr-input-container'>
            <input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=' '
              id='username'
            />
            <label htmlFor='username'>Username</label>
          </div>

          <div className='addUsr-input-container'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=' '
              id='password'
            />
            <label htmlFor='password'>Password</label>
          </div>

          <div className='addUsr-input-container'>
            <input
              type='text'
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder=' '
              id='fullname'
            />
            <label htmlFor='fullname'>Fullname</label>
          </div>

          <div className='addUsr-input-container'>
            <input
              type='text'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=' '
              id='phone'
            />
            <label htmlFor='phone'>Phone</label>
          </div>

          <div className='addUsr-input-container'>
            <Select
              value={position}
              onChange={setPosition}
              options={positionOptions}
              className="react-select-container"
              classNamePrefix="react-select"
              id='position'
            />
            <label htmlFor='position'>Position</label>
          </div>

          <div className='button-container'>
            <button onClick={handleSave} className='save-button'>
              Save
            </button>
            <button onClick={onCancel} className='cancel-button'>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
