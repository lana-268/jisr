# 🏙️ Jisr Backend API

Production-ready, modular Node.js backend built with **Express**, **TypeScript**, and **Firebase Admin SDK** for **Jisr** — a hyperlocal marketplace for neighborhood services and home-cooked products in Turkey.

---

## 📑 Table of Contents
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Firestore Collections & Schema](#-firestore-collections--schema)
- [Quick Start](#-quick-start)
- [Environment Configuration](#-environment-configuration)
- [API Endpoints Reference](#-api-endpoints-reference)
  - [1. Auth & Profiles](#1-auth--profiles)
  - [2. Discovery & Catalog](#2-discovery--catalog)
  - [3. Provider Dashboard](#3-provider-dashboard)
  - [4. Customer Orders](#4-customer-orders)
  - [5. Real-time Communication (Chats & Messages)](#5-real-time-communication-chats--messages)
  - [6. Admin Operations](#6-admin-operations)
- [Hackathon Testing & Auth Modes](#-hackathon-testing--auth-modes)
- [Running Tests & Seeding](#-running-tests--seeding)

---

## 🛠️ Architecture & Tech Stack

- **Runtime & Language**: Node.js (ES2022 / NodeNext), TypeScript (strict mode)
- **Framework**: Express.js with modular 3-tier layering:
  - `server/routes`: Route handlers & path definitions
  - `server/controllers`: Request validation & HTTP response orchestration
  - `server/services`: Business logic & Firestore operations
  - `server/middlewares`: Firebase ID token authentication, role-based guards, global error handling
  - `server/types`: Strict String Union Types (zero regular TypeScript enums)
  - `server/config`: Firebase Admin SDK initialization with live/emulator/fallback dual-mode
- **Database**: Google Cloud Firestore (Firebase Admin SDK)

---

## 🗄️ Firestore Collections & Schema

1. **`admins`**: `{ adminId, name, email, adminType ('SUPER_ADMIN' | 'SUPPORT_ADMIN'), createdByAdminId?, createdAt }`
2. **`customers`**: `{ customerId, name, email, phone?, district?, createdAt }`
3. **`providers`**: `{ providerId, businessName, email, phone, providerType ('HOME_PRODUCT' | 'GENERAL_SERVICE'), status ('PENDING_APPROVAL' | 'APPROVED' | 'BLOCKED'), isOnline (boolean), approvedByAdminId?, district, createdAt }`
4. **`service_categories`**: `{ serviceCategoryId, name, iconUrl?, isActive }`
5. **`product_categories`**: `{ productCategoryId, name, iconUrl?, isActive }`
6. **`products`**: `{ productId, providerId, productCategoryId, title, description?, price, imageUrl?, isAvailable, createdAt }`
7. **`services`**: `{ serviceId, providerId, serviceCategoryId, title, description?, price, imageUrl?, isAvailable, createdAt }`
8. **`orders`**: `{ orderId, productId?, serviceId?, customerId, providerId, totalPrice, status ('PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'), createdAt }`
9. **`chats`**: `{ chatId, customerId, providerId, assignedAdminId?, lastMessage?, updatedAt }`
10. **`messages`** (`chats/{chatId}/messages`): `{ messageId, chatId, senderId, senderRole ('CUSTOMER' | 'PROVIDER' | 'ADMIN'), text, createdAt }`

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the frontend
npm run dev

# 3. Start the backend in a second terminal
npm run dev:server

# 4. Seed database with Istanbul neighborhood demo data
npm run seed

# 5. Run automated end-to-end integration tests
npm run test:api

# 6. Build both frontend and backend
npm run build
```

Default server runs at **http://localhost:5000**.

---

## ⚙️ Environment Configuration

Create a `.env` file from `.env.example`:

```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

# Firebase Admin SDK (Optional in dev/hackathon fallback mode)
FIREBASE_PROJECT_ID=mahallehub-app
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
# Or path to serviceAccountKey.json:
GOOGLE_APPLICATION_CREDENTIALS=

# Hackathon Dev Mode Settings
ALLOW_DEV_AUTH=true
```

---

## 🔌 API Endpoints Reference

### 1. Auth & Profiles
| Method | Endpoint | Description | Auth / Role |
|---|---|---|---|
| `POST` | `/api/auth/register-customer` | Register a new customer | Public |
| `POST` | `/api/auth/register-provider` | Register a provider (`PENDING_APPROVAL`, `isOnline: true`) | Public |
| `GET` | `/api/users/me` | Fetch profile based on UID and role | Authenticated |

### 2. Discovery & Catalog
| Method | Endpoint | Description | Auth / Role |
|---|---|---|---|
| `GET` | `/api/categories/services` | Fetch all active service categories | Public |
| `GET` | `/api/categories/products` | Fetch all active product categories | Public |
| `GET` | `/api/catalog/products` | Filter by `district`, `productCategoryId` (Only approved & online) | Public |
| `GET` | `/api/catalog/services` | Filter by `district`, `serviceCategoryId` (Only approved & online) | Public |
| `GET` | `/api/catalog/items/:id` | Fetch single product/service details along with provider profile | Public |

### 3. Provider Dashboard
| Method | Endpoint | Description | Auth / Role |
|---|---|---|---|
| `PATCH` | `/api/providers/toggle-online` | Toggle provider's `isOnline` status | Provider |
| `GET` | `/api/providers/my-items` | Fetch all products & services for logged-in provider | Provider |
| `POST` | `/api/providers/products` | Add a new home product/food | Provider |
| `POST` | `/api/providers/services` | Add a new service | Provider |
| `PATCH` | `/api/providers/items/:itemId/availability` | Toggle `isAvailable` | Provider |
| `DELETE` | `/api/providers/items/:itemId` | Remove an item | Provider |
| `GET` | `/api/providers/orders` | Fetch incoming orders with customer details | Provider |
| `PATCH` | `/api/providers/orders/:orderId/status` | Update status: `IN_PROGRESS`, `COMPLETED`, `CANCELLED` | Provider |

### 4. Customer Orders
| Method | Endpoint | Description | Auth / Role |
|---|---|---|---|
| `POST` | `/api/orders` | Place order & auto-initialize conversation in `chats` | Customer |
| `GET` | `/api/customers/orders` | Order history with item & provider details | Customer |

### 5. Real-time Communication (Chats & Messages)
| Method | Endpoint | Description | Auth / Role |
|---|---|---|---|
| `GET` | `/api/chats/my-chats` | Fetch list of active conversations | Authenticated |
| `GET` | `/api/chats/:chatId/messages` | Fetch messages ordered by `createdAt ASC` | Participants / Admin |
| `POST` | `/api/chats/:chatId/messages` | Send message and update `lastMessage` & `updatedAt` | Participants / Admin |

### 6. Admin Operations
| Method | Endpoint | Description | Auth / Role |
|---|---|---|---|
| `GET` | `/api/admin/providers/pending` | Fetch all providers waiting for approval | Admin |
| `GET` | `/api/admin/providers` | Fetch all providers (optional `?status=...`) | Admin |
| `PATCH` | `/api/admin/providers/:providerId/status` | Set status to `APPROVED` or `BLOCKED` | Admin |
| `GET` | `/api/admin/support-admins` | List support admin accounts | `SUPER_ADMIN` only |
| `POST` | `/api/admin/create-support-admin` | Create new `SUPPORT_ADMIN` | `SUPER_ADMIN` only |
| `GET` | `/api/admin/chats` | Support Admin monitor: view all conversations | Admin |

---

## 🔑 Hackathon Testing & Auth Modes

1. **Standard Firebase ID Token**:
   - Send header `Authorization: Bearer <firebase-id-token>`
2. **Hackathon Dev Headers** (Enabled by `ALLOW_DEV_AUTH=true`):
   - Send headers:
     - `x-user-id: cust_1`
     - `x-user-role: CUSTOMER` (or `PROVIDER`, `ADMIN`)
     - `x-admin-type: SUPER_ADMIN` (optional for admins)
   - Or send Bearer token: `Authorization: Bearer dev-customer-cust_1`, `dev-provider-prov_1`, `dev-admin-super`, `dev-admin-support`
