import axios from 'axios';

const API_URL = 'http://localhost:8000/auth';

export const login = async (username, password) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  const response = await axios.post(`${API_URL}/login`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const { access_token, user } = response.data;
  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));
  return { access_token, user };
};

export const logout = async () => {
  const token = getToken();
  if (token) {
    try {
      // Backend'e logout request gönder
      await axios.post(`${API_URL}/logout`, {}, {
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
  return localStorage.getItem('token');
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
