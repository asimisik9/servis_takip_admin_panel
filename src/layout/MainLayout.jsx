import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Box, Toolbar } from '@mui/material';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', width: '100vw' }}>
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          minHeight: '100vh',
          bgcolor: 'background.paper',
          mt: 8, // AppBar yüksekliği kadar boşluk bırak
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
