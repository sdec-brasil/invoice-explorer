// repasse
export default function (sequelize, DataTypes) {
  const repasse = sequelize.define('repasse', {
    // id: {
    //   type: DataTypes.INTEGER(),
    //   primaryKey: true,
    //   autoIncrement: true,
    // },
    codigoIbge: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      allowNull: false,
    },
    // notaPagamentoId: {
    //   type: DataTypes.UUID,
    //   primaryKey: true,
    //   allowNull: false,
    // },
    notaPagamentoId: {
      type: DataTypes.INTEGER(),
      allowNull: false,
    },
    valor: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    underscored: false,
    tableName: 'nota_pagamento',
    freezeTableName: true,
  });

  repasse.associate = (models) => {
    repasse.belongsTo(models.municipio, { foreignKey: { name: 'codigoIbge', allowNull: false } });
    repasse.belongsTo(models.notaPagamento, { targetKey: 'nonce', foreignKey: { name: 'notaPagamentoId', allowNull: false } });
  };

  return repasse;
}
