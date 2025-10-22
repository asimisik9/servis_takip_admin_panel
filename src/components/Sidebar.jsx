import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Kullanıcılar', icon: <PeopleIcon />, path: '/users' },
  { text: 'Öğrenciler', icon: <GroupIcon />, path: '/students' },
  { text: 'Okullar', icon: <SchoolIcon />, path: '/schools' },
  { text: 'Otobüsler', icon: <DirectionsBusIcon />, path: '/buses' },
  { text: 'Atamalar', icon: <AssignmentIndIcon />, path: '/assignments' },
];

const Sidebar = ({ open, onClose }) => (
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
      },
      display: { xs: 'block', sm: 'block' },
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto' }}>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} component={Link} to={item.path} onClick={onClose}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  </Drawer>
);

export default Sidebar;
