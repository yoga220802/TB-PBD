import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateMedicineStockReport = (medicines) => {
  const doc = new jsPDF();

  const banyak = medicines.filter(med => med.stock > 10);
  const sedikit = medicines.filter(med => med.stock > 0 && med.stock <= 10);
  const habis = medicines.filter(med => med.stock === 0);

  doc.text("Laporan Stok Obat", 14, 15);
  doc.autoTable({
    head: [['ID', 'Nama Obat', 'Stok']],
    body: banyak.map(med => [med.medicineID, med.medicineName, med.stock.toString()]),
    startY: 20,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.autoTable({
    head: [['ID', 'Nama Obat', 'Stok']],
    body: sedikit.map(med => [med.medicineID, med.medicineName, med.stock.toString()]),
    startY: doc.lastAutoTable.finalY + 10,
    theme: 'grid',
    headStyles: { fillColor: [241, 196, 15] },
  });

  doc.autoTable({
    head: [['ID', 'Nama Obat', 'Stok']],
    body: habis.map(med => [med.medicineID, med.medicineName, '0']),
    startY: doc.lastAutoTable.finalY + 10,
    theme: 'grid',
    headStyles: { fillColor: [231, 76, 60] },
  });

  doc.save("laporan_stok_obat.pdf");
};

export const generateTransactionReport = (transactions) => {
  const doc = new jsPDF();
  doc.text("Laporan Penjualan", 14, 15);
  doc.autoTable({
    head: [['ID Transaksi', 'Tanggal Transaksi', 'Total']],
    body: transactions.map(tx => [tx.transactionID, new Date(tx.orderDateTime).toLocaleDateString(), tx.totalAmount.toString()]),
    startY: 20,
    theme: 'grid'
  });

  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.totalAmount), 0);

  doc.text(`Total Transaksi: ${totalTransactions}`, 14, doc.lastAutoTable.finalY + 10);
  doc.text(`Total Pendapatan: Rp${totalRevenue.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 20);

  doc.save('laporan-penjualan.pdf');
};
