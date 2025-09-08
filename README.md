# 🎨 Math Arena Frontend

This is the **frontend** for the **Math Arena** game.  
It is built with **Next.js**, **React.js**, and **Material-UI (MUI)**.  
It handles user interface, authentication, gameplay UI, and API integration with the backend.

---

## 📂 Project Structure

```
math-arena-frontend/
│-- src/
│   │-- app/               # Next.js App Router pages
│   │-- components/        # Reusable React components (GameClient, UI, etc.)
│   │-- lib/               # API helper functions
│   │-- styles/            # Global styles and themes
│
│-- public/                # Static assets (icons, images)
│-- .env.local             # Environment variables
│-- package.json
│-- README.md
```

---

## ⚙️ Setup

### 1️⃣ Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)  
- Backend server running ([Math Arena Backend](../math-arena-backend))  

---

### 2️⃣ Install Dependencies
```bash
cd math-arena-frontend
npm install
```

---

### 3️⃣ Environment Variables
Create a `.env.local` file in the project root (`math-arena-frontend/.env.local`) with:

```env
NEXT_PUBLIC_API_URL=http://localhost:${PORT}/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:${PORT}
```

---

### 4️⃣ Start the Development Server
```bash
npm run dev
```

Frontend runs at:  
👉 http://localhost:3000

---

## 🔑 Features

- **Authentication** → Register, Login, Logout  
- **Game UI** → Start game, answer questions, view results  
- **API Integration** → Connects with Math Arena backend API  

---

## 🖼️ Assets

Profile pictures are fetched from the backend:  

```
http://localhost:4000/profilePictures/<filename>
```

---
