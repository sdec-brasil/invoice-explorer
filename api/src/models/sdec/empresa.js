// Empresa
export default function (sequelize, DataTypes) {
  const empresa = sequelize.define('empresa', {
    cnpj: {
      type: DataTypes.STRING(14),
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    codCnae: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    razao: {
      type: DataTypes.STRING(150),
      unique: true,
      allowNull: false,
    },
    fantasia: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    cepEnd: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    logEnd: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    numEnd: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    compEnd: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    bairroEnd: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    cidadeEnd: {
      type: DataTypes.STRING(7),
      allowNull: false,
    },
    estadoEnd: {
      type: DataTypes.STRING(2),
      allowNull: false,
    },
    regTrib: {
      // 1 - MEI;
      // 2 - Simples Nacional;
      // 3 - Lucro Presumido;
      // 4 - Lucro Real;
      type: DataTypes.TINYINT({ unsigned: true }),
      allowNull: false,
    },
    ccm: {
      // codigo de cadastro no municipio
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    endBlock: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    underscored: false,
    tableName: 'empresa',
    freezeTableName: true,
    timestamps: false,
  });

  empresa.associate = (models) => {
    empresa.belongsToMany(models.emissor, { as: 'Emissores', through: 'emissoresEmpresa' });
    empresa.belongsTo(models.emissor, { targetKey: 'address', foreignKey: { name: 'dono', allowNull: false } });
  };

  return empresa;
}
