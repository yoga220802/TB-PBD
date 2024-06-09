import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../../../../styles/dashboard/admin/addUser.css";

const EditUser = ({
 onSave,
 onCancel,
 userID,
 setShowNotification,
 setNotificationMessage,
 onEditSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState({ value: "APOTKR", label: "Apoteker" });

  const positionOptions = [
    { value: "APOTKR", label: "Apoteker" },
    { value: "PSTOK", label: "Pengelola Stok" },
    { value: "KAPOT", label: "Kepala Apotek" },
    { value: "ADMIN", label: "Admin" }
  ];

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/users/${userID}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token')}` // Pastikan token diambil dari localStorage dan dikirim
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUsername(data.usrname);
      setPassword(data.usrpass);
      setFullname(data.fullName);
      setPhone(data.phoneNum);
      setPosition(positionOptions.find(option => option.value === data.roleId));
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userID]);

  const handleSave = () => {
    const userData = {
      username,
      password,
      fullname,
      phone,
      position: position.value,
    };
    fetch(`http://localhost:8080/user/editUser/${userID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "User updated successfully") {
          onSave(userData);
          setShowNotification(true);
          setNotificationMessage("User berhasil diedit!");
          onEditSuccess(); // Memanggil fungsi ini setelah berhasil menyimpan
        } else {
          console.error("Error:", data.error || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


 return (
  <div className='overlay'>
   <div className='form-container'>
    <div className='form-header'>
     <h2>Edit User (ID: {userID})</h2>
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
       className='react-select-container'
       classNamePrefix='react-select'
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

export default EditUser;
