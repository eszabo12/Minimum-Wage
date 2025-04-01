import axios from 'axios';
import * as cheerio from 'cheerio';
import { stateAbbrToName, stateNameToAbbr } from './utils.js';

const DOL_URL = 'https://www.dol.gov/agencies/whd/minimum-wage/state';

async function fetchRawStateData() {
  const res = await axios.get(DOL_URL);
  const $ = cheerio.load(res.data);

  const scriptTags = $('script');
  let raw = null;

  scriptTags.each((_, el) => {
    const text = $(el).html();
    const match = text.match(/vMinStateData\s*=\s*(\[[\s\S]*?\]);/);
    if (match) {
      raw = match[1];
      return false;
    }
  });

  if (!raw) throw new Error('State wage data not found.');
  return eval(raw); // It's a JS array of objects, not JSON
}

export async function getWages({ fullName = false } = {}) {
  const raw = await fetchRawStateData();
  const map = {};

  raw.forEach(({ State, Wage }) => {
    if (!Wage || Wage.trim() === '') return;

    const wage = parseFloat(Wage.replace('$', ''));
    const key = fullName ? stateAbbrToName[State] : State;

    if (key) {
      map[fullName ? key : State] = wage;
    }
  });

  return map;
}

export async function getWageByState(stateInput, { fullName = false } = {}) {
  const wages = await getWages({ fullName });

  if (!stateInput) return null;

  const key = fullName
    ? stateInput.trim()
    : stateInput.trim().toUpperCase();

  return wages[key] || null;
}

// Example usage
// getWages({ fullName: true }).then(console.log);
// getWageByState('California', { fullName: true }).then(console.log);
