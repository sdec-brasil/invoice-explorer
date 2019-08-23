// repasse
export default function (sequelize, DataTypes) {
  const repasse = sequelize.define('repasse', {
    code: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      allowNull: false,
    },
    notaPagamentoId: {
      type: DataTypes.UUID,
      primaryKey: true,
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
    repasse.belongsTo(models.municipio, { targetKey: 'code', foreignKey: { name: 'code', allowNull: false } });
    repasse.belongsTo(models.notaPagamento, { targetKey: 'nonce', foreignKey: { name: 'notaPagamentoId', allowNull: false } });
  };

  return repasse;
}
