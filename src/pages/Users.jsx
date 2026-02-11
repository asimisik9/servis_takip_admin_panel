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
  TablePagination,
  TextField,
  MenuItem
} from '@mui/material';

const extractApiErrorMessage = (error, fallbackMessage) => {
  const detail = error?.response?.data?.detail;
  if (!detail) {
    return fallbackMessage;
  }
  if (typeof detail === 'string') {
    return detail;
  }
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean);
    return messages.length > 0 ? messages.join(' | ') : fallbackMessage;
  }
  if (typeof detail === 'object') {
    return detail.message || fallbackMessage;
  }
  return fallbackMessage;
};

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
  const [organizationFilter, setOrganizationFilter] = useState('');

  const loadOrganizations = useCallback(async () => {
    if (!isSuperAdmin) {
      setOrganizations([]);
      return;
    }

    try {
      const orgs = await fetchAllOrganizations();
      setOrganizations(orgs || []);
    } catch {
      setOrganizations([]);
    }
  }, [isSuperAdmin]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const skip = page * rowsPerPage;
      const data = await fetchUsers(skip, rowsPerPage, organizationFilter || null);
      setUsers(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: extractApiErrorMessage(error, 'Kullanıcılar yüklenemedi!'),
        severity: 'error'
      });
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, organizationFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

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

  const handleAddUser = () => {
    setEditingUser(null);
    if (isSuperAdmin && organizations.length === 0) {
      loadOrganizations();
    }
    setModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    if (isSuperAdmin && organizations.length === 0) {
      loadOrganizations();
    }
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
        message: extractApiErrorMessage(error, 'Kullanıcı silinemedi!'),
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
      const errorMessage = extractApiErrorMessage(
        error,
        editingUser ? 'Kullanıcı güncellenemedi!' : 'Kullanıcı eklenemedi!'
      );
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
