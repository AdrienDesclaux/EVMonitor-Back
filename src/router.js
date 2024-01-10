const express = require('express');

const router = express.Router();

// const userController = require('./controllers/userController');
const authController = require('./controllers/authController');
const tokenController = require('./controllers/tokenController');
const authenticateToken = require('./middlewares/authenticateToken');
const userController = require('./controllers/userController');
const addressController = require('./controllers/addressController');
const nativeCoinController = require('./controllers/nativeCoinController');

// Route to refresh JWT token. This is used to obtain a new access token
// when the existing access token has expired or is invalid.
router.get('/refresh_token', tokenController.refreshAccessToken);

// Authenticate the user
router.post('/users/login', authController.login);
router.post('/users/signup', authController.signup);
router.delete('/users/logout', authenticateToken, authController.logout);

router.get('/user', authenticateToken, userController.getUser);
router.delete('/user', authenticateToken, userController.deleteUser);
router.patch('/user', authenticateToken, userController.updateUser);
router.post('/user', authenticateToken, userController.verifyPassword);

// Associated an address to a user (bookmark or owned)
// Add the erc20 address into the table + add the userHasAddresses table
router.post(
  '/addresses',
  authenticateToken,
  addressController.addAddressToUser,
);

// Delete the junction between an address and an user
router.delete(
  '/addresses/:addressId',
  authenticateToken,
  addressController.deleteAddressUser,
);

// Retrieve all addresses associated with a user
router.get('/addresses', authenticateToken, addressController.getUserAddresses);

// Change the subname of an address
router.patch(
  '/addresses/subname',
  authenticateToken,
  addressController.updateSubname,
);

// Modifies the links between user and address for favorites and owned(remove bookmark or add owned)
router.patch(
  '/addresses',
  authenticateToken,
  addressController.updateTypeAdress,
);

// Add the native balance to an address
router.post(
  '/addresses/nativeCoinBalance',
  authenticateToken,
  addressController.addBalanceNativeCoinAddress,
);

// Get the native balance from an address
router.get(
  '/addresses/:address/nativeCoinBalance',
  authenticateToken,
  nativeCoinController.getNativeBalanceByAddress,
);

// Get the details of an address
router.get(
  '/addresses/:address',
  authenticateToken,
  addressController.getAddressDetails,
);

// Refresh the data of an address
router.post(
  '/addresses/:address',
  authenticateToken,
  addressController.refreshAddress,
);

module.exports = router;
