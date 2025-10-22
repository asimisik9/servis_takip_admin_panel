import React, { useEffect, useState } from 'react';
import AssignmentsTable from '../components/AssignmentsTable';
import AssignmentModal from '../components/AssignmentModal';
import {
  fetchStudentBusAssignments,
  fetchParentStudentRelations,
  assignBusToStudent,
  assignParentToStudent,
  deleteStudentBusAssignment,
  deleteParentStudentRelation
} from '../services/assignmentService';
import { fetchStudents } from '../services/studentService';
import { fetchBuses } from '../services/busService';
import { fetchUsers } from '../services/userService';
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

const Assignments = () => {
  const [studentBusAssignments, setStudentBusAssignments] = useState([]);
  const [parentStudentRelations, setParentStudentRelations] = useState([]);
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        studentBusData,
        parentStudentData,
        studentsData,
        busesData,
        usersData
      ] = await Promise.all([
        fetchStudentBusAssignments(),
        fetchParentStudentRelations(),
        fetchStudents(),
        fetchBuses(),
        fetchUsers()
      ]);

      setStudentBusAssignments(studentBusData);
      setParentStudentRelations(parentStudentData);
      setStudents(studentsData);
      setBuses(busesData);
      setUsers(usersData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Veriler yüklenemedi!',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddAssignment = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAssignmentSubmit = async (assignmentType, formData) => {
    try {
      if (assignmentType === 'student-bus') {
        await assignBusToStudent(formData.student_id, formData.bus_id);
        setSnackbar({ open: true, message: 'Öğrenci-Otobüs ataması başarıyla yapıldı!', severity: 'success' });
      } else {
        await assignParentToStudent(formData.student_id, formData.parent_id);
        setSnackbar({ open: true, message: 'Öğrenci-Veli ilişkisi başarıyla oluşturuldu!', severity: 'success' });
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Atama yapılamadı!';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleDeleteStudentBus = (assignmentId) => {
    setDeleteDialog({ open: true, type: 'student-bus', id: assignmentId });
  };

  const handleDeleteParentStudent = (relationId) => {
    setDeleteDialog({ open: true, type: 'parent-student', id: relationId });
  };

  const confirmDelete = async () => {
    try {
      if (deleteDialog.type === 'student-bus') {
        await deleteStudentBusAssignment(deleteDialog.id);
        setSnackbar({ open: true, message: 'Atama başarıyla kaldırıldı!', severity: 'success' });
      } else {
        await deleteParentStudentRelation(deleteDialog.id);
        setSnackbar({ open: true, message: 'İlişki başarıyla kaldırıldı!', severity: 'success' });
      }
      loadData();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Silme işlemi başarısız!',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, type: null, id: null });
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

  // Sadece veli rolündeki kullanıcıları filtrele
  const parents = users.filter(user => user.role === 'veli');

  return (
    <>
      <AssignmentsTable
        studentBusAssignments={studentBusAssignments}
        parentStudentRelations={parentStudentRelations}
        students={students}
        buses={buses}
        users={users}
        onAddStudentBus={handleAddAssignment}
        onAddParentStudent={handleAddAssignment}
        onDeleteStudentBus={handleDeleteStudentBus}
        onDeleteParentStudent={handleDeleteParentStudent}
      />

      <AssignmentModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleAssignmentSubmit}
        students={students}
        buses={buses}
        parents={parents}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: null, id: null })}
      >
        <DialogTitle>
          {deleteDialog.type === 'student-bus' ? 'Atamayı Kaldır' : 'İlişkiyi Kaldır'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu {deleteDialog.type === 'student-bus' ? 'atamayı' : 'ilişkiyi'} kaldırmak istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: null, id: null })}>
            İptal
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Kaldır
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

export default Assignments;
