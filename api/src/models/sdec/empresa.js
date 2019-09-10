// Empresa
export default function (sequelize, DataTypes) {
  const empresa = sequelize.define('empresa', {
    taxNumber: {
      type: DataTypes.STRING(14),
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },
    tradeName: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    street: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    additionalInformation: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    taxRegime: {
      // 1 - MEI;
      // 2 - Simples Nacional;
      // 3 - Lucro Presumido;
      // 4 - Lucro Real;
      type: DataTypes.TINYINT({ unsigned: true }),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    underscored: false,
    tableName: 'empresa',
    freezeTableName: true,
    timestamps: false,
  });

  empresa.associate = (models) => {
    empresa.belongsToMany(models.codigosCnae, { as: 'codCnae', through: 'cnaeEmpresa', timestamps: false });
    empresa.belongsToMany(models.emissor, { as: 'emissores', through: 'emissorEmpresa', foreignKey: 'taxNumber' });
    empresa.belongsTo(models.emissor, { targetKey: 'address', foreignKey: { name: 'endBlock', allowNull: false } });
  };

  return empresa;
}
