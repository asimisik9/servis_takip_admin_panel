import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BusesTable = ({ buses, schools, drivers, onAdd, onEdit, onDelete }) => {
  // School ID'sine göre okul adını bul
  const getSchoolName = (schoolId) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.school_name : 'Bilinmiyor';
  };

  // Driver ID'sine göre şoför adını bul
  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.full_name : 'Atanmamış';
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'plate_number', headerName: 'Plaka', width: 130 },
    { 
      field: 'capacity', 
      headerName: 'Kapasite', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={`${params.value} kişi`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      )
    },
    { 
      field: 'school_id', 
      headerName: 'Okul', 
      flex: 1, 
      minWidth: 180,
      renderCell: (params) => getSchoolName(params.value)
    },
    { 
      field: 'current_driver_id', 
      headerName: 'Şoför', 
      flex: 1, 
      minWidth: 150,
      renderCell: (params) => getDriverName(params.value)
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
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
        <Typography variant="h5">Otobüsler</Typography>
        <Button variant="contained" onClick={onAdd}>Yeni Otobüs</Button>
      </Box>
      <DataGrid
        rows={buses}
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

export default BusesTable;
