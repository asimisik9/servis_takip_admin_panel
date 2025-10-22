import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Servis Takip Admin Paneli
        </Typography>
        <Button 
          color="inherit" 
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Çıkış Yap
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
