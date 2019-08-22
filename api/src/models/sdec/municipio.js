// Municipio
export default function (sequelize, DataTypes) {
  const municipio = sequelize.define('municipio', {
    codigoIbge: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    nome: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    cnpj: {
      type: DataTypes.STRING(14),
      unique: true,
      // TODO: review this allow null here and in the worker
      allowNull: true,
    },
  },
  {
    underscored: false,
    tableName: 'municipio',
    freezeTableName: true,
    timestamps: false,
  });

  municipio.associate = (models) => {
    municipio.belongsTo(models.estado, { targetKey: 'sigla', foreignKey: { name: 'uf', allowNull: false } });
    // municipio.belongsTo(models.regiao, { targetKey: 'nomeRegiao', foreignKey: { name: 'nomeRegiao', allowNull: false } });
    municipio.belongsToMany(models.notaPagamento, { through: models.repasse, foreignKey: 'codigoIbge', otherKey: 'notaPagamentoId' });
  };

  return municipio;
}
