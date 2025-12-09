import axios from 'axios';
import { AUTH_API_URL } from './config';

export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${AUTH_API_URL}/login`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  
  console.log('Login response:', response);

  if (!response.data) {
    throw new Error('Sunucudan boş yanıt döndü.');
  }

  const { access_token, user } = response.data;
  
  if (!access_token) {
    throw new Error('Access token alınamadı.');
  }

  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));
  return { access_token, user };
};

export const logout = async () => {
  const token = getToken();
  if (token) {
    try {
      // Backend'e logout request gönder
      await axios.post(`${AUTH_API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  // Token ve user bilgisini localStorage'dan sil
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined' || token === 'null') return null;
  return token;
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  if (!user || user === 'undefined' || user === 'null') return null;
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
};
