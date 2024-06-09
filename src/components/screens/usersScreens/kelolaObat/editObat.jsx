import React, { useState, useEffect } from 'react';
import NotificationPopup from '../../utils/notificationPopUp';
import ConfirmationPopup from '../../utils/confirmationPopUp';
import "../../../../styles/dashboard/admin/addUser.css";
const EditObat = ({close, onEditSuccess, selectedMedicineId}) => {
  const [medicineName, setMedicineName] = useState('');
  const [brand, setBrand] = useState('');
  const [medicinePrice, setMedicinePrice] = useState('');
  const [medicineUnit, setMedicineUnit] = useState('');
  const [stock, setStock] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [ID, setID] = useState(selectedMedicineId.medicineID)
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const formatDate = (isoString) => {
    return isoString.split('T')[0];
  };

  useEffect(() => {
    fetch(`http://localhost:8080/medicine/get-medicine/${selectedMedicineId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setMedicineName(data.medicineName);
        setBrand(data.brand);
        setMedicinePrice(data.medicinePrice);
        setMedicineUnit(data.medicineUnit);
        setStock(data.stock);
        setExpirationDate(formatDate(data.expirationDate));
      })
      .catch(error => console.error('Error:', error));
  }, [selectedMedicineId]); // Dependensi useEffect adalah ID obat yang dipilih

  const handleSubmit = (event) => {
    console.log(selectedMedicineId)
    event.preventDefault();
    const medicineData = {
      medicineName: medicineName.toUpperCase(),
      brand: brand.toUpperCase(),
      medicinePrice: parseFloat(medicinePrice),
      medicineUnit: medicineUnit.toUpperCase(),
      stock: parseInt(stock),
      expirationDate
    };

    fetch(`http://localhost:8080/medicine/edit/${selectedMedicineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(medicineData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setPopupMessage('Perubahan obat berhasil disimpan!');
      setShowPopup(true);
      setTimeout(() => {
        close(); // Menutup modal setelah menampilkan popup
        onEditSuccess(); // Memanggil callback untuk memuat ulang data
      }, 1500); // Menunggu 1500 ms sebelum menutup modal
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleDelete = () => {
    fetch(`http://localhost:8080/medicine/delete/${selectedMedicineId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Delete success:', data);
      setPopupMessage('Obat berhasil dihapus!');
      setShowPopup(true);
      setTimeout(() => {
        close(); // Menutup modal setelah menampilkan popup
        onEditSuccess(); // Memanggil callback untuk memuat ulang data
      }, 1500);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleConfirmDelete = () => {
    handleDelete();
    setShowConfirmationPopup(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationPopup(false);
  };

  const handleCloseAddModal = () => {
    close()
  };

  return (
    <div className='overlay'>
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='form-header'>
            <h2>Edit Obat (ID: {selectedMedicineId})</h2>
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
              <button type='button' className='save-button' style={{ backgroundColor: '#ffe600', color: '#000'}} onClick={() => setShowConfirmationPopup(true)}>Delete</button>
              <button type='button' className='cancel-button' style={{ backgroundColor: '#E53935' }} onClick={handleCloseAddModal}>Batal</button>
            </div>
          </div>
        </form>
      </div>
      {showConfirmationPopup && <ConfirmationPopup message="Apakah Anda yakin ingin menghapus obat ini?" onCancel={handleCancelDelete} onConfirm={handleConfirmDelete} />}
      {showPopup && <NotificationPopup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default EditObat;
