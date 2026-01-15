const jwt = require('jsonwebtoken');
const user = require('../models/userModel');

const SECRET_KEY = process.env.JWT_SECRET;

const authenticationMiddleware = async(req, res, next) => {
      try {
    const token = req.header('Authorization').replace('Bearer ', '');
    if(!token) {
        return res.status(401).json({ message: 'Authentication failed'});
    }
  
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.email = decoded.email;
        next();
    } catch(error) {
        res.status(401).json({ messages: 'Authentication failed'});
    }
}

module.exports = authenticationMiddleware;