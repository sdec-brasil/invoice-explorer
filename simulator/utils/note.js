/* eslint-disable class-methods-use-this */
const fake = require('./fields');

const tomador = () => ({
  id: undefined,
  nif: undefined,
  nomeRazao: undefined,
  logEnd: undefined,
  numEnd: undefined,
  compEnd: undefined,
  bairroEnd: undefined,
  cidadeEnd: undefined,
  estadoEnd: undefined,
  paisEnd: undefined,
  cepEnd: undefined,
  email: undefined,
  tel: undefined,
});

const obra = () => ({
  codObra: fake.utils.obra,
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
  constructor(addr) {
    this.note = {
      json: {
        emissor: addr,
        prestacao: {
          dataIncidencia: fake.utils.date(),
          baseCalculo: fake.utils.reais(),
          aliqServicos: fake.utils.reais(0, 0.3), // % of tax
          valIss: fake.utils.reais(),
          valLiquiNfse: fake.utils.reais(),
          valServicos: fake.utils.reais(100, 450),
          valDeducoes: fake.utils.reais(0, 10),
          issRetido: String(fake.utils.rad(1, 2)),
          itemLista: fake.utils.item(),
          discriminacao: fake.utils.discriminacao(),
          codServico: String(fake.utils.rad(21, 48)),
          exigibilidadeISS: String(fake.utils.rad(1, 6)),
          optanteSimplesNacional: String(fake.utils.rad(1, 2)),
          incentivoFiscal: String(fake.utils.rad(1, 2)),
          respRetencao: undefined,
          valPis: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 6 }),
          valCofins: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 3 }),
          valInss: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 5 }),
          valIr: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 7 }),
          valCsll: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 3 }),
          outrasRetencoes: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 8 }),
          valTotalTributos: maybeF(fake.utils.reais, { p: 0.5, min: 6, max: 14 }),
          descontoIncond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 4 }),
          descontoCond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 5 }),
          codCnae: maybeF(fake.utils.cnae),
          codNBS: maybeF(fake.utils.nbs),
          numProcesso: undefined,
          regimeEspTribut: maybeF(fake.utils.rad, { p: 0.5, min: 1, max: 6 }),
          prefeituraIncidencia: this.prefeitura(),
        },
        tomador: maybeF(tomador),
        constCivil: maybeF(obra, 0.95),
      },
    };

    const prest = this.note.json.prestacao;

    if (prest.regimeEspTribut !== undefined) {
      prest.regimeEspTribut = String(prest.regimeEspTribut);
    }

    prest.valIss = this.valIss();

    if (prest.exigibilidadeISS === '6' || prest.exigibilidadeISS === '7') {
      prest.numProcesso = fake.utils.numeroProcesso();
    }

    if (prest.issRetido === '1') {
      prest.respRetencao = String(fake.utils.rad(1, 2));
    }

    if (prest.respRetencao === '2') {
      this.note.json.intermediario = {
        identificacaoIntermed: fake.empresa.identificacao(),
        nomeRazaoIntermed: fake.empresa.razaoSocial(),
        cidadeIntermed: fake.cidade(),
      };
    }

    prest.baseCalculo = this.baseCalculo();
    prest.valLiquiNfse = this.valLiquiNfse();

    this.meta = [
      'INVOICE_REGISTRY',
      String(prest.prefeituraIncidencia),
      prest.valServicos,
      prest.baseCalculo,
      prest.itemLista,
      String(prest.exigibilidadeISS),
      prest.valIss,
    ];
  }

  prefeitura() {
    const prefeituras = [1100015, 1100379, 1100403, 1100346];
    return prefeituras[Math.floor(Math.random() * prefeituras.length)];
  }

  valIss() {
    const prest = this.note.json.prestacao;
    return `${(Number(prest.valServicos) * Number(prest.aliqServicos)).toFixed(2)}`;
  }

  baseCalculo() {
    const prest = this.note.json.prestacao;
    const valServ = prest.valServicos !== undefined ? Number(prest.valServicos) : 0;
    const valDeducoes = prest.valDeducoes !== undefined ? Number(prest.valDeducoes) : 0;
    const descontoIncond = prest.descontoIncond !== undefined ? Number(prest.descontoIncond) : 0;
    return `${(valServ - (valDeducoes + descontoIncond)).toFixed(2)}`;
  }

  valLiquiNfse() {
    const prest = this.note.json.prestacao;
    const valServ = prest.valServicos !== undefined ? Number(prest.valServicos) : 0;
    const valPis = prest.valPis !== undefined ? Number(prest.valPis) : 0;
    const valCofins = prest.valCofins !== undefined ? Number(prest.valCofins) : 0;
    const valInss = prest.valInss !== undefined ? Number(prest.valInss) : 0;
    const valIr = prest.valIr !== undefined ? Number(prest.valIr) : 0;
    const valCsll = prest.valCsll !== undefined ? Number(prest.valCsll) : 0;
    const outrasRetencoes = prest.outrasRetencoes !== undefined ? Number(prest.outrasRetencoes) : 0;
    const issRetido = prest.issRetido === '1' ? Number(prest.valIss) : 0;
    const descontoCond = prest.descontoCond !== undefined ? Number(prest.descontoCond) : 0;
    const descontoIncond = prest.descontoIncond !== undefined ? Number(prest.descontoIncond) : 0;
    return `${(
      valServ
        - valPis
        - valCofins
        - valInss
        - valIr
        - valCsll
        - outrasRetencoes
        - issRetido
        - descontoCond
        - descontoIncond
    ).toFixed(2)}`;
  }

  replaceOldNote(txid) {
    this.note.json.prestacao.substitutes = txid;
    this.meta[0] = 'INVOICE_UPDATE';
    console.log(this.note.json.prestacao.substitutes);
  }

  registerTxId(txid) {
    this.txid = txid;
  }

  getTxId() {
    return this.txid;
  }
}

module.exports = Nota;
