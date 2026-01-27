// client/src/hooks/useDashboard.js
import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStats = useCallback(async () => {
    setLoading(true);
    try {
      // Ubah endpoint ke rute order yang baru kita buat
      const { data } = await api.get('/orders/stats'); 
      setStats(data);
    } catch (err) {
      console.error("Gagal memuat statistik dashboard", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, getStats };
};