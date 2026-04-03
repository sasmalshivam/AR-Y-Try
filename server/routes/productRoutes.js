import express from 'express';
import { getProducts, getProductById, getProductsByCategory } from '../controllers/productController.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/category/:cat').get(getProductsByCategory);

export default router;
