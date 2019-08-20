// Emissor
export default function (sequelize, DataTypes) {
  const emissor = sequelize.define('emissor', {
    address: {
      type: DataTypes.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
  },
  {
    underscored: false,
    tableName: 'emissor',
    freezeTableName: true,
    timestamps: false,
  });

  emissor.associate = (models) => {
    emissor.belongsToMany(models.empresa, { as: 'Empresas', through: 'emissorEmpresa' });
  };

  return emissor;
}
