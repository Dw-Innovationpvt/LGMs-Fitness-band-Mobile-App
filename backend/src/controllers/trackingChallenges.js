// import Challenge from "../models/Challenge";
import Challenge from '../models/Challenge.js';

export const getChallenges = async (req, res) => {
  try {
    const userId = req.user._id;
    // const challenges = await Challenge.find({ userId: req.params.userId });
    const challenges = await Challenge.find({ userId });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export const getIdChallenges = async (req, res) => {
      const challenge = await Challenge.findByIdAndDelete(req.params.id);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      res.json(challenge);
}

// post = create
export const createChallenge = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from authenticated request
    const startDate = Date.now(); // Set start date to current time
      const { title, description, type, duration } = req.body;
      const challenge = new Challenge({
        title,
        description,
        type,
        duration,
        startDate,
        userId,
        progress: []
      });
      await challenge.save();
      res.status(201).json(challenge);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
}

// put = update
export const updateChallenge = async (req, res) => {
  try {
    const { date, completed, details } = req.body;
    console.log(req.params.id, "challenge id from params");

    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    const progressEntry = challenge.progress.find(entry => 
      entry.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    if (progressEntry) {
      progressEntry.completed = completed;
      progressEntry.details = details;
    } else {
      challenge.progress.push({ date, completed, details });
    }

    await challenge.save();
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
export const deleteChallenge = async (req, res) => {
  // try {
  //   const challengeId = req.params.id;
  //   const challenge = await Challenge.findByIdAndDelete(challengeId);
  //   if (!challenge) {
  //     return res.status(404).json({ message: "Challenge not found" });
  //   }
  //   res.status(200).json({ message: "Challenge deleted successfully" });
  // } catch (error) {
  //   res.status(500).json({ message: "Error deleting challenge", error: error.message });
  // }
    try {
      const challenge = await Challenge.findByIdAndDelete(req.params.id);
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
      res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}
