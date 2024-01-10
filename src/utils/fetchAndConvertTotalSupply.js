// eslint-disable-next-line import/no-extraneous-dependencies
const { Web3 } = require('web3');
const ethers = require('ethers');

const fetchAndConvertTotalSupply = async (tokenAddress, decimals) => {
  try {
    const provider = process.env.INFURA_API_KEY;
    // Create a new Web3 instance using the Infura provider
    const web3 = new Web3(provider);

    const tokenABI = [
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ];
    // Create a new instance of the token contract using the ABI and token address
    const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);

    // Retrieve the total supply from the token contract
    const totalSupply = await tokenContract.methods.totalSupply().call();

    // Format the total supply, converting it to the specified decimal places
    const supplyConverted = ethers.formatUnits(totalSupply, decimals);
    return supplyConverted;
  } catch (err) {
    console.error('Une erreur est survenue:', err);
    return null;
  }
};

module.exports = fetchAndConvertTotalSupply;
