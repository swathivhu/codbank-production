# 💳 CodBank

> A modern digital banking simulation platform built with Next.js and Firebase.  
> Designed to simulate real-world banking workflows including authentication, account management, and secure dashboard access.

---

## PROJECT IMAGE URL
https://raw.githubusercontent.com/swathivhu/codbank-production/main/CodBank.png
https://raw.githubusercontent.com/swathivhu/codbank-production/main/Dashboard.png
https://raw.githubusercontent.com/swathivhu/codbank-production/main/Sigin%20Page.png

---

## 🌐 Live Demo
🔗 https://codbank-production.vercel.app  

---

## ✨ Features

- 🔐 Secure Authentication (Firebase Auth)
- 🏦 Account Creation & Initialization
- 💰 Real-time Balance Tracking (Firestore)
- 🛡 Protected Dashboard Routing
- ⚡ Production Deployment on Vercel
- 🎨 Modern UI with Tailwind CSS

---

## 🧠 Architecture Overview

CodBank follows a production-style full-stack architecture:

- Client-side authentication handling
- Secure Firestore data structure
- Protected route logic
- Environment-based configuration
- Clean Git + Deployment workflow

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|----------|
| Next.js | Full-stack React Framework |
| Firebase Auth | Authentication |
| Firestore | Real-time Database |
| Tailwind CSS | UI Styling |
| Vercel | Deployment |

---

## 🔒 Environment Variables

The following environment variables are required:
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID


---

## 📦 Installation (Local Setup)

```bash
git clone https://github.com/yourusername/codbank-production.git
cd codbank-production
npm install
npm run dev
```
Create a .env.local file and add Firebase credentials.

src/
 ├── app/
 ├── components/
 ├── lib/
 └── firebase/
---
 🚀 Deployment

Deployed using Vercel with production environment configuration.

---
🎯 Future Improvements

Transaction History

Deposit & Withdraw Simulation

Admin Dashboard

Role-based Access

Analytics Integration

---

👩‍💻 Author

Swathi P V
Full Stack Python developer | Frontend-Focused Developer



