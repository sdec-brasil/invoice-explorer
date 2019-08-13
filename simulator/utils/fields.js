const Leite = require('leite');
const bip39 = require('bip39');

const leite = new Leite();

// Field's Size according to Specs
const sz = {
  razao: 150,
  fantasia: 60,
  logEnd: 125,
  numEnd: 10,
  compEnd: 60,
  bairroEnd: 60,
  cidadeEnd: 7,
  estadoEnd: 2,
  paisEnd: 4,
  cepEnd: 8,
  email: 80,
  tel: 20,
  id: 18,
  endBlock: 38,
};

const constraint = (str, size) => {
  if (str.length > size) {
    throw new Error('Campo maior do que permitido');
  }
};

const utils = {
  randomReais: (min = 100, max = 10000) => (Math.random() * (max - min) + min).toFixed(0),
  getRandomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  telefone: () => {
    const tel = leite.pessoa.rg().replace(/./g, '').replace('-', '');
    constraint(tel, sz.tel);
    return tel;
  },
  email: () => {
    const mail = `${leite.pessoa.email()}`;
    constraint(mail, sz.email);
    return mail;
  },
  randomDate: () => leite.pessoa.nascimento({ formato: 'YYYYMMDD' }),
  randomItem: () => `${utils.getRandomInt(1, 99)}.${utils.getRandomInt(1, 99)}`,
  randomDiscriminacao: () => bip39.generateMnemonic(),
  randomMunicipio: () => `${utils.getRandomInt(1000000, 9999999)}`,
  randomCNAE: () => `${leite.empresa.cnpj()}`,
  randomNBS: () => `${(leite.empresa.cnpj()).slice(0, 9)}`,
  randomProcesso: () => `${leite.empresa.cnpj()}`,
  randomPhone: () => leite.pessoa.rg().replace(/./g, '').replace('-', ''),
  randomHex: () => `0x${(Math.random() * 100000).toFixed(0)}${(Math.random() * 100000).toFixed(0)}`,
  randomPubKey: () => {
    const addr = '1Yu2BuptuZSiBWfr2Qy4aic6qEVnwPWrdkHPEc';
    constraint(addr, sz.endBlock);
    return addr;
  },
  obra: () => (Math.random() * 100000).toFixed(0),
  art: () => (Math.random() * 100000).toFixed(0),
  cnaes: () => {
    const rad = utils.getRandomInt;
    const length = rad(1, 5);
    const cnaeList = [];
    for (let i = 0; i < length; i++) {
      const d = rad(1,99);
      const gc = rad(1,99);
      const s = rad(1,99);
      cnaeList.push(`${d < 10 ? '0' + d : d}.${gc}-${rad(1,9)}/${s < 10 ? '0' + s : s}`);
    };
    return cnaeList;
  },
  cnae: () =>{
    const d = rad(1,99);
    const gc = rad(1,99);
    const s = rad(1,99);
    return `${d < 10 ? '0' + d : d}.${gc}-${rad(1,9)}/${s < 10 ? '0' + s : s}`
  },
};

const empresa = {
  razaoSocial: () => {
    const razao = `${leite.pessoa.nome()} Razão Social`;
    constraint(razao, sz.razao);
    return razao;
  },
  nomeFantasia: () => {
    const fantasia = 'Apenas um Nome Fantasia LTDA';
    constraint(fantasia, sz.fantasia);
    return fantasia;
  },
  identificacao: () => {
    const cnpj = `${leite.empresa.cnpj({formatado: true})}`;
    constraint(cnpj, sz.id);
    return cnpj;
  },
};

const localizacao = {
  logradouro: () => {
    const log = `${leite.localizacao.logradouro()}`;
    constraint(log, sz.logEnd);
    return log;
  },
  bairro: () => {
    const bairro = `${leite.localizacao.bairro()}`;
    constraint(bairro, sz.bairroEnd);
    return bairro;
  },
  cep: () => {
    const cep = `${leite.localizacao.cep()}`;
    constraint(cep, sz.cepEnd);
    return cep;
  },
  cidade: () => {
    const cidade = `${utils.getRandomInt(1000000, 9999999)}`;
    constraint(cidade, sz.cidadeEnd);
    return cidade;
  },
  complemento: () => {
    const comp = `${leite.localizacao.complemento()}`;
    constraint(comp, sz.compEnd);
    return comp;
  },
  estado: () => {
    const uf = `${leite.localizacao.estado()}`;
    constraint(uf, sz.estadoEnd);
    return uf;
  },
  numero: () => {
    const num = `${utils.getRandomInt(0, 450)}`;
    constraint(num, sz.numEnd);
    return num;
  },
};

const pessoa = {
  identificacao: () => `${leite.pessoa.cpf()}`,
};

const fields = {
  logradouro: localizacao.logradouro,
  bairro: localizacao.bairro,
  cep: localizacao.cep,
  cidade: localizacao.cidade,
  complemento: localizacao.complemento,
  numero: localizacao.numero,
  estado: localizacao.estado,

  cnaes: utils.cnaes,
  cnae: utils.cnae,

  email: utils.email,
  telefone: utils.telefone,

  utils: {
    reais: utils.randomReais,
    date: utils.randomDate,
    item: utils.randomItem,
    discriminacao: utils.randomDiscriminacao,
    codMunicipio: utils.randomMunicipio,
    cnae: utils.randomCNAE,
    nbs: utils.randomNBS,
    numeroProcesso: utils.randomProcesso,
    hex: utils.randomHex,
    rad: utils.getRandomInt,
    obra: utils.obra,
    art: utils.art,
  },

  empresa: {
    razaoSocial: empresa.razaoSocial,
    nomeFantasia: empresa.nomeFantasia,
    identificacao: empresa.identificacao,
  },

  pessoa: {
    identificacao: pessoa.identificacao,
  },
};

module.exports = fields;
