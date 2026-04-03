import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Make false initially to not break seeded db
  },
  category: {
    type: String,
    enum: ['eyewear', 'tops', 'bottoms', 'dresses', 'footwear', 'headwear', 'accessories', 'furniture'],
    required: true,
  },
  images: [{
    type: String,
  }],
  arEnabled: {
    type: Boolean,
    default: false,
  },
  arAssetUrl: {
    type: String,
  },
  arType: {
    type: String,
    enum: ['face', 'pose', 'furniture', null],
    default: null,
  },
  stock: {
    type: Number,
    default: 0,
  },
  rating: {
    avg: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    }
  }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
