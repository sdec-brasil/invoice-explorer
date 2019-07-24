// Imports
import fixtures from 'sequelize-fixtures';
import process from 'process';

// App Imports
import generateInvoices from './invoice/generateInvoices';
import generateBlocks from './block/generateBlocks';

export default function (models) {
  console.log('SETUP - Starting to populate tables with Initial Data');

  return new Promise(async (resolve, reject) => {
    const log = () => {};
    try {
      await fixtures.loadFile(`${__dirname}/estado/estados.js`, models, { log });
      await fixtures.loadFile(`${__dirname}/regiao/regioes.js`, models, { log });
      await fixtures.loadFile(`${__dirname}/municipio/municipios.js`, models, { log });
      await fixtures.loadFile(`${__dirname}/prefeitura/prefeituras.js`, models, { log });
      await fixtures.loadFile(`${__dirname}/empresa/empresas.js`, models, { log });

      if (process.env.NODE_ENV !== 'production') {
        // await generateBlocks(50);
        // await generateInvoices(200);
      }

      process.emit('dataLoaded');
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}
