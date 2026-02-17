# Fashion Grid KE

A full-stack e-commerce platform for Kenyan fashion enthusiasts, featuring M-Pesa integration, delivery zones, and an admin dashboard.

## 🚀 Features

- **User Authentication** – JWT-based login/register with role-based access (user/admin)
- **Product Catalog** – Browse, filter by category, view details
- **Shopping Cart** – Add/remove items, update quantities
- **Checkout** – Select delivery zone (Nairobi CBD, Nairobi Outside, Kiambu, Other Counties) with dynamic pricing
- **M-Pesa Payments** – STK Push integration with callback handling
- **Order Management** – View order history and status
- **Admin Dashboard** – Manage products, orders, users, and view analytics
- **Responsive Design** – Mobile-friendly with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- React (Vite) + Tailwind CSS
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- JWT stored in localStorage

### Backend
- Node.js + Express.js
- Prisma ORM + MySQL
- Bcrypt for password hashing
- JWT for authentication
- M-Pesa STK Push (Daraja API)
- Cloudinary for image uploads

### Database
- MySQL (Railway or local)

### Deployment
- Frontend: Vercel
- Backend: Render / Railway
- Database: Railway MySQL
- Images: Cloudinary

## 📁 Project Structure
