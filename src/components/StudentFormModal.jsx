import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';

const StudentFormModal = ({ open, onClose, onSubmit, initialData, schools }) => {
  const [form, setForm] = useState({
    full_name: '',
    student_number: '',
    school_id: '',
    address: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        full_name: initialData.full_name || '',
        student_number: initialData.student_number || '',
        school_id: initialData.school_id || '',
        address: initialData.address || ''
      });
    } else {
      setForm({
        full_name: '',
        student_number: '',
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
    onSubmit(form);
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
          <TextField
            margin="normal"
            label="Okul"
            name="school_id"
            select
            fullWidth
            required
            value={form.school_id}
            onChange={handleChange}
            helperText="Öğrencinin kayıtlı olduğu okul"
          >
            {schools && schools.length > 0 ? (
              schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.school_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Okul bulunamadı
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

export default StudentFormModal;
