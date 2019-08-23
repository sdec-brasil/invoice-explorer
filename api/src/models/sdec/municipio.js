// Municipio
export default function (sequelize, DataTypes) {
  const municipio = sequelize.define('municipio', {
    code: {
      type: DataTypes.STRING(7),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    taxNumber: {
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
    municipio.hasMany(models.repasse, { as: 'repasses', foreignKey: 'ibgeCode' });
  };

  return municipio;
}
