module.exports = function (sequelize, DataTypes) {
  return sequelize.define('chain', {
    chain_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      primaryKey: true,
    },
    chain_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    chain_code3: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    chain_address_version: {
      type: DataTypes.BLOB(100),
      allowNull: false,
    },
    chain_script_addr_vers: {
      type: DataTypes.BLOB(100),
      allowNull: true,
    },
    chain_address_checksum: {
      type: DataTypes.BLOB(100),
      allowNull: true,
    },
    chain_magic: {
      type: DataTypes.BLOB(4),
      allowNull: true,
    },
    chain_policy: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    chain_decimals: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    chain_last_block_id: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      references: {
        model: 'block',
        key: 'block_id',
      },
    },
    chain_protocol_version: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    underscored: true,
    tableName: 'chain',
  });
};
