import type { Order, ProductCategory, ProductItem, Provider, ServiceCategory, ServiceItem } from '../../../types';

export const productCategories: ProductCategory[] = [
  { productCategoryId: 'pc-main', name: 'Main Meals', isActive: true },
  { productCategoryId: 'pc-desserts', name: 'Desserts', isActive: true },
  { productCategoryId: 'pc-pastries', name: 'Pastries', isActive: true },
  { productCategoryId: 'pc-catering', name: 'Event Catering', isActive: true },
];

export const serviceCategories: ServiceCategory[] = [
  { serviceCategoryId: 'sc-cleaning', name: 'Cleaning', isActive: true },
  { serviceCategoryId: 'sc-plumbing', name: 'Plumbing', isActive: true },
  { serviceCategoryId: 'sc-electrical', name: 'Electrical', isActive: true },
  { serviceCategoryId: 'sc-transport', name: 'Transportation', isActive: true },
];

export const mockProviders: Provider[] = [
  { providerId: 'provider-food', businessName: 'Um Mohammed’s Kitchen', email: 'hello@ummohammed.example', phone: '+90 555 120 4421', providerType: 'HOME_PRODUCT', status: 'APPROVED', isOnline: true, approvedByAdminId: 'admin-1', district: 'Başakşehir', createdAt: '2026-02-12T09:00:00Z' },
  { providerId: 'provider-service', businessName: 'Mehmet Home Services', email: 'mehmet@homeservices.example', phone: '+90 555 743 8890', providerType: 'GENERAL_SERVICE', status: 'APPROVED', isOnline: true, approvedByAdminId: 'admin-1', district: 'Kadıköy', createdAt: '2026-03-02T09:00:00Z' },
];

export const mockProducts: ProductItem[] = [
  { productId: 'prod-1', providerId: 'provider-food', productCategoryId: 'pc-main', title: 'Chicken Kabsa', description: 'Fragrant basmati rice, roasted chicken and house spices.', price: 350, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80', isAvailable: true, createdAt: '2026-08-18T10:00:00Z' },
  { productId: 'prod-2', providerId: 'provider-food', productCategoryId: 'pc-main', title: 'Stuffed Grape Leaves', description: 'Hand-rolled vine leaves with rice and herbs.', price: 220, imageUrl: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=300&q=80', isAvailable: true, createdAt: '2026-08-21T10:00:00Z' },
  { productId: 'prod-3', providerId: 'provider-food', productCategoryId: 'pc-catering', title: 'Maqluba Family Tray', description: 'A generous family tray with chicken and vegetables.', price: 600, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80', isAvailable: true, createdAt: '2026-08-25T10:00:00Z' },
  { productId: 'prod-4', providerId: 'provider-food', productCategoryId: 'pc-desserts', title: 'Date Cookies', description: 'Soft handmade cookies filled with dates.', price: 180, imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80', isAvailable: false, createdAt: '2026-08-29T10:00:00Z' },
];

export const mockServices: ServiceItem[] = [
  { serviceId: 'serv-1', providerId: 'provider-service', serviceCategoryId: 'sc-cleaning', title: 'Home Cleaning', description: 'Careful cleaning for apartments and family homes.', price: 400, imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80', isAvailable: true, createdAt: '2026-08-15T10:00:00Z' },
  { serviceId: 'serv-2', providerId: 'provider-service', serviceCategoryId: 'sc-plumbing', title: 'Plumbing Inspection', description: 'Diagnosis of leaks, pressure and fittings.', price: 500, imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=300&q=80', isAvailable: true, createdAt: '2026-08-20T10:00:00Z' },
  { serviceId: 'serv-3', providerId: 'provider-service', serviceCategoryId: 'sc-transport', title: 'Furniture Delivery', description: 'Careful local furniture pickup and delivery.', price: 650, imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80', isAvailable: true, createdAt: '2026-08-24T10:00:00Z' },
  { serviceId: 'serv-4', providerId: 'provider-service', serviceCategoryId: 'sc-electrical', title: 'Electrical Repair', description: 'Safe household electrical diagnostics and repair.', price: 550, imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80', isAvailable: false, createdAt: '2026-08-28T10:00:00Z' },
];

export const mockOrders: Order[] = [
  { orderId: 'JSR-1048', productId: 'prod-1', customerId: 'c-1', customerName: 'Elif Yılmaz', providerId: 'provider-food', itemTitle: 'Chicken Kabsa', totalPrice: 700, status: 'PENDING', createdAt: '2026-09-08T08:30:00Z' },
  { orderId: 'JSR-1045', productId: 'prod-2', customerId: 'c-2', customerName: 'Ayşe Demir', providerId: 'provider-food', itemTitle: 'Stuffed Grape Leaves', totalPrice: 220, status: 'IN_PROGRESS', createdAt: '2026-09-07T12:20:00Z' },
  { orderId: 'JSR-1039', productId: 'prod-3', customerId: 'c-3', customerName: 'Can Kaya', providerId: 'provider-food', itemTitle: 'Maqluba Family Tray', totalPrice: 600, status: 'COMPLETED', createdAt: '2026-09-05T16:10:00Z' },
  { orderId: 'JSR-1032', productId: 'prod-4', customerId: 'c-4', customerName: 'Zeynep Şahin', providerId: 'provider-food', itemTitle: 'Date Cookies', totalPrice: 360, status: 'CANCELLED', createdAt: '2026-09-02T09:45:00Z' },
  { orderId: 'JSR-2051', serviceId: 'serv-1', customerId: 'c-5', customerName: 'Selin Arslan', providerId: 'provider-service', itemTitle: 'Home Cleaning', totalPrice: 400, status: 'PENDING', createdAt: '2026-09-08T07:15:00Z' },
  { orderId: 'JSR-2047', serviceId: 'serv-2', customerId: 'c-6', customerName: 'Emre Aydın', providerId: 'provider-service', itemTitle: 'Plumbing Inspection', totalPrice: 500, status: 'IN_PROGRESS', createdAt: '2026-09-07T11:00:00Z' },
  { orderId: 'JSR-2040', serviceId: 'serv-3', customerId: 'c-7', customerName: 'Merve Çelik', providerId: 'provider-service', itemTitle: 'Furniture Delivery', totalPrice: 650, status: 'COMPLETED', createdAt: '2026-09-04T14:00:00Z' },
  { orderId: 'JSR-2036', serviceId: 'serv-4', customerId: 'c-8', customerName: 'Burak Koç', providerId: 'provider-service', itemTitle: 'Electrical Repair', totalPrice: 550, status: 'CANCELLED', createdAt: '2026-09-03T10:30:00Z' },
];
