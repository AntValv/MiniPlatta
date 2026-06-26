'use strict';

// Choices array is considered "no answer given" when it's empty, or only
// contains the placeholder sentinel value 0 (used by unanswered SELECT fields).
function isUnanswered(question) {
  const choices =
    question && question.answer && Array.isArray(question.answer.choices) ? question.answer.choices : [];
  return choices.length === 0 || choices.every((c) => Number(c) === 0);
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
      return language || 'fi';
    },
  };

  return { libQuestions, libUser };
}

// Libraries referenced by scripts but not needed by the inference logic
// implemented so far. Left as empty stubs on purpose: if a script calls a
// method on one of these, it should fail loudly so the gap gets implemented,
// rather than silently returning undefined.
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
    reminder: {},
    ebdeb: {},
  };
}

/**
 * Builds the EBMEDS-style library objects (libQuestions, libEBMEDS, libUser, ...)
 * that the inference scripts (e.g. example_javascript.js) expect to find as globals.
 * Everything is derived from a single "response" message (e.g. test_response.json).
 */
function createRuntime(response) {
  const recommendations = [];
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
    initScript(scriptId, country, formCode) {
      const match = /^fm(\d+)$/.exec(formCode || '');
      const formNumber = match ? match[1] : null;
      const questionnaires =
        (response.patient && response.patient.investigations && response.patient.investigations.questionnaires) || [];
      const questionnaire = questionnaires.find((qq) => qq.code && String(qq.code.value) === formNumber);
      if (!questionnaire) {
        return false;
      }
      setActiveQuestionnaire(questionnaire);
      return true;
    },

    createScriptRecommendation(scriptId, messageNumber, urgency, text) {
      recommendations.push({
        scriptId,
        messageNumber,
        urgency,
        text: text === undefined || text === null ? '' : String(text),
      });
    },
  };

  return {
    recommendations,
    libEBMEDS,
    libQuestions,
    libUser,
    ...unimplementedLibs(),
  };
}

/**
 * Builds a runtime directly from a pre-built question map (e.g. flattened from a
 * FHIR QuestionnaireResponse). Unlike createRuntime(), the form/questionnaire is
 * already known and fixed, so initScript() always succeeds.
 */
function createRuntimeForQuestionMap(questionMap, language) {
  const recommendations = [];
  const { libQuestions, libUser } = buildQuestionLibs(() => questionMap, language);

  const libEBMEDS = {
    initScript() {
      return true;
    },
    createScriptRecommendation(scriptId, messageNumber, urgency, text) {
      recommendations.push({
        scriptId,
        messageNumber,
        urgency,
        text: text === undefined || text === null ? '' : String(text),
      });
    },
  };

  return {
    recommendations,
    libEBMEDS,
    libQuestions,
    libUser,
    ...unimplementedLibs(),
  };
}

module.exports = { createRuntime, createRuntimeForQuestionMap };
