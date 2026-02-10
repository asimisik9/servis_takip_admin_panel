import React, { useEffect, useState, useCallback } from 'react';
import StudentsTable from '../components/StudentsTable';
import StudentFormModal from '../components/StudentFormModal';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '../services/studentService';
import { fetchSchools } from '../services/schoolService';
import {
  CircularProgress,
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TablePagination
} from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, studentId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    try {
      const skip = page * rowsPerPage;
      const data = await fetchStudents(skip, rowsPerPage);
      setStudents(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Öğrenciler yüklenemedi!',
        severity: 'error'
      });
      setStudents([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  const loadSchools = async () => {
    try {
      const data = await fetchSchools(0, 200);
      setSchools(data.items || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Okullar yüklenemedi!',
        severity: 'warning'
      });
      setSchools([]);
    }
  };

  useEffect(() => {
    loadStudents();
    loadSchools();
  }, [loadStudents]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleDeleteStudent = (studentId) => {
    setDeleteDialog({ open: true, studentId });
  };

  const confirmDelete = async () => {
    try {
      await deleteStudent(deleteDialog.studentId);
      setSnackbar({ open: true, message: 'Öğrenci başarıyla silindi!', severity: 'success' });
      loadStudents();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Öğrenci silinemedi!',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, studentId: null });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingStudent(null);
  };

  const handleStudentSubmit = async (formData) => {
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, formData);
        setSnackbar({ open: true, message: 'Öğrenci başarıyla güncellendi!', severity: 'success' });
      } else {
        await createStudent(formData);
        setSnackbar({ open: true, message: 'Öğrenci başarıyla eklendi!', severity: 'success' });
      }
      setModalOpen(false);
      setEditingStudent(null);
      loadStudents();
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        (editingStudent ? 'Öğrenci güncellenemedi!' : 'Öğrenci eklenemedi!');
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && students.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <StudentsTable
        students={students}
        schools={schools}
        onAdd={handleAddStudent}
        onEdit={handleEditStudent}
        onDelete={handleDeleteStudent}
        loading={loading}
      />

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Sayfa başına satır:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
      />

      <StudentFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleStudentSubmit}
        initialData={editingStudent}
        schools={schools}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, studentId: null })}
      >
        <DialogTitle>Öğrenciyi Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu öğrenciyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, studentId: null })}>
            İptal
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Students;
