import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from "@iconify/react";
import { useNavigate } from 'react-router-dom';
import "../../../../styles/dashboard/transaksi/transaksi.css";
import TransactionDetail from './detailTransaction'; // Import komponen detailTransaction

const formatRupiah = (amount) => {
  const numberAmount = Number(amount);
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

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + (item.medicinePrice * item.quantity), 0);
};

function TransactionModal({ close , transactionID, tanggalTransaksi, apotekerName}) {
  const [items, setItems] = useState([]); // Added this line to define items state
  const [searchID, setSearchID] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchBrand, setSearchBrand] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchStock, setSearchStock] = useState("");
  const [searchUnit, setSearchUnit] = useState("");
  const [searchExpiration, setSearchExpiration] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [showConfirmation, setShowConfirmation] = useState(false); // State untuk mengontrol overlay konfirmasi
  const [transactionData, setTransactionData] = useState(null); // State untuk menyimpan data transaksi
  const [showTransactionDetail, setShowTransactionDetail] = useState(false); // State untuk mengontrol visibilitas overlay detail transaksi
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMedicines = () => {
    fetch("http://localhost:8080/medicine/get-medicines")
      .then((response) => response.json())
      .then((data) => {
        setMedicines(data);
      })
      .catch((error) => console.error("Error fetching medicines:", error));
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const sortedAndFilteredMedicines = useMemo(() => {
    let filteredItems = medicines.filter(medicine => {
      return (
        medicine.medicineID.toString().includes(searchID) &&
        medicine.medicineName.toLowerCase().includes(searchName.toLowerCase()) &&
        medicine.brand.toLowerCase().includes(searchBrand.toLowerCase()) &&
        medicine.medicinePrice.toString().includes(searchPrice) &&
        medicine.stock.toString().includes(searchStock) &&
        medicine.medicineUnit.toLowerCase().includes(searchUnit.toLowerCase()) &&
        formatDate(medicine.expirationDate).includes(searchExpiration)
      );
    });
  
    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredItems.slice(0, 3); // Hanya mengambil 3 data pertama setelah filter
  }, [medicines, sortConfig, searchID, searchName, searchBrand, searchPrice, searchStock, searchUnit, searchExpiration]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const addItem = (medicine) => {
    if (medicine.stock <= 0) {
      setErrorMessage('Stok obat ini habis.');
      return;
    }

    const existingItemIndex = items.findIndex(item => item.medicineID === medicine.medicineID);

    if (existingItemIndex !== -1) {
      const newItems = [...items];
      const newQuantity = newItems[existingItemIndex].quantity + 1;
      if (newQuantity > medicine.stock) {
        setErrorMessage('Tidak dapat menambahkan lebih banyak obat ini karena melebihi stok yang tersedia.');
        return;
      }
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newQuantity
      };
      setItems(newItems);
    } else {
      setItems([...items, { ...medicine, quantity: 1 }]);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    const item = newItems[index];
    if (field === 'quantity') {
      if (value < 1) {
        setErrorMessage('Jumlah tidak boleh kurang dari 1.');
        return;
      }
      if (value > item.stock) {
        setErrorMessage('Kuantitas melebihi stok yang tersedia.');
        return;
      }
    }
    newItems[index] = { ...item, [field]: value };
    setItems(newItems);
  };

  const removeItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleCreateTransaction = () => {
    if (items.length === 0) {
      setErrorMessage('Tidak ada obat yang ditambahkan. Tambahkan minimal satu obat untuk melanjutkan.');
      return; // Hentikan eksekusi fungsi jika tidak ada item
    }

    // Jika ada item, lanjutkan dengan membuat data transaksi
    const transactionData = {
      items: items,
      totalHarga: calculateTotalPrice(items),
      id: transactionID,
      tanggalTransaksi: tanggalTransaksi,
      apotekerName: apotekerName
    };

    console.log(transactionData);

    setTransactionData(transactionData); // simpan data transaksi
    setShowConfirmation(false); // sembunyikan konfirmasi sebelumnya jika ada
    setShowTransactionDetail(true); // tampilkan overlay detail transaksi
  };

  const totalHarga = items.reduce((total, item) => {
    return total + (item.medicinePrice * item.quantity);
  }, 0);

  return (
    <div className="overlay">
      <div className="transaction-modal">
        <h2>Transaction ID: {transactionID}</h2>

        <div className="search-section">
          <h3>Cari obat</h3>
          <div className="table-scrollable">
          <table className="medicine-table">
            <thead>
              <tr>
                <th>
                  <span onClick={() => requestSort("medicineID")}>Medicine ID</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchID}
                    onChange={(e) => setSearchID(e.target.value)}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("medicineName")}>Medicine Name</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("brand")}>Brand</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                  />
                </th>
                <th>
                <span onClick={() => requestSort("medicinePrice")}>Harga</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchPrice}
                    onChange={(e) => setSearchPrice(e.target.value)}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("stock")}>Stok</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchStock}
                    onChange={(e) => setSearchStock(e.target.value)}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("medicineUnit")}>Satuan</span>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchUnit}
                    onChange={(e) => setSearchUnit(e.target.value)}
                  />
                </th>
                <th>
                  <span onClick={() => requestSort("expirationDate")}>
                    Expiration Date
                  </span>
                  <input
                    type="date"
                    placeholder="Search..."
                    value={searchExpiration}
                    onChange={(e) => setSearchExpiration(e.target.value)}
                  />
                </th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {sortedAndFilteredMedicines.length > 0 ? (
                sortedAndFilteredMedicines.map((medicine) => (
                  <tr key={medicine.medicineID}>
                    <td>{medicine.medicineID}</td>
                    <td>{medicine.medicineName}</td>
                    <td>{medicine.brand}</td>
                    <td>{formatRupiah(medicine.medicinePrice)}</td>
                    <td>{medicine.stock}</td>
                    <td>{medicine.medicineUnit}</td>
                    <td>{formatDate(medicine.expirationDate)}</td>
                    <td>
                      <button
                        className="add-button"
                        onClick={() => addItem(medicine)}>
                        <Icon icon="gg:add" className="icon" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Belum ada Obat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>

        <div className="purchase-section">
          <h3>Daftar Beli</h3>
          <table className="purchase-table">
            <thead>
              <tr>
                <th>Id Obat</th>
                <th>Nama Obat</th>
                <th>Harga Satuan</th>
                <th>Jumlah Beli</th>
                <th>Total Harga</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.medicineID}</td>
                  <td>{item.medicineName}</td>
                  <td>{formatRupiah(item.medicinePrice)}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value, 10))}
                      className="quantity-input"
                      min="1"
                    />
                  </td>
                  <td>{formatRupiah(item.medicinePrice * item.quantity)}</td>
                  <td>
                    <button onClick={() => removeItem(index)} className="delete-button">
                      <Icon icon="lucide:delete" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
          <span>Total: {formatRupiah(totalHarga)}</span>
          </div>
          <button className="complete-button" onClick={handleCreateTransaction}>
            Selesaikan Transaksi
          </button>
        </div>
        {errorMessage && <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{errorMessage}</div>}
        <button className="close-button" onClick={close}>
          Tutup
        </button>
      </div>

      {showTransactionDetail && transactionData && (
        <TransactionDetail
        transactionData={transactionData}
        closeDetail={() => setShowTransactionDetail(false)}
        />
      )}
    </div>
  );
}

export default TransactionModal;
