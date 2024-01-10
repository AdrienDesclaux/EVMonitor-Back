const Address = require('./Address');
const AddressHasErc20 = require('./AddressHasErc20');
const AddressHasNativeCoin = require('./AddressHasNativeCoin');
const Alert = require('./Alert');
const Erc20 = require('./Erc20');
const Erc721 = require('./Erc721');
const NativeCoin = require('./NativeCoin');
const User = require('./User');
const UserHasAddresses = require('./UserHasAddresses');

// Address <-> User (Many-to-many)
Address.belongsToMany(User, {
  as: 'users',
  through: UserHasAddresses,
  foreignKey: 'id_address',
  otherKey: 'id_user',
});

User.belongsToMany(Address, {
  as: 'addresses',
  through: UserHasAddresses,
  foreignKey: 'id_user',
  otherKey: 'id_address',
});

// Alert <-> User (One-to-many)
User.hasMany(Alert, {
  as: 'alerts',
  foreignKey: 'id_user',
});

Alert.belongsTo(User, {
  as: 'user',
  foreignKey: 'id_user',
});

// ERC721 <-> Address (One-to-many)

Address.hasMany(Erc721, {
  as: 'erc721s',
  foreignKey: 'id_address',
});

Erc721.belongsTo(Address, {
  as: 'address',
  foreignKey: 'id_address',
});

// ERC20 <-> Address (Many-to-many)

Address.belongsToMany(Erc20, {
  as: 'erc20s',
  through: AddressHasErc20,
  foreignKey: 'id_address',
  otherKey: 'id_erc20',
});

Erc20.belongsToMany(Address, {
  as: 'addresses',
  through: AddressHasErc20,
  foreignKey: 'id_erc20',
  otherKey: 'id_address',
});

// NativeCoin <-> Address (Many-to-many)

Address.belongsToMany(NativeCoin, {
  as: 'nativecoins',
  through: AddressHasNativeCoin,
  foreignKey: 'id_address',
  otherKey: 'id_nativecoin',
});

NativeCoin.belongsToMany(Address, {
  as: 'addresses',
  through: AddressHasNativeCoin,
  foreignKey: 'id_nativecoin',
  otherKey: 'id_address',
});

module.exports = {
  Address,
  AddressHasErc20,
  AddressHasNativeCoin,
  User,
  NativeCoin,
  Erc20,
  Erc721,
  UserHasAddresses,
};
