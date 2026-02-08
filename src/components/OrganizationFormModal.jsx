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
    Box
} from '@mui/material';

const OrganizationFormModal = ({ open, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'school',
        is_active: true
    });

    useEffect(() => {
        if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    type: initialData.type || 'school',
                    is_active: initialData.is_active ?? true
                });
        } else {
            setFormData({
                name: '',
                type: 'school',
                is_active: true
            });
        }
    }, [initialData, open]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {initialData ? 'Organizasyon Düzenle' : 'Yeni Organizasyon'}
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

                        {!initialData && (
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

                        {initialData && (
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>İptal</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Güncelle' : 'Ekle'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default OrganizationFormModal;
