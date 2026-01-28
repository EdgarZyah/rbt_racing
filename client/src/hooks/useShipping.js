import { useState } from 'react';
import api from '../api/axios';

export const useShipping = () => {
  const [shippingCosts, setShippingCosts] = useState([]);
  const [loadingCost, setLoadingCost] = useState(false);
  const [shopAddress, setShopAddress] = useState(null);

  // 1. Ambil Alamat Toko
  const getShopAddress = async () => {
    try {
      const { data } = await api.get('/shop-address'); 
      setShopAddress(data);
    } catch (err) {
      console.error("Gagal ambil alamat toko", err);
    }
  };

  // 2. Hitung Ongkir (DIPERBARUI)
  // Default courier: gabungan semua kurir populer
  const calculateShipping = async ({ destination, items, courier = "jne:sicepat:jnt:pos:tiki" }) => {
    setLoadingCost(true);
    setShippingCosts([]);
    try {
      const { data } = await api.post('/rajaongkir/cost', {
        destination, 
        items,       
        courier // Mengirim string gabungan, misal: "jne:sicepat:jnt"
      });
      setShippingCosts(data); // Backend sudah mengurutkan dari termurah
      return data;
    } catch (err) {
      console.error(err);
      // alert(err.response?.data?.message || "Gagal menghitung ongkir");
    } finally {
      setLoadingCost(false);
    }
  };

  return { 
    shippingCosts, 
    loadingCost, 
    shopAddress,
    getShopAddress, 
    calculateShipping 
  };
};