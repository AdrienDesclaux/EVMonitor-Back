const { validator } = require('web3-validator');

const validateAddress = (address) => {
  try {
    // Use the validator library to validate the address
    validator.validate(['address'], [address]);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = validateAddress;
