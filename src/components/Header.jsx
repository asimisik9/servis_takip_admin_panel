import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../services/authService';

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = getUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <IconButton
          edge="start"
          aria-label="menu"
          sx={{
            mr: 2,
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(24, 161, 216, 0.08)',
            }
          }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #073662 0%, #18A1D8 100%)',
              mr: 1.5,
            }}
          >
            <DirectionsBusIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                lineHeight: 1.2,
                fontSize: { xs: '0.9rem', sm: '1.1rem' }
              }}
            >
              Servis Takip
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' },
                lineHeight: 1
              }}
            >
              Admin Paneli
            </Typography>
          </Box>
        </Box>

        {/* User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMobile && user && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                mr: 1
              }}
            >
              {user.full_name || user.email}
            </Typography>
          )}

          <IconButton
            size="large"
            onClick={handleMenu}
            sx={{
              p: 0.5,
              border: '2px solid',
              borderColor: 'primary.light',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: 'secondary.main',
                transform: 'scale(1.05)',
              }
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.main',
                background: 'linear-gradient(135deg, #073662 0%, #1a5a9c 100%)',
              }}
            >
              <PersonIcon fontSize="small" />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                overflow: 'visible',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 20,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {user && (
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user.full_name || 'Kullanıcı'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
            )}
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: 'error.main',
                gap: 1.5,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 72, 66, 0.08)',
                }
              }}
            >
              <LogoutIcon fontSize="small" />
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
