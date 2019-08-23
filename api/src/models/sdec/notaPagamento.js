// notaPagamento
export default function (sequelize, DataTypes) {
  const notaPagamento = sequelize.define('nota_pagamento', {
    nonce: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    guid: {
      type: DataTypes.UUID,
      unique: true,
    },
    dateEmission: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalValue: {
      type: DataTypes.BIGINT,
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
    notaPagamento.belongsToMany(models.municipio, {
      as: 'repasses',
      through: 'repasse',
      foreignKey: 'notaPagamentoId',
      otherKey: 'code',
    });
    notaPagamento.hasMany(models.invoice, { foreignKey: 'paymentInscructionsCode' });
    notaPagamento.belongsTo(models.empresa, { foreignKey: { name: 'taxNumber', allowNull: false } });
    notaPagamento.belongsTo(models.emissor, { as: 'emittedBy', foreignKey: { name: 'emissorId', allowNull: false } });
  };

  // notaPagamento.belongsTo(models.metodo_pagamento, { primaryKey: { name: 'id_metodo', allowNull: false } });


  return notaPagamento;
}
