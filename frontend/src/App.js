import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import UpdatePassword from './pages/UpdatePassword';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';
import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/stores" element={<AdminStores />} />
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
