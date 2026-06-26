'use strict';

// Converts one FHIR QuestionnaireResponse "answer" array into our canonical
// question-record shape: { answer: { type, value, choices } }.
function toQuestionRecord(answers) {
  if (!answers || answers.length === 0) {
    return { answer: { type: undefined, value: undefined, choices: [] } };
  }

  const codingAnswers = answers.filter((a) => a.valueCoding);
  if (codingAnswers.length > 0) {
    const choices = codingAnswers.map((a) => {
      const n = Number(a.valueCoding.code);
      return Number.isNaN(n) ? a.valueCoding.code : n;
    });
    return {
      answer: {
        type: choices.length > 1 ? 'CHECK' : 'SELECT',
        value: String(codingAnswers[0].valueCoding.code),
        choices,
      },
    };
  }

  const a = answers[0];
  if (a.valueBoolean !== undefined) {
    return { answer: { type: 'YESNO', value: String(a.valueBoolean), choices: [] } };
  }
  if (a.valueInteger !== undefined) {
    return { answer: { type: 'NUMBER', value: String(a.valueInteger), choices: [] } };
  }
  if (a.valueDecimal !== undefined) {
    return { answer: { type: 'NUMBER', value: String(a.valueDecimal), choices: [] } };
  }
  if (a.valueQuantity !== undefined && a.valueQuantity.value !== undefined) {
    return { answer: { type: 'NUMBER', value: String(a.valueQuantity.value), choices: [] } };
  }
  if (a.valueString !== undefined) {
    return { answer: { type: 'TEXT', value: a.valueString, choices: [] } };
  }
  if (a.valueDate !== undefined) {
    return { answer: { type: 'TEXT', value: a.valueDate, choices: [] } };
  }
  if (a.valueDateTime !== undefined) {
    return { answer: { type: 'TEXT', value: a.valueDateTime, choices: [] } };
  }
  return { answer: { type: undefined, value: undefined, choices: [] } };
}

// FHIR QuestionnaireResponse items are a tree (groups nest via "item"). Question
// ids used by the EBMEDS scripts are the numeric linkIds; structural/markup
// items (e.g. "introduction", headers without answers) use non-numeric linkIds
// and are simply skipped.
function flattenFhirItems(items, map) {
  for (const item of items || []) {
    if (Array.isArray(item.item)) {
      flattenFhirItems(item.item, map);
    }
    if (/^\d+$/.test(String(item.linkId))) {
      map.set(String(item.linkId), toQuestionRecord(item.answer));
    }
  }
  return map;
}

function questionMapFromQuestionnaireResponse(resourceItems) {
  return flattenFhirItems(resourceItems, new Map());
}

module.exports = { questionMapFromQuestionnaireResponse, toQuestionRecord };
