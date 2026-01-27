// client/src/api/axios.js
import axios from 'axios';

// 1. Ambil URL dari .env, fallback ke localhost jika tidak ada
export const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const instance = axios.create({
  // 2. Gabungkan URL root dengan path API
  baseURL: `${APP_BASE_URL}/api/v1`, 
});

export default instance;