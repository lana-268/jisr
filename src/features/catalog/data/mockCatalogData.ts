import type { District, ProductCategory, ProductItem, Provider, ServiceCategory, ServiceItem } from '../../../types';

export const districts: District[] = ['Kadıköy', 'Maslak', 'Başakşehir', 'Fatih', 'Üsküdar', 'Beşiktaş', 'Şişli', 'Bakırköy'].map((name, index) => ({ districtId: `district-${index + 1}`, name }));
export const catalogProductCategories: ProductCategory[] = [
  { productCategoryId: 'food-meals', name: 'Home-Cooked Meals', isActive: true }, { productCategoryId: 'food-desserts', name: 'Desserts', isActive: true },
  { productCategoryId: 'food-pastries', name: 'Pastries', isActive: true }, { productCategoryId: 'food-catering', name: 'Event Catering', isActive: true },
];
export const catalogServiceCategories: ServiceCategory[] = [
  { serviceCategoryId: 'service-delivery', name: 'Delivery', isActive: true }, { serviceCategoryId: 'service-cleaning', name: 'Home Cleaning', isActive: true },
  { serviceCategoryId: 'service-maintenance', name: 'Maintenance', isActive: true }, { serviceCategoryId: 'service-transport', name: 'Transportation', isActive: true },
];
const provider = (providerId: string, businessName: string, providerType: Provider['providerType'], district: string, status: Provider['status'] = 'APPROVED', isOnline = true): Provider => ({ providerId, businessName, providerType, district, status, isOnline, email: `${providerId}@example.test`, phone: '+90 555 000 0000', createdAt: '2026-01-15T10:00:00Z', approvedByAdminId: status === 'APPROVED' ? 'admin-1' : null });
export const catalogProviders: Provider[] = [
  provider('p-sarah', 'Sarah’s Kitchen', 'HOME_PRODUCT', 'Başakşehir'), provider('p-ayse', 'Ayşe’s Table', 'HOME_PRODUCT', 'Kadıköy'),
  provider('p-meryem', 'Meryem Homemade', 'HOME_PRODUCT', 'Fatih'), provider('p-zeynep', 'Zeynep’s Oven', 'HOME_PRODUCT', 'Üsküdar'),
  provider('p-burak', 'Burak Neighborhood Delivery', 'GENERAL_SERVICE', 'Beşiktaş'), provider('p-noura', 'Noura Home Care', 'GENERAL_SERVICE', 'Şişli'),
  provider('p-mehmet', 'Mehmet Home Services', 'GENERAL_SERVICE', 'Kadıköy'), provider('p-offline', 'Selin Local Catering', 'HOME_PRODUCT', 'Bakırköy', 'APPROVED', false),
  provider('p-pending', 'Istanbul Handy Help', 'GENERAL_SERVICE', 'Maslak', 'PENDING_APPROVAL'), provider('p-blocked', 'Quick Fix İstanbul', 'GENERAL_SERVICE', 'Fatih', 'BLOCKED'),
];
const product = (productId: string, providerId: string, category: string, title: string, price: number, description: string, imageUrl: string | null, isAvailable = true, createdAt = '2026-08-20T10:00:00Z'): ProductItem => ({ productId, providerId, productCategoryId: category, title, price, description, imageUrl, isAvailable, createdAt });
export const catalogProducts: ProductItem[] = [
  product('cp-1','p-sarah','food-meals','Chicken Kabsa',350,'Fragrant rice, tender chicken and warm house spices.','https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85'),
  product('cp-2','p-sarah','food-catering','Maqluba Family Tray',600,'A generous layered rice and vegetable tray for sharing.','https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85'),
  product('cp-3','p-sarah','food-desserts','Date Cookies',180,'Soft handmade cookies filled with gently spiced dates.','https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=700&q=85'),
  product('cp-4','p-ayse','food-meals','Mantı with Garlic Yogurt',290,'Tiny handmade dumplings served with yogurt and butter.','https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85'),
  product('cp-5','p-ayse','food-pastries','Spinach Börek',210,'Flaky pastry layered with spinach and white cheese.',null),
  product('cp-6','p-ayse','food-desserts','Pistachio Baklava Box',420,'Crisp layers, Antep pistachios and light syrup.','https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=700&q=85'),
  product('cp-7','p-meryem','food-meals','Stuffed Grape Leaves',220,'Hand-rolled vine leaves with rice, herbs and olive oil.','https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=700&q=85'),
  product('cp-8','p-meryem','food-catering','Meze Gathering Platter',520,'A colorful selection of seasonal homemade meze.',null),
  product('cp-9','p-meryem','food-desserts','Orange Semolina Cake',190,'Moist citrus cake finished with coconut.','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85'),
  product('cp-10','p-zeynep','food-pastries','Village Bread',95,'Naturally leavened bread baked fresh each morning.','https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=85'),
  product('cp-11','p-offline','food-catering','Offline Celebration Tray',900,'This should never appear to customers.',null),
  product('cp-12','p-zeynep','food-pastries','Unavailable Poğaça Box',160,'Currently paused by the seller.',null,false,'2026-06-01T10:00:00Z'),
];
const service = (serviceId: string, providerId: string, category: string, title: string, price: number, description: string, imageUrl: string | null, isAvailable = true): ServiceItem => ({ serviceId, providerId, serviceCategoryId: category, title, price, description, imageUrl, isAvailable, createdAt: '2026-08-18T10:00:00Z' });
export const catalogServices: ServiceItem[] = [
  service('cs-1','p-burak','service-delivery','Same-Day Neighborhood Delivery',250,'Careful delivery of food and small packages nearby.','https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&w=700&q=85'),
  service('cs-2','p-burak','service-transport','Small Furniture Transport',650,'Local pickup and careful door-to-door transport.','https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=85'),
  service('cs-3','p-burak','service-delivery','Evening Package Drop',300,'Flexible evening delivery around Beşiktaş.',null),
  service('cs-4','p-noura','service-cleaning','Fresh Home Cleaning',400,'Friendly, thorough cleaning for apartments and homes.','https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=85'),
  service('cs-5','p-noura','service-cleaning','Move-In Deep Clean',850,'A detailed clean before you settle into your home.',null),
  service('cs-6','p-mehmet','service-maintenance','Plumbing Inspection',500,'Diagnosis of leaks, pressure and household fittings.','https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=85'),
  service('cs-7','p-mehmet','service-maintenance','Electrical Repair',550,'Safe household electrical diagnosis and minor repairs.','https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=700&q=85'),
  service('cs-8','p-pending','service-maintenance','Pending Provider Repair',350,'This should never appear to customers.',null),
  service('cs-9','p-blocked','service-transport','Blocked Provider Transport',400,'This should never appear to customers.',null),
];
