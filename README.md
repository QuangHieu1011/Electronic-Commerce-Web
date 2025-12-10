# 🛒 Electronic Commerce Web - TechStore

A modern e-commerce platform specializing in technology devices, built with MERN Stack (MongoDB, Express, React, Node.js).

![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-16.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)

## ✨ Features

### 🛍️ Customer Features
- **Authentication & Security**
  - User registration/login with OTP email verification
  - JWT Token authentication
  - Profile management with avatar upload
  - Secure password hashing

- **Shopping Experience**
  - Browse products with pagination
  - Advanced search and filter by categories
  - Detailed product pages with image gallery
  - Real-time shopping cart updates
  - Product comparison (up to 4 products)
  - Product reviews and ratings
  - Wishlist functionality

- **Checkout & Payment**
  - Multiple payment methods:
    - Cash on Delivery (COD)
    - Bank Transfer with QR Code
    - Credit/Debit Card
    - PayPal Integration
  - Voucher/Discount code system
  - Automatic shipping fee calculation
  - QR Code for bank payment

- **Order Management**
  - Real-time order tracking
  - Order history
  - Map tracking for delivery location
  - Order cancellation
  - Email notifications

### 👨‍💼 Admin Features
- **Dashboard**
  - Overview statistics
  - Revenue reports
  - Sales analytics
  - User activity tracking

- **Product Management**
  - Create, Read, Update, Delete products
  - Bulk import/export
  - Category management
  - Image upload to Cloudinary

- **Order Management**
  - View all orders
  - Update order status
  - Track delivery
  - Handle cancellations

- **User Management**
  - View all users
  - Block/Unblock users
  - Role management
  - Activity logs

- **Voucher Management**
  - Create discount codes
  - Set expiry dates
  - Usage limits
  - Percentage or fixed discounts

### 🤖 AI Chatbot
- 24/7 customer support
- Claude AI integration
- Intelligent product recommendations
- Natural language processing

## 🎬 Demo

### Customer Portal
```
URL: http://localhost:3000
```

### Admin Portal
```
URL: http://localhost:3000/admin
Email: admin@admin.com
Password: admin123
```

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI Framework
- **Redux Toolkit** - State Management
- **React Router** v6 - Routing
- **Ant Design** - UI Component Library
- **Styled Components** - CSS-in-JS
- **Axios** - HTTP Client
- **React Slick** - Carousel Component
- **React Query** - Data Fetching & Caching
- **React Icons** - Icon Library

### Backend
- **Node.js** & **Express** - Server Framework
- **MongoDB** & **Mongoose** - Database & ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Nodemailer** - Email Service
- **Multer** - File Upload Middleware
- **Cloudinary** - Image Storage & CDN
- **Dotenv** - Environment Variables
- **CORS** - Cross-Origin Resource Sharing

### DevOps & Tools
- **Git** - Version Control
- **MongoDB Atlas** - Cloud Database
- **Postman** - API Testing
- **VS Code** - Code Editor

## 📦 Installation

### Prerequisites
- Node.js >= 16.x
- MongoDB >= 4.x
- npm or yarn
- Git

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/Electronic-Commerce-Web.git
cd Electronic-Commerce-Web
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend` folder:
```env
PORT=3001
MONGO_DB=mongodb+srv://your-username:your-password@cluster.mongodb.net/?appName=Cluster0
ACCESS_TOKEN=your_access_token_secret
REFRESH_TOKEN=your_refresh_token_secret
CHATBOT_IDENTITY_SECRET=your_chatbot_secret

# Email Configuration for OTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM_NAME=TechStore
EMAIL_REPLY_TO=your-email@gmail.com
```

Start the backend server:
```bash
npm start
# Or development mode with nodemon
npm run dev
```

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend` folder:
```env
REACT_APP_API_URL=http://localhost:3001
```

Start the frontend:
```bash
npm start
```

The application will open at `http://localhost:3000`

### Step 4: Seed Sample Data (Optional)
```bash
cd backend
node src/seedProducts.js
```

## 📁 Project Structure

