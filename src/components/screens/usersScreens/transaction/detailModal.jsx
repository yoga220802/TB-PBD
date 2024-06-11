import React from "react";
import "../../../../styles/dashboard/transaksi/transaksi.css"; // Tambahkan style yang relevan
import generateReceipt from "../../../report/generateReceipt";

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
  if (!dateString) return ''; // Tambahkan pengecekan ini untuk menghindari error jika dateString tidak valid
  const date = new Date(dateString);
  if (isNaN(date)) return ''; // Tambahkan pengecekan ini untuk menghindari error jika date tidak valid
  return date.toISOString().split('T')[0];
};

const TransactionDetailModal = ({ selectedTransaction, closeDetail }) => {
  // Jika selectedTransaction adalah array, gunakan elemen pertama
  const transaction = Array.isArray(selectedTransaction) ? selectedTransaction[0] : selectedTransaction;

  console.log("transaction", transaction);

  const closeTransaction = () => {
    // Generate dan download struk
    const transactionData = {
      id: transaction.transactionID,
      totalHarga: formatRupiah(transaction.totalHarga),
      tanggalTransaksi: formatDate(transaction.tanggalTransaksi),
      apoteker: transaction.namaApoteker,
      items: transaction.items.map(item => ({
        medicineName: item.namaObat,
        quantity: item.jumlahBeli,
        medicinePrice: formatRupiah(item.hargaSatuan),
      }))
    };

    generateReceipt(
      transactionData,
      transaction.namaPembeli,
      formatRupiah(transaction.uangYangDibayar),
      formatRupiah(transaction.kembalian)
    );

    // Lanjutkan dengan logika untuk menyimpan transaksi
    closeDetail();
  };

  return (
    <div className='overlay'>
      <div className='transaction-detail-container'>
        <h2>Transaction ID: {transaction.transactionID}</h2>
        <div className='transaction-info'>
          <div className='transaction-info-row'>
            <label>Total</label>
            <input
              type='text'
              value={formatRupiah(transaction.totalHarga)}
              readOnly
            />
          </div>
          <div className='transaction-info-row'>
            <label>Tanggal Transaksi</label>
            <input type='date' value={formatDate(transaction.tanggalTransaksi)} readOnly />
          </div>
          <div className='transaction-info-row'>
            <label>Bayar</label>
            <div className='input-with-error'>
              <input type='text' value={formatRupiah(transaction.uangYangDibayar)} readOnly />
            </div>
          </div>
          <div className='transaction-info-row'>
            <label>Kembalian</label>
            <input
              type='text'
              value={formatRupiah(transaction.kembalian)}
              readOnly
            />
          </div>
          <div className='transaction-info-row'>
            <label>Nama Pembeli</label>
            <input type='text' value={transaction.namaPembeli} readOnly />
          </div>
          <div className='transaction-info-row'>
            <label>Apoteker</label>
            <input type='text' value={transaction.namaApoteker} readOnly />
          </div>
        </div>

        <h3>Daftar Beli</h3>
        <table className='transaction-detail-table'>
          <thead>
            <tr>
              <th>Id Obat</th>
              <th>Nama Obat</th>
              <th>Harga Satuan</th>
              <th>Jumlah Beli</th>
              <th>Total Harga</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items && transaction.items.map((item, index) => (
              <tr key={index}>
                <td>{item.medicineID}</td>
                <td>{item.namaObat}</td>
                <td>{formatRupiah(item.hargaSatuan)}</td>
                <td>{item.jumlahBeli}</td>
                <td>{formatRupiah(item.totalHargaItem)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='transaction-buttons'>
          <button className='complete-button' onClick={closeTransaction}>
            Cetak Struk
          </button>
          <button className='cancel-button' onClick={closeDetail}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
