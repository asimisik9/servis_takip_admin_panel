import React, { useEffect, useState, useCallback } from 'react';
import UsersTable from '../components/UsersTable';
import UserFormModal from '../components/UserFormModal';
import { fetchUsers, createUser, updateUser, deleteUser } from '../services/userService';
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
  TablePagination
} from '@mui/material';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const currentUser = getUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const skip = page * rowsPerPage;
      const data = await fetchUsers(skip, rowsPerPage);
      setUsers(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Kullanıcılar yüklenemedi!',
        severity: 'error'
      });
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    loadUsers();
    if (isSuperAdmin) {
      fetchAllOrganizations()
        .then(orgs => setOrganizations(orgs))
        .catch(() => setOrganizations([]));
    }
  }, [loadUsers]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setDeleteDialog({ open: true, userId });
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deleteDialog.userId);
      setSnackbar({ open: true, message: 'Kullanıcı başarıyla silindi!', severity: 'success' });
      loadUsers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Kullanıcı silinemedi!',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, userId: null });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  const handleUserSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        setSnackbar({ open: true, message: 'Kullanıcı başarıyla güncellendi!', severity: 'success' });
      } else {
        await createUser(formData);
        setSnackbar({ open: true, message: 'Kullanıcı başarıyla eklendi!', severity: 'success' });
      }
      setModalOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        (editingUser ? 'Kullanıcı güncellenemedi!' : 'Kullanıcı eklenemedi!');
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <UsersTable
        users={users}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
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

      <UserFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleUserSubmit}
        initialData={editingUser}
        organizations={organizations}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userId: null })}
      >
        <DialogTitle>Kullanıcıyı Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userId: null })}>
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

export default Users;
