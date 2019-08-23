/* eslint-disable class-methods-use-this */
const fake = require('./fields');

const borrower = () => {
  return {
    "borrowerTaxNumber": null,
    "borrowerNif": null,
    "borrowerName": null,
    "borrowerStreet": null,
    "borrowerNumber": null,
    "borrowerAdditionalInformation": null,
    "borrowerDistrict": null,
    "borrowerCity": null,
    "borrowerState": null,
    "borrowerCountry": null,
    "borrowerPostalCode": null,
    "borrowerEmail": null,
    "borrowerPhoneNumber": null
  }
};

const obra = () => ({
  workCode: fake.utils.obra,
  art: fake.utils.art,
});

const odds = (p = 0.5) => Math.random() > p;

const maybeF = (f, o = { p: 0.5 }) => {
  if (odds(o.p)) {
    if (o.min || o.max) {
      return f(o.min, o.max);
    }
    return f();
  }
  return undefined;
};

class Nota {
  constructor(addr, taxNumber) {
    this.note = {
      json: {
        taxNumber: taxNumber,
        emitter: addr,
        provision: {
          cnaeCod: maybeF(fake.cnae),
          nbsCode: maybeF(fake.utils.nbs),
          serviceCode: String(fake.utils.rad(21, 48)),
          issuedOn: fake.utils.date(),
          description: fake.utils.discriminacao(),
          // optanteSimplesNacional: String(fake.utils.rad(1, 2)),
          cityServiceLocation: this.prefeitura(),
          servicesAmount: fake.utils.reais(8000, 16000),
        },
        tributes: {
          processNumber: undefined,
          calculationBasis: undefined,
          issRate: fake.utils.reais(20, 50), // % of tax
          issWithheld: fake.utils.rad(1, 2),
          retentionResponsible: undefined,
          specialTaxRegime: maybeF(fake.utils.rad, { p: 0.5, min: 1, max: 600 }),
          cofinsAmount: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 300 }),
          csllAmount: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 300 }),
          deductionsAmount: fake.utils.reais(0, 10),
          inssAmount: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 500 }),
          irAmount: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 700 }),
          issAmount: undefined,
          netValueNfse: undefined,
          pisAmount: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 600 }),
          approximateTax: maybeF(fake.utils.reais, { p: 0.5, min: 6, max: 1400 }),
          othersAmountsWithheld: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 800 }),
          taxBenefit: String(fake.utils.rad(1, 2)),
          conditionedDiscountAmount: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 500 }),
          unconditionedDiscountAmount: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 400 }),
          issExigibility: String(fake.utils.rad(1, 6)),
        },
        borrower: maybeF(borrower),
        construction: maybeF(obra, 0.95),
      },
    };

    const tribut = this.note.json.tributes;
    const prov = this.note.json.provision;

    tribut.issAmount = this.valIss();

    if (tribut.issExigibility === '6' || tribut.issExigibility === '7') {
      tribut.processNumber = fake.utils.processNumber();
    }

    if (tribut.issWithheld === '1') {
      tribut.retentionResponsible = fake.utils.rad(1, 2);
    }

    if (tribut.retentionResponsible === '2') {
      this.note.json.intermediary = {
        intermediaryTaxNumber: fake.empresa.identificacao(),
        intermediaryName: fake.empresa.razaoSocial(),
        intermediaryCity: fake.cidade(),
      };
    }

    tribut.calculationBasis = this.calculationBasis();
    tribut.netValueNfse = this.netValueNfse();

    this.meta = [
      'INVOICE_REGISTRY',
      String(prov.cityServiceLocation),
      prov.servicesAmount,
      prov.calculationBasis,
      prov.itemLista,
      String(prov.issExigibility),
      prov.issAmount,
    ];

    if(this.note.json.borrower && !!Object.keys(this.note.json.borrower).length) {
      delete this.note.json.borrower;
    }

    if(this.note.json.construction && !!Object.keys(this.note.json.construction).length) {
      delete this.note.json.construction;
    }
  }

  prefeitura() {
    const prefeituras = [1100015, 1100379, 1100403, 1100346];
    return String(prefeituras[Math.floor(Math.random() * prefeituras.length)]);
  }

  valIss() {
    const prov = this.note.json.provision
    const tribut = this.note.json.tributes;
    return `${(Number(prov.servicesAmount) * Number(tribut.issRate)/10).toFixed(0)}`;
  }

  calculationBasis() {
    const prov = this.note.json.provision
    const tribut = this.note.json.tributes;
    const valServ = prov.servicesAmount !== undefined ? Number(prov.servicesAmount) : 0;
    const approximateTax = tribut.approximateTax !== undefined ? Number(tribut.approximateTax) : 0;
    const unconditionedDiscountAmount = tribut.unconditionedDiscountAmount !== undefined ? Number(tribut.unconditionedDiscountAmount) : 0;
    return `${(valServ - (approximateTax + unconditionedDiscountAmount)).toFixed(0)}`;
  }

  netValueNfse() {
    const prov = this.note.json.provision
    const tribut = this.note.json.tributes;
    const valServ = prov.servicesAmount !== undefined ? Number(prov.servicesAmount) : 0;
    const pisAmount = tribut.pisAmount !== undefined ? Number(tribut.pisAmount) : 0;
    const cofinsAmount = tribut.cofinsAmount !== undefined ? Number(tribut.cofinsAmount) : 0;
    const inssAmount = tribut.inssAmount !== undefined ? Number(tribut.inssAmount) : 0;
    const irAmount = tribut.irAmount !== undefined ? Number(tribut.irAmount) : 0;
    const csllAmount = tribut.csllAmount !== undefined ? Number(tribut.csllAmount) : 0;
    const othersAmountsWithheld = tribut.othersAmountsWithheld !== undefined ? Number(tribut.othersAmountsWithheld) : 0;
    const issWidthheld = tribut.issWidthheld === '1' ? Number(tribut.valIss) : 0;
    const conditionedDiscountAmount = tribut.conditionedDiscountAmount !== undefined ? Number(tribut.conditionedDiscountAmount) : 0;
    const unconditionedDiscountAmount = tribut.unconditionedDiscountAmount !== undefined ? Number(tribut.unconditionedDiscountAmount) : 0;
    return `${(
      valServ
        - pisAmount
        - cofinsAmount
        - inssAmount
        - irAmount
        - csllAmount
        - othersAmountsWithheld
        - issWidthheld
        - conditionedDiscountAmount
        - unconditionedDiscountAmount
    ).toFixed(0)}`;
  }

  replaceOldNote(txid) {
    this.note.json.prestacao.substitutes = txid;
    this.meta[0] = 'INVOICE_UPDATE';
    console.log(this.note.json.prestacao.substitutes);
  }

  registerTxId(txid) {
    this.txid = txid;
  }

  registerName(name) {
    this.name = name;
  }

  getTxId() {
    return this.txid;
  }
}

module.exports = Nota;
