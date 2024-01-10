require('dotenv').config();
const Moralis = require('moralis').default;
// Import the EvmChain dataType
const { EvmChain } = require('@moralisweb3/common-evm-utils');

const fetchERC20fromAddress = async (address) => {
  // Initialize the Moralis application with the given API key

  // Define the address and chain you want to work with
  const chain = EvmChain.ETHEREUM;

  // Request the wallet token balances using Moralis
  const response = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  });
  // Convert the response to JSON
  const datas = response.toJSON();

  // Filter out possible spam tokens and tokens with a balance less than 1
  const filteredData = datas.filter(
    (data) => data.possible_spam === false && data.balance > 1,
  );

  // Map over the filtered data to adjust the balance (convert to standard units)
  const newData = filteredData.map((erc20) => ({
    ...erc20,
    balance: erc20.balance / 10 ** erc20.decimals,
  }));

  return newData;
};

module.exports = fetchERC20fromAddress;
