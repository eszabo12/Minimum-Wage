const { getWages, getWageByState, WageMap, StateWageOptions } = require('./index.ts');

const run = async (): Promise<void> => {
  const all: typeof WageMap = await getWages();
  console.log('All wages (abbr):', all);

  const allFull: typeof WageMap = await getWages({ fullName: true });
  console.log('All wages (full name):', allFull);

  const caWage: number = await getWageByState('CA');
  console.log('CA wage:', caWage);

  const options: typeof StateWageOptions = { fullName: true };
  const nyWageByName: number = await getWageByState('New York', options);
  console.log('New York wage:', nyWageByName);
};

run().catch(console.error);
