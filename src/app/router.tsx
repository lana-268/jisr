import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProviderDashboard } from '../pages/provider/ProviderDashboard';

export const router = createBrowserRouter([
  { path: '/dashboard/provider', element: <ProviderDashboard/> },
  { path: '*', element: <Navigate to="/dashboard/provider" replace/> },
]);
