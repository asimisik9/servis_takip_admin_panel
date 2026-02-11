import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Divider
} from '@mui/material';

const OrganizationFormModal = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'school',
    is_active: true,
    create_admin: false,
    admin_full_name: '',
    admin_email: '',
    admin_phone_number: '',
    admin_password: ''
  });

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'school',
        is_active: initialData.is_active ?? true,
        create_admin: false,
        admin_full_name: '',
        admin_email: '',
        admin_phone_number: '',
        admin_password: ''
      });
    } else {
      setFormData({
        name: '',
        type: 'school',
        is_active: true,
        create_admin: false,
        admin_full_name: '',
        admin_email: '',
        admin_phone_number: '',
        admin_password: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEditMode && formData.create_admin) {
      if (
        !formData.admin_full_name ||
        !formData.admin_email ||
        !formData.admin_phone_number ||
        !formData.admin_password
      ) {
        return;
      }
    }

    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditMode ? 'Organizasyon Düzenle' : 'Yeni Organizasyon'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              name="name"
              label="Organizasyon Adı"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />

            {!isEditMode && (
              <FormControl fullWidth required>
                <InputLabel>Tip</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Tip"
                >
                  <MenuItem value="school">Okul</MenuItem>
                  <MenuItem value="transport_company">Taşıma Şirketi</MenuItem>
                </Select>
              </FormControl>
            )}

            {isEditMode && (
              <FormControlLabel
                control={
                  <Switch
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Aktif"
              />
            )}

            {!isEditMode && (
              <>
                <Divider sx={{ my: 1 }} />
                <FormControlLabel
                  control={
                    <Switch
                      name="create_admin"
                      checked={formData.create_admin}
                      onChange={handleChange}
                      color="secondary"
                    />
                  }
                  label="Bu organizasyon için admin oluştur"
                />

                {formData.create_admin && (
                  <>
                    <Typography variant="subtitle2" color="text.secondary">
                      Admin Bilgileri
                    </Typography>
                    <TextField
                      name="admin_full_name"
                      label="Admin Ad Soyad"
                      value={formData.admin_full_name}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <TextField
                      name="admin_email"
                      label="Admin E-posta"
                      type="email"
                      value={formData.admin_email}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                    <TextField
                      name="admin_phone_number"
                      label="Admin Telefon"
                      value={formData.admin_phone_number}
                      onChange={handleChange}
                      required
                      fullWidth
                      placeholder="+905551234567"
                    />
                    <TextField
                      name="admin_password"
                      label="Admin Şifre"
                      type="password"
                      value={formData.admin_password}
                      onChange={handleChange}
                      required
                      fullWidth
                      helperText="En az 8 karakter, büyük-küçük harf ve rakam içermelidir"
                    />
                  </>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEditMode ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OrganizationFormModal;
