'use strict';

// Statically scans an EBMEDS script source for every script it implements, by
// finding its libEBMEDS.initScript("scrNNNNN", country, "fmMMMM") calls and
// cross-checking that a matching "function scrNNNNN()" is actually defined.
// This is what lets the Postman runner stay generic: whichever scripts/forms
// example_javascript.js happens to contain right now are the ones considered
// "related" when scanning Postman collections.
function discoverScripts(scriptSrc) {
  const initCalls = [];
  const initScriptRe = /libEBMEDS\.initScript\(\s*["']([^"']+)["']\s*,\s*["'][^"']*["']\s*,\s*["']fm(\d+)["']\s*\)/g;
  let m;
  while ((m = initScriptRe.exec(scriptSrc))) {
    initCalls.push({ scriptId: m[1], formNumber: m[2] });
  }

  const definedFunctions = new Set();
  const functionRe = /function\s+(scr\d+)\s*\(/g;
  while ((m = functionRe.exec(scriptSrc))) {
    definedFunctions.add(m[1]);
  }

  return initCalls
    .filter((s) => definedFunctions.has(s.scriptId))
    .map((s) => ({ ...s, entryFunctionName: s.scriptId }));
}

module.exports = { discoverScripts };
