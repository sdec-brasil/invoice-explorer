const serializers = Object.create(null);

serializers.invoice = {};

serializers.invoice.serialize = (inv) => {
  const invoice = JSON.parse(JSON.stringify(inv));
  const invoiceStructure = {
    provision: [
      'provisionIssuedOn',
      'provisionCityServiceLocation',
      'provisionCnaeCode',
      'provisionServiceCode',
      'provisionNbsCode',
      'provisionDescription',
      'provisionServicesAmount',
    ],
    tributes: [
      'tributesUnconditionedDiscountAmount',
      'tributesConditionedDiscountAmount',
      'tributesIssExigibility',
      'tributesProcessNumber',
      'tributesDeductionsAmount',
      'tributesCalculationBasis',
      'tributesIssWithheld',
      'tributesRetentionResponsible',
      'tributesSpecialTaxRegime',
      'tributesTaxBenefit',
      'tributesIssRate',
      'tributesIssAmount',
      'tributesPisAmount',
      'tributesCofinsAmount',
      'tributesInssAmount',
      'tributesIrAmount',
      'tributesCsllAmount',
      'tributesOthersAmountsWithheld',
      'tributesApproximateTax',
      'tributesNetValueNfse',
    ],
    borrower: [
      'borrowerTaxNumber',
      'borrowerNif',
      'borrowerName',
      'borrowerStreet',
      'borrowerNumber',
      'borrowerAdditionalInformation',
      'borrowerDistrict',
      'borrowerCity',
      'borrowerState',
      'borrowerCountry',
      'borrowerPostalCode',
      'borrowerEmail',
      'borrowerPhoneNumber',
    ],
    intermediary: [
      'intermediaryTaxNumber',
      'intermediaryName',
      'intermediaryCity',
    ],
    construction: [
      'constructionWorkCode',
      'constructionArt',
    ],
  };
  Object.keys(invoiceStructure).forEach((category) => {
    invoiceStructure[category].forEach((field) => {
      if (invoice[field] !== undefined) {
        if (invoice[category] === undefined) {
          invoice[category] = {};
        }
        invoice[category][field] = invoice[field];
        delete invoice[field];
      }
    });
  });
  return invoice;
};

serializers.invoice.deserialize = (inv) => {
  const newInv = {};
  Object.keys(inv).forEach((key) => {
    if (typeof (inv[key]) === 'object') {
      Object.keys(inv[key]).forEach((field) => {
        newInv[field] = inv[key][field];
      });
    } else {
      newInv[key] = inv[key];
    }
  });
  return newInv;
};

export default serializers;
