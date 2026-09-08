import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoginPage } from './pages/LoginPage';
import { SuperAdminPage } from './pages/admin/SuperAdminPage';
import { SupportAdminPage } from './pages/admin/SupportAdminPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/super/*" element={<SuperAdminPage />} />
            <Route path="/admin/support/*" element={<SupportAdminPage />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
