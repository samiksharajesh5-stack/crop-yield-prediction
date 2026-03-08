# 🌾 CropAI — Crop Yield Prediction System

**Big Data in Agriculture | Team: Sanjay Kanna K J · Sanjay Karthi R P · Samiksha R · Samni T K G · Sandhiya K**

---

## ⚡ Quick Start (2 Steps)

### Step 1 — Create Tables in Neon (Do this FIRST)
1. Go to **console.neon.tech** → your project → **SQL Editor**
2. Open the file `backend/init.sql` from this project
3. Copy ALL content → paste into SQL Editor → click **Run**
4. You should see: `users`, `predictions`, `hadoop_logs` tables created ✅

### Step 2 — Configure and Run
```bash
# Backend
cd backend
copy .env.example .env        # Windows
# Edit .env — set your DATABASE_URL from Neon
npm install
npm run dev                   # → http://localhost:5000

# Frontend (new terminal)
cd frontend
copy .env.example .env        # Windows
npm install
npm run dev                   # → http://localhost:5173
```

---

## 🗄️ Database Setup (Neon — No npm run db:push needed!)

**IMPORTANT: This project uses `init.sql` instead of `npm run db:push`**

Because `npm run db:push` requires a direct connection to Neon which may be blocked
on some networks, we use the SQL Editor in the Neon dashboard instead.

### Steps:
1. Create free account at **https://neon.tech**
2. Create project named `CropDB`
3. Go to **SQL Editor** in left sidebar
4. Paste contents of `backend/init.sql` → Run
5. Copy connection string from **Connect** button
6. Paste in `backend/.env` as `DATABASE_URL`

---

## 📁 Project Structure

```
crop-yield-prediction/
├── backend/
│   ├── src/
│   │   ├── server.ts          — Express app entry
│   │   ├── routes/index.ts    — All API routes
│   │   ├── controllers/       — Auth, Prediction, Analytics
│   │   ├── middleware/        — JWT authentication
│   │   └── db/                — Drizzle ORM + schema
│   ├── ml/
│   │   ├── predict.py         — ML inference script
│   │   ├── model.pkl          — Pre-trained RandomForest
│   │   └── dataset.csv        — 2,200 training records
│   ├── init.sql               — ⭐ Run this in Neon SQL Editor
│   └── .env.example
├── frontend/
│   └── src/
│       ├── pages/             — HomePage, Login, Register,
│       │                        Dashboard, Predict, History, Admin
│       ├── context/           — Auth context
│       └── layouts/           — Sidebar layout
└── hadoop/
    ├── mapreduce/             — 3 MapReduce job scripts
    ├── scripts/               — Local simulation runner
    └── results/               — Pre-computed results
```

---

## 🔑 API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Auth | Current user |
| POST | /api/predictions/predict | Auth | ML prediction |
| GET | /api/predictions | Auth | History |
| PATCH | /api/predictions/:id | Auth | Update actual yield |
| GET | /api/analytics | Auth | User analytics |
| GET | /api/admin/analytics | Admin | System analytics |
| GET | /api/admin/users | Admin | All users |
| DELETE | /api/admin/users/:id | Admin | Delete user |
| PATCH | /api/admin/users/:id/role | Admin | Toggle role |
| GET | /api/admin/predictions | Admin | All predictions |
| DELETE | /api/admin/predictions/:id | Admin | Delete prediction |

---

## 🐘 Hadoop (No Installation Required)

```bash
cd hadoop/scripts
python run_local_simulation.py
# Runs all 3 MapReduce jobs locally — no Hadoop/Java needed
```

---

## 🛠️ Make Yourself Admin

After registering, run this in **Neon SQL Editor**:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```
Then log out and log back in.

---

## 📊 ML Model Info

- Algorithm: RandomForestRegressor (300 trees, max_depth=20)
- Training data: 2,200 records, 22 crop types
- R² Score: 0.664 | RMSE: 2.177 t/ha
