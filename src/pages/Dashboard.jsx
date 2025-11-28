import React from 'react';
import { Box, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">
        Dashboard
      </Typography>
      <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
        Bu sayfa şu an boştur. Konum paylaşma işlemleri mobil uygulama üzerinden yapılmaktadır.
      </Typography>
    </Box>
  );
};

export default Dashboard;
