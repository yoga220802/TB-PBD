import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "../../../../styles/dashboard/kelolaStock/kelolaStockDashboard.css";
import TransactionModal from "./addTransaction"; // Assuming this is your modal component
import TransactionDetailModal from "./detailModal";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const getCurrentDateGMT7 = () => {
  return dayjs().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
};

const formatRupiah = (amount) => {
  const numberAmount = Number(amount); // Convert amount to number
  return (
    "Rp. " +
    numberAmount
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, "$&,")
      .slice(0, -3)
  );
};


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};


function ApotekerScreen({ userDetails, logout }) {
  const navigate = useNavigate();
  const { username, fullname } = userDetails;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const [transactions, setTransactions] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchID, setSearchID] = useState("");
  const [searchOrderDate, setSearchOrderDate] = useState("");
  const [searchTotal, setSearchTotal] = useState("");
  const [searchPayment, setSearchPayment] = useState("");
  const [searchChange, setSearchChange] = useState("");
  const [searchBuyer, setSearchBuyer] = useState("");
  const [searchPharmacist, setSearchPharmacist] = useState("");
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);
  const [transactionID, setTransactionID] = useState(null);
  const [transactionDate, setTransactionDate] = useState(null);

  // Fetch transactions
  const fetchTransactions = () => {
    fetch("http://localhost:8080/transaction")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  };

  useEffect(() => {
    console.log("ApotekerScreen userDetails:", userDetails); // Debug: Log userDetails
  }, [userDetails]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogout = () => {
    logout();
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

  // Sorting
  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [transactions, sortConfig]);

  // Filtering
  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter(transaction =>
      String(transaction.transactionID).toLowerCase().includes(searchID.toLowerCase()) &&
      (searchOrderDate ? transaction.orderDateTime.startsWith(searchOrderDate) : true) &&
      (searchTotal ? Number(transaction.totalAmount) <= Number(searchTotal) : true) &&
      (searchPayment ? Number(transaction.payment) <= Number(searchPayment) : true) &&
      (searchChange ? Number(transaction.paymentChange) <= Number(searchChange) : true) &&
      transaction.buyerName.toLowerCase().includes(searchBuyer.toLowerCase()) &&
      transaction.userID.toLowerCase().includes(searchPharmacist.toLowerCase())
    );
  }, [sortedTransactions, searchID, searchOrderDate, searchTotal, searchPayment, searchChange, searchBuyer, searchPharmacist]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Opening and closing modals
  const handleOpenAddModal = () => setIsAddModalVisible(true);
  const handleCloseAddModal = () => setIsAddModalVisible(false);

  const handleOpenDetailModal = (transaction) => {
    console.log('Opening detail modal for transaction:', transaction.transactionID);
    fetch(`http://localhost:8080/transaction/${transaction.transactionID}`)
    .then(response => response.json())
    .then(data => {
        console.log('Detailed transaction data:', data);
        setSelectedTransaction(data);
        setIsDetailModalVisible(true);
      })
      .catch(error => {
        console.error('Failed to fetch transaction details:', error);
        setIsDetailModalVisible(false);
      });
  };

  const handleCloseDetailModal = () => setIsDetailModalVisible(false);

  const handleOpenTransactionModal = async () => {
    const orderDateTime = getCurrentDateGMT7();
    console.log("Sending orderDateTime:", orderDateTime); // Memastikan tanggal yang dikirim

    try {
      const response = await fetch('http://localhost:8080/transaction/generate-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tanggalTransaksi: orderDateTime }) // Pastikan key ini sesuai dengan yang di backend
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setTransactionID(data.transactionID);
        setTransactionDate(orderDateTime); // Pastikan ini sesuai dengan key yang dikirimkan oleh server
        setIsTransactionModalVisible(true);
      } else {
        throw new Error(data.message || 'Failed to generate transaction ID');
      }
      // Lanjutkan dengan logika sukses
    } catch (error) {
      console.error('Failed to start new transaction:', error);
    }
  };

  const handleCloseTransactionModal = async () => {
    if (transactionID) {
      try {
        const response = await fetch(`http://localhost:8080/transaction/delete/${transactionID}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Transaction deleted successfully:', data);
        } else {
          throw new Error(data.message || 'Failed to delete transaction');
        }
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
    setIsTransactionModalVisible(false); // Menutup modal setelah operasi delete
  };

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
      <div className='user-container'>
        <div className='user-header'>
          <div className='user-welcome'>
            Selamat Datang, {fullname}{" "}
            <span role='img' aria-label='wave'>
              👋
            </span>
          </div>
        </div>
        <div className='search-container'>
          <button
            onClick={() => {
              setSearchID("");
              setSearchOrderDate("");
              setSearchTotal("");
              setSearchPayment("");
              setSearchChange("");
              setSearchBuyer("");
              setSearchPharmacist("");
            }}>
            Clear Filters
          </button>
        </div>
        <div className='table-container'>
          <table className='medicine-table'>
            <thead>
              <tr>
                <th>
                  <span onClick={() => requestSort("transactionID")}>
                    Transaction ID
                  </span>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                    style={{ maxWidth: "100px" }}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("orderDateTime")}>
                    Order Date Time
                  </span>
                  <input
                    type='date'
                    placeholder='Search...'
                    value={searchOrderDate}
                    onChange={(e) => setSearchOrderDate(e.target.value)}
                    style={{ maxWidth: "150px" }}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("totalAmount")}>
                    Total
                  </span>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchTotal}
                    onChange={(e) => setSearchTotal(e.target.value)}
                    style={{ maxWidth: "100px" }}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("payment")}>
                    Bayar
                  </span>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchPayment}
                    onChange={(e) => setSearchPayment(e.target.value)}
                    style={{ maxWidth: "100px" }}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("paymentChange")}>
                    Kembalian
                  </span>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchChange}
                    onChange={(e) => setSearchChange(e.target.value)}
                    style={{ maxWidth: "100px" }}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("buyerName")}>
                    Nama Pembeli
                  </span>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchBuyer}
                    onChange={(e) => setSearchBuyer(e.target.value)}
                    style={{ maxWidth: "150px" }}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("userID")}>
                    Nama Apoteker
                  </span>
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchPharmacist}
                    onChange={(e) => setSearchPharmacist(e.target.value)}
                    style={{ maxWidth: "150px" }}
                  />
                </th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.transactionID}>
                    <td>{transaction.transactionID}</td>
                    <td>{formatDate(transaction.orderDateTime)}</td>
                    <td>{formatRupiah(transaction.totalAmount)}</td>
                    <td>{formatRupiah(transaction.payment)}</td>
                    <td>{formatRupiah(transaction.paymentChange)}</td>
                    <td>{transaction.buyerName}</td>
                    <td>{transaction.userID}</td>
                    <td>
                      <button className='edit-button' onClick={() => handleOpenDetailModal(transaction)}>
                        <Icon icon='ep:info-filled' className='icon' />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>Belum ada transaksi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className='add-button-container'>
          <button className='add-button' onClick={handleOpenTransactionModal}>
            <Icon icon='mdi:plus' className='icon' />
          </button>
        </div>
      </div>
      {isDetailModalVisible && (
        <TransactionDetailModal
        selectedTransaction={selectedTransaction}
          closeDetail={handleCloseDetailModal}
        />
      )}
      {isTransactionModalVisible && <TransactionModal close={handleCloseTransactionModal} transactionID={transactionID} tanggalTransaksi={transactionDate} apotekerName={fullname} />}
    </div>
  );
}

export default ApotekerScreen;
