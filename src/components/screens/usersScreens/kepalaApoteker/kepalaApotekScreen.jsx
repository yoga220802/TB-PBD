import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from "@iconify/react";
import '../../../../styles/dashboard/dashboard.css';
import { generateMedicineStockReport, generateTransactionReport } from '../../../report/kepalaApotek';

function KepalaApotekerScreen({ userDetails, logout }) {
  const navigate = useNavigate();
  const { username, fullname } = userDetails || { username: '', fullname: '' };
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [transactions, setTransactions] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  
  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:8080/transaction/");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  
  const generateLaporanGudang = async () => {
    try {
      const response = await fetch("http://localhost:8080/medicine/get-medicines");
      const medicines = await response.json();
      generateMedicineStockReport(medicines);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const generateLaporanPenjualan = () => {
    generateTransactionReport(transactions);
  };
  useEffect(() => {
    fetchTransactions();
  }, []);

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
            Selamat Datang, {fullname} <span role="img" aria-label="wave"> 👋 </span>
          </div>
        </div>
        <div className="user-buttons">
          <button className="btn show-users" onClick={generateLaporanGudang}>Laporan Gudang</button>
          <button className="btn add-user" onClick={generateLaporanPenjualan}>Laporan Penjualan</button>
        </div>
      </div>
    </div>
  );
}

export default KepalaApotekerScreen;
