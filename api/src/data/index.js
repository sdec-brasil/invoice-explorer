// Imports
import fixtures from 'sequelize-fixtures';
import process from 'process';

export default function (models) {
  console.log('SETUP - Starting to populate tables with Initial Data');

  return new Promise(async (resolve, reject) => {
    const log = () => {};
    try {
      await fixtures.loadFile(`${__dirname}/estado/estados.js`, models, { log });
      await fixtures.loadFile(`${__dirname}/regiao/regioes.js`, models, { log });
      await fixtures.loadFile(`${__dirname}/municipio/municipios.js`, models, { log });
      await fixtures.loadFile(`${__dirname}/prefeitura/prefeituras.js`, models, { log });
      // await fixtures.loadFile(`${__dirname}/empresa/empresas.js`, models, { log });
      process.emit('dataLoaded');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
