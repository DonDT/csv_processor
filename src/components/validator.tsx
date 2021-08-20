let errorCount = 0;

export const currencyValidator = (value: string, currencies: object) => {
  const match = Object.keys(currencies).find((cur) => cur === value);
  if (match) {
    if (errorCount > 0) errorCount--;
  } else errorCount++;
  // best to count errors than comparing the data
  return errorCount === 0;
};
