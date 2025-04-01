import axios from 'axios';
import * as cheerio from 'cheerio';
const { stateAbbrToName, stateNameToAbbr } = require('./utils.ts');
const { MINIMUM_COMBINED_WAGE, NEW_YORK_CITY_ZIP_CODES } = require('./wageData.ts');

const DOL_URL = 'https://www.dol.gov/agencies/whd/minimum-wage/state';

export interface StateWageData {
  State: string;
  Wage: string;
}

export interface WageMap {
  [key: string]: number;
}

export interface WageOptions {
  fullName?: boolean;
}

export interface StateWageOptions extends WageOptions {
  zipCode?: string | null;
}

async function fetchRawStateData(): Promise<StateWageData[]> {
  const res = await axios.get(DOL_URL);
  const $ = cheerio.load(res.data);

  const scriptTags = $('script');
  let raw: string | null = null;

  scriptTags.each((_, el) => {
    const text = $(el).html();
    if (!text) return;
    const match = text.match(/vMinStateData\s*=\s*(\[[\s\S]*?\]);/);
    if (match) {
      raw = match[1];
      return false;
    }
  });

  if (!raw) throw new Error('State wage data not found.');
  return eval(raw);
}

export async function getWages(options: WageOptions = {}): Promise<WageMap> {
  const { fullName = false } = options;
  const raw = await fetchRawStateData();
  const map: WageMap = {};

  raw.forEach(({ State, Wage }: StateWageData) => {
    if (!Wage || Wage.trim() === '') return;
    const wage = parseFloat(Wage.replace('$', ''));
    const key = fullName ? stateAbbrToName[State] : State;
    if (key) {
      map[key] = wage;
    }
  });

  return map;
}

export async function getWageByState(
  stateInput: string,
  options: StateWageOptions = {}
): Promise<number | null> {
  const { fullName = false, zipCode = null } = options;

  // If zip is NYC zip, return NYC wage from combined map
  if (zipCode && NEW_YORK_CITY_ZIP_CODES.has(zipCode)) {
    return MINIMUM_COMBINED_WAGE.NY_NYC / 100;
  }

  const wages = await getWages({ fullName });
  const key = fullName
    ? stateInput.trim()
    : stateInput.trim().toUpperCase();

  return wages[key] || null;
}

export { MINIMUM_COMBINED_WAGE, NEW_YORK_CITY_ZIP_CODES };

// Example usage
// getWages({ fullName: true }).then(console.log);
// getWageByState('California', { fullName: true }).then(console.log);
// Example usage with ZIP codes
// NYC zip (Manhattan)
// getWageByState('NY', { zipCode: '10001' }).then(console.log); 
// Non-NYC zip (Albany)
// getWageByState('NY', { zipCode: '12201' }).then(console.log);
