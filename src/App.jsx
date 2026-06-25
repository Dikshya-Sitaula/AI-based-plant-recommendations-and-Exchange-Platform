import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NurseryAuth from './pages/NurseryAuth';
import NurseryDashboard from './pages/NurseryDashboard';
import NurseryProducts from './pages/NurseryProducts';
import NurseryProductForm from './pages/NurseryProductForm';
import NurserySales from './pages/NurserySales';
import NurseryTrending from './pages/NurseryTrending';
import NurseryProfile from './pages/NurseryProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminNurseries from './pages/AdminNurseries';
import AdminProducts from './pages/AdminProducts';
import AdminTrending from './pages/AdminTrending';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/nursery/signin" replace />} />

        {/* Nursery Routes */}
        <Route path="/nursery/signin" element={<NurseryAuth />} />
        <Route path="/nursery/signup" element={<NurseryAuth />} />
        <Route path="/nursery/dashboard" element={<NurseryDashboard />} />
        <Route path="/nursery/products" element={<NurseryProducts />} />
        <Route path="/nursery/products/add" element={<NurseryProductForm />} />
        <Route path="/nursery/products/:id/edit" element={<NurseryProductForm />} />
        <Route path="/nursery/orders" element={<NurserySales />} />
        <Route path="/nursery/sales-report" element={<NurserySales />} />
        <Route path="/nursery/trending-products" element={<NurseryTrending />} />
        <Route path="/nursery/profile" element={<NurseryProfile />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/nurseries" element={<AdminNurseries />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/trending-products" element={<AdminTrending />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;