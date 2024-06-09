import React from 'react';
import '../../../styles/notificationPopup.css';

const ConfirmationPopup = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="popUp-overlay">
        <div className="popup">
            
      <p>{message}</p>
      <button onClick={onCancel} className="close-button" style={{ backgroundColor: '#E53935', marginRight: '10px' }}>Cancel</button>
      <button onClick={onConfirm} className="close-button" >Confirm</button>
        </div>
    </div>
  );
};

export default ConfirmationPopup;
