import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Chip, Alert, Typography } from '@mui/material';
import LiveMap from './LiveMap';
import useBusLocation from '../hooks/useBusLocation';

const BusLocationModal = ({ open, onClose, bus }) => {
  const { location, isConnected, connect, disconnect } = useBusLocation(bus?.id);

  useEffect(() => {
    if (open && bus?.id) {
      connect();
    }

    return () => {
      if (open) {
        disconnect();
      }
    };
  }, [open, bus?.id, connect, disconnect]);

  if (!open || !bus) return null;

  // LiveMap obje formatında busLocations bekliyor: { busId: location }
  const busLocations = location ? { [bus.id]: location } : {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {bus.plate_number} - Canlı Konum
          </Typography>
          <Chip 
            label={isConnected ? 'Bağlı' : 'Bağlantı Yok'} 
            color={isConnected ? 'success' : 'error'}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        {location ? (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Son Güncelleme: {new Date(location.timestamp).toLocaleString('tr-TR')}
              <br />
              Enlem: {location.latitude.toFixed(6)}, Boylam: {location.longitude.toFixed(6)}
            </Alert>
            <Box sx={{ height: '500px', width: '100%' }}>
              <LiveMap busLocations={busLocations} />
            </Box>
          </Box>
        ) : (
          <Box sx={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Alert severity="warning">
              {isConnected 
                ? 'Konum verisi bekleniyor...' 
                : 'Bağlantı kuruluyor...'}
            </Alert>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Kapat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusLocationModal;
