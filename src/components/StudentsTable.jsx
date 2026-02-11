import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getUser } from '../services/authService';

const StudentsTable = ({ students, schools, onAdd, onEdit, onDelete }) => {
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'full_name', headerName: 'Ad Soyad', flex: 1, minWidth: 150 },
    { field: 'student_number', headerName: 'Öğrenci No', width: 130 },
    ...(isSuperAdmin ? [{
      field: 'organization_id',
      headerName: 'Organizasyon',
      flex: 1,
      minWidth: 180,
      valueGetter: (value, row) => {
        if (row?.organization_name) return row.organization_name;
        if (!value) return 'Atanmamış';
        return 'Bilinmiyor';
      }
    }] : []),
    { 
      field: 'school_id', 
      headerName: 'Okul', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (value, row) => {
        if (row?.school_name) return row.school_name;
        if (!value) return 'Seçilmedi';
        const school = schools?.find(s => s.id === value);
        return school ? school.school_name : 'Bilinmiyor';
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
        <Typography variant="h5">Öğrenciler</Typography>
        <Button variant="contained" onClick={onAdd}>Yeni Öğrenci</Button>
      </Box>
      <DataGrid
        rows={students}
        columns={columns}
        disableSelectionOnClick
        hideFooter
        autoHeight
        sx={{ minWidth: 360 }}
      />
    </Box>
  );
};

export default StudentsTable;
