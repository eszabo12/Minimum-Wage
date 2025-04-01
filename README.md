# 💸 State Minimum Wage Scraper

Scrapes official U.S. minimum wage data straight from [dol.gov](https://www.dol.gov/agencies/whd/minimum-wage/state) — because everyone deserves to know what they’re worth. 🫡

---

## 📦 What is this?

This is a lightweight Node.js package that:
- Scrapes up-to-date state minimum wages 💵
- Lets you query wages by abbreviation (`TX`) or full state name (`Texas`)
- Works great for payroll systems, dashboards, job boards, or fun weekend side projects where you're obsessing about state labor data (we don't judge)

---

## ✨ Features

✅ Real-time scraping from DOL  
✅ Supports abbreviations or full state names  
✅ Fun to use, minimal to set up  
✅ Actually returns cents (not just dollars, like some savage)

---

## 🚀 Usage

### Install

```bash
npm install min-wage
```

### Basic Usage```js
const { getWages, getWageByState } = require('min-wage');

// Get all wages by state abbreviation
const allWages = await getWages();
console.log(allWages);

// Get wage by state name
const nyWage = await getWageByState('New York');
console.log(nyWage);

