// EmissorEmpresa
export default function (sequelize, DataTypes) {
  const emissorEmpresa = sequelize.define('emissorEmpresa', {
    empresaCnpj: {
      type: DataTypes.STRING(14),
      allowNull: false,
      primary_key: true,
    },
    emissorAddress: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primary_key: true,
    },
  },
  {
    underscored: false,
    tableName: 'emissorEmpresa',
    freezeTableName: true,
    timestamps: false,
  });

  emissorEmpresa.associate = (models) => {
    emissorEmpresa.belongsTo(models.emissor, { targetKey: 'address', foreignKey: { name: 'emissorAddress', allowNull: false } });
    emissorEmpresa.belongsTo(models.empresa, { targetKey: 'cnpj', foreignKey: { name: 'empresaCnpj', allowNull: false } });
  };

  return emissorEmpresa;
}
