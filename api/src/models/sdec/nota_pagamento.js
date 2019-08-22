// notaPagamento
export default function (sequelize, DataTypes) {
  const notaPagamento = sequelize.define('nota_pagamento', {
    guid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    dataEmissao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    valorTotal: {
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
    notaPagamento.hasMany(models.invoice, { foreignKey: 'notaPagamento' });
    notaPagamento.belongsTo(models.empresa, { foreignKey: { name: 'cnpj', allowNull: false } });
    notaPagamento.belongsTo(models.emissor, { as: 'emittedBy', foreignKey: { name: 'emissor', allowNull: false } });
  };

  // notaPagamento.belongsTo(models.metodo_pagamento, { primaryKey: { name: 'id_metodo', allowNull: false } });


  return notaPagamento;
}
