/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

// Extracts the access token from the cookie.
function authenticateToken(req, res, next) {
  // Extract the 'accessToken' from the cookies in the request
  const { accessToken } = req.cookies;

  // Check if accessToken is present
  if (!accessToken) return res.sendStatus(401);

  // Verify the accessToken using the JWT_ACCESS_SECRET
  jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    // Set the authenticated user information in the request object
    req.user = user;
    // Continue to the next middleware or route handler
    next();
  });
}

module.exports = authenticateToken;
