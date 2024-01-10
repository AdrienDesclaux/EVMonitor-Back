// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
// eslint-disable-next-line import/no-extraneous-dependencies
const { Web3 } = require('web3');

const fetchNativeCoinBalance = async (address) => {
  try {
    const provider = process.env.INFURA_API_KEY;

    // Create a new Web3 instance using the Infura provider
    const web3 = new Web3(new Web3.providers.HttpProvider(provider));
    // Get the balance of the provided address in Wei
    const balance = await web3.eth.getBalance(address);
    // Convert the balance from Wei to native coin units (Ether)
    const nativeCoinBalance = web3.utils.fromWei(balance, 'ether');

    return nativeCoinBalance;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = fetchNativeCoinBalance;
