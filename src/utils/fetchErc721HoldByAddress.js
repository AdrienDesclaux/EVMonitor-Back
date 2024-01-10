require('dotenv').config();

// Define a function to extract specific fields from the provided data
const extractFields = (data) => ({
  contractAddress: data.contract.address,
  tokenId: data.tokenId,
  name: data.contract.name,
  imageURL: data.image.cachedUrl,
});

const fetchErc721HoldByAddress = async (address) => {
  // Set up options for the HTTP request
  const options = { method: 'GET', headers: { accept: 'application/json' } };
  try {
    // Make a fetch request to Alchemy API to get ERC721 tokens held by the provided address
    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&orderBy=transferTime&excludeFilters[]=SPAM&excludeFilters[]=AIRDROPS&spamConfidenceLevel=LOW&pageSize=100`,
      options,
    );
    // Check if the response is valid
    if (!response) {
      throw new Error('Error');
    }
    // Parse the response data as JSON
    const data = await response.json();
    // Filter the data to include only ERC721 tokens
    const filteredData = data.ownedNfts.filter(
      (erc721) => erc721.tokenType === 'ERC721',
    );
    // Extract specific fields from the filtered data
    const extractedData = filteredData.map(extractFields);

    return extractedData;
  } catch (error) {
    console.log(error);
    return null;
  }
};

module.exports = fetchErc721HoldByAddress;
