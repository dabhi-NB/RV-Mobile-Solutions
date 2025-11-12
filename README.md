📂 Project Structure (Daksh Mobile Accessories)
daksh-mobile-accessories/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── userRoutes.js
│   │   └── orderRoutes.js
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── userController.js
│   │   └── orderController.js
│   └── config/
│       └── db.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api.js
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ProductPage.jsx
│       │   ├── CartPage.jsx
│       │   └── CheckoutPage.jsx
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProductCard.jsx
│       │   ├── CartItem.jsx
│       │   └── Footer.jsx
│       └── styles/
│           └── main.css
└── README.md

⚙️ Backend Setup
# Navigate to backend folder
cd D:\Daksh Mobile Accessories\backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mongoose dotenv cors bcryptjs jsonwebtoken

# Install dev dependency for development
npm install -D nodemon

# Start backend server
npm start


Create .env file inside backend/:

PORT=5000
MONGO_URI=mongodb://localhost:27017/daksh_accessories


🎨 Frontend Setup (Vite + React)
# Navigate to frontend folder
cd D:\Daksh Mobile Accessories\frontend

# Create React app with Vite in current folder
npm create vite@latest . 

# Choose: React → JavaScript

# Install frontend dependencies
npm install axios bootstrap react-router-dom

# Start React development server
npm run dev


👉 If you want to use npm start instead of npm run dev, edit package.json in frontend:

"scripts": {
  "start": "vite",
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}


Now you can simply run:

npm start


✅ With this structure, you’ll have:

Backend: Express + MongoDB + JWT + Bcrypt

Frontend: Vite + React + Bootstrap + Router + Axios

Clean setup without CRA errors

