import React, { useEffect, useState } from 'react';
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
  Button
} from '@mui/material';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, studentId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.detail || 'Öğrenciler yüklenemedi!', 
        severity: 'error' 
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSchools = async () => {
    try {
      const data = await fetchSchools();
      setSchools(data);
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
  }, []);

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

  if (loading) {
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
