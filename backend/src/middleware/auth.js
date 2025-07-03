// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Ensure the path is correct

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Get the token after "Bearer"
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    const user = await User.findById(decoded.userId).select('-password'); // Remove password

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Attach user to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// module.exports = auth;
    export default auth;