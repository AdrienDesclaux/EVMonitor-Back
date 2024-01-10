const axios = require('axios');

const getFloorPriceErc721 = async (contractAddress) => {
  try {
    const apiKey = process.env.ALCHEMY_API_KEY;

    // Define the base URL for the Alchemy NFT API
    const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v2/${apiKey}`;

    // Construct the URL for fetching the floor price of the ERC721 token
    const url = `${baseURL}/getFloorPrice/?contractAddress=${contractAddress}`;

    // Make a GET request to the Alchemy NFT API
    const response = await axios.get(url);

    // Extract the floor price from the API response
    const firstKey = Object.keys(response.data)[0];
    const firstObject = response.data[firstKey];

    return firstObject.floorPrice;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

module.exports = getFloorPriceErc721;
