import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import EditUser from "./editUser";
import { fetchUsers, deleteUser } from "../../../../api/api";
import "../../../../styles/dashboard/dashboard.css";
import NotificationPopup from "../../utils/notificationPopUp";
import ConfirmationPopup from "../../utils/confirmationPopUp";

const ShowUsers = ({ setToken, setRole, username, logout }) => {
 const [users, setUsers] = useState([]);
 const [editUserId, setEditUserId] = useState(null);
 const [dropdownVisible, setDropdownVisible] = useState(false);
 const [showNotification, setShowNotification] = useState(false);
 const [notificationMessage, setNotificationMessage] = useState("");
 const [showConfirmDelete, setShowConfirmDelete] = useState(false);
 const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
 const [userIdToDelete, setUserIdToDelete] = useState(null);
 const navigate = useNavigate();
 const dropdownRef = useRef(null);

 useEffect(() => {
  const loadUsers = async () => {
   try {
    const data = await fetchUsers();
    setUsers(
     data.sort(
      (a, b) => parseInt(a.userId.slice(3)) - parseInt(b.userId.slice(3))
     )
    );
   } catch (error) {
    console.error("Error fetching users:", error);
   }
  };
  loadUsers();
 }, []);

 const handleEdit = (userId) => {
  setEditUserId(userId);
 };

 const handleDelete = async (userId) => {
  // Tampilkan popup konfirmasi sebelum menghapus
  setUserIdToDelete(userId);
  setShowConfirmDelete(true);
 };

 const handleConfirmDelete = async () => {
  try {
   await deleteUser(userIdToDelete);
   setUsers(users.filter((user) => user.userId !== userIdToDelete));
   setShowConfirmDelete(false);
   setShowDeleteSuccess(true);
  } catch (error) {
   console.error("Error deleting user:", error);
  }
 };

 const handleCancelDelete = () => {
  // Tutup popup konfirmasi jika pengguna membatalkan penghapusan
  setShowConfirmDelete(false);
 };

 const handleSave = (updatedUser) => {
  setUsers(
   users.map((user) =>
    user.userId === updatedUser.userId ? updatedUser : user
   )
  );
  setEditUserId(null);
  setNotificationMessage("User berhasil diedit!");
 };

 const handleCancel = () => {
  setEditUserId(null);
 };

 const handleEditSuccess = () => {
    fetchUsers().then((data) => {
      setUsers(data.sort(
        (a, b) => parseInt(a.userId.slice(3)) - parseInt(b.userId.slice(3))
      ));
    });
  };

 const handleLogout = () => {
  logout()
  navigate("/");
 };

 const toggleDropdown = () => {
  setDropdownVisible(!dropdownVisible);
 };

 useEffect(() => {
  const handleClickOutside = (event) => {
   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setDropdownVisible(false);
   }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
   document.removeEventListener("mousedown", handleClickOutside);
  };
 }, [dropdownRef]);

 return (
  <div>
   <div className='topbar'>
    <div className='topbar-left'>
     <span className='apotek-sehat'>APOTEK SEHAT</span>
    </div>
    <div className='user-dropdown-container' ref={dropdownRef}>
     <button className='user-button' onClick={toggleDropdown}>
      <span className='user-fullname'>{username}</span>{" "}
      <Icon icon='gridicons:dropdown' className='icon' />
     </button>
     {dropdownVisible && (
      <div className='user-dropdown'>
       <button onClick={handleLogout} className='logout-button'>
        <Icon icon='el:off' className='icon' />{" "}
        <span className='logout-text'>Logout</span>
       </button>
      </div>
     )}
    </div>
   </div>
   <div className='user-list-container'>
    <h3>
     <span
      onClick={() => navigate("/admin")}
      style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
      Dashboard
     </span>
     /showUser
    </h3>
    <h2>Users Data</h2>
    <div className='user-list'>
     {users.map((user) => (
      <div key={user.userId} className='user-card'>
       <div className='user-details'>
        <div className='user-avatar'>
         <Icon icon='carbon:user-avatar-filled-alt' className='avatar-icon' />
        </div>
        <div className='user-info'>
         <p>ID: {user.userId}</p>
         <p>Username: {user.usrname}</p>
         <p>Password: {user.usrpass}</p>
         <p>Fullname: {user.fullName}</p>
         <p>Position: {user.roleName}</p>
         <p>Phone: {user.phoneNum}</p>
        </div>
       </div>
       <div className='user-actions'>
        <button className='btn edit' onClick={() => handleEdit(user.userId)}>
         Edit
        </button>
        <button
         className='btn delete'
         onClick={() => handleDelete(user.userId)}>
         Delete
        </button>
       </div>
      </div>
     ))}
    </div>
    {editUserId && (
  <EditUser
    userID={editUserId}
    onSave={handleSave}
    onCancel={handleCancel}
    onEditSuccess={handleEditSuccess} // Teruskan fungsi ini sebagai prop
    setShowNotification={setShowNotification}
    setNotificationMessage={setNotificationMessage}
  />
)}
    {showNotification && (
     <NotificationPopup
      message={notificationMessage}
      onClose={() => setShowNotification(false)}
     />
    )}

    {showConfirmDelete && (
     <ConfirmationPopup
      message='Apakah Anda yakin ingin menghapus pengguna ini?'
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDelete}
     />
    )}
    {showDeleteSuccess && (
     <NotificationPopup
      message='Pengguna berhasil dihapus!'
      onClose={() => setShowDeleteSuccess(false)}
     />
    )}
   </div>
  </div>
 );
};

export default ShowUsers;
