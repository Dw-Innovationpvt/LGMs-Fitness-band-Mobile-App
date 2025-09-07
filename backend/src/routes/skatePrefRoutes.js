import express from 'express';
import { getPreferences, setPreferences } from '../controllers/skatePreferences.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getPreferences);
router.post('/', auth, setPreferences);

export default router;