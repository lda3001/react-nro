import { Router, RequestHandler } from 'express';
import { getAllNews, getNewsByCategory, getNewsById, addNews } from '../controllers/newsController';

const router = Router();

// GET all news
router.get('/', getAllNews as RequestHandler);

// GET news by category
router.get('/category/:category', getNewsByCategory as RequestHandler);

// GET news by ID
router.get('/:id', getNewsById as RequestHandler);

// POST new news (would be protected by auth in real app)
router.post('/', addNews as RequestHandler);

export default router;
