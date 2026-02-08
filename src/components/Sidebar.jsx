import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  alpha
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../services/authService';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
    description: 'Genel bakış'
  },
];

// super_admin only items
const superAdminItems = [
  {
    text: 'Organizasyonlar',
    icon: <BusinessIcon />,
    path: '/organizations',
    description: 'Okul ve şirketler'
  },
];

// All admin items
const managementItems = [
  {
    text: 'Kullanıcılar',
    icon: <PeopleIcon />,
    path: '/users',
    description: 'Sistem kullanıcıları'
  },
  {
    text: 'Öğrenciler',
    icon: <GroupIcon />,
    path: '/students',
    description: 'Öğrenci listesi'
  },
  {
    text: 'Okullar',
    icon: <SchoolIcon />,
    path: '/schools',
    description: 'Kayıtlı okullar'
  },
  {
    text: 'Otobüsler',
    icon: <DirectionsBusIcon />,
    path: '/buses',
    description: 'Servis araçları'
  },
  {
    text: 'Atamalar',
    icon: <AssignmentIndIcon />,
    path: '/assignments',
    description: 'Öğrenci-servis atamaları'
  },
];

const Sidebar = ({ open, onClose }) => {
  const location = useLocation();
  const user = getUser();
  const isSuperAdmin = user?.role === 'super_admin';

  const renderMenuItem = (item) => {
    const isSelected = location.pathname === item.path;

    return (
      <ListItemButton
        key={item.text}
        component={Link}
        to={item.path}
        onClick={onClose}
        selected={isSelected}
        sx={{
          borderRadius: 2,
          mx: 1.5,
          mb: 0.5,
          py: 1.5,
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.12),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.16),
            },
            '& .MuiListItemIcon-root': {
              color: 'secondary.main',
            },
            '& .MuiListItemText-primary': {
              color: 'secondary.main',
              fontWeight: 600,
            },
          },
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
            transform: 'translateX(4px)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: isSelected ? 'secondary.main' : 'text.secondary',
            minWidth: 44,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          secondary={item.description}
          primaryTypographyProps={{
            fontWeight: isSelected ? 600 : 500,
            fontSize: '0.95rem',
          }}
          secondaryTypographyProps={{
            fontSize: '0.75rem',
            sx: { opacity: 0.7 }
          }}
        />
      </ListItemButton>
    );
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar />

      <Box sx={{ overflow: 'auto', py: 2 }}>
        {/* Dashboard */}
        <List>
          {menuItems.map(renderMenuItem)}
        </List>

        {/* Super Admin Only - Platform Yönetimi */}
        {isSuperAdmin && (
          <>
            <Box sx={{ px: 3, py: 1.5, mt: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  letterSpacing: 1.5,
                }}
              >
                Platform Yönetimi
              </Typography>
            </Box>
            <List>
              {superAdminItems.map(renderMenuItem)}
            </List>
          </>
        )}

        {/* Management Section - All Admins */}
        <Box sx={{ px: 3, py: 1.5, mt: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: 1.5,
            }}
          >
            {isSuperAdmin ? 'Kaynak Yönetimi' : 'Yönetim'}
          </Typography>
        </Box>
        <List>
          {managementItems.map(renderMenuItem)}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{
        mt: 'auto',
        p: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, rgba(7, 54, 98, 0.03) 0%, rgba(24, 161, 216, 0.03) 100%)',
      }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            textAlign: 'center',
          }}
        >
          Servis Takip v2.0
        </Typography>
        {isSuperAdmin && (
          <Typography
            variant="caption"
            sx={{
              color: 'secondary.main',
              display: 'block',
              textAlign: 'center',
              fontWeight: 600,
              mt: 0.5,
            }}
          >
            Super Admin
          </Typography>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
