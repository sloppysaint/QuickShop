# QuickShop 🛒

A simple, modern e-commerce cart built with React, Node.js, MongoDB, and Stripe.

---

## Features

- Product listing with mock data
- Cart: add, remove, update quantity
- Stripe payments (test mode)
- Transaction logging (MongoDB)
- Email order confirmation (Nodemailer + Gmail)

---

## Tech Stack

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB + Mongoose
- **Payments:** Stripe API
- **Email:** Nodemailer (Gmail)

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/sloppysaint/QuickShop.git
cd QuickShop
cd server && npm install
cd ../client && npm install

### 2. Environment Variables

Create a `server/.env` file with the following content:
```bash
PORT=5000
STRIPE_SECRET_KEY=sk_test_yourStripeSecretKey
STRIPE_PUBLISHABLE_KEY=pk_test_yourStripePublishableKey
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
MONGODB_URI=your_uri

---

## 3. Run the App

### Backend

```bash
cd server
npm run dev

### Frontend
```bash
cd ../client
npm start
