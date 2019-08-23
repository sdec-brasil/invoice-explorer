// notaPagamento
export default function (sequelize, DataTypes) {
  const notaPagamento = sequelize.define('nota_pagamento', {
    nonce: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      auto_increment: true,
    },
    guid: {
      type: DataTypes.UUID,
    },
    dateEmission: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalValue: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['pendente', 'pago', 'vencido', 'cancelado'],
      allowNull: false,
      defaultValue: 'pendente',
    },
  },
  {
    underscored: false,
    tableName: 'nota_pagamento',
    freezeTableName: true,
  });

  notaPagamento.associate = (models) => {
    notaPagamento.hasMany(models.invoice, { foreignKey: 'paymentInstructionsCode' });
    notaPagamento.belongsTo(models.empresa, { foreignKey: { name: 'taxNumber', allowNull: false } });
    notaPagamento.belongsTo(models.emissor, { as: 'emittedBy', foreignKey: { name: 'emissorId', allowNull: false } });
  };

  // notaPagamento.belongsTo(models.metodo_pagamento, { primaryKey: { name: 'id_metodo', allowNull: false } });


  return notaPagamento;
}
