# 🏠 RentLedger

A full-stack rental property management web app for landlords to manage properties, tenants, leases, and payments — all in one place.

---

## ✨ Features

- 🔐 **Authentication** — Secure JWT-based login & registration with bcrypt password hashing
- 🏢 **Properties** — Add and manage your rental properties
- 👤 **Tenants** — Track tenant details linked to properties
- 📄 **Leases** — Create and manage lease agreements with rent and deposit info
- 💸 **Payments** — Record and track monthly rent payments with UPI references
- 📊 **Dashboard** — Overview of key stats across your portfolio
- 🛡️ **Security** — Rate limiting, helmet headers, and CORS protection

---

## 🛠️ Tech Stack

### Frontend (Client)
| Tech | Purpose |
|------|---------|
| React + Vite | UI framework & build tool |
| React Router v6 | Client-side routing |
| React Hot Toast | Notifications |
| Vanilla CSS | Styling |

### Backend (Server)
| Tech | Purpose |
|------|---------|
| Node.js + Express 5 | REST API |
| better-sqlite3 | SQLite database (local file) |
| JSON Web Tokens (JWT) | Auth tokens |
| bcryptjs | Password hashing |
| Helmet | HTTP security headers |
| express-rate-limit | Rate limiting |
| dotenv | Environment variables |

---

## 📁 Project Structure

```
Rentledger/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── pages/           # Landing, Login, Register, Dashboard, Properties, Tenants, Leases, Payments
│       ├── components/      # Shared components (DashboardLayout, RouteGuard, etc.)
│       ├── contexts/        # AuthContext (global auth state)
│       └── lib/             # API helper (api.js)
│
└── server/                  # Express backend
    ├── controllers/         # Business logic (auth, property, tenant, lease, payment)
    ├── routes/              # API route definitions
    ├── middleware/          # JWT auth middleware
    ├── db.js                # SQLite schema & connection
    └── index.js             # App entry point
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/dhruvmaheshwar016/Rentledger.git
cd Rentledger
```

### 2. Setup the Server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

Start the server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Setup the Client

```bash
cd client
npm install
npm run dev
```

The frontend will be running at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT | ❌ |
| GET | `/api/properties` | List all properties | ✅ |
| POST | `/api/properties` | Add a property | ✅ |
| GET | `/api/tenants` | List all tenants | ✅ |
| POST | `/api/tenants` | Add a tenant | ✅ |
| GET | `/api/leases` | List all leases | ✅ |
| POST | `/api/leases` | Create a lease | ✅ |
| GET | `/api/payments` | List all payments | ✅ |
| POST | `/api/payments` | Record a payment | ✅ |
| GET | `/api/health` | Health check | ❌ |

---

## 🗄️ Database

RentLedger uses **SQLite** via `better-sqlite3`. The database file (`rentledger.db`) is auto-created on first run — no external database setup required.

**Tables:** `users`, `properties`, `tenants`, `leases`, `payments`

---

## 📄 License

MIT License © 2026 [Dhruv Maheshwar](https://github.com/dhruvmaheshwar016)
