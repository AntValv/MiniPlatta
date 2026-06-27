'use strict';

const vm = require('vm');
const { createRuntime, createRuntimeForQuestionMap } = require('./runtime');

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
    lifetimeRiskService: runtime.lifetimeRiskService,
    console,
  };
}

// Runs scriptId's entry function (assumed to share its name with the scriptId,
// e.g. "scr05133") against an already-built runtime, in a fresh vm context.
function executeScript({ scriptSrc, scriptPath, scriptId, runtime }) {
  const sandbox = buildSandbox(runtime);
  vm.createContext(sandbox);
  vm.runInContext(scriptSrc, sandbox, { filename: scriptPath });
  if (typeof sandbox[scriptId] !== 'function') {
    throw new Error(`Skriptiä "${scriptId}" ei löytynyt ${scriptPath}:stä.`);
  }
  sandbox[scriptId]();
  return runtime.recommendations;
}

function runScriptForQuestionMap({ scriptSrc, scriptPath, scriptId, questionMap, language }) {
  const runtime = createRuntimeForQuestionMap(questionMap, language || 'fi');
  return executeScript({ scriptSrc, scriptPath, scriptId, runtime });
}

// Runs against a full EBMEDS-style "response" message (e.g. test_response.json,
// or the JSON dumped by the editor's own feedback-container preview).
function runScriptForResponse({ scriptSrc, scriptPath, scriptId, response }) {
  const runtime = createRuntime(response);
  return executeScript({ scriptSrc, scriptPath, scriptId, runtime });
}

module.exports = { buildSandbox, executeScript, runScriptForQuestionMap, runScriptForResponse };
