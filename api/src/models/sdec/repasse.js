// Repasse
export default function (sequelize, DataTypes) {
  const repasse = sequelize.define('repasse', {
    ibgeCode: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      allowNull: false,
    },
    notaPagamentoId: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    underscored: false,
    tableName: 'repasse',
    freezeTableName: true,
    timestamps: false,
  });

  repasse.associate = (models) => {
    repasse.belongsTo(models.municipio, { targetKey: 'code', foreignKey: { name: 'ibgeCode', allowNull: false } });
    repasse.belongsTo(models.notaPagamento, { targetKey: 'txId', foreignKey: { name: 'notaPagamentoId', allowNull: false } });
  };

  return repasse;
}
