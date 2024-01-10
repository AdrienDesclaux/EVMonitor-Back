const { AddressHasErc20, Erc20, Address } = require('../models/index');
const fetchAndConvertTotalSupply = require('../utils/fetchAndConvertTotalSupply');
const fetchERC20fromAddress = require('../utils/fetchTokenHold');
const getErc20Price = require('../utils/getErc20Price');

const erc20Controller = {
  addErc20: async (addressRecord) => {
    try {
      // Fetch ERC20 data from Etherscan API using the address's public key
      const apiData = await fetchERC20fromAddress(addressRecord.public_key);

      // Check for presence of API data
      if (apiData.length < 1) {
        return;
      }

      // Delete existing entries from the junction table for the address
      await AddressHasErc20.destroy({
        where: { id_address: addressRecord.id },
      });

      // Iterate over each ERC20 token from the API data
      await Promise.all(
        apiData.map(async (erc20) => {
          try {
            // Check if the token already exists in the database
            const existingToken = await Erc20.findOne({
              where: { contract_address: erc20.token_address },
            });

            let erc20Row;
            // If the token does not exist in the database
            if (!existingToken) {
              const totalSupply = await fetchAndConvertTotalSupply(
                erc20.token_address,
                erc20.decimals,
              );
              // Fetch the current price of the token
              const price = await getErc20Price(erc20.token_address);

              // Create a new entry for the token in the Erc20 table
              erc20Row = await Erc20.create({
                contract_address: erc20.token_address,
                total_supply: totalSupply,
                name: erc20.name,
                logo: erc20.logo,
                decimals: erc20.decimals,
                symbol: erc20.symbol,
                price_usd: price.usdPrice,
                price_eth: price.weiConverted,
              });
            } else {
              // If the token already exists, update its price in the database
              const price = await getErc20Price(erc20.token_address);
              erc20Row = await Erc20.update(
                {
                  price_eth: price.weiConverted,
                  price_usd: price.usdPrice,
                },
                { where: { contract_address: erc20.token_address } },
              );
              // Set erc20Row to the existing token for further use
              erc20Row = existingToken;
            }

            // Create or update the association with the address in the junction table
            await AddressHasErc20.create({
              id_address: addressRecord.id,
              id_erc20: erc20Row.id,
              balance: erc20.balance,
            });
          } catch (apiError) {
            console.error('Error during Etherscan API call:', apiError);
            // Handle the error as needed, you can log it or return a specific value
          }
        }),
      );
    } catch (error) {
      console.error('Error adding ERC20:', error);
    }
  },

  getErc20FromAddress: async (address) => {
    try {
      // Check if address is well imported
      if (!address) {
        return null;
      }
      // Get ERC20 data associated with the given address
      const erc20FromAddress = await Address.findAll({
        where: { public_key: address },
        include: [
          {
            model: Erc20,
            as: 'erc20s',
            attributes: {
              // Exclude the unwanted attributes
              exclude: ['decimals'],
            },
            through: {
              attributes: ['balance'],
            },
          },
        ],
      });

      // Check if the searched data is not empty
      if (!erc20FromAddress || erc20FromAddress === 0) {
        return null;
      }
      // Return the ERC20 data associated with the given address
      return erc20FromAddress;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

module.exports = erc20Controller;
