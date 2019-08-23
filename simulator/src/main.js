/* eslint-disable quote-props */
const Multichain = require('multinodejs');
const dockers = require('../utils/docker');
const Owner = require('./owner');
const Note = require('../utils/note');

const masterPort = 8001;
const masterPassword = 'this-is-insecure-change-it';

const stream = 'events';

const owners = [];
const replaceableNotes = [];
const emitters = [];

// randomInt :: (Int A, Int B) -> (Int C) | A < C < B
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function publishNote(master, company) {
  try {
    const [ address, taxNumber ] = company;
    const note = new Note(address, taxNumber);
    const timestamp = Date.now();
    const assetname = note.note.json.taxNumber.replace('.', '').replace('/','').replace('-', '') + `/NF-${timestamp}`;
    const txid = await master.node.issueFrom([
      address, 
      address, 
      {name: assetname,'open':true,'restrict':'send'},
      0,
      1,
      0,
      note.note.json
    ]);
    note.registerTxId(txid);
    note.registerName(assetname);
    console.log(`Nota registrada | TxId: ${txid} | taxNumber: ${taxNumber} | Address: ${address}`);
    if (Math.random() > 0.9) replaceableNotes.push(note);
  } catch (e) {
    console.log('Error | Registrar nota fiscal nova', e);
  }
};

// printNotes :: () ~> printNotes()
function printNotes(master) {
  const timer = Math.random() * 2500;
  setTimeout(async () => {
    const { length } = emitters;
    if (length) {
      const eIndex = getRandomInt(0, length - 1);
      publishNote(master, emitters[eIndex]);
    }
    printNotes(master);
  }, timer);
}

// registerEnterprises :: (Node) ~> registerEnterprises(Node)
function registerEnterprises(master) {
  const timer = Math.random() * 15000;
  setTimeout(async () => {
    try {
      const address = await master.node.getNewAddress();
      const owner = await new Owner(address, master);
      owners.push(owner);
    } catch (e) {
      console.error('Error | Registrar empresa', e);
    }
    registerEnterprises(master);
  }, timer);
}

// replaceNotes :: (Node) ~-> replaceNotes(Node)
function replaceNotes(master) {
  const timer = Math.random() * 15000;
  setTimeout(async () => {
    const { length } = replaceableNotes;
    if (length) {
      try {
        const oldNote = replaceableNotes.pop();
        const newNote = new Note(oldNote.note.emissor, oldNote.note.taxNumber);
        newNote.replaceOldNote(oldNote.txid);
        const address = oldNote.note.emissor;
        const txid = master.node.issueMoreFrom([
          address,
          oldNote.name,
          0,
          0,
          note.note.json,
        ]);
        newNote.registerTxId(txid);
        newNote.registerName(oldNote.name);
        console.log(`Nota substituída | TxId: ${txid} | taxNumber: ${oldNote.note.taxNumber} | Address: ${address}`);
        if (Math.random() > 0.9) replaceNotes.push(newNote);
      } catch (e) {
        console.log('Error | Registrar nota fiscal substituta');
      }
    }
    replaceNotes();
  }, timer);
}

function registerEmitters(master) {
  const timer = Math.random() * 35000;
  setTimeout(async () => {
    const { length } = owners;
    if (length) {
      try {
      const address = await master.node.getNewAddress();
      const owner = owners[getRandomInt(0, length - 1)];
      const txid = await master.node.grantFrom([owner.json.endBlock, address, owner.constructAsset().name + '.low3', 0]);
      emitters.push([address, owner.json.taxNumber])
    } catch (e) {
      console.error('Error | Registrar emissor', e);
    }
  }
  }, timer);
}

function killscript(minutes) {
  setTimeout(() => process.exit(0), minutes * 60000);
}

(async (timeLimit) => {
  if (isNaN(timeLimit)) process.exit(-1);

  const master = {
    node: Multichain({
      port: masterPort,
      host: 'localhost',
      user: 'multichainrpc',
      pass: masterPassword,
    }),
    addr: '',
  };

  master.addr = (await master.node.getAddresses())['0'].toString();

  registerEnterprises(master);
  printNotes(master);
  // replaceNotes(master);
  registerEmitters(master);
  killscript(Number(timeLimit));
})(process.argv[2] || 2);

module.exports.addEmitter = (address, taxNumber) => emitters.push([address, taxNumber]);