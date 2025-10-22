import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const roleLabels = {
  admin: 'Admin',
  sofor: 'Şoför',
  veli: 'Veli'
};

const roleColors = {
  admin: 'error',
  sofor: 'primary',
  veli: 'success'
};

const UsersTable = ({ users, onAdd, onEdit, onDelete }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'full_name', headerName: 'Ad Soyad', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'E-posta', flex: 1, minWidth: 200 },
    { field: 'phone_number', headerName: 'Telefon', width: 150 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={roleLabels[params.value] || params.value}
          color={roleColors[params.value] || 'default'}
          size="small"
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
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableSelectionOnClick
        autoHeight
        sx={{ minWidth: 360 }}
      />
    </Box>
  );
};

export default UsersTable;
