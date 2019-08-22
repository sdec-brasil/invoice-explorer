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
    dataEmissao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    valorTotal: {
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
      as: 'municipios', through: 'repasse', foreignKey: 'notaPagamentoId', otherKey: 'codigoIbge',
    });
    notaPagamento.hasMany(models.invoice, { foreignKey: 'notaPagamento' });
    notaPagamento.belongsTo(models.empresa, { foreignKey: { name: 'cnpj', allowNull: false } });
    notaPagamento.belongsTo(models.emissor, { as: 'emittedBy', foreignKey: { name: 'emissorId', allowNull: false } });
  };

  // notaPagamento.belongsTo(models.metodo_pagamento, { primaryKey: { name: 'id_metodo', allowNull: false } });


  return notaPagamento;
}
