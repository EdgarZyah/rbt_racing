// client/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/commons/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute

// Layouts
import MainLayout from "./layouts/MainLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Public Pages
import HomePage from "./pages/Home";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AboutUs from "./pages/AboutUs";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Protected Customer Pages
import Payment from "./pages/Payment";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import Order from "./pages/customer/Order";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import ProductList from "./pages/admin/ProductList";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import OrderList from "./pages/admin/OrderList";
import Category from "./pages/admin/Category";
import UserManagement from "./pages/admin/UserManagement";
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          {/* 1. PUBLIC & GUEST ROUTES */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="product" element={<Product />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="about" element={<AboutUs />} />
            
            {/* Guest Only: Jika sudah login tidak bisa akses login/register */}
            <Route path="login" element={
              <ProtectedRoute guestOnly>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="register" element={
              <ProtectedRoute guestOnly>
                <Register />
              </ProtectedRoute>
            } />

            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify-email" element={<VerifyEmail />} />

            {/* Proteksi khusus Payment agar hanya Customer yang bisa akses */}
            <Route path="payment" element={
              <ProtectedRoute requiredRole="CUSTOMER">
                <Payment />
              </ProtectedRoute>
            } />
          </Route>

          {/* 2. ADMIN PROTECTED ROUTES */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="products" element={<ProductList />} />
            <Route path="product/add" element={<AddProduct />} />
            <Route path="product/edit/:id" element={<EditProduct />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="categories" element={<Category />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* 3. CUSTOMER PROTECTED ROUTES */}
          <Route path="/customer" element={
            <ProtectedRoute requiredRole="CUSTOMER">
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route index element={<CustomerDashboard />} />
            <Route path="profile" element={<CustomerProfile />} />
            <Route path="orders" element={<Order />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;