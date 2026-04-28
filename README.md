# 🚀 ResQSync – Smart Emergency Resource Allocation System

🌐 **Live Demo:** https://resqsync-1.onrender.com/

![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![Node](https://img.shields.io/badge/Backend-Node.js-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![Clerk](https://img.shields.io/badge/Auth-Clerk-orange)
![AI](https://img.shields.io/badge/AI-NLP-blue)
![Maps](https://img.shields.io/badge/Maps-Leaflet-green)

---

## 📌 Overview

ResQSync is an **AI-powered emergency response platform** that connects users in distress with nearby volunteers in real time.

The system uses **AI-based classification, location tracking, and intelligent matching** to ensure faster and more efficient emergency response.

---

## ✨ Features

### 🚨 Emergency Reporting
- Report emergencies instantly  
- Automatic location detection  
- Simple and fast UI  

---

### 🤖 AI-Powered Classification
- NLP model analyzes user input  
- Determines **category** and **priority**  
- Improves decision-making  

---

### 📍 Location-Based Matching
- Finds nearby volunteers  
- Distance-based filtering (500m, 1km, 1.5km)  

---

### 🗺️ Map Integration
- Interactive maps using **Leaflet**  
- Shows:
  - User location  
  - Nearby volunteers  
  - Coverage radius  

---

### 🧑‍💼 Admin Dashboard
- View all emergency requests  
- Assign volunteers  
- Monitor response  

---

### 🔐 Authentication
- Secure login/signup using **Clerk**  
- Role-based access (Admin/User)  

---

### ⚡ Real-Time Feedback
- Toast notifications  
- Loading states  
- Instant UI updates  

---

### 📊 Smart Insights
- Active alerts  
- Volunteer count  
- Avg response time  

---

## 🛠️ Tech Stack

### Frontend
- Next.js  
- React  
- Tailwind CSS / Custom Styling  
- React Hot Toast  
- Leaflet  

---

### Backend
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

---

### AI Engine
- Python (FastAPI)  
- Custom NLP model  

---

### Authentication
- Clerk  

---

### Deployment
- Frontend: Render / Vercel  
- Backend: Render  

---

## 📂 Project Structure
```
ResQSync
│
├── frontend
│   ├── app
│   │   ├── dashboard
│   │   ├── map
│   │   ├── sign-in
│   │   ├── sign-up
│   │   └── layout.tsx
│   │
│   ├── components
│   │   ├── Mapview.tsx
│   │   └── toastProvider.tsx
│   │
│   ├── public
│   ├── styles
│   └── package.json
│
├── backend
│   ├── controllers
│   │   ├── requestController.js
│   │   ├── assignController.js
│   │   └── userController.js
│   │
│   ├── models
│   │   ├── Request.js
│   │   └── User.js
|   |   └── ngoEmployee.models.js
│   │
│   ├── routes
│   │   ├── requestRoutes.js
│   │   ├── assignRoutes.js
│   │   └── userRoutes.js
│   │
│   └── index.js
│
├── engine
│   ├── app.py
│   ├── core
│   │   └── inference.py
│   └── requirements.txt
│
└── README.md
```

---

# ⚡ Installation

### 1. Clone the repository
git clone https://github.com/AyushMishra-2005/ResQSync.git

### 2. Install dependencies

Frontend
```
cd frontend
npm install
```

Backend
```
cd backend
npm install
```

### 3. Run the project

Backend
npm run dev

Frontend
npm run dev

# 🔑 Environment Variables

### Backend `.env`
PORT=8000

MONGO_URI=mongodb+srv://user...

ADMIN_EMAIL=admin@gmail.com

CLERK_SECRET_KEY=sk_test_...

---

### Frontend `.env`
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...

NEXT_PUBLIC_ADMIN_EMAIL=admin@gmail.com

NEXT_PUBLIC_API_URL=https://resqsync-7lc9.onrender.com
