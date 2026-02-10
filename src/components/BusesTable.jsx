import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BusesTable = ({ buses, schools, drivers, onAdd, onEdit, onDelete }) => {
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
      valueGetter: (value, row) => {
        // Önce backend'den gelen school_name'i kullan
        if (row?.school_name) return row.school_name;
        // Fallback: schools listesinden eşleştir
        const school = schools?.find(s => s.id === value);
        return school ? school.school_name : 'Bilinmiyor';
      }
    },
    { 
      field: 'current_driver_id', 
      headerName: 'Şoför', 
      flex: 1, 
      minWidth: 150,
      valueGetter: (value, row) => {
        // Önce backend'den gelen driver_name'i kullan
        if (row?.driver_name) return row.driver_name;
        // Fallback: current_driver objesini kontrol et
        if (row?.current_driver?.full_name) return row.current_driver.full_name;
        // Fallback: drivers listesinden eşleştir
        if (!value) return 'Atanmamış';
        const driver = drivers?.find(d => d.id === value);
        return driver ? driver.full_name : 'Atanmamış';
      }
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
        disableSelectionOnClick
        hideFooter
        autoHeight
        sx={{ minWidth: 360 }}
      />
    </Box>
  );
};

export default BusesTable;
