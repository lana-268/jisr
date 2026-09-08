import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';
import { LandingPage } from '../pages/landing/LandingPage';
import { UserCatalog } from '../pages/user/UserCatalog';
import { PlaceholderPage } from '../pages/PlaceholderPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage/> },
  { path: '/user', element: <UserCatalog/> },
  { path: '/dashboard/provider', element: <ProviderDashboard/> },
  ...['/login', '/register', '/orders', '/explore', '/about', '/careers', '/trust', '/terms', '/privacy'].map((path) => ({ path, element: <PlaceholderPage/> })),
  { path: '*', element: <Navigate to="/" replace/> },
]);
