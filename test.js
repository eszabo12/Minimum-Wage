import { getWages, getWageByState } from './index.js';

const run = async () => {
  const all = await getWages();
  console.log('All wages (abbr):', all);

  const allFull = await getWages({ fullName: true });
  console.log('All wages (full name):', allFull);

  const caWage = await getWageByState('CA');
  console.log('CA wage:', caWage);

  const nyWageByName = await getWageByState('New York', { fullName: true });
  console.log('New York wage:', nyWageByName);
};

run();
