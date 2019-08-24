// notaPagamento
export default function (sequelize, DataTypes) {
  const notaPagamento = sequelize.define('nota_pagamento', {
    nonce: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    txId: {
      type: DataTypes.STRING(32),
      unique: true,
    },
    taxNumber: {
      type: DataTypes.STRING(14),
      allowNull: false,
    },
    emissorId: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    dateEmission: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    totalAmount: {
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
    timestamps: false,
  });

  notaPagamento.associate = (models) => {
    notaPagamento.belongsTo(models.empresa, { targetKey: 'taxNumber', foreignKey: { name: 'taxNumber', allowNull: false } });
    notaPagamento.belongsTo(models.emissor, { targetKey: 'address', foreignKey: { name: 'emissorId', allowNull: false } });
    notaPagamento.hasMany(models.invoice, { as: 'invoices', foreignKey: 'paymentInstructionsCode' });
    notaPagamento.hasMany(models.repasse, { as: 'repasses', sourceKey: 'txId', foreignKey: 'notaPagamentoId' });
  };

  return notaPagamento;
}
