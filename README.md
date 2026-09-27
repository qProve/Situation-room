# Situation Room

> ⚠️ This project is currently in alpha and is actively being worked on. Expect breaking changes and incomplete features. This project has many new features planned and waiting to be implemented.

Situation Room is a web application for visualizing real-time global event data on an interactive 3D globe. It aggregates data from multiple sources and displays them as interactive markers on a dark-themed map.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Pinia + MapLibre GL JS
- **Backend**: Express.js + Prisma
- **Database**: PostgreSQL
- **Map**: MapLibre GL JS — basemaps.cartocdn.com

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL database

### 1. Clone the repository

```bash
git clone https://github.com/qProve/Situation-room.git
cd situation-room
```

### 2. Configure environment variables

**Frontend** — create `.env` in the frontend directory:

```dotenv
VITE_API_BASE_URL=http://localhost:3001/api
```

**Backend** — create `.env` in the backend directory:

```dotenv
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
JWT_SECRET="your-secret-key"
```

### 3. Install dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 4. Run the app

Start both in separate terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3001`.

---

*More info in `/docs`.*