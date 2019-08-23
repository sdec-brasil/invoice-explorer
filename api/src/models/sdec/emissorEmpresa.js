// EmissorEmpresa
export default function (sequelize, DataTypes) {
  const emissorEmpresa = sequelize.define('emissorEmpresa', {
    taxNumber: {
      type: DataTypes.STRING(14),
      allowNull: false,
      primary_key: true,
    },
    emitterAddress: {
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
    emissorEmpresa.belongsTo(models.emissor, { targetKey: 'address', foreignKey: { name: 'emitterAddress', allowNull: false } });
    emissorEmpresa.belongsTo(models.empresa, { targetKey: 'taxNumber', foreignKey: { name: 'taxNumber', allowNull: false } });
  };

  return emissorEmpresa;
}