```
Electronic-Commerce-Web/
├── backend/
│   ├── src/
│   │   ├── config/              # Database & Cloudinary config
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   ├── controllers/         # Request handlers
│   │   │   ├── UserController.js
│   │   │   ├── ProductController.js
│   │   │   ├── OrderController.js
│   │   │   └── OTPController.js
│   │   ├── middleware/          # Custom middleware
│   │   │   └── authMiddleware.js
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── UserModel.js
│   │   │   ├── ProductModel.js
│   │   │   ├── OrderModel.js
│   │   │   └── OTPModel.js
│   │   ├── routes/              # API routes
│   │   │   ├── UserRouter.js
│   │   │   ├── ProductRouter.js
│   │   │   ├── OrderRouter.js
│   │   │   └── OTPRouter.js
│   │   ├── services/            # Business logic
│   │   │   ├── UserService.js
│   │   │   ├── ProductService.js
│   │   │   ├── OrderService.js
│   │   │   └── EmailService.js
│   │   └── index.js             # Entry point
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── favicon.ico
    ├── src/
    │   ├── assets/              # Static files
    │   │   ├── images/
    │   │   └── icons/
    │   ├── components/          # Reusable components
    │   │   ├── AdminUser/
    │   │   ├── ButtonComponent/
    │   │   ├── CardComponent/
    │   │   ├── HeaderComponent/
    │   │   ├── InputForm/
    │   │   ├── LoadingComponent/
    │   │   ├── ModalComponent/
    │   │   ├── NavbarComponent/
    │   │   ├── PaymentModal/
    │   │   ├── ProductCard/
    │   │   └── ...
    │   ├── pages/               # Page components
    │   │   ├── HomePage/
    │   │   ├── ProductDetailPage/
    │   │   ├── CheckoutPage/
    │   │   ├── ProfilePage/
    │   │   ├── OrderPage/
    │   │   ├── AdminPage/
    │   │   └── ...
    │   ├── redux/               # Redux store
    │   │   ├── slides/
    │   │   │   ├── userSlide.js
    │   │   │   ├── productSlide.js
    │   │   │   └── orderSlide.js
    │   │   └── store.js
    │   ├── service/             # API services
    │   │   ├── UserService.js
    │   │   ├── ProductService.js
    │   │   └── OrderService.js
    │   ├── hooks/               # Custom React hooks
    │   ├── utils/               # Utility functions
    │   ├── App.js               # Main App component
    │   ├── index.js             # Entry point
    │   └── routes.js            # Route configuration
    ├── .env                     # Environment variables
    ├── .gitignore
    └── package.json
```

## 🔌 API Documentation

### Authentication Endpoints
```http
POST   /api/user/sign-up          # Register new user
POST   /api/user/sign-in          # User login
POST   /api/user/log-out          # User logout
POST   /api/user/refresh-token    # Refresh access token
GET    /api/user/get-details/:id  # Get user details
PUT    /api/user/update-user/:id  # Update user profile
DELETE /api/user/delete-user/:id  # Delete user (Admin)
GET    /api/user/getAll            # Get all users (Admin)
```

### OTP Endpoints
```http
POST   /api/otp/send              # Send OTP to email
POST   /api/otp/verify            # Verify OTP code
```

### Product Endpoints
```http
GET    /api/product                           # Get all products
GET    /api/product/:id                       # Get product by ID
POST   /api/product                           # Create product (Admin)
PUT    /api/product/:id                       # Update product (Admin)
DELETE /api/product/:id                       # Delete product (Admin)
GET    /api/product/search?name=keyword       # Search products
GET    /api/product/category/:category        # Get by category
```

### Order Endpoints
```http
POST   /api/order                 # Create new order
GET    /api/order/user/:id        # Get user orders
GET    /api/order/:id             # Get order details
GET    /api/order/all             # Get all orders (Admin)
PUT    /api/order/:id             # Update order status
DELETE /api/order/:id             # Cancel order
```

