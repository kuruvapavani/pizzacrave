
# 🍕 PizzaCrave

**PizzaCrave** is your go-to destination for delicious, freshly baked pizzas delivered right to your doorstep. From classic flavors to gourmet creations, this web app is built to make pizza ordering simple, fast, and fun. Whether you're craving a Margherita or something spicy, we’ve got you covered.

## 🚀 Features

- 🔐 Secure **User Authentication**
  - Register, Login, Forgot Password
  - Email Verification before login
  - Update username and password securely
    
- 🛒 **Shopping Cart**
  - Add, update, and delete items in cart
    
- 📦 **Order Management**
  - Place orders with:
    - Cash on Delivery
    - Stripe Payments (Test Mode – Stripe not available for live use in India)
  - View order history
  - Real-time status updates with admin tracking
    
- 📬 **Email Notifications**
  - Admin receives email upon user placing an order
    
- 🔔 **Toast Notifications** for real-time feedback
  
- 🛠️ **Admin Panel**
  - Manage orders and pizzas
  - Add, update, and delete pizzas
  - Update order statuses

## 🧑‍💻 Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT + Email Verification
- **Payments**: Stripe (Test Mode)
- **Email Service**: Nodemailer

## 📦 Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/kuruvapavani/pizzacrave.git
   cd pizzacrave
   ```

2. **Frontend Setup**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup**

   ```bash
   cd backend
   npm install
   node server.js
   ```

4. **Environment Variables**

   Create a `.env` file in the `backend` directory with the following variables:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=pavanikuruva2109@gmail.com
   EMAIL_PASS=your_email_password
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

## 🔐 Test Stripe Payments

- Use test card: `4242 4242 4242 4242` (expiry: any future date, CVC: any 3 digits)
- Payments are in test mode due to Stripe's restrictions in India.

## ✨ Live Demo

Check out the live version here: [PizzaCrave Live Site](https://pizzacrave.vercel.app/)

## 📐 Design Reference

Check out the initial design mockups created in Figma:  
[Figma Design – PizzaCrave (Basic Pages)](https://www.figma.com/design/tLuIDmrV3R89whuwavPBc5/Untitled?node-id=0-1&t=Sewy1MB49ZGfzTrb-1)

## 📫 Contact

For questions or suggestions, feel free to reach me at **pavanikuruva2109@gmail.com**.

---

> Made with ❤️ by Pavani Kuruva
