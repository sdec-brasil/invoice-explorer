const serializers = Object.create(null);

serializers.invoice = {};

serializers.invoice.serialize = (inv) => {
  const invoice = JSON.parse(JSON.stringify(inv));
  const invoiceStructure = {
    prestacao: [
      'emissorId',
      'dataPrestacao',
      'prefeituraPrestacao',
      'codTributMunicipio',
      'itemLista',
      'codCnae',
      'codServico',
      'codNBS',
      'discriminacao',
      'valServicos',
      'descontoIncond',
      'descontoCond',
      'exigibilidadeISS',
      'numProcesso',
      'valDeducoes',
      'baseCalculo',
    ],
    taxas: [
      'issRetido',
      'respRetencao',
      'regimeEspTribut',
      'incentivoFiscal',
      'aliqServicos',
      'valIss',
      'valPis',
      'valCofins',
      'valInss',
      'valIr',
      'valCsll',
      'outrasRetencoes',
      'valTotalTributos',
      'valLiquiNfse',
    ],
    tomador: [
      'identificacaoTomador',
      'nif',
      'nomeRazaoTomador',
      'logEnd',
      'numEnd',
      'compEnd',
      'bairroEnd',
      'cidadeEnd',
      'estadoEnd',
      'paisEnd',
      'cepEnd',
      'email',
      'tel',
    ],
    intermediario: [
      'identificacaoIntermed',
      'nomeRazaoIntermed',
      'cidadeIntermed',
    ],
    constCivil: [
      'codObra',
      'art',
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
