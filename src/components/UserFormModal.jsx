import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import { getUser } from '../services/authService';

const UserFormModal = ({ open, onClose, onSubmit, initialData, organizations = [] }) => {
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const roles = [
    ...(isSuperAdmin ? [{ value: 'super_admin', label: 'Super Admin' }] : []),
    { value: 'admin', label: 'Admin' },
    { value: 'sofor', label: 'Şoför' },
    { value: 'veli', label: 'Veli' },
  ];

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    role: 'veli',
    password: '',
    organization_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || '',
        email: initialData.email || '',
        phone_number: initialData.phone_number || '',
        role: initialData.role || 'veli',
        password: '',
        organization_id: initialData.organization_id || ''
      });
    } else {
      setForm({
        full_name: '',
        email: '',
        phone_number: '',
        role: 'veli',
        password: '',
        organization_id: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = { ...form };
    if (initialData && !submitData.password) {
      delete submitData.password;
    }
    // Only send organization_id if super_admin
    if (!isSuperAdmin) {
      delete submitData.organization_id;
    } else if (submitData.organization_id === '') {
      submitData.organization_id = null;
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
          {isSuperAdmin && (
            <TextField
              margin="normal"
              label="Organizasyon"
              name="organization_id"
              select
              fullWidth
              value={form.organization_id}
              onChange={handleChange}
              helperText="Boş bırakılırsa platform seviyesinde kullanıcı olur"
            >
              <MenuItem value="">
                <em>Organizasyonsuz (Platform)</em>
              </MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name} ({org.type === 'school' ? 'Okul' : 'Taşıma Şirketi'})
                </MenuItem>
              ))}
            </TextField>
          )}
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
