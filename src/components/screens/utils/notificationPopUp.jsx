import React from 'react';
import '../../../styles/notificationPopup.css';

const NotificationPopup = ({ message, onClose }) => {
  return (
    <div className="popUp-overlay">
      <div className="popup">
        <p>{message}</p>
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default NotificationPopup;
