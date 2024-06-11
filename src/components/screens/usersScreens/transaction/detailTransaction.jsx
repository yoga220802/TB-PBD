import React, { useState } from "react";
import "../../../../styles/dashboard/transaksi/transaksi.css"; // Tambahkan style yang relevan
import { z } from "zod";
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


const TransactionDetail = ({
 transactionData,
 closeDetail,
}) => {
 // State lokal untuk input pengguna
 const isValidDate = Date.parse(transactionData.tanggalTransaksi);
 const dateObject = isValidDate ? new Date(transactionData.tanggalTransaksi) : new Date();
 const formattedDate = dateObject.toISOString().split("T")[0];
 const [bayar, setBayar] = useState("");
 const [kembalian, setKembalian] = useState("");
 const [namaPembeli, setNamaPembeli] = useState("-");
 const [paymentError, setPaymentError] = useState("");
 const [errorMessage, setErrorMessage] = useState("");

 const paymentSchema = z.object({
  totalHarga: z.number(),
  bayar: z.string(),
 });
 
 const validatePayment = (totalHarga, bayar) => {
  const result = paymentSchema.safeParse({
   totalHarga,
   bayar: bayar.replace(/[^0-9,-]+/g, ""), // Membersihkan input untuk hanya mengandung angka
  });

  if (!result.success) {
   setPaymentError("Input tidak valid.");
   return false;
  }

  const pembayaran = Number(result.data.bayar);
  const kembalianHitung = pembayaran - totalHarga;

  if (kembalianHitung < 0) {
   setPaymentError("Pembayaran tidak cukup.");
   return false;
  } else {
   setPaymentError("");
   setKembalian(formatRupiah(kembalianHitung));
   return true;
  }
 };

 const handlePaymentChange = (e) => {
  const inputBayar = e.target.value;
  setBayar(inputBayar); // Memperbarui state bayar dengan nilai input terbaru

  const pembayaran = Number(inputBayar.replace(/[^0-9,-]+/g, ""));
  const totalHarga = transactionData.totalHarga;
  const kembalianHitung = pembayaran - totalHarga;

  if (kembalianHitung >= 0) {
   setKembalian(kembalianHitung); // Memperbarui state kembalian dengan format rupiah
   setPaymentError(""); // Menghapus pesan error jika ada
  } else {
   setKembalian(""); // Mengosongkan kembalian jika pembayaran tidak cukup
   setPaymentError("Pembayaran tidak cukup.");
  }
 };

 const completeTransaction = () => {
  if (!validatePayment(transactionData.totalHarga, bayar)) {
    return; // Menghentikan fungsi jika validasi gagal
  }
  
  // Generate dan download struk
  const transactionReceipt = {
    id: transactionData.id,
    tanggalTransaksi: transactionData.tanggalTransaksi,
    totalHarga: formatRupiah(transactionData.totalHarga),
    items: transactionData.items,
    apoteker: transactionData.apotekerName,
  };
  generateReceipt(transactionReceipt, namaPembeli, formatRupiah(bayar), formatRupiah(kembalian));
  
  // Lanjutkan dengan logika untuk menyimpan transaksi
  const transactionInfoData = {
    transactionID: transactionData.id,
    totalHarga: transactionData.totalHarga,
    bayar: bayar,
    kembalian: kembalian,
    namaPembeli: namaPembeli,
    apoteker: transactionData.apotekerName,
  };
  
  // Membuat request untuk menambahkan transaksi ke transactionInfo
  const createTransactionPromise = fetch("http://localhost:8080/transaction/createTransaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transactionInfoData),
  });

  // Membuat array promises untuk menyimpan detail transaksi
  const saveDetailsPromises = transactionData.items.map((item) => {
    const detailData = {
      transactionID: transactionData.id,
      medicineID: item.medicineID,
      quantity: item.quantity,
      totalPrice: item.medicinePrice * item.quantity,
    };

    return fetch("http://localhost:8080/transaction/addDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detailData),
    });
  });

  // Menjalankan semua promises secara bersamaan
  Promise.all([createTransactionPromise, ...saveDetailsPromises])
    .then((responses) => Promise.all(responses.map(res => res.json())))
    .then((data) => {
      console.log("Transaksi dan detail transaksi berhasil disimpan:", data);
      closeDetail();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      setErrorMessage("Gagal menyimpan transaksi. Silakan coba lagi.");
    });
 };

 return (
  <div className='transaction-detail-overlay'>
   <div className='transaction-detail-container'>
    <h2>Transaction ID: {transactionData.id}</h2>
    <div className='transaction-info'>
     <div className='transaction-info-row'>
      <label>Total</label>
      <input
       type='text'
       value={formatRupiah(transactionData.totalHarga)}
       readOnly
      />
     </div>
     <div className='transaction-info-row'>
      <label>Tanggal Transaksi</label>
      <input type='date' value={formattedDate} readOnly />
     </div>
     <div className='transaction-info-row'>
      <label>Bayar</label>
      <div className='input-with-error'>
       <input
        type="text"
        value={bayar}
        onChange={handlePaymentChange}
        className={paymentError ? "input-error" : ""}
       />
       {paymentError && <span className='error-message'>{paymentError}</span>}
      </div>
     </div>
     <div className='transaction-info-row'>
      <label>Kembalian</label>
      <input type='text' value= { formatRupiah(kembalian)} readOnly />
     </div>
     <div className='transaction-info-row'>
      <label>Nama Pembeli</label>
      <input
       type='text'
       value={namaPembeli}
       onChange={(e) => setNamaPembeli(e.target.value)}
      />
     </div>
     <div className='transaction-info-row'>
      <label>Apoteker</label>
      <input type='text' value={transactionData.apotekerName} readOnly />
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
      {transactionData.items.map((item, index) => (
       <tr key={index}>
        <td>{item.medicineID}</td>
        <td>{item.medicineName}</td>
        <td>{formatRupiah(item.medicinePrice)}</td>
        <td>{item.quantity}</td>
        <td>{formatRupiah(item.medicinePrice * item.quantity)}</td>
       </tr>
      ))}
     </tbody>
    </table>

    <div className='transaction-buttons'>
     <button className='complete-button' onClick={completeTransaction}>
      Beli
     </button>
     <button className='cancel-button' onClick={closeDetail}>
      Tutup
     </button>
    </div>
    {errorMessage && <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{errorMessage}</div>}
   </div>
  </div>
 );
};

export default TransactionDetail;
