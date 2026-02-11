import React, { useEffect, useState, useCallback } from 'react';
import SchoolsTable from '../components/SchoolsTable';
import SchoolFormModal from '../components/SchoolFormModal';
import { fetchSchools, createSchool, updateSchool, deleteSchool } from '../services/schoolService';
import { fetchUsers } from '../services/userService';
import { fetchAllOrganizations } from '../services/organizationService';
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
  TablePagination,
  TextField,
  MenuItem
} from '@mui/material';

const Schools = () => {
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const [schools, setSchools] = useState([]);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, schoolId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [organizationFilter, setOrganizationFilter] = useState('');

  const loadSchools = useCallback(async () => {
    setLoading(true);
    try {
      const skip = page * rowsPerPage;
      const data = await fetchSchools(skip, rowsPerPage, organizationFilter || null);
      setSchools(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Okullar yüklenemedi!',
        severity: 'error'
      });
      setSchools([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, organizationFilter]);

  const loadUsers = useCallback(async () => {
    try {
      const userOrgFilter = isSuperAdmin ? null : (organizationFilter || null);
      const data = await fetchUsers(0, 200, userOrgFilter);
      setUsers(data.items || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Kullanıcılar yüklenemedi!',
        severity: 'warning'
      });
      setUsers([]);
    }
  }, [isSuperAdmin, organizationFilter]);

  useEffect(() => {
    loadSchools();
    loadUsers();
  }, [loadSchools, loadUsers]);

  useEffect(() => {
    if (!isSuperAdmin) {
      setOrganizations([]);
      return;
    }
    fetchAllOrganizations()
      .then((orgs) => setOrganizations(orgs || []))
      .catch(() => setOrganizations([]));
  }, [isSuperAdmin]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOrganizationFilterChange = (event) => {
    setOrganizationFilter(event.target.value);
    setPage(0);
  };

  const handleAddSchool = () => {
    setEditingSchool(null);
    setModalOpen(true);
  };

  const handleEditSchool = (school) => {
    setEditingSchool(school);
    setModalOpen(true);
  };

  const handleDeleteSchool = (schoolId) => {
    setDeleteDialog({ open: true, schoolId });
  };

  const confirmDelete = async () => {
    try {
      await deleteSchool(deleteDialog.schoolId);
      setSnackbar({ open: true, message: 'Okul başarıyla silindi!', severity: 'success' });
      loadSchools();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Okul silinemedi!',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, schoolId: null });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingSchool(null);
  };

  const handleSchoolSubmit = async (formData) => {
    try {
      if (editingSchool) {
        await updateSchool(editingSchool.id, formData);
        setSnackbar({ open: true, message: 'Okul başarıyla güncellendi!', severity: 'success' });
      } else {
        await createSchool(formData);
        setSnackbar({ open: true, message: 'Okul başarıyla eklendi!', severity: 'success' });
      }
      setModalOpen(false);
      setEditingSchool(null);
      loadSchools();
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        (editingSchool ? 'Okul güncellenemedi!' : 'Okul eklenemedi!');
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && schools.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {isSuperAdmin && (
        <Box sx={{ mb: 2, maxWidth: 420 }}>
          <TextField
            select
            fullWidth
            label="Organizasyona Göre Filtrele"
            value={organizationFilter}
            onChange={handleOrganizationFilterChange}
          >
            <MenuItem value="">Tümü</MenuItem>
            {organizations.map((org) => (
              <MenuItem key={org.id} value={org.id}>
                {org.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      <SchoolsTable
        schools={schools}
        users={users}
        onAdd={handleAddSchool}
        onEdit={handleEditSchool}
        onDelete={handleDeleteSchool}
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

      <SchoolFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleSchoolSubmit}
        initialData={editingSchool}
        users={users}
        organizations={organizations}
        isSuperAdmin={isSuperAdmin}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, schoolId: null })}
      >
        <DialogTitle>Okulu Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu okulu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, schoolId: null })}>
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

export default Schools;
