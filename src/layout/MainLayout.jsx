import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        width: '100vw',
      }}
    >
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          pt: { xs: 9, sm: 10 }, // AppBar height + spacing
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          transition: 'all 0.3s ease',
        }}
      >
        <Container
          maxWidth="xl"
          disableGutters={isMobile}
          sx={{
            height: '100%',
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
