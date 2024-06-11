import jsPDF from 'jspdf';

const generateReceipt = (transactionData,namaPembeli, bayar, kembalian) => {
  const doc = new jsPDF();

  doc.text('Struk Pembayaran', 50, 20);
  doc.text(`ID Transaksi: ${transactionData.id}`, 20, 30);
  doc.text(`Tanggal: ${new Date(transactionData.tanggalTransaksi).toLocaleDateString()}`, 20, 40);
  doc.text(`Nama Pembeli: ${namaPembeli}`, 20, 50);
  doc.text(`Nama Apoteker: ${transactionData.apoteker}`, 20, 60);
  doc.text('Item Pembelian:', 20, 70);
  transactionData.items.forEach((item, index) => {
    doc.text(`${item.medicineName} - ${item.quantity} x Rp${item.medicinePrice}`, 20, 80 + (index * 10));
  });
  doc.text(`Total: ${transactionData.totalHarga}`, 20, 130);
  doc.text(`Bayar: ${bayar}`, 20, 140);
  doc.text(`Kembalian: ${kembalian}`, 20, 150);

  doc.save('struk-pembayaran.pdf');
};

export default generateReceipt;