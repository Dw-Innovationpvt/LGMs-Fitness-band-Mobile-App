// api.js
import axios from 'axios';
import { API_URL } from '../constants/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.warn('Using localStorage for token, consider using AsyncStorage for React Native, i think api.js is successfulll');
  }

  return config;
});

export default api;