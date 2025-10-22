import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Students from '../pages/Students';
import Schools from '../pages/Schools';
import Buses from '../pages/Buses';
import Assignments from '../pages/Assignments';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => (
  <Router>
    <MainLayout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute><Students /></PrivateRoute>} />
        <Route path="/schools" element={<PrivateRoute><Schools /></PrivateRoute>} />
        <Route path="/buses" element={<PrivateRoute><Buses /></PrivateRoute>} />
        <Route path="/assignments" element={<PrivateRoute><Assignments /></PrivateRoute>} />
      </Routes>
    </MainLayout>
  </Router>
);

export default AppRoutes;
