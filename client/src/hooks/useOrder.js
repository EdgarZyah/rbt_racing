import { useState, useCallback } from "react";
import api from "../api/axios";

export const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- CREATE ORDER ---
  const createOrder = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/orders', payload);
      return { success: true, data: data.data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create order' };
    } finally {
      setLoading(false);
    }
  };

  // --- GET ORDERS (ADMIN) ---
  const getOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/admin');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- GET USER ORDERS (CUSTOMER) ---
  const getUserOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/customer');
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- GET DETAIL ---
  const getOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      return { success: true, data: data };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // --- UPDATE STATUS ---
  const updateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  // --- FITUR BARU: UPDATE RESI ---
  const updateResi = async (id, resi) => {
    setLoading(true);
    try {
      await api.patch(`/orders/${id}/resi`, { resi });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'SHIPPED', resi } : o));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Gagal mengupdate resi" };
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    getOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updateResi, // Export fungsi baru
  };
};