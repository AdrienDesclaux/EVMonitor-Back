const { Erc721, Address } = require('../models');
const fetchErc721HoldByAddress = require('../utils/fetchErc721HoldByAddress');
const getFloorPriceErc721 = require('../utils/getFloorPriceErc721');
// TO DO: fetch les nouvelles datas grâce à un websocket afin d'ajouter
// et de retirer lorsqu'il y a une transaction d'un token
const erc721Controller = {
  addErc721: async (addressRecord) => {
    try {
      // Check if there is data from the ERC721 API
      const apiData = await fetchErc721HoldByAddress(addressRecord.public_key);
      const newERC721 = await Promise.all(
        apiData.map(async (erc721) => ({
          ...erc721,
          floor_price: await getFloorPriceErc721(erc721.contractAddress),
        })),
      );

      if (apiData.length < 1) {
        return null;
      }

      // Destroy all the nfts that the address has
      await Erc721.destroy({
        where: { id_address: addressRecord.id },
      });

      // Add the new list of ERC721 tokens associated with the address to the database
      await Promise.all(
        newERC721.map(async (erc721) => {
          try {
            // Create a new entry in the database for each ERC721 token
            await Erc721.create({
              contract_address: erc721.contractAddress,
              collection_name: erc721.name,
              token_id: erc721.tokenId,
              image: erc721.imageURL,
              id_address: addressRecord.id,
              floor_price: erc721.floor_price,
            });
          } catch (apiError) {
            console.log(apiError);
          }
        }),
      );
      // Resolve the promise to indicate successful execution
      return Promise.resolve();
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },

  getErc721FromAddress: async (address) => {
    try {
      // Check if address is well imported from params
      if (!address) {
        return null;
      }
      // Get ERC721 data associated with the given address
      const erc721FromAddress = await Address.findAll({
        where: { public_key: address },
        include: [
          {
            model: Erc721,
            as: 'erc721s',
            attributes: {
              // Exclude the unwanted attributes
              exclude: ['id_address'],
            },
          },
        ],
      });

      // Check if searched data are not empty
      if (!erc721FromAddress || erc721FromAddress === 0) {
        return null;
      }
      // Return the ERC721 data associated with the given address
      return erc721FromAddress;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

module.exports = erc721Controller;
