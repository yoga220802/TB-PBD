const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const results = [];

fs.createReadStream('./src/database/dataset/APOTEK_normalized.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (!data.expirationDate || data.expirationDate.trim() === '') {
      data.expirationDate = generateRandomDate(); // Menghasilkan tanggal acak jika null
    } else {
      let date = moment(data.expirationDate, ['MMM-YY', 'MM/DD/YYYY', 'YYYY-MM-DD'], true);
      if (!date.isValid()) {
        data.expirationDate = generateRandomDate(); // Menghasilkan tanggal acak jika format salah
      } else {
        data.expirationDate = date.format('YYYY-MM-DD'); // Memformat tanggal yang valid
      }
    }
    results.push(data);
  })
  .on('end', () => {
    writeCSV(results);
  });

function generateRandomDate() {
  const start = new Date(2024, 1, 1);
  const end = new Date(2030, 12, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return moment(randomDate).format('YYYY-MM-DD');
}

function writeCSV(data) {
  const csvWriter = createCsvWriter({
    path: './src/database/dataset/APOTEK_normalized2s.csv',
    header: [
      {id: 'No', title: 'No'},
      {id: 'medicineName', title: 'medicineName'},
      {id: 'expirationDate', title: 'expirationDate'},
      {id: 'unit', title: 'unit'},
      {id: 'brand', title: 'brand'},
      {id: 'stock', title: 'stock'},
      {id: 'medicinePrice', title: 'medicinePrice'}
    ]
  });

  csvWriter.writeRecords(data)
    .then(() => {
      console.log('CSV file was written successfully with normalized dates');
    });
}
