'use strict';

// Choices array is considered "no answer given" when it's empty, or only
// contains the placeholder sentinel value 0 (used by unanswered SELECT fields).
function isUnanswered(question) {
  const choices =
    question && question.answer && Array.isArray(question.answer.choices) ? question.answer.choices : [];
  return choices.length === 0 || choices.every((c) => Number(c) === 0);
}

// Scripts only ever branch on the literal codes "fi"/"sv"/"en" (the
// platform's three supported languages) and assume libUser.getLanguageCode()
// always hands back one of those — the real platform presumably normalizes
// whatever raw locale/UI value it received before scripts ever see it. Our
// test data sources (response.user.language, the editor's feedback-container
// dump) aren't guaranteed to already be in that clean form, so we normalize
// here too: lowercase, drop any region suffix ("en-GB" -> "en"), and default
// to "fi" — the platform's base language — for anything unrecognized.
function normalizeLanguageCode(raw) {
  const code = String(raw || '')
    .toLowerCase()
    .split(/[-_]/)[0];
  return code === 'sv' || code === 'en' ? code : 'fi';
}

/**
 * Builds libQuestions + libUser on top of a question map: Map<string id, questionRecord>
 * where questionRecord = { answer: { type, value, choices, returnValue } }.
 * This is the shared core consumed by both the EBMEDS-style "response" runtime
 * and the FHIR-QuestionnaireResponse-based runtime used by the Postman test runner.
 */
function buildQuestionLibs(getQuestionMap, language) {
  function getQuestion(id) {
    return getQuestionMap().get(String(id));
  }

  const libQuestions = {
    getAnswerValue(id) {
      const q = getQuestion(id);
      if (!q || !q.answer || q.answer.value === undefined || q.answer.value === null) {
        return undefined;
      }
      const a = q.answer;
      switch (a.type) {
        case 'YESNO': {
          if (typeof a.value === 'boolean') return a.value;
          if (a.value === 'true') return true;
          if (a.value === 'false') return false;
          return undefined;
        }
        case 'NUMBER': {
          const n = Number(a.value);
          return Number.isNaN(n) ? a.value : n;
        }
        case 'SELECT': {
          const raw = a.returnValue !== undefined && a.returnValue !== null ? a.returnValue : a.value;
          const n = Number(raw);
          return Number.isNaN(n) ? raw : n;
        }
        case 'TEXT':
          return a.value;
        case 'CHECK':
          return Array.isArray(a.choices) && a.choices.length > 0 ? a.choices : a.value;
        default:
          return a.value;
      }
    },

    hasAnswerId(id, answerId) {
      const q = getQuestion(id);
      const unanswered = isUnanswered(q);
      if (Number(answerId) === -1) {
        // -1 is the "nothing selected / none of the above" sentinel.
        return unanswered;
      }
      if (unanswered) return false;
      const choices = q.answer.choices || [];
      return choices.some((c) => Number(c) === Number(answerId));
    },
  };

  const libUser = {
    getLanguageCode() {
      return normalizeLanguageCode(language);
    },
  };

  return { libQuestions, libUser };
}

// Libraries referenced by scripts but not needed by the inference logic
// implemented so far. Left as empty stubs on purpose: if a script calls a
// method on one of these, it should fail loudly so the gap gets implemented,
// rather than silently returning undefined.
//
// "reminder" is the odd one out: some scripts (e.g. scr01900 / form 153) treat
// it as a pre-existing global string buffer they grow with "reminder += ..."
// rather than a lib namespace, so its stub starts out as "" rather than {}.
function unimplementedLibs() {
  return {
    libDiagnoses: {},
    libMeasurements: {},
    libMedication: {},
    libVaccinations: {},
    libProcedures: {},
    libPatient: {},
    libRisks: {},
    libCommon: {},
    libSharedFunctions: {},
    reminder: '',
    ebdeb: {},
  };
}

// Some scripts (e.g. scr01900 / form 153) query an external "lifetime
// cardiovascular risk" calculator that lives outside the normal libQuestions
// data model and isn't even listed in the script's own /*global*/ comment.
// We have no spec for its real algorithm, so this is a neutral stub: it never
// crashes the script, but it also never produces a real risk figure. Pass
// "overrides" (e.g. response.lifetimeRiskService in the test JSON) to supply
// known values when a test scenario specifically needs to exercise the
// risk-dependent branches.
function buildLifetimeRiskService(overrides) {
  const o = overrides || {};
  const risks = o.risks || {};
  function bucket(name) {
    const r = risks[name] || {};
    return { cases: r.cases || 0, chartValue: r.chartValue || 0 };
  }
  return {
    getAgeRemainderSync() {
      return o.additionalYears !== undefined ? o.additionalYears : 0;
    },
    getLifeTimeInformation() {
      return {
        ageRemainder: o.ageRemainder !== undefined ? o.ageRemainder : 0,
        currentHealtyYears: o.currentHealtyYears !== undefined ? o.currentHealtyYears : 0,
        currentLifetime: o.currentLifetime !== undefined ? o.currentLifetime : 0,
        maxHealtyYears: o.maxHealtyYears !== undefined ? o.maxHealtyYears : 0,
        maxLifetime: o.maxLifetime !== undefined ? o.maxLifetime : 0,
      };
    },
    getRisks() {
      return {
        coronary: bucket('coronary'),
        stroke: bucket('stroke'),
        diabetes: bucket('diabetes'),
        dementia: bucket('dementia'),
        // Left undefined unless explicitly overridden, so the script's own
        // "if (!risks.total)" guards trigger their built-in
        // "STAR risk counter did not return any risks" fallback text instead
        // of us fabricating a risk number we can't actually back up.
        total: risks.total,
      };
    },
  };
}

