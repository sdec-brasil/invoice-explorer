// Boleto
export default (sequelize, DataTypes) => sequelize.define(
  'boleto',
  {
    num_boleto: {
      type: DataTypes.STRING(48),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    /* notas_correspondentes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      // tem que relacionar com a tabela nota_fiscal como chaves estrageiras para as notas
    }, */
    /* cnpj_pagador: {
      type: DataTypes.STRING(14),
      allowNull: false,
    }, */
    data_pagamento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    valor_total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    data_vencimento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    estado: {
      type: DataTypes.SMALLINT, // 0 - pendente, 1 - pago, 2 - expirado
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    underscored: true,
  },
);