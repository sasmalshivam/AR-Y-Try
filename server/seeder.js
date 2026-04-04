import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ar-ecommerce')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

const mockProducts = [
  {
    name: 'Classic Ray-Ban Aviators',
    description: 'Iconic aviator sunglasses providing maximum UV protection and timeless style.',
    price: 150.00,
    category: 'eyewear',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MjM2OTZ8MHwxfHNlYXJjaHw3fHxnbGFzc2VzfGVufDB8fHx8MTcxMTU5MjA5OXww&ixlib=rb-4.0.3&q=80&w=400'],
    arEnabled: true,
    arType: 'face',
    arAssetUrl: 'https://cdn-icons-png.flaticon.com/512/103/103099.png',
    stock: 25,
    rating: { avg: 4.8, count: 120 }
  },
  {
    name: 'Vintage Denim Cap',
    description: 'A stylish vintage washed denim cap, perfect for a sunny day out.',
    price: 25.00,
    category: 'headwear',
    images: ['https://images.unsplash.com/photo-1521369909029-2afed8822615?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MjM2OTZ8MHwxfHNlYXJjaHwyfHxjYXB8ZW58MHx8fHwxNzExNTkyMTQ5fDA&ixlib=rb-4.0.3&q=80&w=400'],
    arEnabled: true,
    arType: 'face',
    arAssetUrl: 'https://cdn-icons-png.flaticon.com/512/86/86576.png',
    stock: 50,
    rating: { avg: 4.5, count: 85 }
  },
  {
    name: 'Retro Round Glasses',
    description: 'Stylish round glasses that give off a classic retro vibe.',
    price: 110.00,
    category: 'eyewear',
    images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=400'],
    arEnabled: true,
    arType: 'face',
    arAssetUrl: 'https://cdn-icons-png.flaticon.com/512/10940/10940735.png',
    stock: 40,
    rating: { avg: 4.7, count: 210 }
  },
  {
    name: 'Cotton Graphic T-Shirt',
    description: 'Comfortable premium cotton t-shirt featuring an awesome print.',
    price: 35.00,
    category: 'tops',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    arEnabled: true,
    arType: 'pose',
    arAssetUrl: 'https://cdn-icons-png.flaticon.com/512/863/863684.png',
    stock: 120,
    rating: { avg: 4.9, count: 530 }
  },
  {
    name: 'Casual Checkered Shirt',
    description: 'Great checkered button-up for a relaxed yet smart casual look.',
    price: 45.00,
    category: 'tops',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400'],
    arEnabled: true,
    arType: 'pose',
    arAssetUrl: 'https://cdn-icons-png.flaticon.com/512/1785/1785255.png',
    stock: 80,
    rating: { avg: 4.4, count: 35 }
  },
  {
    name: 'Modern Dress Shirt',
    description: 'A sharp, slim fit dress shirt perfect for the office or formal events.',
    price: 65.00,
    category: 'tops',
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'],
    arEnabled: true,
    arType: 'pose',
    arAssetUrl: 'https://cdn-icons-png.flaticon.com/512/2806/2806086.png',
    stock: 60,
    rating: { avg: 4.6, count: 42 }
  },
  {
    name: 'Nude Silk Lipstick',
    description: 'Premium nude silk lipstick with a natural finish.',
    price: 24.99,
    category: 'beauty',
    arEnabled: true,
    arType: 'face',
    stock: 100,
    rating: { avg: 4.8, count: 150 }
  },
  {
    name: 'Mauve Mist Lipstick',
    description: 'Soft mauve lipstick with a satin finish.',
    price: 26.99,
    category: 'beauty',
    arEnabled: true,
    arType: 'face',
    stock: 80,
    rating: { avg: 4.7, count: 95 }
  },
  {
    name: 'Deep Plum Lipstick',
    description: 'Rich berry plum lipstick for a bold look.',
    price: 28.99,
    category: 'beauty',
    arEnabled: true,
    arType: 'face',
    stock: 60,
    rating: { avg: 4.9, count: 120 }
  },
  {
    name: 'Sunset Coral Lipstick',
    description: 'Bright sunset coral lipstick for a fresh glow.',
    price: 24.99,
    category: 'beauty',
    arEnabled: true,
    arType: 'face',
    stock: 90,
    rating: { avg: 4.6, count: 85 }
  },
  {
    name: 'Ruby Rush Lipstick',
    description: 'Classic ruby red lipstick for timeless elegance.',
    price: 29.99,
    category: 'beauty',
    arEnabled: true,
    arType: 'face',
    stock: 75,
    rating: { avg: 5.0, count: 210 }
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(mockProducts);
    
    console.log('Data Imported successfully');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
