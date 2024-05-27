import express from 'express';
import { getCategories } from '../controllers/categoryController.js'
const router = express.Router();

router.get('/get-category', getCategories);

export default router;