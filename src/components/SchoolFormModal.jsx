import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';

const SchoolFormModal = ({ open, onClose, onSubmit, initialData, users, organizations = [], isSuperAdmin = false }) => {
  const [form, setForm] = useState({
    school_name: '',
    school_address: '',
    contact_person_id: '',
    organization_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        school_name: initialData.school_name || '',
        school_address: initialData.school_address || '',
        contact_person_id: initialData.contact_person_id || '',
        organization_id: initialData.organization_id || ''
      });
    } else {
      setForm({
        school_name: '',
        school_address: '',
        contact_person_id: '',
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
    if (isSuperAdmin) {
      if (!submitData.organization_id) {
        submitData.organization_id = null;
      }
    } else {
      delete submitData.organization_id;
    }
    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Okulu Düzenle' : 'Yeni Okul Ekle'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="normal"
            label="Okul Adı"
            name="school_name"
            fullWidth
            required
            placeholder="Atatürk İlkokulu"
            value={form.school_name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Adres"
            name="school_address"
            fullWidth
            required
            multiline
            rows={3}
            placeholder="Ankara, Çankaya..."
            value={form.school_address}
            onChange={handleChange}
          />
          {isSuperAdmin && (
            <TextField
              margin="normal"
              label="Organizasyon"
              name="organization_id"
              select
              fullWidth
              required
              value={form.organization_id}
              onChange={handleChange}
              helperText="Okulun bağlı olacağı organizasyon"
            >
              {organizations && organizations.length > 0 ? (
                organizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  Organizasyon bulunamadı
                </MenuItem>
              )}
            </TextField>
          )}
          <TextField
            margin="normal"
            label="İletişim Kişisi"
            name="contact_person_id"
            select
            fullWidth
            required
            value={form.contact_person_id}
            onChange={handleChange}
            helperText="Okul yetkilisi veya sorumlu kişi"
          >
            {users && users.length > 0 ? (
              users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.full_name} ({user.role === 'admin' ? 'Admin' : user.role === 'sofor' ? 'Şoför' : 'Veli'})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Kullanıcı bulunamadı
              </MenuItem>
            )}
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

export default SchoolFormModal;
