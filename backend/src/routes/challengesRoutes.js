import express from 'express';
import auth from '../middleware/auth.js';
import { getChallenges, updateChallenge, createChallenge, deleteChallenge, getIdChallenges } from '../controllers/trackingChallenges.js';

const router = express.Router();

router.get("/",auth, getChallenges); // Get all challenges for the authenticated user
router.get("/:id", auth, getIdChallenges); // Get a specific challenge by ID (if needed, can be modified to return a single challenge)
router.post("/", auth, createChallenge); // Create a new challenge
router.put("/:id/progress", auth, updateChallenge); // Update challenge progress
router.delete("/:id", auth, deleteChallenge); // Delete a challenge by ID


export default router;