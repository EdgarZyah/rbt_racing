import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"; // Tambahkan ini
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter harus membungkus App jika Routes ada di dalam App */}
    <BrowserRouter>
      {/* AuthProvider sebagai data user utama */}
      <AuthProvider>
        {/* CartProvider di dalam karena mungkin butuh data user */}
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)