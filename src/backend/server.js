require('dotenv').config();
console.log(process.env.JWT_SECRET); // Harus menampilkan nilai secret key Anda

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const medicineRoutes = require('./routes/medicineRoutes'); // Pastikan path sesuai dengan setup Anda
const authenticateToken = require('./middleware/authenticateToken'); // Import middleware
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/user', authenticateToken, userRoutes); // Lindungi rute user dengan middleware
app.use('/medicine', medicineRoutes);
app.use('/transaction', transactionRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
