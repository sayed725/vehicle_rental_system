# 🚙 Vehicle Rental System (Backend)

A complete backend API for managing vehicles, bookings, Customers, and role-based access control.  
Built with **TypeScript**, **Node.js**, **Express**, **PostgreSQL**, and **JWT Authentication**.

---

## 🌐 Live Deployment

🔗 **API Base URL:** https://coming-soon.vercel.app

---

---

## Requirements

[Documentation](https://github.com/Apollo-Level2-Web-Dev/B6A2)

---

## 🎯 Features

### 👥 **Users Management**

- Secure User registration & login
- JWT-based authentication management
- Role-based access (`admin`, `customer`)
- Admin can manage all the users activity

### 🚙 **Vehicles Management**

- Add, update & delete vehicles (Admin only)
- Vehicles have type, registration number, daily rent price, status, 
- Availability status (`available` / `booked`)

### 📅 **Bookings Management**

- Customers can choose and book different kinds of vehicles
- Only admin or own customer can update his profile
- Only admin can see or manage all customers data
- Auto booking date validation availability
- Auto calculates total price based on booking dates
- Only available vehicle can be booked
- Auto Updates vehicle status to booked
- Customer can cancel booking before start date
- if needed Admin can mark booking as returned
- Vehicle will Automatically marks bookings as 'returned' when rent end date has passed and then it will be available to book again
- Prevent User and Vehicle deletion if they have active bookings
- System logic will prevents any invalid actions

### 🔐 **Security Management**

- Encrypted passwords using bcrypt
- Protected routes using JWT
- Role-based middleware for secure auth

---

## 🛠️ Technology Stack

- **Node.js** + **TypeScript**
- **Express.js** (web framework)
- **PostgreSQL** (database neon db)
- **bcrypt** (password hashing)
- **jsonwebtoken** (JWT authentication)
- **VerceL** (Deployment) 
---

## Setup & Run Instructions

### 1️⃣ **Clone the Repository**

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ **Install Dependencies**

```
npm i
```

### 3️⃣ **Environment Variables**

```
PORT=5001
CONNECTION_STR=postgresql://neondb_owner:npg_YRqr7xiKt2lB@ep-snowy-bush-ad3ii0zj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET="KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30"
```

### 4️⃣ **Run Server**

```
npm run dev
```

### 5️⃣ **API Base URL**

```
http://localhost:5000/api/v1
```

