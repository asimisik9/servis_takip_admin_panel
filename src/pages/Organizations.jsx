import React, { useEffect, useState, useCallback } from 'react';
import OrganizationsTable from '../components/OrganizationsTable';
import OrganizationFormModal from '../components/OrganizationFormModal';
import { fetchOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../services/organizationService';
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

const Organizations = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, orgId: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [totalCount, setTotalCount] = useState(0);

    const loadOrganizations = useCallback(async () => {
        setLoading(true);
        try {
            const skip = page * rowsPerPage;
            const data = await fetchOrganizations(skip, rowsPerPage);
            setOrganizations(data.items || []);
            setTotalCount(data.total || 0);
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.detail || 'Organizasyonlar yüklenemedi!',
                severity: 'error'
            });
            setOrganizations([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage]);

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

    const handleAddOrg = () => {
        setEditingOrg(null);
        setModalOpen(true);
    };

    const handleEditOrg = (org) => {
        setEditingOrg(org);
        setModalOpen(true);
    };

    const handleDeleteOrg = (orgId) => {
        setDeleteDialog({ open: true, orgId });
    };

    const confirmDelete = async () => {
        try {
            await deleteOrganization(deleteDialog.orgId);
            setSnackbar({ open: true, message: 'Organizasyon başarıyla silindi!', severity: 'success' });
            loadOrganizations();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.detail || 'Organizasyon silinemedi!',
                severity: 'error'
            });
        } finally {
            setDeleteDialog({ open: false, orgId: null });
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingOrg(null);
    };

    const handleOrgSubmit = async (formData) => {
        try {
            if (editingOrg) {
                await updateOrganization(editingOrg.id, formData);
                setSnackbar({ open: true, message: 'Organizasyon başarıyla güncellendi!', severity: 'success' });
            } else {
                await createOrganization(formData);
                setSnackbar({ open: true, message: 'Organizasyon başarıyla eklendi!', severity: 'success' });
            }
            setModalOpen(false);
            setEditingOrg(null);
            loadOrganizations();
        } catch (error) {
            const errorMessage = error.response?.data?.detail ||
                (editingOrg ? 'Organizasyon güncellenemedi!' : 'Organizasyon eklenemedi!');
            setSnackbar({ open: true, message: errorMessage, severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading && organizations.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <OrganizationsTable
                organizations={organizations}
                onAdd={handleAddOrg}
                onEdit={handleEditOrg}
                onDelete={handleDeleteOrg}
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

            <OrganizationFormModal
                open={modalOpen}
                onClose={handleModalClose}
                onSubmit={handleOrgSubmit}
                initialData={editingOrg}
            />

            <Dialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog({ open: false, orgId: null })}
            >
                <DialogTitle>Organizasyonu Sil</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bu organizasyonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, orgId: null })}>
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

export default Organizations;
