import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
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
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/bill/:sessionId" element={<MobileBill />} />
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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/nurseries" element={<AdminNurseries />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/trending-products" element={<AdminTrending />} />
        <Route element={<Layout />}>
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="marketplace/:id" element={<PlantDetail />} />
          <Route path="scan" element={<Scan />} />
          <Route path="recommendation" element={<Recommendation />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
   