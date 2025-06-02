import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

const userAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token provided" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        // console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
    }


    export default userAuth;