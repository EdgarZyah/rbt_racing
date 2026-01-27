import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  const getProfile = async () => {
    const { data } = await api.get('/users/profile');
    return data;
  };

  const updateProfile = async (userData) => {
    try {
      await api.put('/users/profile', userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return { users, loading, getUsers, updateRole, getProfile, updateProfile };
};