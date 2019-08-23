const formatters = Object.create(null);

/**
 * Formats a cpf if it is not formatted, and returns it
 * @param   {String} cpf - An unformatted or formatted cpf
 * @returns {String} A formatted CPF
 */
formatters.CPF = (cpf) => {
  // Check CPF format
  if (/[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/.test(cpf)) {
    return cpf;
  }
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};


/**
 * Formats a taxNumber if it is not formatted, and returns it
 * @param   {String} taxNumber - An unformatted or formatted taxNumber
 * @returns {String} A formatted taxNumber
 */
formatters.taxNumber = (taxNumber) => {
  // Check taxNumber format
  if (/[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}-[0-9]{2}/.test(taxNumber)) {
    return false;
  }
  return `${taxNumber.slice(0, 2)}.${taxNumber.slice(2, 5)}.${taxNumber.slice(5, 8)}/${taxNumber.slice(8, 12)}-${taxNumber.slice(12, 14)}`;
};

export default formatters;
