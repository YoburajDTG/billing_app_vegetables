import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import Invoices from './pages/Invoices';
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import useAuthStore from './store/useAuthStore';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/invoice/new" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateInvoice />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/invoices" element={
          <ProtectedRoute>
            <MainLayout>
              <Invoices />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/inventory" element={
          <ProtectedRoute>
            <MainLayout>
              <Inventory />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
