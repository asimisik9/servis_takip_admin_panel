import React, { useEffect, useState, useCallback } from 'react';
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
import { getUser } from '../services/authService';

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

const Assignments = () => {
  const currentUser = getUser();
  const canManageParentRelations = !(
    currentUser?.role === 'admin' &&
    currentUser?.organization?.type === 'transport_company'
  );

  const [studentBusAssignments, setStudentBusAssignments] = useState([]);
  const [parentStudentRelations, setParentStudentRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: null, id: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Tab state
  const [activeTab, setActiveTab] = useState(0);

  // Pagination state for student-bus
  const [sbPage, setSbPage] = useState(0);
  const [sbRowsPerPage, setSbRowsPerPage] = useState(20);
  const [sbTotal, setSbTotal] = useState(0);

  // Pagination state for parent-student
  const [psPage, setPsPage] = useState(0);
  const [psRowsPerPage, setPsRowsPerPage] = useState(20);
  const [psTotal, setPsTotal] = useState(0);

  const loadStudentBusAssignments = useCallback(async () => {
    try {
      const skip = sbPage * sbRowsPerPage;
      const data = await fetchStudentBusAssignments(skip, sbRowsPerPage);
      setStudentBusAssignments(data.items || []);
      setSbTotal(data.total || 0);
    } catch (error) {
      console.error('Error loading student-bus assignments:', error);
      setStudentBusAssignments([]);
    }
  }, [sbPage, sbRowsPerPage]);

  const loadParentStudentRelations = useCallback(async () => {
    try {
      const skip = psPage * psRowsPerPage;
      const data = await fetchParentStudentRelations(skip, psRowsPerPage);
      setParentStudentRelations(data.items || []);
      setPsTotal(data.total || 0);
    } catch (error) {
      console.error('Error loading parent-student relations:', error);
      setParentStudentRelations([]);
    }
  }, [psPage, psRowsPerPage]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([
        loadStudentBusAssignments(),
        loadParentStudentRelations()
      ]);
      setLoading(false);
    };
    loadAll();
  }, [loadStudentBusAssignments, loadParentStudentRelations]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSbChangePage = (event, newPage) => {
    setSbPage(newPage);
  };

  const handleSbChangeRowsPerPage = (event) => {
    setSbRowsPerPage(parseInt(event.target.value, 10));
    setSbPage(0);
  };

  const handlePsChangePage = (event, newPage) => {
    setPsPage(newPage);
  };

  const handlePsChangeRowsPerPage = (event) => {
    setPsRowsPerPage(parseInt(event.target.value, 10));
    setPsPage(0);
  };

  const handleAddAssignment = () => {
    if (activeTab === 1 && !canManageParentRelations) {
      setSnackbar({
        open: true,
        message: 'Taşıma şirketi adminleri öğrenci-veli ilişkisi oluşturamaz.',
        severity: 'warning'
      });
      return;
    }
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
        loadStudentBusAssignments();
      } else {
        if (!canManageParentRelations) {
          setSnackbar({
            open: true,
            message: 'Taşıma şirketi adminleri öğrenci-veli ilişkisi oluşturamaz.',
            severity: 'warning'
          });
          return;
        }
        await assignParentToStudent(formData.student_id, formData.parent_id);
        setSnackbar({ open: true, message: 'Öğrenci-Veli ilişkisi başarıyla oluşturuldu!', severity: 'success' });
        loadParentStudentRelations();
      }
      setModalOpen(false);
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
        loadStudentBusAssignments();
      } else {
        if (!canManageParentRelations) {
          setSnackbar({
            open: true,
            message: 'Taşıma şirketi adminleri öğrenci-veli ilişkisi silemez.',
            severity: 'warning'
          });
          return;
        }
        await deleteParentStudentRelation(deleteDialog.id);
        setSnackbar({ open: true, message: 'İlişki başarıyla kaldırıldı!', severity: 'success' });
        loadParentStudentRelations();
      }
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

  return (
    <>
      <AssignmentsTable
        studentBusAssignments={studentBusAssignments}
        parentStudentRelations={parentStudentRelations}
        onAddStudentBus={handleAddAssignment}
        onAddParentStudent={handleAddAssignment}
        onDeleteStudentBus={handleDeleteStudentBus}
        onDeleteParentStudent={handleDeleteParentStudent}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        canManageParentRelations={canManageParentRelations}
      />

      {/* Pagination for current tab */}
      <TablePagination
        component="div"
        count={activeTab === 0 ? sbTotal : psTotal}
        page={activeTab === 0 ? sbPage : psPage}
        onPageChange={activeTab === 0 ? handleSbChangePage : handlePsChangePage}
        rowsPerPage={activeTab === 0 ? sbRowsPerPage : psRowsPerPage}
        onRowsPerPageChange={activeTab === 0 ? handleSbChangeRowsPerPage : handlePsChangeRowsPerPage}
        rowsPerPageOptions={[10, 20, 50, 100]}
        labelRowsPerPage="Sayfa başına satır:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
      />

      <AssignmentModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleAssignmentSubmit}
        canCreateParentRelation={canManageParentRelations}
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
