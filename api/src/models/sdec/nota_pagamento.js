// nota_pagamento
export default function (sequelize, DataTypes) {
  const nota_pagamento = sequelize.define('nota_pagamento', {
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

  nota_pagamento.associate = (models) => {
    nota_pagamento.hasMany(models.invoice, { foreignKey: 'notaPagamento' });
    nota_pagamento.belongsTo(models.empresa, { foreignKey: { name: 'cnpj', allowNull: false } });
    nota_pagamento.belongsTo(models.emissor, { as: 'emittedBy', foreignKey: { name: 'emissor', allowNull: false } });
  };

  // nota_pagamento.belongsTo(models.metodo_pagamento, { primaryKey: { name: 'id_metodo', allowNull: false } });


  return nota_pagamento;
}
