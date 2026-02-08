import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Button,
    Typography,
    Box,
    Chip,
    Tooltip
} from '@mui/material';
import { Edit, Delete, Add, Business, LocalShipping } from '@mui/icons-material';

const OrganizationsTable = ({ organizations, onAdd, onEdit, onDelete, loading }) => {
    const getTypeLabel = (type) => {
        switch (type) {
            case 'school':
                return { label: 'Okul', color: 'primary', icon: <Business fontSize="small" /> };
            case 'transport_company':
                return { label: 'Taşıma Şirketi', color: 'secondary', icon: <LocalShipping fontSize="small" /> };
            default:
                return { label: type, color: 'default', icon: null };
        }
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                    Organizasyonlar
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={onAdd}
                >
                    Organizasyon Ekle
                </Button>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ad</TableCell>
                            <TableCell>Tip</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {organizations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Henüz organizasyon bulunmamaktadır.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            organizations.map((org) => {
                                const typeInfo = getTypeLabel(org.type);
                                return (
                                    <TableRow key={org.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {org.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                icon={typeInfo.icon}
                                                label={typeInfo.label}
                                                color={typeInfo.color}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={org.is_active ? 'Aktif' : 'Pasif'}
                                                color={org.is_active ? 'success' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Düzenle">
                                                <IconButton size="small" onClick={() => onEdit(org)} color="primary">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Sil">
                                                <IconButton size="small" onClick={() => onDelete(org.id)} color="error">
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default OrganizationsTable;
