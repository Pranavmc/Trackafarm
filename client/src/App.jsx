import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';

import Layout from './components/Layout';
import Chatbot from './components/Chatbot';
import Dashboard from './pages/farmer/Dashboard';
import Livestock from './pages/farmer/Livestock';
import AnimalProfile from './pages/farmer/AnimalProfile';
import MilkLog from './pages/farmer/MilkLog';
import VetRecords from './pages/farmer/VetRecords';
import FeedLog from './pages/farmer/FeedLog';
import Reports from './pages/farmer/Reports';
import Forecast from './pages/farmer/Forecast';
import Finance from './pages/farmer/Finance';
import AdminDashboard from './pages/admin/AdminDashboard';
import ApprovalPanel from './pages/admin/ApprovalPanel';
import Profile from './pages/Profile';

import Marketplace from './pages/marketplace/Marketplace';
import Cart from './pages/marketplace/Cart';
import OrderDetails from './pages/marketplace/OrderDetails';
import SellerDashboard from './pages/marketplace/SellerDashboard';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Farmer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['farmer', 'vet', 'cooperative', 'seller', 'buyer']} />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/livestock" element={<Livestock />} />
                <Route path="/dashboard/livestock/:id" element={<AnimalProfile />} />
                <Route path="/dashboard/milk-logs" element={<MilkLog />} />
                <Route path="/dashboard/vet-records" element={<VetRecords />} />
                <Route path="/dashboard/feed-inventory" element={<FeedLog />} />
                <Route path="/dashboard/reports" element={<Reports />} />
                <Route path="/dashboard/strategy-hub" element={<Forecast />} />
                <Route path="/dashboard/finance" element={<Finance />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                
                {/* E-commerce Routes */}
                <Route path="/dashboard/marketplace" element={<Marketplace />} />
                <Route path="/dashboard/cart" element={<Cart />} />
                <Route path="/dashboard/orders/:id" element={<OrderDetails />} />
                <Route path="/dashboard/seller" element={<SellerDashboard />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route element={<Layout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/stats" element={<AdminDashboard />} />
                <Route path="/admin/approvals" element={<ApprovalPanel />} />
                <Route path="/admin/animals" element={<Livestock />} />
                <Route path="/admin/animals/:id" element={<AnimalProfile />} />
                <Route path="/admin/profile" element={<Profile />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Chatbot />
        </CartProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
