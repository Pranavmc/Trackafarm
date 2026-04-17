# TrackaFarm Access Credentials

Use the following credentials to access different areas of the application. These are the default accounts created by the seeding script.

## 🛡️ Admin Account
**Role:** Global Administrator (Approve farmers, manage all data)
- **Email:** `admin@trackafarm.com`
- **Password:** `admin123`

---

## 👨‍🌾 Farmer Account
**Role:** Regular Farmer (Manage animals, milk logs, and vet records)
- **Email:** `farmer@trackafarm.com`
- **Password:** `farmer123`

---

## 🛒 Seller Account
**Role:** E-commerce Seller (Manage products in the marketplace)
- **Email:** `seller@trackafarm.com`
- **Password:** `seller123`

---

## ⏳ Pending Farmer (Demo)
**Role:** Farmer awaiting approval (Access is restricted until Admin approves)
- **Email:** `pending@trackafarm.com`
- **Password:** `pending123`

---

> [!IMPORTANT]
> To use these accounts, you must first run the seed script on your database if you haven't already. If you are using the live Render deployment, ensure the database has been seeded with `npm run seed` in the `server` directory.
