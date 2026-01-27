// client/src/hooks/useProduct.js
import { useState, useCallback } from "react";
import api from "../api/axios";

export const useProduct = () => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. GET ALL PRODUCTS
  const getProducts = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error sebelum fetch
    try {
      const { data } = await api.get("/products");
      console.log("📦 Data Produk dari API:", data); // DEBUG: Cek di Console Browser
      
      // Pastikan data adalah array sebelum di-set
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Format data salah, harus array:", data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error Fetching Products:", err);
      setError(err.response?.data?.message || "Gagal memuat produk");
      setProducts([]); // Set kosong jika error agar UI tidak crash
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. GET PRODUCT BY ID
  const getProductById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/id/${id}`);
      setProduct(data);
      return data;
    } catch (err) {
      setError("Gagal mengambil detail produk");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. GET PRODUCT BY SLUG (Untuk Customer)
  const getProductBySlug = useCallback(async (slug) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
    } catch (err) {
      setError("Produk tidak ditemukan");
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. CREATE
  const createProduct = async (formData) => {
    setLoading(true);
    try {
      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await getProducts(); // Refresh list otomatis setelah create
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // 5. UPDATE
  const updateProduct = async (id, formData) => {
    setLoading(true);
    try {
      await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await getProducts(); // Refresh list otomatis
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // 6. DELETE
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    product,
    loading,
    error,
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};