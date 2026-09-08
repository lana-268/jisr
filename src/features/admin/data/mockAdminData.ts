import type { Provider } from '../../../types';
import type { AdminCustomer, AdminOrder, AdminProfile } from '../types/admin';

export const mockAdminProfile: AdminProfile = {
  adminId: 'admin-super-001',
  name: 'Lana Demir',
  email: 'admin@jisr.local',
  role: 'SUPER_ADMIN',
};

export const mockAdminCustomers: AdminCustomer[] = [
  { customerId: 'CUS-1001', name: 'Elif Yilmaz', email: 'elif.yilmaz@example.com', phone: '+90 532 145 28 11', district: 'Kadikoy', status: 'ACTIVE', orderCount: 8, totalSpent: 3720, createdAt: '2026-07-18T09:15:00.000Z' },
  { customerId: 'CUS-1002', name: 'Zeynep Kaya', email: 'zeynep.kaya@example.com', phone: '+90 535 410 76 22', district: 'Basaksehir', status: 'ACTIVE', orderCount: 5, totalSpent: 2040, createdAt: '2026-07-24T13:30:00.000Z' },
  { customerId: 'CUS-1003', name: 'Mert Aydin', email: 'mert.aydin@example.com', phone: '+90 541 278 31 08', district: 'Uskudar', status: 'BLOCKED', orderCount: 2, totalSpent: 980, createdAt: '2026-08-01T11:45:00.000Z' },
  { customerId: 'CUS-1004', name: 'Selin Arslan', email: 'selin.arslan@example.com', phone: '+90 533 902 16 44', district: 'Besiktas', status: 'ACTIVE', orderCount: 11, totalSpent: 6350, createdAt: '2026-08-08T08:20:00.000Z' },
  { customerId: 'CUS-1005', name: 'Burak Sahin', email: 'burak.sahin@example.com', phone: '+90 505 611 09 72', district: 'Atasehir', status: 'ACTIVE', orderCount: 4, totalSpent: 1780, createdAt: '2026-08-15T16:05:00.000Z' },
  { customerId: 'CUS-1006', name: 'Derya Celik', email: 'derya.celik@example.com', phone: '+90 539 184 63 29', district: 'Maltepe', status: 'ACTIVE', orderCount: 1, totalSpent: 550, createdAt: '2026-08-30T10:40:00.000Z' },
];

export const mockAdminProviders: Provider[] = [
  { providerId: 'provider-home-001', businessName: "Um Mohammed's Kitchen", email: 'um.mohammed@jisr.local', phone: '+90 532 233 44 10', providerType: 'HOME_PRODUCT', status: 'APPROVED', isOnline: true, approvedByAdminId: 'admin-super-001', district: 'Basaksehir', createdAt: '2026-05-09T09:00:00.000Z' },
  { providerId: 'provider-service-001', businessName: 'Mehmet Home Services', email: 'mehmet@jisr.local', phone: '+90 533 775 20 18', providerType: 'GENERAL_SERVICE', status: 'APPROVED', isOnline: true, approvedByAdminId: 'admin-super-001', district: 'Kadikoy', createdAt: '2026-05-21T12:00:00.000Z' },
  { providerId: 'provider-home-002', businessName: "Aylin's Pastry Table", email: 'aylin.pastry@example.com', phone: '+90 541 602 17 82', providerType: 'HOME_PRODUCT', status: 'PENDING_APPROVAL', isOnline: false, approvedByAdminId: null, district: 'Uskudar', createdAt: '2026-09-02T10:10:00.000Z' },
  { providerId: 'provider-service-002', businessName: 'Can Fix & Care', email: 'can.fix@example.com', phone: '+90 505 490 86 11', providerType: 'GENERAL_SERVICE', status: 'PENDING_APPROVAL', isOnline: false, approvedByAdminId: null, district: 'Besiktas', createdAt: '2026-09-04T14:25:00.000Z' },
  { providerId: 'provider-home-003', businessName: 'Sofra by Nermin', email: 'nermin.sofra@example.com', phone: '+90 535 332 90 71', providerType: 'HOME_PRODUCT', status: 'BLOCKED', isOnline: false, approvedByAdminId: 'admin-super-001', district: 'Maltepe', createdAt: '2026-06-11T15:40:00.000Z' },
  { providerId: 'provider-service-003', businessName: 'Istanbul Moving Help', email: 'moving.help@example.com', phone: '+90 539 270 14 16', providerType: 'GENERAL_SERVICE', status: 'APPROVED', isOnline: false, approvedByAdminId: 'admin-super-001', district: 'Atasehir', createdAt: '2026-07-02T08:35:00.000Z' },
];

export const mockAdminOrders: AdminOrder[] = [
  { orderId: 'ORD-2408', productId: 'product-kabsa', customerId: 'CUS-1001', customerName: 'Elif Yilmaz', providerId: 'provider-home-001', providerName: "Um Mohammed's Kitchen", itemTitle: 'Chicken Kabsa', totalPrice: 350, status: 'PENDING', createdAt: '2026-09-08T08:20:00.000Z' },
  { orderId: 'ORD-2407', serviceId: 'service-cleaning', customerId: 'CUS-1002', customerName: 'Zeynep Kaya', providerId: 'provider-service-001', providerName: 'Mehmet Home Services', itemTitle: 'Home Cleaning', totalPrice: 400, status: 'IN_PROGRESS', createdAt: '2026-09-08T07:45:00.000Z' },
  { orderId: 'ORD-2406', productId: 'product-maqluba', customerId: 'CUS-1004', customerName: 'Selin Arslan', providerId: 'provider-home-001', providerName: "Um Mohammed's Kitchen", itemTitle: 'Maqluba Family Tray', totalPrice: 600, status: 'COMPLETED', createdAt: '2026-09-07T15:10:00.000Z' },
  { orderId: 'ORD-2405', serviceId: 'service-electric', customerId: 'CUS-1005', customerName: 'Burak Sahin', providerId: 'provider-service-001', providerName: 'Mehmet Home Services', itemTitle: 'Electrical Repair', totalPrice: 550, status: 'CANCELLED', createdAt: '2026-09-07T12:30:00.000Z' },
  { orderId: 'ORD-2404', productId: 'product-cookies', customerId: 'CUS-1006', customerName: 'Derya Celik', providerId: 'provider-home-001', providerName: "Um Mohammed's Kitchen", itemTitle: 'Date Cookies', totalPrice: 360, status: 'PENDING', createdAt: '2026-09-06T18:05:00.000Z' },
  { orderId: 'ORD-2403', serviceId: 'service-plumbing', customerId: 'CUS-1001', customerName: 'Elif Yilmaz', providerId: 'provider-service-001', providerName: 'Mehmet Home Services', itemTitle: 'Plumbing Inspection', totalPrice: 500, status: 'COMPLETED', createdAt: '2026-09-05T09:50:00.000Z' },
  { orderId: 'ORD-2402', productId: 'product-grape-leaves', customerId: 'CUS-1002', customerName: 'Zeynep Kaya', providerId: 'provider-home-001', providerName: "Um Mohammed's Kitchen", itemTitle: 'Stuffed Grape Leaves', totalPrice: 440, status: 'IN_PROGRESS', createdAt: '2026-09-04T16:40:00.000Z' },
  { orderId: 'ORD-2401', serviceId: 'service-delivery', customerId: 'CUS-1004', customerName: 'Selin Arslan', providerId: 'provider-service-001', providerName: 'Mehmet Home Services', itemTitle: 'Furniture Delivery', totalPrice: 650, status: 'COMPLETED', createdAt: '2026-09-03T11:20:00.000Z' },
];
