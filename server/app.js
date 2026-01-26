const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Agar client React bisa akses API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder untuk Gambar Produk
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (Nanti kita import dari folder routes)
// const productRoutes = require('./routes/productRoutes');
// app.use('/api/products', productRoutes);

// Base Route Check
app.get('/', (req, res) => {
  res.json({ message: 'RBT-Racing API is Running!' });
});

// Error Handling Middleware Global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error', 
    message: 'Something went wrong!' 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server launched in http://localhost:${PORT}`);
});