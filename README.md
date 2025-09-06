# 🚀 Odoo Hackathon Project

This repository contains the source code for our **Hackathon project**.  
It is divided into two major parts: **Frontend (React + Tailwind + Vite)** and **Backend (Python Flask)**, along with a database setup.

---

## 📂 Project Structure

```
odoo_hackathon/
│
├── Frontend/                 # React + Vite + Tailwind frontend
│   ├── public/               # Static assets
│   ├── src/                  # Source code
│   ├── index.html            # Entry point
│   ├── package.json          # Node dependencies
│   ├── vite.config.ts        # Vite configuration
│   └── tailwind.config.ts    # Tailwind CSS configuration
│
├── database/                 # Database-related files
│
├── app.py                    # Flask backend entry point
├── requirements.txt          # Python dependencies
└── README.md                 # Project documentation
```

---

## ⚡ Tech Stack

### 🔹 Frontend
- **React.js**
- **Vite**
- **TailwindCSS**
- **TypeScript**

### 🔹 Backend
- **Python Flask**
- **REST API**
- **SQLAlchemy / Database integration**

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Namra12345/phantom.git
cd phantom
```

### 2️⃣ Backend Setup (Flask)
```bash
cd odoo_hackathon
python -m venv venv
venv\Scripts\activate   # On Windows
source venv/bin/activate  # On Mac/Linux

pip install -r requirements.txt
python app.py
```
Your Flask backend should now be running on:  
👉 http://127.0.0.1:5000

---

### 3️⃣ Frontend Setup (React + Vite)
```bash
cd Frontend
npm install
npm run dev
```
Your frontend should now be running on:  
👉 http://localhost:5173

---

## 🛠️ Features
- 🔐 Secure backend with Flask
- 🎨 Modern responsive UI with React + Tailwind
- ⚡ Fast builds using Vite
- 🗄️ Database support for persistent data
- 📡 REST API integration between frontend & backend

---

## 👨‍💻 Contributors
- **Namra Patel**  
- **Pratham Barot**
- **Mann Ahalpara**  
- **Purva Pansara**
