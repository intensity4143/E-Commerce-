# TrendCart – E-Commerce Website

Live Demo: https://trendcart-frontend-three.vercel.app/

## Test Credentials
You can use the following credentials to test the application:

Email: testuser@gmail.com  
Password: 123456789

TrendCart is a full-stack e-commerce website built using the MERN stack. Users can browse products, manage cart, and place orders using Razorpay, Stripe, or Cash on Delivery.

---

## Features

### User

* Browse products
* Add/remove items from cart
* Select product size
* Login / Signup
* Place orders (Razorpay / Stripe / COD)
* View orders

### Admin

* Add, update, delete products
* Manage orders

---

## Tech Stack

Frontend:

* React (Vite)
* Tailwind CSS

Backend:

* Node.js
* Express.js

Database:

* MongoDB

Other:

* JWT Authentication
* Razorpay
* Stripe

---

## Screenshots

### Home Page

![Home](./screenshots/home.png)

### Product Page

![Product](./screenshots/product.png)

### Cart

![Cart](./screenshots/cart.png)

### Orders

![Orders](./screenshots/orders.png)

### Admin Panel

![Admin](./screenshots/admin.png)

---

## Project Structure

```
frontend/
backend/
```

---

## Environment Variables

Create a `.env` file in the backend using the `.env.example` file provided in the project.

---

## Run Locally

Clone the repository:

```
git clone https://github.com/intensity4143/E-Commerce-
cd E-Commerce-
```

Backend:

```
cd backend
npm install
npm run server
```

Frontend:

```
cd frontend
npm install
npm run dev
```

---

## Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Notes

* Orders are created before payment
* Payment is verified before updating status

---

## GitHub

https://github.com/intensity4143

---

If you found this project useful, consider giving it a ⭐
