import { db } from '../config/firebase.js';

async function checkAllCollections() {
  const collections = [
    'admins',
    'customers',
    'providers',
    'service_categories',
    'product_categories',
    'products',
    'services',
    'orders',
    'chats',
  ];

  console.log('--- Checking live Firestore collections ---');
  for (const col of collections) {
    const snap = await db.collection(col).get();
    console.log(`📁 ${col}: ${snap.docs.length} documents`);
    if (snap.docs.length > 0) {
      console.log(`   Sample doc (${snap.docs[0].id}):`, JSON.stringify(snap.docs[0].data()).substring(0, 80) + '...');
    }
  }
  process.exit(0);
}

checkAllCollections();
