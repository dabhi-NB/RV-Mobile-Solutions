require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const User = require("./models/User");
const CartItem = require("./models/Cart");
const Order = require("./models/Order");

const bcrypt = require("bcryptjs");

const products = [
  {
    name: "Silicone Phone Case",
    brand: "Daksh",
    category: "Covers",
    description: "Soft silicone protective case",
    image: "https://picsum.photos/seed/case/600/400",
    price: 199,
    countInStock: 50,
  },
  {
    name: "Fast Charger 20W",
    brand: "Daksh",
    category: "Chargers",
    description: "USB-C fast wall charger",
    image: "https://picsum.photos/seed/charger/600/400",
    price: 499,
    countInStock: 100,
  },
  {
    name: "Wireless Earbuds",
    brand: "Daksh",
    category: "Audio",
    description: "Bluetooth earbuds with mic",
    image: "https://picsum.photos/seed/earbuds/600/400",
    price: 1199,
    countInStock: 30,
  },
  {
    name: "Tempered Glass Screen Protector",
    brand: "Daksh",
    category: "Accessories",
    description: "HD clear screen protector",
    image: "https://picsum.photos/seed/glass/600/400",
    price: 149,
    countInStock: 80,
  },
  {
    name: "Bluetooth Speaker Mini",
    brand: "Daksh",
    category: "Audio",
    description: "Portable mini Bluetooth speaker",
    image: "https://picsum.photos/seed/speaker/600/400",
    price: 899,
    countInStock: 45,
  },
  {
    name: "Power Bank 10000mAh",
    brand: "Daksh",
    category: "Chargers",
    description: "Fast charging portable power bank",
    image: "https://picsum.photos/seed/powerbank/600/400",
    price: 1399,
    countInStock: 60,
  },
  {
    name: "Car Charger Dual Port",
    brand: "Daksh",
    category: "Chargers",
    description: "Dual USB car charger for smartphones",
    image: "https://picsum.photos/seed/carcharger/600/400",
    price: 299,
    countInStock: 75,
  },
  {
    name: "Gaming Headphones",
    brand: "Daksh",
    category: "Audio",
    description: "Over-ear gaming headset with mic",
    image: "https://picsum.photos/seed/headphones/600/400",
    price: 1699,
    countInStock: 25,
  },
  {
    name: "Mobile Stand",
    brand: "Daksh",
    category: "Accessories",
    description: "Adjustable desktop mobile holder",
    image: "https://picsum.photos/seed/stand/600/400",
    price: 249,
    countInStock: 90,
  },
  {
    name: "OTG Cable Type-C",
    brand: "Daksh",
    category: "Cables",
    description: "USB Type-C to USB OTG cable",
    image: "https://picsum.photos/seed/otg/600/400",
    price: 99,
    countInStock: 150,
  },
  // Add up to 25 similar products easily:
];

while (products.length < 25) {
  products.push({
    name: `Product ${products.length + 1}`,
    brand: "Daksh",
    category: "Accessories",
    description: "Random sample product",
    image: `https://picsum.photos/seed/item${products.length + 1}/600/400`,
    price: Math.floor(Math.random() * 2000) + 100,
    countInStock: Math.floor(Math.random() * 100) + 10,
  });
}

const users = Array.from({ length: 10 }, (_, i) => ({
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  password: bcrypt.hashSync("123456", 10),
  isAdmin: false,
}));

const admins = [
  {
    name: "Admin One",
    email: "admin1@example.com",
    password: bcrypt.hashSync("admin123", 10),
    isAdmin: true,
  },
  {
    name: "Admin Two",
    email: "admin2@example.com",
    password: bcrypt.hashSync("admin123", 10),
    isAdmin: true,
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await User.deleteMany({});
    await CartItem.deleteMany({});
    await Order.deleteMany({});

    const createdProducts = await Product.insertMany(products);
    const createdUsers = await User.insertMany([...users, ...admins]);

    // ✅ Create sample carts
    const carts = [];
    for (let i = 0; i < 5; i++) {
      const user = createdUsers[i];
      const itemsCount = Math.floor(Math.random() * 3) + 2; // 2-4 items per cart
      const cartItems = [];

      for (let j = 0; j < itemsCount; j++) {
        const randomProduct =
          createdProducts[Math.floor(Math.random() * createdProducts.length)];
        cartItems.push({
          user: user._id,
          product: randomProduct._id, // ✅ Fix: product ID must be linked
          quantity: Math.floor(Math.random() * 3) + 1,
        });
      }

      carts.push(...cartItems);
    }
    await CartItem.insertMany(carts);

    // ✅ Create sample orders
    const orders = [];
    for (let i = 5; i < 10; i++) {
      const user = createdUsers[i];
      const orderItemsCount = Math.floor(Math.random() * 3) + 3; // 3–6 items
      const orderItems = [];

      for (let j = 0; j < orderItemsCount; j++) {
        const randomProduct =
          createdProducts[Math.floor(Math.random() * createdProducts.length)];
        orderItems.push({
          name: randomProduct.name,
          qty: Math.floor(Math.random() * 3) + 1,
          image: randomProduct.image,
          price: randomProduct.price,
          product: randomProduct._id,
        });
      }

      orders.push({
        user: user._id,
        orderItems,
        totalPrice: orderItems.reduce(
          (acc, item) => acc + item.price * item.qty,
          0
        ),
        isPaid: true,
        paidAt: Date.now(),
      });
    }
    await Order.insertMany(orders);

    console.log("✅ Users, Admins, Products, Carts & Orders seeded!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
