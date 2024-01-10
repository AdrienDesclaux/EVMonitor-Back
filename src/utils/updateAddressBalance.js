const { AddressHasNativeCoin } = require('../models');
const fetchNativeCoinBalance = require('./fetchNativeCoinBalance');

const updateAddressBalance = async (address) => {
  // Fetch the new balance of the address using the fetchNativeCoinBalance function
  const newBalance = await fetchNativeCoinBalance(address.public_key);

  // Update the balance in the AddressHasNativeCoin junction table
  await AddressHasNativeCoin.update(
    { balance: newBalance },
    {
      where: { id_address: address.id },
    },
  );
};

module.exports = updateAddressBalance;
