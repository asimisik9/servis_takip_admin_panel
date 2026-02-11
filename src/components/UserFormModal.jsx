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
  const [fieldErrors, setFieldErrors] = useState({});
  const requiresOrganization = isSuperAdmin && form.role !== 'super_admin';

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
    setFieldErrors({});
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === 'role') {
      setForm((prev) => ({
        ...prev,
        role: value,
        organization_id: value === 'super_admin' ? '' : prev.organization_id
      }));
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};

    const digits = (form.phone_number || '').replace(/\D/g, '');
    if (digits.length < 10) {
      nextErrors.phone_number = 'Telefon numarası en az 10 rakam içermelidir.';
    }

    if (requiresOrganization && !form.organization_id) {
      nextErrors.organization_id = 'Bu rol için organizasyon seçimi zorunludur.';
    }

    if (!initialData || form.password) {
      if (form.password.length < 8) {
        nextErrors.password = 'Şifre en az 8 karakter olmalıdır.';
      } else if (!/[A-Z]/.test(form.password)) {
        nextErrors.password = 'Şifre en az 1 büyük harf içermelidir.';
      } else if (!/[a-z]/.test(form.password)) {
        nextErrors.password = 'Şifre en az 1 küçük harf içermelidir.';
      } else if (!/\d/.test(form.password)) {
        nextErrors.password = 'Şifre en az 1 rakam içermelidir.';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const submitData = { ...form };
    if (initialData && !submitData.password) {
      delete submitData.password;
    }
    // Only send organization_id if super_admin
    if (!isSuperAdmin) {
      delete submitData.organization_id;
    } else {
      if (submitData.organization_id === '') {
        submitData.organization_id = null;
      }
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
            error={Boolean(fieldErrors.phone_number)}
            helperText={fieldErrors.phone_number}
          />
          <TextField
            margin="normal"
            label="Şifre"
            name="password"
            type="password"
            fullWidth
            required={!initialData}
            helperText={fieldErrors.password || (initialData
              ? 'Boş bırakırsanız değişmez. Kural: en az 8 karakter, 1 büyük, 1 küçük, 1 rakam.'
              : 'Kural: en az 8 karakter, 1 büyük, 1 küçük, 1 rakam.')}
            value={form.password}
            onChange={handleChange}
            error={Boolean(fieldErrors.password)}
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
              required={requiresOrganization}
              value={form.organization_id}
              onChange={handleChange}
              error={Boolean(fieldErrors.organization_id)}
              helperText={fieldErrors.organization_id || (requiresOrganization
                ? "Bu rol için organizasyon zorunludur"
                : "Sadece super_admin organizasyonsuz olabilir")}
            >
              {form.role === 'super_admin' && (
                <MenuItem value="">
                  <em>Organizasyonsuz (Platform)</em>
                </MenuItem>
              )}
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
