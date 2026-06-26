#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const { createRuntimeForQuestionMap } = require('./runtime');
const { discoverScripts } = require('./scripts');
const { questionMapFromQuestionnaireResponse } = require('./fhir');
const { listCollectionFiles, loadCollectionRequests, parseFhirBody, extractAssertions } = require('./postman');

const ROOT = path.join(__dirname, '..');

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function buildSandbox(runtime) {
  return {
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
}

function runScenario({ scriptSrc, scriptPath, scriptId, items }) {
  const questionMap = questionMapFromQuestionnaireResponse(items);
  const runtime = createRuntimeForQuestionMap(questionMap, 'fi');
  const sandbox = buildSandbox(runtime);
  vm.createContext(sandbox);
  vm.runInContext(scriptSrc, sandbox, { filename: scriptPath });
  sandbox[scriptId]();
  return runtime.recommendations;
}

function resolveAgainstReminders(recommendations, reminderDefs) {
  return recommendations.map((rec) => ({
    ...rec,
    def: reminderDefs.find((r) => r.scriptId === rec.scriptId && r.messageNumber === rec.messageNumber),
  }));
}

function evaluateTest({ resolved, expectedCode, expectedTopicUuid }) {
  const codeMatch = resolved.some((r) => (r.def && r.def.suggestions ? r.def.suggestions : []).some((s) => (s.codes || []).some((c) => c.value === expectedCode)));
  const topicMatch = expectedTopicUuid ? resolved.some((r) => r.def && r.def.uuid === expectedTopicUuid) : null;
  const pass = Boolean(codeMatch) && (topicMatch === null ? true : topicMatch);
  return { pass, codeMatch, topicMatch };
}

function main() {
  const scriptPath = path.join(ROOT, 'example_javascript.js');
  const reminderPath = path.join(ROOT, 'example_reminder.json');
  const postmanDir = path.join(ROOT, 'Postman_tests');

  const scriptSrc = fs.readFileSync(scriptPath, 'utf8');
  const reminderDefs = loadJSON(reminderPath);
  const availableScripts = discoverScripts(scriptSrc);
  const formToScript = new Map(availableScripts.map((s) => [s.formNumber, s.scriptId]));

  console.log(
    `example_javascript.js sisältää skriptit: ${
      availableScripts.map((s) => `${s.scriptId} (form ${s.formNumber})`).join(', ') || '(ei yhtään tunnistettua skriptiä)'
    }`,
  );

  const collectionFiles = listCollectionFiles(postmanDir);
  if (collectionFiles.length === 0) {
    console.log(`Postman_tests-hakemistosta (${postmanDir}) ei löytynyt *.postman_collection.json -tiedostoja.`);
    return;
  }

  const allRequests = collectionFiles.flatMap(loadCollectionRequests);
  console.log(`Postman-kokoelmia: ${collectionFiles.length}, testipyyntöjä yhteensä: ${allRequests.length}`);

  const relevant = [];
  for (const req of allRequests) {
    const fhir = parseFhirBody(req);
    if (!fhir) continue;
    const scriptId = formToScript.get(fhir.formNumber);
    if (!scriptId) continue;
    relevant.push({ req, fhir, scriptId });
  }
  console.log(`example_javascript.js:hen liittyviä testejä löytyi: ${relevant.length}`);
  console.log('');

  let passed = 0;
  const failures = [];

  for (const { req, fhir, scriptId } of relevant) {
    const { expectedCode, expectedTopicUuid } = extractAssertions(req);

    let recommendations = null;
    let runError = null;
    try {
      recommendations = runScenario({ scriptSrc, scriptPath, scriptId, items: fhir.items });
    } catch (e) {
      runError = e;
    }

    let result = { pass: false, codeMatch: false, topicMatch: false };
    let resolved = [];
    if (!runError) {
      resolved = resolveAgainstReminders(recommendations, reminderDefs);
      result = evaluateTest({ resolved, expectedCode, expectedTopicUuid });
    }

    console.log(`${result.pass ? 'PASS' : 'FAIL'}  [${req._collection}] ${req.name}`);

    if (result.pass) {
      passed += 1;
    } else {
      failures.push({
        name: req.name,
        collection: req._collection,
        runError,
        expectedCode,
        expectedTopicUuid,
        codeMatch: result.codeMatch,
        topicMatch: result.topicMatch,
        triggered: resolved.map((r) => ({ messageNumber: r.messageNumber, uuid: r.def && r.def.uuid })),
      });
    }
  }

  console.log('');
  console.log('='.repeat(70));
  console.log(`Tulos: ${passed}/${relevant.length} testiä läpi.`);

  if (failures.length) {
    console.log('');
    console.log('Epäonnistuneet testit:');
    for (const f of failures) {
      console.log('-'.repeat(70));
      console.log(`[${f.collection}] ${f.name}`);
      if (f.runError) {
        console.log(`  Skriptin ajo kaatui: ${f.runError.message}`);
        continue;
      }
      console.log(`  Odotettu koodi: ${f.expectedCode}  (löytyikö: ${f.codeMatch})`);
      console.log(`  Odotettu topic-uuid: ${f.expectedTopicUuid}  (löytyikö: ${f.topicMatch})`);
      console.log(
        `  Skriptin tuottamat muistutteet: ${
          f.triggered.map((t) => `messageNumber ${t.messageNumber} (uuid ${t.uuid || '?'})`).join(', ') || '(ei yhtään)'
        }`,
      );
    }
  }
}

main();
