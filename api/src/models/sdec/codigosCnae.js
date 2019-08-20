// Empresa
export default function (sequelize, DataTypes) {
  const codigosCnae = sequelize.define('codigosCnae', {
    cnae: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    underscored: false,
    tableName: 'codigosCnae',
    freezeTableName: true,
    timestamps: false,
  });

  return codigosCnae;
}
