/* eslint-disable no-console */
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateForm = require('../utils/validateForm');

const authController = {
  // POST
  signup: async (req, res) => {
    try {
      // Get from the form the informations to sign up
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        return res
          .status(400)
          .json({ error: 'Un ou plusieurs champs sont manquants' });
      }

      // Check if email or username is already in use
      const checkUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });
      // If user already in use return status 400
      if (checkUser) {
        return res
          .status(400)
          .json({ error: "L'email ou le pseudonyme n'est pas disponible" });
      }

      // Check if the email format is correct
      const emailChecked = validateForm.validateEmail(email);

      // If the email isn't valid return status 400
      if (emailChecked === false) {
        return res.status(400).json({
          error: 'Merci de renseigner un email valide',
        });
      }
      // Check if the password format is correct
      const passwordChecked = validateForm.validatePassword(password);

      // If the password isn't valid return status 400
      if (passwordChecked === false) {
        return res.status(400).json({
          error: 'Merci de respecter les restrictions de mot de passe',
        });
      }

      // Encrypt the password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      await User.create({
        email,
        username,
        password: encryptedPassword,
        is_admin: false,
      });
      return res.status(201).json({ message: 'Utilisateur crée avec succès' });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  // POST
  login: async (req, res) => {
    try {
      // Get from the form the credentials to log in
      const { email, password } = req.body;
      // Check if the email is already in database
      const user = await User.findOne({
        where: {
          email,
        },
      });

      // If there is no user matching that email, return 401
      if (!user) {
        return res
          .status(401)
          .json({ error: 'Email ou mot de passe incorrect' });
      }

      // Now compare the user's password with the one from the form
      const passwordIsOk = await bcrypt.compare(password, user.password);
      // If passowrd doesn't match, return 401
      if (!passwordIsOk) {
        return res
          .status(401)
          .json({ error: 'Email ou mot de passe incorrect' });
      }

      // Create JWT token
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' },
      );

      // Create JWT refresh token
      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' },
      );

      // Set 'refreshToken' cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Set 'accesToken' cookie
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: 'strict',
      });

      return res.status(200).json({ message: 'Connexion réussie' });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },
  // DELETE
  logout: (req, res) => {
    try {
      // Clear both refresh and accesstoken from the cookies
      res.clearCookie('accessToken', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.clearCookie('refreshToken', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }
  },
};

module.exports = authController;
