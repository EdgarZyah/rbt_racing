// server/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models');
const mainRouter = require('./routes'); 
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder untuk Akses Gambar WebP
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use("/api/v1", mainRouter);

// Database Connection & Sync
// Gunakan { alter: true } hanya saat pengembangan untuk update struktur tabel otomatis
db.sequelize.sync({ alter: false }) 
  .then(() => {
    console.log("Database RBT Racing connected and synced.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });