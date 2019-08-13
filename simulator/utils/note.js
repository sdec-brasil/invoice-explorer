/* eslint-disable class-methods-use-this */
const fake = require('./fields');

const tomador = () => {
  return {
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
  }
};

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
  constructor(addr, cnpj) {
    this.note = {
      json: {
        cnpj: cnpj,
        emissor: addr,
        prestacao: {
          codCnae: maybeF(fake.cnae),
          codNBS: maybeF(fake.utils.nbs),
          codServico: String(fake.utils.rad(21, 48)),
          codTributMunicipio: this.prefeitura(),
          dataPrestacao: fake.utils.date(),
          discriminacao: fake.utils.discriminacao(),
          itemLista: fake.utils.item(),
          numProcesso: undefined,
          optanteSimplesNacional: String(fake.utils.rad(1, 2)),
          prefeituraPrestacao: this.prefeitura(),
        },
        tributos: {
          baseCalculo: undefined,
          aliqServicos: fake.utils.reais(20, 50), // % of tax
          issRetido: fake.utils.rad(1, 2),
          respRetencao: undefined,
          regimeEspTribut: maybeF(fake.utils.rad, { p: 0.5, min: 1, max: 600 }),
          valCofins: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 300 }),
          valCsll: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 300 }),
          valDeducoes: fake.utils.reais(0, 10),
          valInss: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 500 }),
          valIr: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 700 }),
          valIss: undefined,
          valLiquiNfse: undefined,
          valPis: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 600 }),
          valServicos: fake.utils.reais(8000, 16000),
          valTotalTributos: maybeF(fake.utils.reais, { p: 0.5, min: 6, max: 1400 }),
          outrasRetencoes: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 800 }),
          incentivoFiscal: String(fake.utils.rad(1, 2)),
          descontoCond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 500 }),
          descontoIncond: maybeF(fake.utils.reais, { p: 0.5, min: 0, max: 400 }),
          exigibilidadeISS: String(fake.utils.rad(1, 6)),
        },
        tomador: maybeF(tomador),
        constCivil: maybeF(obra, 0.95),
      },
    };

    const tribut = this.note.json.tributos;
    const prest = this.note.json.prestacao;

    tribut.valIss = this.valIss();

    if (tribut.exigibilidadeISS === '6' || tribut.exigibilidadeISS === '7') {
      prest.numProcesso = fake.utils.numeroProcesso();
    }

    if (tribut.issRetido === '1') {
      tribut.respRetencao = fake.utils.rad(1, 2);
    }

    if (tribut.respRetencao === '2') {
      this.note.json.intermediario = {
        identificacaoIntermed: fake.empresa.identificacao(),
        nomeRazaoIntermed: fake.empresa.razaoSocial(),
        cidadeIntermed: fake.cidade(),
      };
    }

    tribut.baseCalculo = this.baseCalculo();
    tribut.valLiquiNfse = this.valLiquiNfse();

    this.meta = [
      'INVOICE_REGISTRY',
      String(prest.prefeituraIncidencia),
      prest.valServicos,
      prest.baseCalculo,
      prest.itemLista,
      String(prest.exigibilidadeISS),
      prest.valIss,
    ];

    if(this.note.json.tomador && !!Object.keys(this.note.json.tomador).length) {
      delete this.note.json.tomador;
    }

    if(this.note.json.constCivil && !!Object.keys(this.note.json.constCivil).length) {
      delete this.note.json.constCivil;
    }
  }

  prefeitura() {
    const prefeituras = [1100015, 1100379, 1100403, 1100346];
    return String(prefeituras[Math.floor(Math.random() * prefeituras.length)]);
  }

  valIss() {
    const tribut = this.note.json.tributos;
    return `${(Number(tribut.valServicos) * Number(tribut.aliqServicos)/10).toFixed(0)}`;
  }

  baseCalculo() {
    const tribut = this.note.json.tributos;
    const valServ = tribut.valServicos !== undefined ? Number(tribut.valServicos) : 0;
    const valDeducoes = tribut.valDeducoes !== undefined ? Number(tribut.valDeducoes) : 0;
    const descontoIncond = tribut.descontoIncond !== undefined ? Number(tribut.descontoIncond) : 0;
    return `${(valServ - (valDeducoes + descontoIncond)).toFixed(0)}`;
  }

  valLiquiNfse() {
    const tribut = this.note.json.tributos;
    const valServ = tribut.valServicos !== undefined ? Number(tribut.valServicos) : 0;
    const valPis = tribut.valPis !== undefined ? Number(tribut.valPis) : 0;
    const valCofins = tribut.valCofins !== undefined ? Number(tribut.valCofins) : 0;
    const valInss = tribut.valInss !== undefined ? Number(tribut.valInss) : 0;
    const valIr = tribut.valIr !== undefined ? Number(tribut.valIr) : 0;
    const valCsll = tribut.valCsll !== undefined ? Number(tribut.valCsll) : 0;
    const outrasRetencoes = tribut.outrasRetencoes !== undefined ? Number(tribut.outrasRetencoes) : 0;
    const issRetido = tribut.issRetido === '1' ? Number(tribut.valIss) : 0;
    const descontoCond = tribut.descontoCond !== undefined ? Number(tribut.descontoCond) : 0;
    const descontoIncond = tribut.descontoIncond !== undefined ? Number(tribut.descontoIncond) : 0;
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
