import React, { useCallback, useEffect, useMemo, useState } from 'react';
import OrganizationsTable from '../components/OrganizationsTable';
import OrganizationFormModal from '../components/OrganizationFormModal';
import {
  fetchOrganizations,
  fetchAllOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  fetchContracts,
  createContract,
  terminateContract,
} from '../services/organizationService';
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
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';

const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

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

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [contracts, setContracts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [contractsLoading, setContractsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, orgId: null });
  const [terminateDialog, setTerminateDialog] = useState({ open: false, contractId: null });

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [activeContractsOnly, setActiveContractsOnly] = useState(true);
  const [contractForm, setContractForm] = useState({
    school_org_id: '',
    company_org_id: '',
    start_date: getTodayIsoDate(),
    end_date: '',
  });

  const schoolOrganizations = useMemo(
    () => allOrganizations.filter((org) => org.type === 'school' && org.is_active !== false),
    [allOrganizations],
  );

  const companyOrganizations = useMemo(
    () => allOrganizations.filter((org) => org.type === 'transport_company' && org.is_active !== false),
    [allOrganizations],
  );

  const organizationNameMap = useMemo(() => {
    const map = new Map();
    allOrganizations.forEach((org) => map.set(org.id, org.name));
    return map;
  }, [allOrganizations]);

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
        message: extractApiErrorMessage(error, 'Organizasyonlar yüklenemedi!'),
        severity: 'error',
      });
      setOrganizations([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  const loadAllOrganizations = useCallback(async () => {
    try {
      const data = await fetchAllOrganizations();
      setAllOrganizations(data || []);
    } catch {
      setAllOrganizations([]);
      setSnackbar({
        open: true,
        message: 'Contract formu için organizasyonlar yüklenemedi.',
        severity: 'warning',
      });
    }
  }, []);

  const loadContracts = useCallback(async () => {
    setContractsLoading(true);
    try {
      const data = await fetchContracts({ activeOnly: activeContractsOnly, limit: 500 });
      setContracts(Array.isArray(data) ? data : []);
    } catch (error) {
      setContracts([]);
      setSnackbar({
        open: true,
        message: extractApiErrorMessage(error, 'Sözleşmeler yüklenemedi!'),
        severity: 'error',
      });
    } finally {
      setContractsLoading(false);
    }
  }, [activeContractsOnly]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  useEffect(() => {
    loadAllOrganizations();
  }, [loadAllOrganizations]);

  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  const resetContractForm = () => {
    setContractForm({
      school_org_id: '',
      company_org_id: '',
      start_date: getTodayIsoDate(),
      end_date: '',
    });
  };

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
      await Promise.all([loadOrganizations(), loadAllOrganizations(), loadContracts()]);
    } catch (error) {
      setSnackbar({
        open: true,
        message: extractApiErrorMessage(error, 'Organizasyon silinemedi!'),
        severity: 'error',
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
        const updatePayload = {
          name: formData.name,
          is_active: formData.is_active,
        };
        await updateOrganization(editingOrg.id, updatePayload);
        setSnackbar({ open: true, message: 'Organizasyon başarıyla güncellendi!', severity: 'success' });
      } else {
        const createPayload = {
          name: formData.name,
          type: formData.type,
        };
        if (formData.create_admin) {
          createPayload.admin = {
            full_name: formData.admin_full_name?.trim(),
            email: formData.admin_email?.trim(),
            phone_number: formData.admin_phone_number?.trim(),
            password: formData.admin_password,
          };
        }
        await createOrganization(createPayload);
        setSnackbar({ open: true, message: 'Organizasyon başarıyla eklendi!', severity: 'success' });
      }
      setModalOpen(false);
      setEditingOrg(null);
      await Promise.all([loadOrganizations(), loadAllOrganizations(), loadContracts()]);
    } catch (error) {
      const errorMessage = extractApiErrorMessage(
        error,
        editingOrg ? 'Organizasyon güncellenemedi!' : 'Organizasyon eklenemedi!',
      );
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleContractFieldChange = (event) => {
    const { name, value } = event.target;
    setContractForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateContract = async (event) => {
    event.preventDefault();

    if (!contractForm.school_org_id || !contractForm.company_org_id || !contractForm.start_date) {
      setSnackbar({
        open: true,
        message: 'Okul, taşıma şirketi ve başlangıç tarihi zorunludur.',
        severity: 'warning',
      });
      return;
    }

    if (contractForm.school_org_id === contractForm.company_org_id) {
      setSnackbar({
        open: true,
        message: 'Okul ve taşıma şirketi aynı organizasyon olamaz.',
        severity: 'warning',
      });
      return;
    }

    try {
      await createContract({
        school_org_id: contractForm.school_org_id,
        company_org_id: contractForm.company_org_id,
        start_date: contractForm.start_date,
        end_date: contractForm.end_date || null,
      });

      setSnackbar({ open: true, message: 'Sözleşme başarıyla oluşturuldu!', severity: 'success' });
      resetContractForm();
      await loadContracts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: extractApiErrorMessage(error, 'Sözleşme oluşturulamadı!'),
        severity: 'error',
      });
    }
  };

  const handleOpenTerminateDialog = (contractId) => {
    setTerminateDialog({ open: true, contractId });
  };

  const handleTerminateContract = async () => {
    try {
      await terminateContract(terminateDialog.contractId);
      setSnackbar({ open: true, message: 'Sözleşme sonlandırıldı.', severity: 'success' });
      await loadContracts();
    } catch (error) {
      setSnackbar({
        open: true,
        message: extractApiErrorMessage(error, 'Sözleşme sonlandırılamadı!'),
        severity: 'error',
      });
    } finally {
      setTerminateDialog({ open: false, contractId: null });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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

      <Paper sx={{ p: 2, mt: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <Box>
            <Typography variant="h6">Organizasyon Sözleşmeleri</Typography>
            <Typography variant="body2" color="text.secondary">
              Okul ve taşıma şirketi arasındaki aktif/pasif sözleşmeleri yönetin.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FormControlLabel
              control={(
                <Switch
                  checked={activeContractsOnly}
                  onChange={(event) => setActiveContractsOnly(event.target.checked)}
                />
              )}
              label="Sadece aktif"
            />
            <Button variant="outlined" onClick={loadContracts}>
              Yenile
            </Button>
          </Stack>
        </Stack>

        <Box component="form" onSubmit={handleCreateContract} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                required
                label="Okul Organizasyonu"
                name="school_org_id"
                value={contractForm.school_org_id}
                onChange={handleContractFieldChange}
              >
                {schoolOrganizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                required
                label="Taşıma Şirketi"
                name="company_org_id"
                value={contractForm.company_org_id}
                onChange={handleContractFieldChange}
              >
                {companyOrganizations.map((org) => (
                  <MenuItem key={org.id} value={org.id}>
                    {org.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                required
                type="date"
                label="Başlangıç"
                name="start_date"
                value={contractForm.start_date}
                onChange={handleContractFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Bitiş"
                name="end_date"
                value={contractForm.end_date}
                onChange={handleContractFieldChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button type="submit" variant="contained" fullWidth sx={{ height: '56px' }}>
                Sözleşme Ekle
              </Button>
            </Grid>
          </Grid>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Okul</TableCell>
                <TableCell>Taşıma Şirketi</TableCell>
                <TableCell>Başlangıç</TableCell>
                <TableCell>Bitiş</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell align="right">İşlem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contractsLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={20} />
                  </TableCell>
                </TableRow>
              ) : contracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Gösterilecek sözleşme bulunamadı.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                contracts.map((contract) => {
                  const schoolName = organizationNameMap.get(contract.school_org_id) || contract.school_org_id;
                  const companyName =
                    organizationNameMap.get(contract.company_org_id) || contract.company_org_id;

                  return (
                    <TableRow key={contract.id} hover>
                      <TableCell>{schoolName}</TableCell>
                      <TableCell>{companyName}</TableCell>
                      <TableCell>{contract.start_date || '-'}</TableCell>
                      <TableCell>{contract.end_date || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={contract.is_active ? 'Aktif' : 'Pasif'}
                          color={contract.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          disabled={!contract.is_active}
                          onClick={() => handleOpenTerminateDialog(contract.id)}
                        >
                          Sonlandır
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

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

      <Dialog
        open={terminateDialog.open}
        onClose={() => setTerminateDialog({ open: false, contractId: null })}
      >
        <DialogTitle>Sözleşmeyi Sonlandır</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bu sözleşmeyi sonlandırmak istediğinizden emin misiniz? Sonlandırılan sözleşme tekrar aktif edilmediği
            sürece yeni bus işlemleri bu eşleşmede engellenir.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTerminateDialog({ open: false, contractId: null })}>
            İptal
          </Button>
          <Button onClick={handleTerminateContract} color="error" variant="contained">
            Sonlandır
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
