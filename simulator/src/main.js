/* eslint-disable quote-props */
const Multichain = require('multinodejs');
const dockers = require('../utils/docker');
const Enterprise = require('./empresa');

const masterPort = 8001;
const masterPassword = 'this-is-insecure-change-it';
const slavePort = 8002;

const stream = 'events';
const enterprises = [];
const replaceableNotes = [];

// randomInt :: (Int A, Int B) -> (Int C) | A < C < B
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// printNotes :: () ~> printNotes()
function printNotes() {
  const timer = Math.random() * 2500;
  setTimeout(async () => {
    const { length } = enterprises;
    if (length) {
      const eIndex = getRandomInt(0, length - 1);
      enterprises[eIndex].publishNote(stream);
    }
    printNotes();
  }, timer);
}

// registerEnterprises :: (Node, Node) ~> registerEnterprises(Node, Node)
function registerEnterprises(master, slave) {
  const timer = Math.random() * 15000;
  setTimeout(async () => {
    if (timer > 7250) {
      const enterprise = new Enterprise(master, stream);
      enterprises.push(enterprise);
    } else {
      const enterprise = new Enterprise(slave, stream);
      enterprises.push(enterprise);
    }
    registerEnterprises(master, slave);
  }, timer);
}

// replaceNotes :: (Node, Node) ~-> replaceNotes(Node, Nonde)
function replaceNotes() {
  const timer = Math.random() * 15000;
  setTimeout(async () => {
    const { length } = replaceableNotes;
    if (length) {
      const [enterprise, note] = replaceableNotes.pop();
      enterprise.replaceNote(stream, note);
    }
    replaceNotes();
  }, timer);
}

function killscript(minutes) {
  setTimeout(() => process.exit(0), minutes * 60000);
}

(async (timeLimit) => {
  let slavePassword = await dockers.exec(
    'docker exec docker-multichain_slavenode_1 cat root/.multichain/MyChain/multichain.conf',
  );
  slavePassword = dockers.extractPassword(slavePassword);

  const slave = {
    node: Multichain({
      port: slavePort,
      host: 'localhost',
      user: 'multichainrpc',
      pass: slavePassword,
    }),
    addr: '',
  };

  slave.addr = (await slave.node.getAddresses())['0'].toString();

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

  await dockers.exec(`docker exec docker-multichain_masternode_1 multichain-cli MyChain grant ${slave.addr} activate,mine 0`);

  registerEnterprises(master, slave);
  printNotes();
  replaceNotes();
  killscript(Number(timeLimit));
})(process.argv[2] || 2);

module.exports.addNote = note => replaceableNotes.push(note);
