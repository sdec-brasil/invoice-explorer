const fake = require('../utils/fields');
const Note = require('../utils/note');
const main = require('../src/main');

const maybeF = (f) => {
  if (Math.random() > 0.5) {
    return f();
  }
  return undefined;
};

class Enterprise {
  constructor({ node, addr }, stream) {
    this.node = node;
    this.nodeAddr = addr;
    this.registered = false;
    this.json = {};
    this.json.endBlock = undefined;
    this.json.razao = fake.empresa.razaoSocial();
    this.json.fantasia = fake.empresa.nomeFantasia();
    this.json.cnpj = fake.empresa.identificacao();
    this.json.logEnd = fake.logradouro();
    this.json.numEnd = fake.numero();
    this.json.compEnd = fake.complemento();
    this.json.bairroEnd = fake.bairro();
    this.json.cidadeEnd = fake.utils.codMunicipio();
    this.json.estadoEnd = fake.estado();
    this.json.paisEnd = '';
    this.json.cepEnd = fake.cep();
    this.json.email = maybeF(fake.email);
    this.json.tel = maybeF(fake.telefone);
    this.register(stream);
  }

  async register(stream) {
    try {
      const address = await this.node.getNewAddress();
      this.json.endBlock = address;
      const tx = await this.node.grant([address, 'send,receive', 0]);

      setTimeout(async () => {
        try {
          await this.node.publishFrom([address, stream, ['COMPANY_REGISTRY', this.json.cnpj], { json: this.json }]);
          this.registered = true;
          console.log(`Empresa ${address} Registrada com ${tx}`);
        } catch (e) {
          console.log('Error ao registrar empresa:');
          console.error(e);
        }
      }, 5000);
    } catch (e) {
      console.log('Error ao gerar endereço e permitir empresa:');
      console.error(e);
    }
  }

  publishNote(stream) {
    const addr = this.json.endBlock;
    const note = new Note(this.json.endBlock);

    if (this.registered) {
      console.log('Registrando Nota');
      return this.node.publishFrom([addr, stream, note.meta, note.note])
        .then((txid) => {
          const json = JSON.stringify(note);
          console.log(`\t Nota registrada | txid: ${txid}`);
          note.registerTxId(txid);
          if (Math.random() > 0.85) main.addNote([this, note]);
          return note;
        }).catch((err) => {
          console.log('\t Não conseguiu registrar nota');
          console.log(err.code);
          console.log(err);
          throw new Error('#publishNote Err');
        });
    }

    return null;
  }

  replaceNote(stream, oldNote) {
    const addr = this.json.endBlock;
    const newNote = new Note(this.json.endBlock);
    newNote.replaceOldNote(oldNote.txid);
    this.node.publishFrom([addr, stream, newNote.meta, newNote.note])
      .then((txid) => {
        const json = JSON.stringify(newNote);
        console.log(`\t Nota substituta registrada | txid: ${txid}`);
        return newNote;
      }).catch((err) => {
        console.log('\t Não conseguiu substituir nota');
        console.log(err.code);
        console.log(err);
        throw new Error('#replacehNote Err');
      });
  }
}

module.exports = Enterprise;
