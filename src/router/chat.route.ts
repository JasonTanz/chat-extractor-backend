import express from 'express';
import uploadMiddleware from '../middlewares/uploadMiddleware';
import { analyze } from '../controllers/chat.controller';

const router = express.Router();

// POST /api/chat/analyze
router.post('/analyze', uploadMiddleware, analyze);

export default router;
