import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUser } from '../services/authService';

const roleLabels = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  sofor: 'Şoför',
  veli: 'Veli'
};

const roleColors = {
  super_admin: 'warning',
  admin: 'error',
  sofor: 'primary',
  veli: 'success'
};

const UsersTable = ({ users, onAdd, onEdit, onDelete }) => {
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'full_name', headerName: 'Ad Soyad', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'E-posta', flex: 1, minWidth: 200 },
    { field: 'phone_number', headerName: 'Telefon', width: 150 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={roleLabels[params.value] || params.value}
          color={roleColors[params.value] || 'default'}
          size="small"
          variant={params.value === 'super_admin' ? 'filled' : 'outlined'}
        />
      ),
    },
    ...(isSuperAdmin ? [{
      field: 'organization_id',
      headerName: 'Organizasyon',
      flex: 1,
      minWidth: 180,
      valueGetter: (value, row) => {
        if (row?.organization_name) return row.organization_name;
        if (row?.organization?.name) return row.organization.name;
        if (!value) return 'Platform (Global)';
        return 'Bilinmiyor';
      },
    }] : []),
    {
      field: 'is_active',
      headerName: 'Durum',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Aktif' : 'Pasif'}
          color={params.value ? 'success' : 'default'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(params.row)}
            title="Düzenle"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(params.row.id)}
            title="Sil"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', height: 600, bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Kullanıcılar</Typography>
        <Button variant="contained" onClick={onAdd}>Yeni Kullanıcı</Button>
      </Box>
      <DataGrid
        rows={users}
        columns={columns}
        disableSelectionOnClick
        hideFooter
        autoHeight
        sx={{ minWidth: 360 }}
      />
    </Box>
  );
};

export default UsersTable;
