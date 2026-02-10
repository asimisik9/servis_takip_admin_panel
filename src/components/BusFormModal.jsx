import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import { getUser } from '../services/authService';

const BusFormModal = ({ open, onClose, onSubmit, initialData, schools, drivers, organizations = [] }) => {
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [form, setForm] = useState({
    plate_number: '',
    capacity: '',
    school_id: '',
    current_driver_id: '',
    organization_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        plate_number: initialData.plate_number || '',
        capacity: initialData.capacity || '',
        school_id: initialData.school_id || '',
        current_driver_id: initialData.current_driver_id || '',
        organization_id: initialData.organization_id || ''
      });
    } else {
      setForm({
        plate_number: '',
        capacity: '',
        school_id: '',
        current_driver_id: '',
        organization_id: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Capacity için sayısal değer kontrolü
    if (name === 'capacity') {
      setForm({ ...form, [name]: value ? parseInt(value, 10) : '' });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...form,
      current_driver_id: form.current_driver_id || null,
    };
    if (isSuperAdmin) {
      submitData.organization_id = form.organization_id || null;
    } else {
      delete submitData.organization_id;
    }
    onSubmit(submitData);
  };

  // Sadece şoför rolündeki kullanıcıları filtrele
  const driverUsers = drivers.filter(user => user.role === 'sofor');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initialData ? 'Otobüsü Düzenle' : 'Yeni Otobüs Ekle'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            margin="normal"
            label="Plaka"
            name="plate_number"
            fullWidth
            required
            placeholder="34 ABC 123"
            value={form.plate_number}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Kapasite"
            name="capacity"
            type="number"
            fullWidth
            required
            inputProps={{ min: 1 }}
            helperText="Otobüsün yolcu kapasitesi"
            value={form.capacity}
            onChange={handleChange}
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
            helperText="Otobüsün bağlı olduğu okul"
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
              helperText="Otobüsün bağlı olduğu taşıyıcı organizasyon"
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
            label="Şoför"
            name="current_driver_id"
            select
            fullWidth
            value={form.current_driver_id}
            onChange={handleChange}
            helperText="Otobüse atanacak şoför (opsiyonel)"
          >
            <MenuItem value="">
              <em>Atanmamış</em>
            </MenuItem>
            {driverUsers && driverUsers.length > 0 ? (
              driverUsers.map((driver) => (
                <MenuItem key={driver.id} value={driver.id}>
                  {driver.full_name} ({driver.email})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Şoför bulunamadı
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

export default BusFormModal;
