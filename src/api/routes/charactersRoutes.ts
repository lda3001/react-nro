import { Router, RequestHandler } from 'express';
import { getAllCharacters, getCharacterById } from '../controllers/charactersController';

const router = Router();

// GET all characters
router.get('/', getAllCharacters as RequestHandler);

// GET character by ID
router.get('/:id', getCharacterById as RequestHandler);

export default router;
