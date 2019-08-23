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
    this.json.taxRegime = fake.utils.rad(1, 4);
    this.json.name = fake.empresa.razaoSocial();
    this.json.tradeName = fake.empresa.nomeFantasia();
    this.json.taxNumber = fake.empresa.identificacao();
    this.json.street = fake.logradouro();
    this.json.number = fake.numero();
    this.json.additionalInformation = fake.complemento();
    this.json.district = fake.bairro();
    this.json.city = fake.utils.codMunicipio();
    this.json.state = fake.estado();
    this.json.economicAtivites = fake.economicAtivites();
    this.json.postalCode = fake.cep();
    this.json.email = maybeF(fake.email);
    this.json.phoneNumber = maybeF(fake.telefone);
    this.register(master);
  }

  constructAsset() {
    return { 
      name: this.json.taxNumber, 
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
        console.log(`Empresa | TxId: ${issued} | taxNumber: ${this.json.taxNumber} | Address: ${this.json.endBlock}`);
        main.addEmitter(this.json.endBlock, this.json.taxNumber);
      }
    } catch (e) {
      console.log('Error | Gerar endereço e permitir empresa:');
      // console.error(e);
    }
  }
}

module.exports = Owner;
