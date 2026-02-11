import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import { getUser } from '../services/authService';

const StudentFormModal = ({ open, onClose, onSubmit, initialData, schools, organizations = [] }) => {
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [form, setForm] = useState({
    full_name: '',
    student_number: '',
    organization_id: '',
    school_id: '',
    address: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || '',
        student_number: initialData.student_number || '',
        organization_id: initialData.organization_id || '',
        school_id: initialData.school_id || '',
        address: initialData.address || ''
      });
    } else {
      setForm({
        full_name: '',
        student_number: '',
        organization_id: '',
        school_id: '',
        address: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...form,
      school_id: form.school_id || null
    };

    if (isSuperAdmin) {
      if (!submitData.organization_id) {
        return;
      }
    } else {
      delete submitData.organization_id;
    }

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Öğrenciyi Düzenle' : 'Yeni Öğrenci Ekle'}</DialogTitle>
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
            label="Öğrenci Numarası"
            name="student_number"
            fullWidth
            required
            placeholder="2025001"
            value={form.student_number}
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
              helperText="Super admin için organizasyon seçimi zorunludur"
            >
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name} ({org.type === 'school' ? 'Okul' : 'Taşıma Şirketi'})
                </MenuItem>
              ))}
            </TextField>
          )}

          <TextField
            margin="normal"
            label="Okul"
            name="school_id"
            select
            fullWidth
            value={form.school_id}
            onChange={handleChange}
            helperText="Opsiyonel"
          >
            <MenuItem value="">
              <em>Seçilmedi</em>
            </MenuItem>
            {schools && schools.length > 0 ? (
              schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.school_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="__no_school__">
                Okul bulunamadı
              </MenuItem>
            )}
          </TextField>

          <TextField
            margin="normal"
            label="Adres"
            name="address"
            fullWidth
            multiline
            rows={3}
            value={form.address}
            onChange={handleChange}
            helperText="Google Maps formatında açık adres giriniz"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained">Kaydet</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default StudentFormModal;
