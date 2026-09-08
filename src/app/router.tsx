import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { LandingPage } from '../pages/landing/LandingPage';
import { UserCatalog } from '../pages/user/UserCatalog';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { AuthPage } from '../pages/auth/AuthPage';
import { CustomerOrders } from '../pages/customer/CustomerOrders';
import { CustomerMessagesPage } from '../pages/customer/CustomerMessagesPage';
import { InfoPage } from '../pages/info/InfoPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage/> },
  { path: '/user', element: <UserCatalog/> },
  { path: '/dashboard/provider', element: <ProviderDashboard/> },
  { path: '/dashboard/admin', element: <AdminDashboard/> },
  { path: '/login', element: <AuthPage/> },
  { path: '/register', element: <AuthPage/> },
  { path: '/orders', element: <CustomerOrders/> },
  { path: '/messages', element: <CustomerMessagesPage/> },
  { path: '/explore', element: <Navigate to="/user" replace/> },
  ...['/about', '/careers', '/trust', '/terms', '/privacy'].map((path) => ({ path, element: <InfoPage/> })),
  { path: '/coming-soon', element: <PlaceholderPage/> },
  { path: '*', element: <Navigate to="/" replace/> },
]);
