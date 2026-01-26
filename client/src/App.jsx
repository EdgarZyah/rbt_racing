import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/Home';
import Product from './pages/Product';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Routes>
      {/* Route Publik dengan Navbar/Footer */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="product" element={<Product />} />
        <Route path="product/:id" element={<ProductDetail />} />
        
        {/* Tambahkan route lain nanti di sini */}
        <Route path="cart" element={<div className="p-10">Cart Page</div>} />
        <Route path="login" element={<div className="p-10">Login Page</div>} />
      </Route>

      {/* Route Dashboard/Admin (bisa tanpa Navbar utama nanti) */}
      <Route path="/admin" element={<div>Halaman Admin</div>} />
    </Routes>
  );
}

export default App;