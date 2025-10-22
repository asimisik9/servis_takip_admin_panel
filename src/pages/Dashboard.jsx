import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Card,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MapIcon from '@mui/icons-material/Map';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LiveMap from '../components/LiveMap';
import useBusLocation from '../hooks/useBusLocation';
import { fetchBuses } from '../services/busService';

const Dashboard = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [testLocation, setTestLocation] = useState({
    latitude: '39.9334', // Ankara
    longitude: '32.8597'
  });
  
  // Tüm otobüslerin konumlarını tutmak için state
  const [busLocations, setBusLocations] = useState({});
  
  // Seçili otobüs için WebSocket bağlantısı
  const { location, isConnected, connect, disconnect, sendLocation } = useBusLocation(selectedBusId);

  // Otobüsleri yükle
  useEffect(() => {
    const loadBuses = async () => {
      try {
        const data = await fetchBuses();
        setBuses(data);
        if (data.length > 0) {
          setSelectedBusId(data[0].id);
        }
      } catch (error) {
        console.error('Otobüsler yüklenemedi:', error);
      }
    };
    loadBuses();
  }, []);

  // Seçili otobüs değiştiğinde WebSocket'i yönet
  useEffect(() => {
    if (selectedBusId) {
      connect();
    }
    return () => disconnect();
  }, [selectedBusId, connect, disconnect]);

  // Seçili otobüsün konumu güncellendiğinde haritadaki konumu güncelle
  useEffect(() => {
    if (location && selectedBusId) {
      setBusLocations(prev => ({
        ...prev,
        [selectedBusId]: location
      }));
    }
  }, [location, selectedBusId]);

  const handleSendLocation = () => {
    const lat = parseFloat(testLocation.latitude);
    const lng = parseFloat(testLocation.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Geçerli koordinatlar girin!');
      return;
    }
    
    if (sendLocation(lat, lng)) {
      console.log('Konum gönderildi:', { lat, lng });
    }
  };

  const handleRandomLocation = () => {
    // Ankara çevresinde rastgele konum üret
    const baseLatitude = 39.9334;
    const baseLongitude = 32.8597;
    const randomLat = baseLatitude + (Math.random() - 0.5) * 0.1;
    const randomLng = baseLongitude + (Math.random() - 0.5) * 0.1;
    
    setTestLocation({
      latitude: randomLat.toFixed(6),
      longitude: randomLng.toFixed(6)
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        <MapIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Canlı Otobüs Takip - Test Paneli
      </Typography>

      <Grid container spacing={3}>
        {/* Harita */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Canlı Harita
            </Typography>
            <LiveMap busLocations={busLocations} />
          </Paper>
        </Grid>

        {/* Kontrol Paneli */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <DirectionsBusIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
                Test Kontrolü
              </Typography>

              {/* Otobüs Seçimi */}
              <TextField
                select
                fullWidth
                label="Otobüs Seç"
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.plate_number}
                  </option>
                ))}
              </TextField>

              {/* Bağlantı Durumu */}
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={isConnected ? 'Bağlı' : 'Bağlantı Yok'} 
                  color={isConnected ? 'success' : 'error'}
                  size="small"
                />
              </Box>

              {/* Koordinat Girişi */}
              <TextField
                fullWidth
                label="Enlem (Latitude)"
                value={testLocation.latitude}
                onChange={(e) => setTestLocation({ ...testLocation, latitude: e.target.value })}
                type="number"
                inputProps={{ step: 0.000001 }}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Boylam (Longitude)"
                value={testLocation.longitude}
                onChange={(e) => setTestLocation({ ...testLocation, longitude: e.target.value })}
                type="number"
                inputProps={{ step: 0.000001 }}
                sx={{ mb: 2 }}
              />

              {/* Butonlar */}
              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={handleSendLocation}
                  disabled={!isConnected}
                  startIcon={<SendIcon />}
                >
                  Konum Gönder
                </Button>
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  onClick={handleRandomLocation}
                >
                  Rastgele Konum
                </Button>
              </Box>

              {/* Son Konum Bilgisi */}
              {location && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Son Konum:</strong>
                  <br />
                  Enlem: {location.latitude?.toFixed(6)}
                  <br />
                  Boylam: {location.longitude?.toFixed(6)}
                  <br />
                  Zaman: {new Date(location.timestamp).toLocaleTimeString('tr-TR')}
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Kullanım Talimatları */}
          <Card>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                📍 Nasıl Kullanılır?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                1. Listeden bir otobüs seçin
                <br />
                2. Koordinatları girin veya "Rastgele Konum" butonunu kullanın
                <br />
                3. "Konum Gönder" butonuna tıklayın
                <br />
                4. Haritada otobüsün konumunu canlı olarak görün
                <br />
                <br />
                💡 Aynı otobüs için birden fazla sekme açarak gerçek zamanlı senkronizasyonu test edebilirsiniz!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
