// nota_fiscal
// invoice
export default function (sequelize, DataTypes) {
  const invoice = sequelize.define('invoice', {
    nonce: {
      type: DataTypes.INTEGER(),
      primaryKey: true,
      autoIncrement: true,
    },
    invoiceCode: {
      type: DataTypes.STRING(64),
    },
    substitutes: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    substitutedBy: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    invoiceName: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    // ----- Campos que não estão na documentação:
    status: {
      // 0 - pendente,
      // 1 - atrasado,
      // 2 - pago,
      // 3 - substitutesda,
      // 4 - dados inconsistentes
      type: DataTypes.TINYINT({ unsigned: true }),
      allowNull: false,
      defaultValue: 0,
    },
    encryptedBorrower: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // campo emissor
    // ----- Campos da Prestação:
    provisionIssuedOn: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // campo provisionCityServiceLocation
    provisionCnaeCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // This may need to be a table
    provisionServiceCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    provisionNbsCode: {
      type: DataTypes.STRING(9),
      allowNull: true,
    },
    provisionDescription: {
      type: DataTypes.STRING(2000),
      allowNull: false,
    },
    provisionServicesAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: false,
    },
    // ----- Campos de Tributos:
    tributesUnconditionedDiscountAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesConditionedDiscountAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesIssExigibility: {
      // * `1` - Exigível
      // * `2` - Não incidência
      // * `3` - Isenção
      // * `4` - Exportação
      // * `5` - Imunidade
      // * `6` - Exigibilidade Suspensa por Decisão Judicial
      // * `7` - Exigibilidade Suspensa por Processo Administrativo
      type: DataTypes.TINYINT({ unsigned: true }),
      allowNull: false,
    },
    tributesProcessNumber: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    tributesDeductionsAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesCalculationBasis: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: false,
    },
    tributesIssWithheld: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tributesRetentionResponsible: {
      // Informado somente se tributesIssWithheld igual a "true".
      // A opção “2 – Intermediário” somente poderá ser selecionada
      // se "intermediaryTaxNumber" informado.
      //       * `1` - Tomador
      //       * `2` - Intermediário
      type: DataTypes.TINYINT({ unsigned: true }),
      allowNull: true,
    },
    tributesSpecialTaxRegime: {
      // * `1` – Microempresa Municipal
      // * `2` – Estimativa
      // * `3` – Sociedade de Profissionais
      // * `4` – Cooperativa
      // * `5` – Microempresário Individual (MEI)
      // * `6` – Microempresário e Empresa de Pequeno Porte (ME EPP).
      type: DataTypes.TINYINT({ unsigned: true }),
      allowNull: true,
    },
    tributesTaxBenefit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tributesIssRate: {
      type: DataTypes.DECIMAL(10, 1),
      allowNull: true,
    },
    tributesIssAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: false,
    },
    tributesPisAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesCofinsAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesInssAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesIrAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesCsllAmount: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesOthersAmountsWithheld: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesApproximateTax: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },
    tributesNetValueNfse: {
      type: DataTypes.BIGINT({ unsigned: true }),
      allowNull: true,
    },

    // ----- Campos do Tomador:
    borrowerTaxNumber: {
      type: DataTypes.STRING(14),
      allowNull: true,
    },
    borrowerNif: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    borrowerName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    borrowerStreet: {
      type: DataTypes.STRING(125),
      allowNull: true,
    },
    borrowerNumber: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    borrowerAdditionalInformation: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    borrowerDistrict: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    borrowerCity: {
      type: DataTypes.INTEGER({ unsigned: true }),
      allowNull: true,
    },
    borrowerState: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
    borrowerCountry: {
      type: DataTypes.INTEGER({ unsigned: true }),
      allowNull: true,
    },
    borrowerPostalCode: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    borrowerEmail: {
      type: DataTypes.STRING(80),
      allowNull: true,
    },
    borrowerPhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    // ----- Campos do Intermediário:
    intermediaryTaxNumber: {
      type: DataTypes.STRING(14),
      allowNull: true,
    },
    intermediaryName: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    intermediaryCity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // ----- Campos da Construção Civil:
    constructionWorkCode: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    constructionArt: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  },
  {
    underscored: false,
    tableName: 'invoice',
    freezeTableName: true,
    timestamps: false,
  });

  invoice.associate = (models) => {
    invoice.belongsTo(models.emissor, { targetKey: 'address', foreignKey: { name: 'emitter', allowNull: false } });
    invoice.belongsTo(models.empresa, { targetKey: 'taxNumber', foreignKey: { name: 'taxNumber', allowNull: false } });
    invoice.belongsTo(models.notaPagamento, { targetKey: 'txId', foreignKey: { name: 'paymentInstructionsCode', allowNull: true } });
    invoice.belongsTo(models.municipio, { targetKey: 'code', foreignKey: { name: 'provisionCityServiceLocation', allowNull: false } });
    invoice.belongsTo(models.block, { targetKey: 'block_id', as: 'block', foreignKey: { name: 'blockHeight', allowNull: true } });
  };

  return invoice;
}
