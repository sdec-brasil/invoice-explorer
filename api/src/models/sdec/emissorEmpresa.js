// EmissorEmpresa
export default function (sequelize, DataTypes) {
  const emissorEmpresa = sequelize.define('emissorEmpresa', {
    emitterAddress: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'emissor',
        key: 'address',
      },
    },
    taxNumber: {
      type: DataTypes.STRING(14),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'empresa',
        key: 'taxNumber',
      },
    },
  },
  {
    underscored: false,
    tableName: 'emissorEmpresa',
    freezeTableName: true,
    timestamps: false,
  });

  return emissorEmpresa;
}
