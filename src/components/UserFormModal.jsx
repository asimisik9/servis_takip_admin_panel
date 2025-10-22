import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'sofor', label: 'Şoför' },
  { value: 'veli', label: 'Veli' },
];

const UserFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'veli',
    password: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        phone_number: initialData.phone_number || '',
        role: initialData.role || 'veli',
        password: '' // Password is optional when editing
      });
    } else {
      setForm({
        full_name: '',
        email: '',
        phone_number: '',
        role: 'veli',
        password: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // If editing and password is empty, remove it from the form data
    const submitData = { ...form };
    if (initialData && !submitData.password) {
      delete submitData.password;
    }
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="normal"
            label="Ad Soyad"
            name="full_name"
            fullWidth
            required
            value={form.full_name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="E-posta"
            name="email"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Telefon"
            name="phone_number"
            fullWidth
            required
            placeholder="+905551234567"
            value={form.phone_number}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Şifre"
            name="password"
            type="password"
            fullWidth
            required={!initialData}
            helperText={initialData ? 'Değiştirmek istemiyorsanız boş bırakın' : ''}
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Rol"
            name="role"
            select
            fullWidth
            required
            value={form.role}
            onChange={handleChange}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">Kaydet</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default UserFormModal;
