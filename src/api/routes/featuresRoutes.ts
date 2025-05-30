import { Router, RequestHandler } from 'express';
import { getAllFeatures, getFeatureById } from '../controllers/featuresController';

const router = Router();

// GET all features
router.get('/', getAllFeatures as RequestHandler);

// GET feature by ID
router.get('/:id', getFeatureById as RequestHandler);

export default router;
