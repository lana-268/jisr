import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

let isRealFirebase = false;
let firestoreInstance: any = null;
let authInstance: any = null;

// Check if credentials exist
const hasServiceAccountPath = !!process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const hasEnvCredentials = !!(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

if (hasServiceAccountPath || hasEnvCredentials || hasEmulator) {
  try {
    if (!admin.apps.length) {
      if (hasServiceAccountPath) {
        admin.initializeApp({
          credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      } else if (hasEnvCredentials) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          }),
        });
      } else {
        // Emulator mode
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'mahallehub-dev',
        });
      }
    }
    firestoreInstance = admin.firestore();
    authInstance = admin.auth();
    isRealFirebase = true;
    console.log('✅ Connected to live Firebase Admin SDK / Firestore.');
  } catch (err) {
    console.warn('⚠️ Could not initialize live Firebase credentials. Falling back to local hackathon storage simulator.', err);
  }
}

// In-memory Firestore adapter for seamless Hackathon development & instant zero-setup execution
class InMemoryFirestore {
  private collections: Map<string, Map<string, any>> = new Map();
  private readonly storagePath = path.resolve(process.cwd(), 'data', 'in-memory-firestore.json');

  constructor() {
    try {
      const stored = JSON.parse(fs.readFileSync(this.storagePath, 'utf8')) as Record<string, Record<string, any>>;
      for (const [collectionName, documents] of Object.entries(stored)) {
        this.collections.set(collectionName, new Map(Object.entries(documents)));
      }
    } catch {
      // Start with an empty local database when no seed file exists yet.
    }
  }

  private persist(): void {
    const serializable: Record<string, Record<string, any>> = {};
    for (const [collectionName, documents] of this.collections.entries()) {
      serializable[collectionName] = Object.fromEntries(documents.entries());
    }
    fs.mkdirSync(path.dirname(this.storagePath), { recursive: true });
    fs.writeFileSync(this.storagePath, JSON.stringify(serializable, null, 2), 'utf8');
  }

  private getColMap(colName: string): Map<string, any> {
    if (!this.collections.has(colName)) {
      this.collections.set(colName, new Map());
    }
    return this.collections.get(colName)!;
  }

  collection(colName: string) {
    return new InMemoryCollectionRef(this, colName);
  }

  // Internal helper to get/set data
  _getDoc(colName: string, id: string): any {
    return this.getColMap(colName).get(id) || null;
  }

  _setDoc(colName: string, id: string, data: any, merge = false): void {
    const col = this.getColMap(colName);
    if (merge && col.has(id)) {
      col.set(id, { ...col.get(id), ...data });
    } else {
      col.set(id, { ...data });
    }
    this.persist();
  }

  _deleteDoc(colName: string, id: string): void {
    this.getColMap(colName).delete(id);
    this.persist();
  }

  _getAllDocs(colName: string): { id: string; data: any }[] {
    const col = this.getColMap(colName);
    const result: { id: string; data: any }[] = [];
    col.forEach((val, key) => {
      result.push({ id: key, data: { ...val } });
    });
    return result;
  }
}

class InMemoryQuery {
  constructor(
    protected root: InMemoryFirestore,
    protected colPath: string,
    protected filters: { field: string; op: string; val: any }[] = [],
    protected orders: { field: string; dir: 'asc' | 'desc' }[] = []
  ) {}

  where(field: string, op: string, val: any): InMemoryQuery {
    return new InMemoryQuery(this.root, this.colPath, [...this.filters, { field, op, val }], [...this.orders]);
  }

  orderBy(field: string, dir: 'asc' | 'desc' = 'asc'): InMemoryQuery {
    return new InMemoryQuery(this.root, this.colPath, [...this.filters], [...this.orders, { field, dir }]);
  }

  async get(): Promise<{ empty: boolean; docs: any[] }> {
    let docs = this.root._getAllDocs(this.colPath);

    for (const f of this.filters) {
      docs = docs.filter((item) => {
        const itemVal = item.data[f.field];
        if (f.op === '==' || f.op === '===') return itemVal === f.val;
        if (f.op === '!=') return itemVal !== f.val;
        if (f.op === '>') return itemVal > f.val;
        if (f.op === '>=') return itemVal >= f.val;
        if (f.op === '<') return itemVal < f.val;
        if (f.op === '<=') return itemVal <= f.val;
        if (f.op === 'in') return Array.isArray(f.val) && f.val.includes(itemVal);
        return true;
      });
    }

    for (const o of this.orders) {
      docs.sort((a, b) => {
        const valA = a.data[o.field] ?? '';
        const valB = b.data[o.field] ?? '';
        if (valA < valB) return o.dir === 'asc' ? -1 : 1;
        if (valA > valB) return o.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const docSnapshots = docs.map((d) => ({
      id: d.id,
      exists: true,
      data: () => d.data,
      ref: new InMemoryDocRef(this.root, this.colPath, d.id),
    }));

    return {
      empty: docSnapshots.length === 0,
      docs: docSnapshots,
    };
  }
}

class InMemoryCollectionRef extends InMemoryQuery {
  constructor(root: InMemoryFirestore, colPath: string) {
    super(root, colPath);
  }

  doc(id?: string): InMemoryDocRef {
    const docId = id || 'doc_' + Math.random().toString(36).substring(2, 11);
    return new InMemoryDocRef(this.root, this.colPath, docId);
  }

  async add(data: any): Promise<InMemoryDocRef> {
    const docId = 'doc_' + Math.random().toString(36).substring(2, 11);
    const docRef = new InMemoryDocRef(this.root, this.colPath, docId);
    await docRef.set(data);
    return docRef;
  }
}

class InMemoryDocRef {
  constructor(
    private root: InMemoryFirestore,
    private colPath: string,
    public id: string
  ) {}

  async get(): Promise<{ id: string; exists: boolean; data: () => any; ref: InMemoryDocRef }> {
    const data = this.root._getDoc(this.colPath, this.id);
    return {
      id: this.id,
      exists: data !== null,
      data: () => (data ? { ...data } : undefined),
      ref: this,
    };
  }

  async set(data: any, options?: { merge?: boolean }): Promise<void> {
    this.root._setDoc(this.colPath, this.id, data, !!options?.merge);
  }

  async update(data: any): Promise<void> {
    const existing = this.root._getDoc(this.colPath, this.id);
    if (!existing) {
      throw new Error(`Document ${this.colPath}/${this.id} does not exist`);
    }
    this.root._setDoc(this.colPath, this.id, { ...existing, ...data }, false);
  }

  async delete(): Promise<void> {
    this.root._deleteDoc(this.colPath, this.id);
  }

  collection(subColName: string): InMemoryCollectionRef {
    // subcollection represented as parentCol/id/subCol
    return new InMemoryCollectionRef(this.root, `${this.colPath}/${this.id}/${subColName}`);
  }
}

const fallbackDb = new InMemoryFirestore();

export const db = isRealFirebase ? firestoreInstance : fallbackDb;
export const auth = isRealFirebase ? authInstance : null;
export const isLiveFirebase = isRealFirebase;

export default {
  admin,
  db,
  auth,
  isLiveFirebase,
};
