import app from '../app.js';
import { Server } from 'http';
import { db } from '../config/firebase.js';

let server: Server;
const TEST_PORT = 5099;
const BASE_URL = `http://localhost:${TEST_PORT}/api`;

let passCount = 0;
let failCount = 0;

async function assert(testName: string, fn: () => Promise<boolean | void>) {
  try {
    const result = await fn();
    if (result === false) {
      console.error(`❌ FAIL: ${testName}`);
      failCount++;
    } else {
      console.log(`✅ PASS: ${testName}`);
      passCount++;
    }
  } catch (err: any) {
    console.error(`❌ FAIL: ${testName} - Error: ${err.message}`);
    failCount++;
  }
}

async function request(path: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const body: any = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function runTests() {
  console.log('🚀 Starting MahalleHub API Integration Test Suite...\n');

  // Start test server
  await new Promise<void>((resolve) => {
    server = app.listen(TEST_PORT, () => {
      resolve();
    });
  });

  // 1. Seed initial data
  console.log('--- Step 0: Seeding Database ---');
  await db.collection('admins').doc('admin_super_1').set({
    adminId: 'admin_super_1',
    name: 'Selin Yılmaz',
    email: 'admin@mahallehub.com',
    adminType: 'SUPER_ADMIN',
    createdAt: new Date().toISOString(),
  });
  await db.collection('admins').doc('admin_support_1').set({
    adminId: 'admin_support_1',
    name: 'Burak Kaya',
    email: 'destek@mahallehub.com',
    adminType: 'SUPPORT_ADMIN',
    createdByAdminId: 'admin_super_1',
    createdAt: new Date().toISOString(),
  });
  await db.collection('product_categories').doc('pc_ev').set({
    productCategoryId: 'pc_ev',
    name: 'Ev Yemekleri',
    isActive: true,
  });
  await db.collection('service_categories').doc('sc_tamir').set({
    serviceCategoryId: 'sc_tamir',
    name: 'Tamirat & Tesisat',
    isActive: true,
  });

  // 2. Health check
  console.log('\n--- Category: System Health ---');
  await assert('GET /api/health returns 200 OK', async () => {
    const res = await request('/health');
    return res.status === 200 && res.body.status === 'ok';
  });

  // 3. Auth & Profiles
  console.log('\n--- Category 1: Auth & User Profiles ---');
  let testCustomerId = '';
  await assert('POST /api/auth/register-customer creates customer', async () => {
    const res = await request('/auth/register-customer', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Kerem Özkan',
        email: `kerem_${Date.now()}@example.com`,
        phone: '+905551234567',
        district: 'Kadıköy',
      }),
    });
    if (res.status === 201 && res.body.data.customerId) {
      testCustomerId = res.body.data.customerId;
      return true;
    }
    return false;
  });

  let testProviderId = '';
  await assert('POST /api/auth/register-provider creates provider with PENDING_APPROVAL and isOnline: true', async () => {
    const res = await request('/auth/register-provider', {
      method: 'POST',
      body: JSON.stringify({
        businessName: 'Leziz Ev Börekleri',
        email: `borek_${Date.now()}@example.com`,
        phone: '+905559876543',
        providerType: 'HOME_PRODUCT',
        district: 'Kadıköy',
      }),
    });
    if (
      res.status === 201 &&
      res.body.data.providerId &&
      res.body.data.status === 'PENDING_APPROVAL' &&
      res.body.data.isOnline === true
    ) {
      testProviderId = res.body.data.providerId;
      return true;
    }
    return false;
  });

  await assert('GET /api/users/me returns authenticated customer profile', async () => {
    const res = await request('/users/me', {
      headers: {
        'x-user-id': testCustomerId,
        'x-user-role': 'CUSTOMER',
      },
    });
    return res.status === 200 && res.body.data.profile.customerId === testCustomerId;
  });

  await assert('GET /api/users/me returns authenticated provider profile', async () => {
    const res = await request('/users/me', {
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
    });
    return res.status === 200 && res.body.data.profile.providerId === testProviderId;
  });

  await assert('GET /api/users/me returns authenticated super admin profile', async () => {
    const res = await request('/users/me', {
      headers: {
        'x-user-id': 'admin_super_1',
        'x-user-role': 'ADMIN',
        'x-admin-type': 'SUPER_ADMIN',
      },
    });
    return res.status === 200 && res.body.data.adminType === 'SUPER_ADMIN';
  });

  // 4. Categories & Catalog
  console.log('\n--- Category 2: Discovery & Catalog ---');
  await assert('GET /api/categories/services returns active service categories', async () => {
    const res = await request('/categories/services');
    return res.status === 200 && Array.isArray(res.body.data) && res.body.data.length > 0;
  });

  await assert('GET /api/categories/products returns active product categories', async () => {
    const res = await request('/categories/products');
    return res.status === 200 && Array.isArray(res.body.data) && res.body.data.length > 0;
  });

  // Set testProvider to APPROVED so catalog tests can find it
  await db.collection('providers').doc(testProviderId).update({ status: 'APPROVED', isOnline: true });

  // Add an item for catalog test
  const prodDoc = await db.collection('products').add({
    productId: 'test_prod_catalog_1',
    providerId: testProviderId,
    productCategoryId: 'pc_ev',
    title: 'Çıtır Ispanaklı Börek',
    description: 'Taze fırından yeni çıkmış',
    price: 180,
    isAvailable: true,
    createdAt: new Date().toISOString(),
  });
  await prodDoc.update({ productId: prodDoc.id });
  const testCatalogProdId = prodDoc.id;

  await assert('GET /api/catalog/products filters by district and productCategoryId', async () => {
    const res = await request(`/catalog/products?district=Kadıköy&productCategoryId=pc_ev`);
    return res.status === 200 && res.body.count >= 1 && res.body.data[0].provider.district === 'Kadıköy';
  });

  await assert('GET /api/catalog/items/:id returns item with provider details', async () => {
    const res = await request(`/catalog/items/${testCatalogProdId}`);
    return (
      res.status === 200 &&
      res.body.data.item.productId === testCatalogProdId &&
      res.body.data.provider.providerId === testProviderId
    );
  });

  // 5. Provider Dashboard
  console.log('\n--- Category 3: Provider Dashboard ---');
  await assert('PATCH /api/providers/toggle-online toggles provider online status', async () => {
    const res = await request('/providers/toggle-online', {
      method: 'PATCH',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
    });
    // It was true, now should be false
    const firstToggle = res.status === 200 && res.body.data.isOnline === false;
    // Toggle back to true
    const res2 = await request('/providers/toggle-online', {
      method: 'PATCH',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
    });
    return firstToggle && res2.body.data.isOnline === true;
  });

  let createdProdId = '';
  await assert('POST /api/providers/products adds a new home product', async () => {
    const res = await request('/providers/products', {
      method: 'POST',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
      body: JSON.stringify({
        productCategoryId: 'pc_ev',
        title: 'Anne Kurabiyesi',
        description: 'Taze fındıklı anne kurabiyesi',
        price: 120,
      }),
    });
    if (res.status === 201 && res.body.data.productId) {
      createdProdId = res.body.data.productId;
      return true;
    }
    return false;
  });

  let createdServId = '';
  await assert('POST /api/providers/services adds a new service', async () => {
    const res = await request('/providers/services', {
      method: 'POST',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
      body: JSON.stringify({
        serviceCategoryId: 'sc_tamir',
        title: 'Kombi Bakımı',
        description: 'Yıllık periyodik kombi bakımı',
        price: 500,
      }),
    });
    if (res.status === 201 && res.body.data.serviceId) {
      createdServId = res.body.data.serviceId;
      return true;
    }
    return false;
  });

  await assert('GET /api/providers/my-items returns provider products and services', async () => {
    const res = await request('/providers/my-items', {
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
    });
    return res.status === 200 && res.body.data.products.length >= 1 && res.body.data.services.length >= 1;
  });

  await assert('PATCH /api/providers/items/:itemId/availability toggles availability', async () => {
    const res = await request(`/providers/items/${createdProdId}/availability`, {
      method: 'PATCH',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
    });
    return res.status === 200 && res.body.data.item.isAvailable === false;
  });

  await assert('DELETE /api/providers/items/:itemId deletes item', async () => {
    const res = await request(`/providers/items/${createdServId}`, {
      method: 'DELETE',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
    });
    return res.status === 200 && res.body.success === true;
  });

  // 6. Orders & Chats
  console.log('\n--- Category 4: Customer Orders & Auto-Chat ---');
  let testOrderId = '';
  let autoChatId = '';
  await assert('POST /api/orders creates order and auto-initializes chat', async () => {
    const res = await request('/orders', {
      method: 'POST',
      headers: {
        'x-user-id': testCustomerId,
        'x-user-role': 'CUSTOMER',
      },
      body: JSON.stringify({
        productId: testCatalogProdId,
        note: 'Lütfen sıcak teslim ediniz.',
      }),
    });
    if (res.status === 201 && res.body.data.order && res.body.data.chat) {
      testOrderId = res.body.data.order.orderId;
      autoChatId = res.body.data.chat.chatId;
      return res.body.data.order.status === 'PENDING' && autoChatId.length > 0;
    }
    return false;
  });

  await assert('GET /api/customers/orders fetches customer order history', async () => {
    const res = await request('/customers/orders', {
      headers: {
        'x-user-id': testCustomerId,
        'x-user-role': 'CUSTOMER',
      },
    });
    return res.status === 200 && res.body.data.length >= 1 && res.body.data[0].orderId === testOrderId;
  });

  await assert('GET /api/providers/orders fetches provider orders', async () => {
    const res = await request('/providers/orders', {
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
    });
    return res.status === 200 && res.body.data.length >= 1 && res.body.data[0].orderId === testOrderId;
  });

  await assert('PATCH /api/providers/orders/:orderId/status updates status to IN_PROGRESS', async () => {
    const res = await request(`/providers/orders/${testOrderId}/status`, {
      method: 'PATCH',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
      body: JSON.stringify({ status: 'IN_PROGRESS' }),
    });
    return res.status === 200 && res.body.data.status === 'IN_PROGRESS';
  });

  // 7. Chats & Messages
  console.log('\n--- Category 5: Real-time Communication (Chats & Messages) ---');
  await assert('GET /api/chats/my-chats returns list of conversations', async () => {
    const res = await request('/chats/my-chats', {
      headers: {
        'x-user-id': testCustomerId,
        'x-user-role': 'CUSTOMER',
      },
    });
    return res.status === 200 && res.body.data.length >= 1 && res.body.data[0].chatId === autoChatId;
  });

  await assert('GET /api/chats/:chatId/messages returns messages in ASC order', async () => {
    const res = await request(`/chats/${autoChatId}/messages`, {
      headers: {
        'x-user-id': testCustomerId,
        'x-user-role': 'CUSTOMER',
      },
    });
    return res.status === 200 && res.body.data.length >= 1;
  });

  await assert('POST /api/chats/:chatId/messages sends message and updates chat', async () => {
    const res = await request(`/chats/${autoChatId}/messages`, {
      method: 'POST',
      headers: {
        'x-user-id': testProviderId,
        'x-user-role': 'PROVIDER',
      },
      body: JSON.stringify({
        text: 'Siparişinizi hazırlamaya başladık!',
      }),
    });
    return res.status === 201 && res.body.data.text === 'Siparişinizi hazırlamaya başladık!';
  });

  // 8. Admin Operations
  console.log('\n--- Category 6: Admin Operations ---');
  await assert('GET /api/admin/providers/pending lists providers waiting for approval', async () => {
    // Register another pending provider
    await db.collection('providers').doc('prov_pending_test').set({
      providerId: 'prov_pending_test',
      businessName: 'Bekleyen Usta',
      email: 'bekleyen@example.com',
      phone: '123',
      providerType: 'GENERAL_SERVICE',
      status: 'PENDING_APPROVAL',
      isOnline: true,
      district: 'Kadıköy',
      createdAt: new Date().toISOString(),
    });

    const res = await request('/admin/providers/pending', {
      headers: {
        'x-user-id': 'admin_super_1',
        'x-user-role': 'ADMIN',
      },
    });
    return res.status === 200 && res.body.data.some((p: any) => p.providerId === 'prov_pending_test');
  });

  await assert('GET /api/admin/providers lists providers with status filter', async () => {
    const res = await request('/admin/providers?status=APPROVED', {
      headers: {
        'x-user-id': 'admin_super_1',
        'x-user-role': 'ADMIN',
      },
    });
    return res.status === 200 && res.body.data.every((p: any) => p.status === 'APPROVED');
  });

  await assert('PATCH /api/admin/providers/:providerId/status approves provider', async () => {
    const res = await request('/admin/providers/prov_pending_test/status', {
      method: 'PATCH',
      headers: {
        'x-user-id': 'admin_super_1',
        'x-user-role': 'ADMIN',
      },
      body: JSON.stringify({ status: 'APPROVED' }),
    });
    return res.status === 200 && res.body.data.status === 'APPROVED';
  });

  await assert('GET /api/admin/support-admins lists support admins (SUPER_ADMIN only)', async () => {
    const res = await request('/admin/support-admins', {
      headers: {
        'x-user-id': 'admin_super_1',
        'x-user-role': 'ADMIN',
        'x-admin-type': 'SUPER_ADMIN',
      },
    });
    return res.status === 200 && res.body.data.length >= 1;
  });

  await assert('POST /api/admin/create-support-admin creates new SUPPORT_ADMIN (SUPER_ADMIN only)', async () => {
    const res = await request('/admin/create-support-admin', {
      method: 'POST',
      headers: {
        'x-user-id': 'admin_super_1',
        'x-user-role': 'ADMIN',
        'x-admin-type': 'SUPER_ADMIN',
      },
      body: JSON.stringify({
        name: 'Merve Arslan',
        email: `merve_${Date.now()}@mahallehub.com`,
      }),
    });
    return res.status === 201 && res.body.data.adminType === 'SUPPORT_ADMIN';
  });

  await assert('GET /api/admin/chats returns all chats for support monitor', async () => {
    const res = await request('/admin/chats', {
      headers: {
        'x-user-id': 'admin_support_1',
        'x-user-role': 'ADMIN',
        'x-admin-type': 'SUPPORT_ADMIN',
      },
    });
    return res.status === 200 && res.body.data.length >= 1;
  });

  // Summary
  console.log('\n=========================================');
  console.log(`🎯 Test Results: ${passCount} Passed, ${failCount} Failed.`);
  console.log('=========================================');

  server.close();
  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  if (server) server.close();
  process.exit(1);
});
