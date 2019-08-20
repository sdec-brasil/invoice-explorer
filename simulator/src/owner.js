const fake = require('../utils/fields');
const main = require('../src/main');

const maybeF = (f) => {
  if (Math.random() > 0.5) {
    return f();
  }
  return undefined;
};

class Owner {
  constructor(address, master) {
    this.registered = false;
    this.json = {};
    this.json.endBlock = address;
    this.json.regTrib = fake.utils.rad(1, 4);
    this.json.razao = fake.empresa.razaoSocial();
    this.json.fantasia = fake.empresa.nomeFantasia();
    this.json.cnpj = fake.empresa.identificacao();
    this.json.logEnd = fake.logradouro();
    this.json.numEnd = fake.numero();
    this.json.compEnd = fake.complemento();
    this.json.bairroEnd = fake.bairro();
    this.json.cidadeEnd = fake.utils.codMunicipio();
    this.json.estadoEnd = fake.estado();
    this.json.cnaes = fake.cnaes();
    this.json.paisEnd = '';
    this.json.cepEnd = fake.cep();
    this.json.email = maybeF(fake.email);
    this.json.tel = maybeF(fake.telefone);
    this.register(master);
  }

  constructAsset() {
    return { 
      name: this.json.cnpj, 
      open: true, 
      restrict: 'send,receive'
    };
  }

  async register(master) {
    try {
      const asset = this.constructAsset();
      const issued = await master.node.issueFrom([master.addr, this.json.endBlock, asset, 1, 1, 0, this.json]);
      const granted = await master.node.grantFrom([master.addr, this.json.endBlock, asset.name + '.activate', 0]);

      if (issued && granted) {
        console.log(`Empresa | TxId: ${issued} | CNPJ: ${this.json.cnpj} | Address: ${this.json.endBlock}`);
        main.addEmitter(this.json.endBlock, this.json.cnpj);
      }
    } catch (e) {
      console.log('Error | Gerar endereço e permitir empresa:');
      // console.error(e);
    }
  }
}

module.exports = Owner;
