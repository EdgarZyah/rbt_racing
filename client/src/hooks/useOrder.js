// client/src/hooks/useOrder.js
import { useState, useCallback } from "react";
import api from "../api/axios";

export const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch semua order (Admin)
  const getOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders/admin");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);
  const getOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil detail");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // Fetch order milik user (Customer)
  const getUserOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders/customer");
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return {
    orders,
    loading,
    error,
    getOrders,
    getOrderById,
    getUserOrders,
    updateOrderStatus,
  };
};
