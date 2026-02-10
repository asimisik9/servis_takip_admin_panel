import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const SchoolsTable = ({ schools, users, onAdd, onEdit, onDelete }) => {
  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'school_name', headerName: 'Okul Adı', flex: 1, minWidth: 200 },
    { field: 'school_address', headerName: 'Adres', flex: 1, minWidth: 250 },
    { 
      field: 'contact_person_id', 
      headerName: 'İletişim Kişisi', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (value, row) => {
        // Önce backend'den gelen contact_person_name'i kullan
        if (row?.contact_person_name) return row.contact_person_name;
        // Fallback: users listesinden eşleştir
        const user = users?.find(u => u.id === value);
        return user ? user.full_name : 'Bilinmiyor';
      }
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
        <Typography variant="h5">Okullar</Typography>
        <Button variant="contained" onClick={onAdd}>Yeni Okul</Button>
      </Box>
      <DataGrid
        rows={schools}
        columns={columns}
        disableSelectionOnClick
        hideFooter
        autoHeight
        sx={{ minWidth: 360 }}
      />
    </Box>
  );
};

export default SchoolsTable;
