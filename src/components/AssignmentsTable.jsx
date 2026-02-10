import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, IconButton, Tabs, Tab, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AssignmentsTable = ({
  studentBusAssignments,
  parentStudentRelations,
  onAddStudentBus,
  onAddParentStudent,
  onDeleteStudentBus,
  onDeleteParentStudent,
  activeTab,
  onTabChange,
  canManageParentRelations = true
}) => {
  // Student-Bus Assignments columns
  const studentBusColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    {
      field: 'student',
      headerName: 'Öğrenci',
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => {
        const student = row?.student;
        return student ? `${student.full_name} (${student.student_number})` : 'Bilinmiyor';
      }
    },
    {
      field: 'bus',
      headerName: 'Otobüs (Plaka)',
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => {
        const bus = row?.bus;
        return bus ? `${bus.plate_number} (Kapasite: ${bus.capacity})` : 'Bilinmiyor';
      }
    },
    {
      field: 'actions',
      headerName: 'İşlemler',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => onDeleteStudentBus(params.row.id)}
          title="Atamayı Kaldır"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  // Parent-Student Relations columns
  const parentStudentColumns = [
    { field: 'id', headerName: 'ID', width: 80 },
    {
      field: 'student',
      headerName: 'Öğrenci',
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => {
        const student = row?.student;
        return student ? `${student.full_name} (${student.student_number})` : 'Bilinmiyor';
      }
    },
    {
      field: 'parent',
      headerName: 'Veli',
      flex: 1,
      minWidth: 200,
      valueGetter: (value, row) => {
        const parent = row?.parent;
        return parent ? `${parent.full_name} (${parent.email || parent.phone_number})` : 'Bilinmiyor';
      }
    }
  ];

  if (canManageParentRelations) {
    parentStudentColumns.push({
      field: 'actions',
      headerName: 'İşlemler',
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          color="error"
          onClick={() => onDeleteParentStudent(params.row.id)}
          title="İlişkiyi Kaldır"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    });
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 2, borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Atamalar</Typography>
        <Button
          variant="contained"
          onClick={activeTab === 0 ? onAddStudentBus : onAddParentStudent}
          disabled={activeTab === 1 && !canManageParentRelations}
        >
          Yeni Atama
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={onTabChange} sx={{ mb: 2 }}>
        <Tab label="Öğrenci-Otobüs Atamaları" />
        <Tab label="Öğrenci-Veli İlişkileri" />
      </Tabs>

      {activeTab === 0 && (
        <DataGrid
          rows={studentBusAssignments}
          columns={studentBusColumns}
          disableSelectionOnClick
          hideFooter
          autoHeight
          sx={{ minWidth: 360 }}
        />
      )}

      {activeTab === 1 && (
        <DataGrid
          rows={parentStudentRelations}
          columns={parentStudentColumns}
          disableSelectionOnClick
          hideFooter
          autoHeight
          sx={{ minWidth: 360 }}
        />
      )}
    </Box>
  );
};

export default AssignmentsTable;
