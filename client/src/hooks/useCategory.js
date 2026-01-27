// client/src/hooks/useCategory.js
import { useState, useCallback } from 'react';
import api from '../api/axios';

export const useCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  const addCategory = async (name) => {
    try {
      const { data } = await api.post('/categories', { name });
      setCategories((prev) => [...prev, data]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  const updateCategory = async (id, name) => {
    try {
      const { data } = await api.put(`/categories/${id}`, { name });
      setCategories((prev) => prev.map((cat) => (cat.id === id ? data : cat)));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    }
  };

  return { categories, loading, error, getCategories, addCategory, updateCategory, deleteCategory };
};