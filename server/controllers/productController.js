import mongoose from 'mongoose';
import Product from '../models/Product.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = await Product.findById(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch products by category
// @route   GET /api/products/category/:cat
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.cat;
    const products = await Product.find({ category });
    
    if (products) {
       res.json(products);
    } else {
       res.status(404).json({ message: 'No products found in this category' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
