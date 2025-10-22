import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StudentsTable = ({ students, schools, onAdd, onEdit, onDelete }) => {
  // School ID'sine göre okul adını bul
  const getSchoolName = (schoolId) => {
    const school = schools.find(s => s.id === schoolId);
    return school ? school.school_name : 'Bilinmiyor';
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'full_name', headerName: 'Ad Soyad', flex: 1, minWidth: 150 },
    { field: 'student_number', headerName: 'Öğrenci No', width: 130 },
    { 
      field: 'school_id', 
      headerName: 'Okul', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (params) => getSchoolName(params)
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

export default StudentsTable;
