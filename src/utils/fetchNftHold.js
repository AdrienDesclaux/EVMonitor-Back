require('dotenv').config();
const { Core } = require('@quicknode/sdk');

// Create a new Core instance with the specified endpoint URL and configuration
const core = new Core({
  endpointUrl:
    'https://divine-delicate-glade.quiknode.pro/c1ed92bbea501f7c05c7c3d8f3a9859037aa70ec/',
  config: {
    addOns: {
      nftTokenV2: true,
    },
  },
});
const fetchNftHold = async (address) => {
  try {
    // Make a request to QuikNode's 'qn_fetchNFTs' API with the specified parameters
    const response = await core.client.qn_fetchNFTs({
      wallet: address,
      perPage: 20,
      page: 1,
    });
    return response;
  } catch (error) {
    console.log('error', error);
    return null;
  }
};

module.exports = fetchNftHold;
