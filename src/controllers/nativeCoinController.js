const { NativeCoin, Address } = require('../models');

const nativeCoinController = {
  getNativeBalanceByAddress: async (req, res) => {
    const { address } = req.params;
    try {
      // Retrieve the native coin balance for the specified address
      const addressBalance = await Address.findOne({
        where: { public_key: address },
        include: [
          {
            model: NativeCoin,
            as: 'nativecoins',
            through: {
              attributes: ['balance'],
            },
          },
        ],
      });
      // Return the native coin balance in the response
      return res.status(200).json(addressBalance.nativecoins);
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};

module.exports = nativeCoinController;
