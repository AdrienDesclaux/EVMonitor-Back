const axios = require('axios');

const getEthPrice = async () => {
  try {
    // Define the CoinGecko API endpoint for Ethereum price in USD
    const url =
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';
    // Make a GET request to the CoinGecko API
    const response = await axios.get(url);
    // Stock the eth price in usd in a variable
    const ethPrice = response.data.ethereum.usd;

    return ethPrice;
  } catch (error) {
    console.error("Erreur lors de la récupération du prix de l'ETH:", error);
    return null;
  }
};

module.exports = getEthPrice;
