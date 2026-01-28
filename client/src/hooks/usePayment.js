import { useState } from 'react';
import api from '../api/axios';

export const usePayment = () => {
  const [uploading, setUploading] = useState(false);

  const confirmPayment = async (orderId, file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('paymentProof', file);

      const { data } = await api.post(`/orders/${orderId}/payment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { success: true, data: data.data };
    } catch (err) {
      console.error("Upload Error:", err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to upload payment proof' 
      };
    } finally {
      setUploading(false);
    }
  };

  return { confirmPayment, uploading };
};