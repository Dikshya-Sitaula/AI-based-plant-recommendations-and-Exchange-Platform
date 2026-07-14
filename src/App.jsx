import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import NurseryLayout from './components/NurseryLayout';
import Marketplace from './pages/Marketplace';
import PlantDetail from './pages/PlantDetail';
import Scan from './pages/Scan';
import Rewards from './pages/Rewards';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Recommendation from './pages/Recommendation';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import MobileBill from './pages/MobileBill';
import Community from './pages/Community';
import NurserySignin from './pages/nursery/NurserySignin';
import NurserySignup from './pages/nursery/NurserySignup';
import NurseryDashboard from './pages/nursery/NurseryDashboard';
import NurseryProducts from './pages/nursery/NurseryProducts';
import NurseryProductForm from './pages/nursery/NurseryProductForm';
import NurseryOrders from './pages/nursery/NurseryOrders';
import NurseryTrending from './pages/nursery/NurseryTrending';
import NurseryProfile from './pages/nursery/NurseryProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNurseries from './pages/admin/AdminNurseries';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSalesReport from './pages/admin/AdminSalesReport';
import AdminTrendingProducts from './pages/admin/AdminTrendingProducts';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bill/:sessionId" element={<MobileBill />} />

        <Route path="/nursery/signup" element={<NurserySignup />} />
        <Route path="/nursery/signin" element={<NurserySignin />} />
        <Route path="/nursery" element={<NurseryLayout />}>
          <Route path="dashboard" element={<NurseryDashboard />} />
          <Route path="products" element={<NurseryProducts />} />
          <Route path="products/add" element={<NurseryProductForm />} />
          <Route path="products/:id/edit" element={<NurseryProductForm />} />
          <Route path="orders" element={<NurseryOrders />} />
          <Route path="sales-report" element={<NurseryOrders />} />
          <Route path="trending-products" element={<NurseryTrending />} />
          <Route path="profile" element={<NurseryProfile />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id" element={<PlantDetail />} />
          <Route path="scan" element={<Scan />} />
          <Route path="recommendation" element={<Recommendation />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="community" element={<Community />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="nurseries" element={<AdminNurseries />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="sales-report" element={<AdminSalesReport />} />
          <Route path="trending-products" element={<AdminTrendingProducts />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
