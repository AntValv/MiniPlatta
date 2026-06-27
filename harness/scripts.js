'use strict';

// Statically scans an EBMEDS script source for every script it implements, by
// finding its libEBMEDS.initScript(scriptId, ...args) calls and cross-checking
// that a matching "function scrNNNNN()" is actually defined. The form code
// ("fmMMMM") and country arguments aren't always in the same argument
// position across scripts, so every quoted argument is scanned for whichever
// one looks like "fmMMMM" rather than assuming a fixed position. This is what
// lets the Postman runner stay generic: whichever scripts/forms
// example_javascript.js happens to contain right now are the ones considered
// "related" when scanning Postman collections.
function discoverScripts(scriptSrc) {
  const initCalls = [];
  const callRe = /libEBMEDS\.initScript\(([^)]*)\)/g;
  let m;
  while ((m = callRe.exec(scriptSrc))) {
    const args = [...m[1].matchAll(/["']([^"']*)["']/g)].map((a) => a[1]);
    if (args.length === 0) continue;
    const scriptId = args[0];
    const formArg = args.find((a) => /^fm\d+$/.test(a));
    if (!formArg) continue;
    initCalls.push({ scriptId, formNumber: formArg.slice(2) });
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
