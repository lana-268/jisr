import { db } from '../config/firebase.js';

async function seed() {
  console.log('🌱 Seeding MahalleHub Database with realistic Istanbul neighborhood data...');

  // 1. Admins
  const admins = [
    {
      adminId: 'admin_super_1',
      name: 'Selin Yılmaz',
      email: 'admin@mahallehub.com',
      adminType: 'SUPER_ADMIN',
      createdAt: new Date().toISOString(),
    },
    {
      adminId: 'admin_support_1',
      name: 'Burak Kaya',
      email: 'destek@mahallehub.com',
      adminType: 'SUPPORT_ADMIN',
      createdByAdminId: 'admin_super_1',
      createdAt: new Date().toISOString(),
    },
  ];

  for (const admin of admins) {
    await db.collection('admins').doc(admin.adminId).set(admin);
  }
  console.log(`✅ Seeded ${admins.length} admins (SUPER_ADMIN & SUPPORT_ADMIN).`);

  // 2. Customers
  const customers = [
    {
      customerId: 'cust_1',
      name: 'Ayşe Demir',
      email: 'ayse@example.com',
      phone: '+905321112233',
      district: 'Kadıköy',
      createdAt: new Date().toISOString(),
    },
    {
      customerId: 'cust_2',
      name: 'Mehmet Çelik',
      email: 'mehmet@example.com',
      phone: '+905422223344',
      district: 'Beşiktaş',
      createdAt: new Date().toISOString(),
    },
    {
      customerId: 'cust_3',
      name: 'Zeynep Aksoy',
      email: 'zeynep@example.com',
      phone: '+905533334455',
      district: 'Üsküdar',
      createdAt: new Date().toISOString(),
    },
  ];

  for (const customer of customers) {
    await db.collection('customers').doc(customer.customerId).set(customer);
  }
  console.log(`✅ Seeded ${customers.length} customers.`);

  // 3. Providers
  const providers = [
    {
      providerId: 'prov_1',
      businessName: 'Fatma Teyze Ev Yemekleri',
      email: 'fatma@mahallehub.com',
      phone: '+905324445566',
      providerType: 'HOME_PRODUCT',
      status: 'APPROVED',
      isOnline: true,
      approvedByAdminId: 'admin_super_1',
      district: 'Kadıköy',
      createdAt: new Date().toISOString(),
    },
    {
      providerId: 'prov_2',
      businessName: 'Usta Ahmet Tesisat & Tamirat',
      email: 'ahmet@mahallehub.com',
      phone: '+905335556677',
      providerType: 'GENERAL_SERVICE',
      status: 'APPROVED',
      isOnline: true,
      approvedByAdminId: 'admin_super_1',
      district: 'Kadıköy',
      createdAt: new Date().toISOString(),
    },
    {
      providerId: 'prov_3',
      businessName: 'Moda Butik Terzi & Tadilat',
      email: 'terzi@mahallehub.com',
      phone: '+905356667788',
      providerType: 'GENERAL_SERVICE',
      status: 'APPROVED',
      isOnline: true,
      approvedByAdminId: 'admin_super_1',
      district: 'Kadıköy',
      createdAt: new Date().toISOString(),
    },
    {
      providerId: 'prov_4',
      businessName: 'Hatice Hanım Baklava & Tatlıları',
      email: 'hatice@mahallehub.com',
      phone: '+905367778899',
      providerType: 'HOME_PRODUCT',
      status: 'PENDING_APPROVAL',
      isOnline: true,
      district: 'Beşiktaş',
      createdAt: new Date().toISOString(),
    },
    {
      providerId: 'prov_5',
      businessName: 'Boğaziçi Elektrik Ustası',
      email: 'bogazici@mahallehub.com',
      phone: '+905378889900',
      providerType: 'GENERAL_SERVICE',
      status: 'APPROVED',
      isOnline: true,
      approvedByAdminId: 'admin_super_1',
      district: 'Beşiktaş',
      createdAt: new Date().toISOString(),
    },
  ];

  for (const provider of providers) {
    await db.collection('providers').doc(provider.providerId).set(provider);
  }
  console.log(`✅ Seeded ${providers.length} providers.`);

  // 4. Categories
  const serviceCategories = [
    { serviceCategoryId: 'sc_tesisat', name: 'Tesisat & Montaj', iconUrl: 'wrench', isActive: true },
    { serviceCategoryId: 'sc_elektrik', name: 'Elektrik & Aydınlatma', iconUrl: 'zap', isActive: true },
    { serviceCategoryId: 'sc_temizlik', name: 'Ev Temizliği', iconUrl: 'sparkles', isActive: true },
    { serviceCategoryId: 'sc_terzi', name: 'Terzi & Tadilat', iconUrl: 'scissors', isActive: true },
    { serviceCategoryId: 'sc_ozelders', name: 'Özel Ders', iconUrl: 'book-open', isActive: true },
  ];

  for (const sc of serviceCategories) {
    await db.collection('service_categories').doc(sc.serviceCategoryId).set(sc);
  }
  console.log(`✅ Seeded ${serviceCategories.length} service categories.`);

  const productCategories = [
    { productCategoryId: 'pc_evyemek', name: 'Ev Yapımı Yemekler', iconUrl: 'utensils', isActive: true },
    { productCategoryId: 'pc_borek', name: 'Börek & Hamur İşleri', iconUrl: 'croissant', isActive: true },
    { productCategoryId: 'pc_tatli', name: 'Geleneksel Tatlılar', iconUrl: 'cake', isActive: true },
    { productCategoryId: 'pc_recel', name: 'Organik Reçel & Sos', iconUrl: 'jar', isActive: true },
    { productCategoryId: 'pc_elisi', name: 'El İşi & Örgü', iconUrl: 'heart', isActive: true },
  ];

  for (const pc of productCategories) {
    await db.collection('product_categories').doc(pc.productCategoryId).set(pc);
  }
  console.log(`✅ Seeded ${productCategories.length} product categories.`);

  // 5. Products
  const products = [
    {
      productId: 'prod_manti_1',
      providerId: 'prov_1',
      productCategoryId: 'pc_evyemek',
      title: 'Kayseri Usulü El Açması Mantı (1 Porsiyon)',
      description: 'Günlük taze kıymalı, sarımsaklı süzme yoğurt ve tereyağlı pul biber sosu ile.',
      price: 240,
      imageUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500',
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
    {
      productId: 'prod_sarma_1',
      providerId: 'prov_1',
      productCategoryId: 'pc_evyemek',
      title: 'Zeytinyağlı Yaprak Sarma (500 gr)',
      description: 'Anne eli değmiş taze asma yapraklarından kuş üzümlü ve çam fıstıklı.',
      price: 190,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500',
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
    {
      productId: 'prod_suboregi_1',
      providerId: 'prov_1',
      productCategoryId: 'pc_borek',
      title: 'Peynirli El Açması Tepsi Su Böreği',
      description: 'Bol tereyağlı ve Ezine peynirli kat kat geleneksel su böreği.',
      price: 320,
      imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500',
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const prod of products) {
    await db.collection('products').doc(prod.productId).set(prod);
  }
  console.log(`✅ Seeded ${products.length} products.`);

  // 6. Services
  const services = [
    {
      serviceId: 'serv_tesisat_1',
      providerId: 'prov_2',
      serviceCategoryId: 'sc_tesisat',
      title: 'Acil Su Tesisatı & Musluk Tamiri',
      description: 'Kadıköy içi 30 dakikada yerinde servis. Sızıntı onarımı ve batarya montajı.',
      price: 450,
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
    {
      serviceId: 'serv_terzi_1',
      providerId: 'prov_3',
      serviceCategoryId: 'sc_terzi',
      title: 'Pantolon Paça & Elbise Daraltma',
      description: 'Moda Butik Terzi güvencesiyle aynı gün teslim paça ve tadilat işlemleri.',
      price: 150,
      imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500',
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
    {
      serviceId: 'serv_elektrik_1',
      providerId: 'prov_5',
      serviceCategoryId: 'sc_elektrik',
      title: 'Sigorta Değişimi & Avize Montajı',
      description: 'Beşiktaş bölgesinde uzman elektrik arıza onarımı ve aydınlatma kurulumu.',
      price: 400,
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500',
      isAvailable: true,
      createdAt: new Date().toISOString(),
    },
  ];

  for (const serv of services) {
    await db.collection('services').doc(serv.serviceId).set(serv);
  }
  console.log(`✅ Seeded ${services.length} services.`);

  // 7. Orders & Chats & Messages
  const orderId = 'ord_demo_1';
  const chatId = 'chat_demo_1';
  const now = new Date().toISOString();

  await db.collection('orders').doc(orderId).set({
    orderId,
    productId: 'prod_manti_1',
    customerId: 'cust_1',
    providerId: 'prov_1',
    totalPrice: 240,
    status: 'IN_PROGRESS',
    createdAt: now,
  });

  await db.collection('chats').doc(chatId).set({
    chatId,
    customerId: 'cust_1',
    providerId: 'prov_1',
    lastMessage: 'Mantınız fırından yeni çıktı, 15 dakikaya kapınızda!',
    updatedAt: now,
  });

  const messages = [
    {
      messageId: 'msg_1',
      chatId,
      senderId: 'cust_1',
      senderRole: 'CUSTOMER',
      text: 'Merhaba Fatma teyze, sarımsaklı yoğurdu bol koyabilir misiniz?',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
    {
      messageId: 'msg_2',
      chatId,
      senderId: 'prov_1',
      senderRole: 'PROVIDER',
      text: 'Tabii ki kızım, bol tereyağlı ve sarımsaklı hazırlıyorum.',
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    },
    {
      messageId: 'msg_3',
      chatId,
      senderId: 'prov_1',
      senderRole: 'PROVIDER',
      text: 'Mantınız fırından yeni çıktı, 15 dakikaya kapınızda!',
      createdAt: now,
    },
  ];

  for (const msg of messages) {
    await db.collection('chats').doc(chatId).collection('messages').doc(msg.messageId).set(msg);
  }
  console.log('✅ Seeded demo order, chat, and messages.');
  console.log('🎉 MahalleHub database seeding complete!');
}

seed().catch((err) => {
  console.error('❌ Error during database seeding:', err);
  process.exit(1);
});
