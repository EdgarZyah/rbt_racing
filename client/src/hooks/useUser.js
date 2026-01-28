import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useUser = () => {
  const [users, setUsers] = useState([]); // State untuk list user (Admin)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- ADMIN FUNCTIONS ---

  // 1. Get All Users
  const getUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Update User Role
  const updateRole = useCallback(async (id, role) => {
    setLoading(true);
    try {
      // Pastikan endpoint backend mendukung ini (misal: PATCH /users/:id/role)
      await api.patch(`/users/${id}/role`, { role });
      await getUsers(); // Refresh data setelah update
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update role' 
      };
    } finally {
      setLoading(false);
    }
  }, [getUsers]); // Dependency getUsers agar list ter-refresh

  // --- CUSTOMER / PROFILE FUNCTIONS ---

  // 3. Get Own Profile
  const getProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/profile');
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Update Own Profile
  const updateProfile = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', payload);
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Update failed' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,        // PENTING: Jangan sampai hilang lagi
    loading,
    error,
    getUsers,     // Admin
    updateRole,   // Admin
    getProfile,   // Customer
    updateProfile // Customer
  };
};