// Finds whichever argument to libEBMEDS.initScript(...) looks like "fmNNNN",
// regardless of its position — different scripts pass (scriptId, country,
// formCode) while others pass (scriptId, formCode, country).
function extractFormNumber(args) {
  const formArg = args.find((a) => /^fm\d+$/.test(a || ''));
  return formArg ? formArg.slice(2) : null;
}

// createObservation/createRiskAssessment record structured clinical data as a
// side effect (akin to FHIR Observation/RiskAssessment resources); scripts
// never use their return value, so recording the call is enough to keep them
// from crashing while still exposing what was recorded for inspection.
//
// createScriptReminder is a newer-style sibling of createScriptRecommendation
// used by some scripts: no explicit scriptId argument (it's implicitly
// whichever script is currently running, set via initScript), and its return
// value is concatenated by the caller into a buffer
// (`reminder += libEBMEDS.createScriptReminder(...)`) that later gets passed
// to libEBMEDS.reminderStatistics(). We don't have the real
// reminderStatistics implementation, so it's a passthrough stub — the
// messageNumber/urgency/text we recorded is what the harness actually reports.
function buildRecordingMethods() {
  const recommendations = [];
  const observations = [];
  const riskAssessments = [];
  let currentScriptId = null;
  return {
    recommendations,
    observations,
    riskAssessments,
    setCurrentScriptId(scriptId) {
      currentScriptId = scriptId;
    },
    createScriptRecommendation(scriptId, messageNumber, urgency, text) {
      recommendations.push({
        scriptId,
        messageNumber,
        urgency,
        text: text === undefined || text === null ? '' : String(text),
      });
    },
    createScriptReminder(messageNumber, urgency, text) {
      const resolvedText = text === undefined || text === null ? '' : String(text);
      recommendations.push({ scriptId: currentScriptId, messageNumber, urgency, text: resolvedText });
      return resolvedText;
    },
    reminderStatistics(buffer) {
      return buffer;
    },
    createObservation(observation) {
      observations.push(observation);
    },
    createRiskAssessment(riskAssessment) {
      riskAssessments.push(riskAssessment);
    },
  };
}

/**
 * Builds the EBMEDS-style library objects (libQuestions, libEBMEDS, libUser, ...)
 * that the inference scripts (e.g. example_javascript.js) expect to find as globals.
 * Everything is derived from a single "response" message (e.g. test_response.json).
 */
function createRuntime(response) {
  const {
    recommendations,
    observations,
    riskAssessments,
    setCurrentScriptId,
    createScriptRecommendation,
    createScriptReminder,
    reminderStatistics,
    createObservation,
    createRiskAssessment,
  } = buildRecordingMethods();
  let questionMap = new Map();

  function setActiveQuestionnaire(questionnaire) {
    questionMap = new Map();
    for (const q of questionnaire.questions || []) {
      questionMap.set(String(q.id), q);
    }
  }

  const { libQuestions, libUser } = buildQuestionLibs(
    () => questionMap,
    response.user && response.user.language,
  );

  const libEBMEDS = {
    initScript(scriptId, ...args) {
      setCurrentScriptId(scriptId);
      const formNumber = extractFormNumber(args);
      const questionnaires =
        (response.patient && response.patient.investigations && response.patient.investigations.questionnaires) || [];
      const questionnaire = questionnaires.find((qq) => qq.code && String(qq.code.value) === formNumber);
      if (!questionnaire) {
        return false;
      }
      setActiveQuestionnaire(questionnaire);
      return true;
    },

    createScriptRecommendation,
    createScriptReminder,
    reminderStatistics,
    createObservation,
    createRiskAssessment,
  };

  return {
    recommendations,
    observations,
    riskAssessments,
    libEBMEDS,
    libQuestions,
    libUser,
    lifetimeRiskService: buildLifetimeRiskService(response.lifetimeRiskService),
    ...unimplementedLibs(),
  };
}

/**
 * Builds a runtime directly from a pre-built question map (e.g. flattened from a
 * FHIR QuestionnaireResponse). Unlike createRuntime(), the form/questionnaire is
 * already known and fixed, so initScript() always succeeds.
 */
function createRuntimeForQuestionMap(questionMap, language, lifetimeRiskOverrides) {
  const {
    recommendations,
    observations,
    riskAssessments,
    setCurrentScriptId,
    createScriptRecommendation,
    createScriptReminder,
    reminderStatistics,
    createObservation,
    createRiskAssessment,
  } = buildRecordingMethods();
  const { libQuestions, libUser } = buildQuestionLibs(() => questionMap, language);

  const libEBMEDS = {
    initScript(scriptId) {
      setCurrentScriptId(scriptId);
      return true;
    },
    createScriptRecommendation,
    createScriptReminder,
    reminderStatistics,
    createObservation,
    createRiskAssessment,
  };

  return {
    recommendations,
    observations,
    riskAssessments,
    libEBMEDS,
    libQuestions,
    libUser,
    lifetimeRiskService: buildLifetimeRiskService(lifetimeRiskOverrides),
    ...unimplementedLibs(),
  };
}

module.exports = { createRuntime, createRuntimeForQuestionMap };
