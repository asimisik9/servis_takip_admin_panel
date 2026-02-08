import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Students from '../pages/Students';
import Schools from '../pages/Schools';
import Buses from '../pages/Buses';
import Assignments from '../pages/Assignments';
import Organizations from '../pages/Organizations';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoute';
import { getToken, getUser } from '../services/authService';

const PublicRoute = ({ children }) => {
  const token = getToken();
  return !token ? children : <Navigate to="/" replace />;
};

const SuperAdminRoute = ({ children }) => {
  const user = getUser();
  return user?.role === 'super_admin' ? children : <Navigate to="/" replace />;
};

const ProtectedLayout = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />

      <Route element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/organizations" element={<SuperAdminRoute><Organizations /></SuperAdminRoute>} />
        <Route path="/users" element={<Users />} />
        <Route path="/students" element={<Students />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/buses" element={<Buses />} />
        <Route path="/assignments" element={<Assignments />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
