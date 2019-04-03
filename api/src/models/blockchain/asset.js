export default function (sequelize, DataTypes) {
  const Asset = sequelize.define('Asset', {
    asset_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      primaryKey: true,
    },
    tx_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      references: {
        model: 'tx',
        key: 'tx_id',
      },
    },
    chain_id: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      references: {
        model: 'chain',
        key: 'chain_id',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    multiplier: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    issue_qty: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    prefix: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  }, {
    underscored: true,
    tableName: 'asset',
  });

  Asset.associate = (models) => {
    Asset.belongsTo(models.Tx, { foreignKey: { name: 'tx_id', unique: true } });
    Asset.belongsTo(models.Chain, { foreignKey: 'chain_id' });
  };

  return Asset;
}