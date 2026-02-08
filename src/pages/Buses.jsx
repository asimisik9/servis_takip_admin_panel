import React, { useEffect, useState, useCallback } from 'react';
import BusesTable from '../components/BusesTable';
import BusFormModal from '../components/BusFormModal';
import { fetchBuses, createBus, updateBus, deleteBus } from '../services/busService';
import { fetchSchools } from '../services/schoolService';
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
  Button,
  TablePagination
} from '@mui/material';

const Buses = () => {
  const [buses, setBuses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, busId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const loadBuses = useCallback(async () => {
    setLoading(true);
    try {
      const skip = page * rowsPerPage;
      const data = await fetchBuses(skip, rowsPerPage);
      setBuses(data.items || []);
      setTotalCount(data.total || 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Otobüsler yüklenemedi!',
        severity: 'error'
      });
      setBuses([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  const loadSchools = async () => {
    try {
      const data = await fetchSchools(0, 1000);
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

  const loadDrivers = async () => {
    try {
      const data = await fetchUsers(0, 1000);
      setDrivers(data.items || []);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Şoförler yüklenemedi!',
        severity: 'warning'
      });
      setDrivers([]);
    }
  };

  useEffect(() => {
    loadBuses();
    loadSchools();
    loadDrivers();
  }, [loadBuses]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddBus = () => {
    setEditingBus(null);
    setModalOpen(true);
  };

  const handleEditBus = (bus) => {
    setEditingBus(bus);
    setModalOpen(true);
  };

  const handleDeleteBus = (busId) => {
    setDeleteDialog({ open: true, busId });
  };

  const confirmDelete = async () => {
    try {
      await deleteBus(deleteDialog.busId);
      setSnackbar({ open: true, message: 'Otobüs başarıyla silindi!', severity: 'success' });
      loadBuses();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.detail || 'Otobüs silinemedi!',
        severity: 'error'
      });
    } finally {
      setDeleteDialog({ open: false, busId: null });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingBus(null);
  };

  const handleBusSubmit = async (formData) => {
    try {
      if (editingBus) {
        await updateBus(editingBus.id, formData);
        setSnackbar({ open: true, message: 'Otobüs başarıyla güncellendi!', severity: 'success' });
      } else {
        await createBus(formData);
        setSnackbar({ open: true, message: 'Otobüs başarıyla eklendi!', severity: 'success' });
      }
      setModalOpen(false);
      setEditingBus(null);
      loadBuses();
    } catch (error) {
      const errorMessage = error.response?.data?.detail ||
        (editingBus ? 'Otobüs güncellenemedi!' : 'Otobüs eklenemedi!');
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && buses.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <BusesTable
        buses={buses}
        schools={schools}
        drivers={drivers}
        onAdd={handleAddBus}
        onEdit={handleEditBus}
        onDelete={handleDeleteBus}
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

      <BusFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSubmit={handleBusSubmit}
        initialData={editingBus}
        schools={schools}
        drivers={drivers}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, busId: null })}
      >
        <DialogTitle>Otobüsü Sil</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu otobüsü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, busId: null })}>
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

export default Buses;
