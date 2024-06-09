import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react";
import AddUser from './addUser'
import '../../../../styles/dashboard/dashboard.css';
import NotificationPopup from '../../utils/notificationPopUp'; // Import komponen NotificationPopup

function AdminScreen({ userDetails, logout }) {
  const navigate = useNavigate();
  const { username, fullname } = userDetails;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const dropdownRef = useRef(null);


  const handleLogout = () => {
logout()
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleAddUser = () => {
    setShowAddUser(true);
  };

  const handleSaveUser = (userData) => {
    console.log('User data disimpan:', userData);
    setShowAddUser(false);
    setNotificationMessage('User berhasil ditambahkan!');
    setShowNotification(true);
  };

  const handleCancel = () => {
    setShowAddUser(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div>
      <div className="topbar">
        <div className="topbar-left">
          <span className="apotek-sehat">APOTEK SEHAT</span>
        </div>
        <div className="user-dropdown-container" ref={dropdownRef}>
          <button className="user-button" onClick={toggleDropdown}>
            <span className="user-fullname">{username}</span> <Icon icon='gridicons:dropdown' className='icon' />
          </button>
          {dropdownVisible && (
            <div className="user-dropdown">
              <button onClick={handleLogout} className="logout-button">
                <Icon icon='el:off' className='icon' /> <span className="logout-text">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="user-container">
        <div className="user-header">
          <div className="user-welcome">
            Selamat Datang, {fullname} <span role="img" aria-label="wave">👋</span>
          </div>
        </div>
        <div className="user-buttons">
          <button className="btn show-users" onClick={() => navigate('/show-users')}>Show Users</button>
          <button className="btn add-user" onClick={handleAddUser}>Add User</button>
        </div>
      </div>
      {showAddUser && <AddUser onSave={handleSaveUser} onCancel={handleCancel} />}
      {showNotification && (
        <NotificationPopup 
          message={notificationMessage} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </div>
  );
}

export default AdminScreen;
