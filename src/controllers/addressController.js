const erc20Controller = require('./erc20Controller');
const erc721Controller = require('./erc721Controller');
const fetchNativeCoinBalance = require('../utils/fetchNativeCoinBalance');
const updateAddressBalance = require('../utils/updateAddressBalance');
const validateAddress = require('../utils/validateAddress');
const {
  Address,
  User,
  UserHasAddresses,
  AddressHasNativeCoin,
  NativeCoin,
  Erc721,
  Erc20,
} = require('../models/index');

const addressController = {
  addAddressToUser: async (req, res) => {
    try {
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;
      // Retrieve informations from the form
      const { address, isFavorite, isOwned, subname } = req.body;
      // Validate that the address is existing in the blockchain
      const isValid = validateAddress(address);

      // Check if the address is present in the body request
      if (!address) {
        return res.status(401).json({ error: 'Une adresse est requise' });
      }

      // If the address isn't valid, return 400
      if (!isValid) {
        return res.status(400).json({ error: 'Adresse non valide' });
      }
      // Look for the address in the DB to avoid duplicates
      // Uses of the public key as search criteria
      const existingAddress = await Address.findOne({
        where: { public_key: address },
      });

      let addressRecord;

      // If address doesn't exist in database
      if (!existingAddress) {
        // Create a new entry for address in database
        addressRecord = await Address.create({ public_key: address });
        console.log('addressRecord', addressRecord);
      } else {
        // If address does exist, we use it as it
        addressRecord = existingAddress;
      }

      // Check if the user has already this address associated
      const userHasAlreadyAddress = await UserHasAddresses.findOne({
        where: { id_user: userId, id_address: addressRecord.id },
      });
      if (userHasAlreadyAddress) {
        return res.status(400).json({ error: 'Adresse déja ajoutée' });
      }
      // Create an association between user and address
      // Adding informations about bookmarked or owned
      await UserHasAddresses.create({
        id_user: userId,
        id_address: addressRecord.id,
        is_favorite: isFavorite,
        is_owned: isOwned,
        subname,
      });

      // Create an association between address and nativeCoin
      await AddressHasNativeCoin.create({
        id_address: addressRecord.id,
        id_nativecoin: 1,
        balance: 50,
      });

      // Call the erc20Controller to create the erc20 in the database
      await erc20Controller.addErc20(addressRecord);
      // Call the erc721Controller to create the erc721 in the database
      await erc721Controller.addErc721(addressRecord);
      return res
        .status(200)
        .json({ message: "Adresse ajouté à l'utilisateur" });
    } catch (error) {
      console.error(
        'Erreur globale lors du traitement des tokens ERC20 :',
        error,
      );
      return res.status(400).json({ error });
    }
  },

  getUserAddresses: async (req, res) => {
    try {
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;
      // Retrieve the address + user + association
      const addresses = await Address.findAll({
        include: [
          {
            model: User,
            as: 'users',
            where: { id: userId },
            through: {
              attributes: ['id'],
            },
          },
        ],
      });

      // Update the balance of each address
      await Promise.all(addresses.map(updateAddressBalance));
      // Asking database for all the addresses that are linked to an user
      const user = await Address.findAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: [
          {
            model: User,
            as: 'users',
            where: { id: userId },
            attributes: {
              exclude: [
                'password',
                'email',
                'username',
                'createdAt',
                'updatedAt',
              ],
            },
            through: {
              attributes: { exclude: ['createdAt', 'updatedAt'] },
            },
          },
          {
            model: NativeCoin,
            as: 'nativecoins',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            through: {
              attributes: { exclude: ['id_address', 'createdAt', 'updatedAt'] },
            },
          },
        ],
      });
      // If the user isn't found return 404
      if (!user || user.length === 0) {
        return res.status(404).json({ error: 'Aucune addresses associé' });
      }

      const totalBalanceOwned = user.reduce((sum, address) => {
        // Check if the address is owned by the user
        if (address.users[0].UserHasAddresses.is_owned) {
          // If owned, extract the balance from the native coin associated with the address
          const balance = parseFloat(
            address.nativecoins[0].AddressHasNativeCoin.balance,
          );
          // Add the balance to the running sum
          return sum + balance;
        }
        // If the address is not owned, do not modify the sum
        return sum;
      }, 0);

      return res.status(200).json({ user, totalBalanceOwned });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  updateTypeAdress: async (req, res) => {
    try {
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;
      const { addressId, isFavorite, isOwned } = req.body;
      // If addressId isn't provided, or if isFavorite and isOwned
      // isn't provided simultaneously, return an error
      if (!addressId || isFavorite == null || isOwned == null) {
        return res.status(400).json({
          error:
            'Des champs sont manquants, ou isFavorite et isOwned ne sont pas fourni simultanément',
        });
      }
      // If isFavorite and isOwned are equal, return an error
      if (isFavorite === isOwned) {
        return res
          .status(400)
          .json({ error: 'IsFavorite ne peux pas être égale à isOwned' });
      }
      // Otherwise, update type of address
      await UserHasAddresses.update(
        {
          is_favorite: isFavorite,
          is_owned: isOwned,
        },
        {
          where: { id_user: userId, id_address: addressId },
        },
      );

      return res.status(200).json({ message: 'Addresse modifié avec succès' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  addBalanceNativeCoinAddress: async (req, res) => {
    try {
      // Retrieve the address from the body
      const { address } = req.body;
      // If there is not address, return 401
      if (!address) {
        return res.status(401).json({ error: 'Une adresse est requise' });
      }
      // Get the native coin balance on address provided from body
      const balanceAddress = await fetchNativeCoinBalance(address);

      // Retrieve the id of the address
      const getAddressId = await Address.findOne({
        where: { public_key: address },
      });
      // If there is not address
      if (!getAddressId) {
        return res.status(401).json({ error: 'Adresse inconnu' });
      }
      // Check if there is an association between nativecoin and the address
      const existingBalanceAddress = await AddressHasNativeCoin.findOne({
        where: { id_address: getAddressId.id },
      });
      // If balance association isn't found in db, create it
      if (!existingBalanceAddress) {
        await AddressHasNativeCoin.create({
          id_address: getAddressId.id,
          id_nativecoin: 1,
          balance: balanceAddress,
        });
        return res.status(200).json({ message: "Balance de l'adresse crée" });
      }
      // If balance association is found, update it
      await AddressHasNativeCoin.update({
        where: { id_address: getAddressId },
        balance: balanceAddress,
      });
      return res.status(200).json({ message: 'Balance mise à jour' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  getAddressDetails: async (req, res) => {
    try {
      // Retrieve the address from the params
      const { address } = req.params;

      // Call the DB to get data from both erc20 and erc721
      const erc20Data = await erc20Controller.getErc20FromAddress(address);
      const erc721Data = await erc721Controller.getErc721FromAddress(address);

      // Insert the data into an object
      const data = {
        erc20Data,
        erc721Data,
      };

      return res.status(200).json({ data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  deleteAddressUser: async (req, res) => {
    try {
      // Retrieve the address from the params
      const { addressId } = req.params;
      // Retrieve userId from req.user, set by authentication middleware
      const { userId } = req.user;

      // Destroy the link between user and address
      await UserHasAddresses.destroy({
        where: { id_address: addressId, id_user: userId },
      });
      return res
        .status(200)
        .json({ message: 'Adresse supprimé de votre liste' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  },

  updateSubname: async (req, res) => {
    // Retrieve userId from req.user, set by authentication middleware
    const { userId } = req.user;
    const { addressId, subname } = req.body;
    try {
      // if no address or subname
      if (!addressId || !subname) {
        return res
          .status(400)
          .json({ error: 'Données manquantes dans la requête' });
      }
      // Update the subname in the UserHasAddresses table for the specified user and address
      const [rowAffected] = await UserHasAddresses.update(
        { subname },
        { where: { id_user: userId, id_address: addressId } },
      );
      // Check if the update affected any rows
      if (rowAffected === 0) {
        return res
          .status(400)
          .json({ error: "L'addresse n'est pas liée à l'utilisateur" });
      }
      return res.status(200).json({ message: 'Modifier avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Erreur lors de la mise à jour' });
    }
  },

  refreshAddress: async (req, res) => {
    // Retrieve the address from the params
    const { address } = req.params;
    try {
      // Find the address in the Address table based on the provided public key
      const findAddress = await Address.findAll({
        where: { public_key: address },
      });
      // Call controllers to refresh ERC721 and ERC20 data for the found address
      await erc721Controller.addErc721(findAddress[0]);
      await erc20Controller.addErc20(findAddress[0]);

      return res
        .status(200)
        .json({ message: "Mise à jour de l'adresse réussi" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  },
};

module.exports = addressController;
