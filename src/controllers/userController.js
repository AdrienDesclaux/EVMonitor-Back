const bcrypt = require('bcrypt');
const User = require('../models/User');
const validateForm = require('../utils/validateForm');

const userController = {
  getUser: async (req, res) => {
    try {
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;
      // Check if userId is present, otherwise return an error
      if (!userId) {
        return res.status(401).json({ error: 'Id utilisateur requis' });
      }

      // Find user with userId
      const userRequest = await User.findByPk(userId);
      // Construct a simplified user object with selected properties
      const user = {
        id: userRequest.id,
        username: userRequest.username,
        email: userRequest.email,
        is_admin: userRequest.is_admin,
        createdAt: userRequest.createdAt,
        updatedAt: userRequest.updatedAt,
      };
      return res
        .status(200)
        .json({ user, message: 'Informations utilisateur trouvées' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  deleteUser: async (req, res) => {
    try {
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;

      // Check if userId is present, otherwise return an error
      if (!userId) {
        return res.status(401).json({ error: 'Id utilisateur requis' });
      }

      // Delete the user from the database corresponding to userId
      await User.destroy({
        where: {
          id: userId,
        },
      });

      // Delete jwt acces and refresh token stored in cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      // Response on successful deletion
      return res
        .status(200)
        .json({ message: 'Utilisateur supprimé avec succès!' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  verifyPassword: async (req, res) => {
    try {
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;
      // Retrieve the password from the body
      const { password } = req.body;
      // If userId is null
      if (!userId) {
        return res.status(401).json({ error: 'Id utilisateur requis' });
      }

      // Find user with the userId
      const user = await User.findByPk(userId);

      // If no user found
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      // Check if the password from the body correspond to the user's password found
      const isPasswordOk = await bcrypt.compare(password, user.password);

      // If the password is correct
      if (isPasswordOk) {
        return res.status(200).json({ message: 'Mot de passe correct' });
      }

      return res.status(401).json({ error: 'Mot de passe incorrect' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  updateUser: async (req, res) => {
    try {
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;
      // Retrieve the username and the newpassword from the body
      const { username, newPassword } = req.body;
      // If userId is null
      if (!userId) {
        return res.status(401).json({ error: 'Id utilisateur requis' });
      }

      // Check if at least one field is not present
      if (!username && !newPassword) {
        return res.status(400).json({
          error:
            "Aucun champ de mise à jour fourni. Veuillez fournir un nom d'utilisateur ou un nouveau mot de passe.",
        });
      }
      // if username found, update it
      if (username) {
        User.update({ username }, { where: { id: userId } });
        return res
          .status(201)
          .json({ message: "Nom d'utilisateur mis à jour avec succès" });
      }
      // Update password with encrypted password
      if (newPassword) {
        // Check if the password has a valid format
        const checkPassword = validateForm.validatePassword(newPassword);
        // if not valid
        if (checkPassword === false) {
          return res.status(400).json({
            error: 'Merci de respecter les restrictions de mot de passe',
          });
        }
        // Encrtpy the newpassword with bcrypt
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        User.update({ password: encryptedPassword }, { where: { id: userId } });

        // Invalidate the current JWT tokens
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
      }
      return res.status(201).json({
        message:
          'Mot de passe mis à jour avec succès, merci de vous reconnecter',
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },
};

module.exports = userController;
