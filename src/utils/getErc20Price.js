const Moralis = require('moralis').default;
const ethers = require('ethers');

Moralis.start({
  apiKey: process.env.MORALIS_API_KEY,
});

const getErc20Price = async (contractAddress) => {
  try {
    // Retrieve the token price information using Moralis
    const response = await Moralis.EvmApi.token.getTokenPrice({
      chain: '0x1',
      address: contractAddress,
    });

    // Extract relevant information from the response
    const { value, decimals } = response.jsonResponse.nativePrice;
    // Convert the wei value to standard units
    const weiConverted = ethers.formatUnits(value, decimals);
    // Extract the USD price from the response
    const { usdPrice } = response.jsonResponse;

    return { usdPrice, weiConverted };
  } catch (err) {
    // Check whether the error is due to a lack of liquidity (error code: C0006)
    if (err.code === 'C0006') {
      return { usdPrice: 0, weiConverted: 0 };
    }
    return null;
  }
};

module.exports = getErc20Price;
