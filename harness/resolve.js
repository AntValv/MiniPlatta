'use strict';

// Fills "@1" in a reminder template string with the text produced by the script.
function substitute(template, text) {
  if (!template) return template || '';
  return template.split('@1').join(text || '');
}

// Links scriptId+messageNumber recommendations produced by the engine to their
// definitions in the reminder bank (example_reminder.json), resolving "@1".
// A reminder whose patientMessage is empty is professional/nurse-facing only.
function resolveAgainstReminders(recommendations, reminderDefs) {
  return recommendations.map((rec) => {
    const def = reminderDefs.find((r) => r.scriptId === rec.scriptId && r.messageNumber === rec.messageNumber);
    if (!def) {
      return { ...rec, found: false };
    }
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

module.exports = { resolveAgainstReminders, substitute };
