'use strict';

const fs = require('fs');
const path = require('path');

function listCollectionFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.postman_collection.json'))
    .map((f) => path.join(dir, f));
}

function collectLeafRequests(items, acc) {
  for (const it of items || []) {
    if (Array.isArray(it.item)) {
      collectLeafRequests(it.item, acc);
    } else if (it.request) {
      acc.push(it);
    }
  }
  return acc;
}

function loadCollectionRequests(collectionPath) {
  const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));
  const acc = [];
  collectLeafRequests(data.item, acc);
  return acc.map((req) => ({ ...req, _collection: path.basename(collectionPath) }));
}

// A Postman request item is a usable test case only if it POSTs a CDS Hooks
// "questionnaire-completed" hook carrying a FHIR QuestionnaireResponse.
function parseFhirBody(req) {
  if (!req.request || req.request.method !== 'POST') return null;
  const raw = req.request.body && req.request.body.raw;
  if (!raw) return null;
  let body;
  try {
    body = JSON.parse(raw);
  } catch (e) {
    return null;
  }
  if (body.hook !== 'questionnaire-completed') return null;
  let formNumber;
  let items;
  try {
    const resource = body.prefetch.questionnaireResponse.resource;
    formNumber = String(resource.questionnaire.identifier.value);
    items = resource.item;
  } catch (e) {
    return null;
  }
  return { formNumber, items };
}

// Pulls the expected suggestedAction code and reminder-topic UUID out of the
// request's "test" event script, e.g.:
//   var expectedCode = 'DE-OTH3'
//   ... coding.find(({ code }) => code === '8a7298e6-...')
function extractAssertions(req) {
  const exec = (req.event || [])
    .filter((e) => e.listen === 'test')
    .flatMap((e) => (e.script && e.script.exec) || [])
    .join('\n');

  const codeMatch = /expectedCode\s*=\s*['"]([^'"]+)['"]/.exec(exec);
  const uuidRe = /['"]([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})['"]/g;
  const uuids = [];
  let m;
  while ((m = uuidRe.exec(exec))) uuids.push(m[1]);

  return {
    expectedCode: codeMatch ? codeMatch[1] : null,
    expectedTopicUuid: uuids[0] || null,
  };
}

module.exports = { listCollectionFiles, loadCollectionRequests, parseFhirBody, extractAssertions };
