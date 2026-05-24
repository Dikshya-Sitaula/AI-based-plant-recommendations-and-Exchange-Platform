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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/payment-mobile/:sessionId" element={<MobileBill />} />
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
