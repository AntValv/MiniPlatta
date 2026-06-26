#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { createRuntime } = require('./runtime');

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseArgs(argv) {
  const root = path.join(__dirname, '..');
  const args = { script: null, response: null, reminders: null };
  const positional = [];
  for (const arg of argv) {
    if (arg.startsWith('--script=')) args.script = arg.slice('--script='.length);
    else if (arg.startsWith('--response=')) args.response = arg.slice('--response='.length);
    else if (arg.startsWith('--reminders=')) args.reminders = arg.slice('--reminders='.length);
    else positional.push(arg);
  }
  // Allow plain positional usage too: run.js [response] [script] [reminders]
  if (!args.response && positional[0]) args.response = positional[0];
  if (!args.script && positional[1]) args.script = positional[1];
  if (!args.reminders && positional[2]) args.reminders = positional[2];

  args.script = path.resolve(args.script || path.join(root, 'example_javascript.js'));
  args.response = path.resolve(args.response || path.join(root, 'test_response.json'));
  args.reminders = path.resolve(args.reminders || path.join(root, 'example_reminder.json'));
  return args;
}

function findEntryFunctionName(scriptSrc) {
  const match = /function\s+(scr\d+)\s*\(/.exec(scriptSrc);
  if (!match) {
    throw new Error('Could not find an entry function (expected "function scrNNNNN()") in the script file.');
  }
  return match[1];
}

function runInferenceScript({ scriptPath, responsePath }) {
  const response = readJSON(responsePath);
  const scriptSrc = fs.readFileSync(scriptPath, 'utf8');
  const entryFunctionName = findEntryFunctionName(scriptSrc);

  const runtime = createRuntime(response);

  const sandbox = {
    libEBMEDS: runtime.libEBMEDS,
    libQuestions: runtime.libQuestions,
    libUser: runtime.libUser,
    libDiagnoses: runtime.libDiagnoses,
    libMeasurements: runtime.libMeasurements,
    libMedication: runtime.libMedication,
    libVaccinations: runtime.libVaccinations,
    libProcedures: runtime.libProcedures,
    libPatient: runtime.libPatient,
    libRisks: runtime.libRisks,
    libCommon: runtime.libCommon,
    libSharedFunctions: runtime.libSharedFunctions,
    reminder: runtime.reminder,
    ebdeb: runtime.ebdeb,
    console,
  };

  vm.createContext(sandbox);
  vm.runInContext(scriptSrc, sandbox, { filename: scriptPath });

  if (typeof sandbox[entryFunctionName] !== 'function') {
    throw new Error(`Entry function "${entryFunctionName}" was not defined by the script.`);
  }
  sandbox[entryFunctionName]();

  return runtime.recommendations;
}

// Fills "@1" in a reminder template string with the text produced by the script.
function substitute(template, text) {
  if (!template) return template || '';
  return template.split('@1').join(text || '');
}

function resolveRecommendations(recommendations, reminderDefs) {
  return recommendations.map((rec) => {
    const def = reminderDefs.find((r) => r.scriptId === rec.scriptId && r.messageNumber === rec.messageNumber);
    if (!def) {
      return { ...rec, found: false };
    }
    // A reminder whose patientMessage is empty is professional/nurse-facing only
    // (in this dataset that's exactly messageNumber 13, the case-summary reminder).
    const isProfessionalOnly = !def.patientMessage;
    return {
      ...rec,
      found: true,
      isProfessionalOnly,
      uuid: def.uuid,
      longMessage: substitute(def.longMessage, rec.text),
      shortMessage: substitute(def.shortMessage, rec.text),
      nurseMessage: substitute(def.nurseMessage, rec.text),
      patientMessage: substitute(def.patientMessage, rec.text),
      suggestions: def.suggestions || [],
    };
  });
}

function printReport(resolved) {
  console.log('='.repeat(80));
  console.log(`Saatiin ${resolved.length} suositus(ta) skriptin ajosta:`);
  console.log('='.repeat(80));

  for (const rec of resolved) {
    console.log('');
    console.log(
      `--- messageNumber ${rec.messageNumber} (urgency=${rec.urgency})` +
        (rec.isProfessionalOnly ? '  [AMMATTILAISEN TIIVISTELMÄ]' : '  [HOIDON TARPEEN ARVION SUOSITUS]'),
    );
    if (!rec.found) {
      console.log('  !! Tälle messageNumberille ei löytynyt vastinetta reminder-tiedostosta.');
      console.log(`  Raaka teksti (4. parametri): "${rec.text}"`);
      continue;
    }
    if (rec.longMessage) console.log(`  longMessage:     ${rec.longMessage}`);
    if (rec.nurseMessage) console.log(`  nurseMessage:    ${rec.nurseMessage}`);
    if (rec.patientMessage) console.log(`  patientMessage:  ${rec.patientMessage}`);
    if (rec.suggestions.length) {
      console.log('  suggestions:');
      for (const s of rec.suggestions) {
        const codes = (s.codes || []).map((c) => c.value).join(', ');
        console.log(`    - [${s.kind}] ${codes ? `${codes} — ` : ''}${s.text}`);
      }
    }
  }
  console.log('');
  console.log('='.repeat(80));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const reminderDefs = readJSON(args.reminders);

  const recommendations = runInferenceScript({ scriptPath: args.script, responsePath: args.response });
  const resolved = resolveRecommendations(recommendations, reminderDefs);

  printReport(resolved);

  return resolved;
}

if (require.main === module) {
  main();
}

module.exports = { main, runInferenceScript, resolveRecommendations };
