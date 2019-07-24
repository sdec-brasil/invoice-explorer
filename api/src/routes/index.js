// App Imports
import addresses from './addresses';
import balances from './balances';
import blockchain from './blockchain';
import blocks from './blocks';
import invoices from './invoices';
import city from './city';
import transactions from './transactions';
import companies from './companies';

const routes = {
  ...addresses,
  ...balances,
  ...blockchain,
  ...blocks,
  ...invoices,
  ...city,
  ...transactions,
  ...companies,
};

export default routes;
