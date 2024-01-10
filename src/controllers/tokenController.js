/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const tokenController = {
  refreshAccessToken: (req, res) => {
    // Extract the refreshToken from the cookies in the request
    const { refreshToken } = req.cookies;
    // If no refreshToken, return 401
    if (!refreshToken) return res.sendStatus(401);

    // Verify the refreshToken using the JWT_REFRESH_SECRET
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      // If there is an error during verification, return a 403 Forbidden status
      if (err) return res.sendStatus(403);

      // Generate a new access token using the userId from the verified refreshToken
      const newAccessToken = jwt.sign(
        { userId: user.userId },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' },
      );

      // Set the 'accessToken' cookie with the new access token
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict',
      });

      return res
        .status(200)
        .json({ message: 'Rafraîchissement du acces_token réussi' });
    });
  },
};

module.exports = tokenController;
