import { useState, useCallback, useRef } from 'react';
import api from '../api/axios';

export const useAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- LOCATION DATA STATES ---
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);

  // --- CRUD ADDRESS (Tetap sama) ---
  const getAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/addresses');
      setAddresses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat alamat');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAddress = async (payload) => {
    setLoading(true);
    try {
      await api.post('/addresses', payload);
      await getAddresses();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id, payload) => {
    setLoading(true);
    try {
      await api.put(`/addresses/${id}`, payload);
      await getAddresses();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/addresses/${id}`);
      await getAddresses();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const setMainAddress = async (id) => {
    setLoading(true);
    try {
      await api.patch(`/addresses/${id}/main`);
      await getAddresses();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  // --- RAJA ONGKIR FETCHERS (DIPERBAIKI DENGAN ABORT SIGNAL) ---
  
  const getProvinces = useCallback(async (signal) => {
    try {
      const { data } = await api.get('/rajaongkir/provinces', { signal });
      setProvinces(data);
    } catch (err) { 
      if (err.name !== 'CanceledError') console.error(err); 
    }
  }, []);

  const getCities = useCallback(async (provId, signal) => {
    if (!provId) { setCities([]); return; }
    try {
      const { data } = await api.get(`/rajaongkir/cities/${provId}`, { signal });
      setCities(data);
    } catch (err) { 
      if (err.name !== 'CanceledError') console.error(err); 
    }
  }, []);

  const getDistricts = useCallback(async (cityId, signal) => {
    if (!cityId) { setDistricts([]); return; }
    try {
      const { data } = await api.get(`/rajaongkir/districts/${cityId}`, { signal });
      setDistricts(data);
    } catch (err) { 
      if (err.name !== 'CanceledError') console.error(err); 
    }
  }, []);

  const getSubDistricts = useCallback(async (districtId, signal) => {
    if (!districtId) { setSubDistricts([]); return; }
    try {
      const { data } = await api.get(`/rajaongkir/subdistricts/${districtId}`, { signal });
      setSubDistricts(data);
    } catch (err) { 
      if (err.name !== 'CanceledError') console.error(err); 
    }
  }, []);

  return {
    addresses, loading, error,
    provinces, cities, districts, subDistricts,
    getAddresses, addAddress, updateAddress, deleteAddress, setMainAddress,
    getProvinces, getCities, getDistricts, getSubDistricts
  };
};