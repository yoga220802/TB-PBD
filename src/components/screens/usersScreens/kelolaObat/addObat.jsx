import React, { useState } from 'react';
import NotificationPopup from '../../utils/notificationPopUp';
import "../../../../styles/dashboard/admin/addUser.css";
const AddObat = ({close, onAddSuccess}) => {
  const [medicineName, setMedicineName] = useState('');
  const [brand, setBrand] = useState('');
  const [medicinePrice, setMedicinePrice] = useState('');
  const [medicineUnit, setMedicineUnit] = useState('');
  const [stock, setStock] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const medicineData = {
      medicineName: medicineName.toUpperCase(),
      brand: brand.toUpperCase(),
      medicinePrice,
      medicineUnit: medicineUnit.toUpperCase(),
      stock,
      expirationDate
    };

    fetch('http://localhost:8080/medicine/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(medicineData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setPopupMessage('Obat berhasil ditambahkan!');
      setShowPopup(true);
      setTimeout(() => {
        close(); // Menutup modal setelah menampilkan popup
        onAddSuccess(); // Memanggil callback untuk memuat ulang data
      }, 1500); // Menunggu 1500 ms sebelum menutup modal
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleCloseAddModal = () => {
    close()
  };

  return (
    <div className='overlay'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-header'>
            <h2>Tambah Obat Baru</h2>
          </div>
          <div className='form-body'>
            <input
              type='text'
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder='Nama Obat'
            />
            <input
              type='text'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder='Merek'
            />
            <input
              type='number'
              value={medicinePrice}
              onChange={(e) => setMedicinePrice(e.target.value)}
              placeholder='Harga'
            />
            <input
              type='text'
              value={medicineUnit}
              onChange={(e) => setMedicineUnit(e.target.value)}
              placeholder='Satuan Unit'
            />
            <input
              type='number'
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder='Stok'
            />
            <input
              type='date'
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              placeholder='Tanggal Kadaluarsa'
            />
            <div className='button-container'>
              <button type='submit' className='save-button'>Simpan</button>
              <button type='button' className='cancel-button' style={{ backgroundColor: '#E53935' }} onClick={handleCloseAddModal}>Batal</button>
            </div>
          </div>
        </form>
      </div>
      {showPopup && <NotificationPopup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default AddObat;