### Voucher Endpoints
```http
GET    /api/voucher               # Get all vouchers
POST   /api/voucher               # Create voucher (Admin)
POST   /api/voucher/apply         # Apply voucher code
PUT    /api/voucher/:id           # Update voucher (Admin)
DELETE /api/voucher/:id           # Delete voucher (Admin)
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=3001

# Database
MONGO_DB=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0

# JWT Secrets
ACCESS_TOKEN=your_secure_access_token_secret_key
REFRESH_TOKEN=your_secure_refresh_token_secret_key

# Chatbot
CHATBOT_IDENTITY_SECRET=your_chatbot_api_key

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM_NAME=TechStore
EMAIL_REPLY_TO=your-email@gmail.com

# Cloudinary (Optional)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# PayPal (Optional)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 📧 Gmail App Password Setup
1. Go to Google Account Settings
2. Enable 2-Step Verification
3. Go to Security > App passwords
4. Generate new app password for "Mail"
5. Use generated password in `EMAIL_PASS`

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)
*Modern and responsive homepage with featured products*

### Product Detail
![Product Detail](./screenshots/product-detail.png)
*Detailed product information with image gallery*

### Shopping Cart
![Shopping Cart](./screenshots/cart.png)
*Interactive shopping cart with quantity controls*

### Checkout Process
![Checkout](./screenshots/checkout.png)
*Streamlined checkout with multiple payment options*

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Comprehensive admin panel with analytics*

### Order Tracking
![Order Tracking](./screenshots/order-tracking.png)
*Real-time order tracking with map integration*

## 🎨 Key Features Explained

### 1. OTP Email Verification
- Secure account activation via email
- 6-digit OTP code with 10-minute expiry
- Resend functionality after 60 seconds
- Professional email templates
- Spam protection

### 2. Multi-Payment System
- **Cash on Delivery (COD)**: Pay when you receive
- **Bank Transfer**: Auto-generated QR Code with VietQR
- **Credit Card**: Secure card payment form
- **PayPal**: International payment gateway
- Payment status tracking

### 3. Voucher System
- Percentage discount (e.g., 10% off)
- Fixed amount discount (e.g., $10 off)
- Free shipping vouchers
- Minimum order value requirements
- Usage limit per user
- Expiry date management

### 4. Order Tracking
- Real-time status updates
- Interactive map tracking
- Email notifications at each stage
- Detailed order timeline
- Delivery estimation
- Support for cancellations

### 5. Product Comparison
- Compare up to 4 products side-by-side
- Highlight key differences
- Visual comparison table
- Spec-by-spec analysis
- Add to cart directly from comparison

### 6. AI Chatbot
- Powered by Claude AI
- Natural language understanding
- Product recommendations
- Order assistance
- FAQ responses
- 24/7 availability

## 🚀 Deployment

### Backend Deployment (Railway/Render)

#### Using Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Add environment variables in Railway dashboard
# Deploy
railway up
```

#### Using Render:
1. Create account on [Render](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Set build command: `cd backend && npm install`
5. Set start command: `node src/index.js`
6. Add environment variables
7. Deploy

### Frontend Deployment (Vercel/Netlify)

#### Using Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Build production
cd frontend
npm run build

# Deploy
vercel --prod
```

#### Using Netlify:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build production
npm run build

# Deploy
netlify deploy --prod --dir=build
```

### Database (MongoDB Atlas)
1. Create cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IP addresses (0.0.0.0/0 for all)
4. Get connection string
5. Update MONGO_DB in .env

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt rounds
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Sanitize user inputs
- **XSS Protection**: Prevent cross-site scripting
- **SQL Injection Prevention**: Mongoose query validation
- **Rate Limiting**: Prevent brute force attacks (Recommended)
- **HTTPS Only**: Secure data transmission (Production)
- **Environment Variables**: Sensitive data protection

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run E2E tests
npm run test:e2e
```

## 📈 Performance Optimization

- Lazy loading components
- Image optimization with Cloudinary
- Redux for efficient state management
- Debounced search functionality
- Pagination for large datasets
- MongoDB indexing
- CDN for static assets
- Code splitting

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**Lê Công Bảo & Lưu Quang Hiếu**

- 📧 Email: luuquanghieu9.6pht@gmail.com
- 🐙 GitHub: [@quanghieu](https://github.com/your-username)
- 💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)

## 🙏 Acknowledgments

- [React Documentation](https://reactjs.org/)
- [Ant Design](https://ant.design/)
- [MongoDB University](https://university.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Claude AI by Anthropic](https://www.anthropic.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 📞 Support

If you have any questions or need help, please:
- Create an [Issue](https://github.com/your-username/Electronic-Commerce-Web/issues)
- Email us at: luuquanghieu9.6pht@gmail.com
- Join our [Discord Community](https://discord.gg/your-invite) (Optional)

## 🗺️ Roadmap

- [ ] Mobile responsive improvements
- [ ] Progressive Web App (PWA)
- [ ] Multi-language support (i18n)
- [ ] Social media login (Google, Facebook)
- [ ] Product recommendations AI
- [ ] Live chat support
- [ ] Export orders to PDF
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Supplier management



---

<div align="center">

### ⭐ Star this repo if you find it helpful! ⭐

Developed by [Lê Công Bảo & Lưu Quang Hiếu](https://github.com/your-username)

</div>
