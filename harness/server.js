#!/usr/bin/env node
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const { discoverScripts } = require('./scripts');
const { runScriptForResponse } = require('./engine');
const { resolveAgainstReminders } = require('./resolve');

const ROOT = path.join(__dirname, '..');
const SCRIPT_PATH = path.join(ROOT, 'example_javascript.js');
const REMINDER_PATH = path.join(ROOT, 'example_reminder.json');
const PORT = process.env.PORT ? Number(process.env.PORT) : 4757;

function loadJSON(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function sendJSON(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders() });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// Picks the scriptId in example_javascript.js whose form code matches one of
// the questionnaires present in the response message.
function findScriptForResponse(response, availableScripts) {
  const questionnaires =
    (response.patient && response.patient.investigations && response.patient.investigations.questionnaires) || [];
  const formNumbers = new Set(questionnaires.map((q) => q.code && String(q.code.value)));
  return availableScripts.find((s) => formNumbers.has(s.formNumber));
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders());
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', ...corsHeaders() });
    res.end('EBMEDS-testisilta käynnissä. Lähetä POST /run muodossa { "response": {...} }.');
    return;
  }

  if (req.method === 'POST' && req.url === '/run') {
    try {
      const raw = await readBody(req);
      const { response } = JSON.parse(raw);
      if (!response) {
        sendJSON(res, 200, { ok: false, error: 'Pyynnön rungossa ei ollut "response"-kenttää.' });
        return;
      }

      const scriptSrc = fs.readFileSync(SCRIPT_PATH, 'utf8');
      const reminderDefs = loadJSON(REMINDER_PATH);
      const availableScripts = discoverScripts(scriptSrc);
      const match = findScriptForResponse(response, availableScripts);

      if (!match) {
        const responseForms = (
          (response.patient && response.patient.investigations && response.patient.investigations.questionnaires) ||
          []
        )
          .map((q) => q.code && q.code.value)
          .join(', ');
        sendJSON(res, 200, {
          ok: false,
          error:
            `example_javascript.js ei sisällä skriptiä vastaussanoman lomakkeelle (${responseForms || 'tuntematon'}). ` +
            `Tiedostossa juuri nyt: ${availableScripts.map((s) => `${s.scriptId} (form ${s.formNumber})`).join(', ') || '(ei yhtään)'}.`,
        });
        return;
      }

      const recommendations = runScriptForResponse({
        scriptSrc,
        scriptPath: SCRIPT_PATH,
        scriptId: match.scriptId,
        response,
      });
      const resolved = resolveAgainstReminders(recommendations, reminderDefs);

      sendJSON(res, 200, { ok: true, scriptId: match.scriptId, recommendations: resolved });
    } catch (e) {
      sendJSON(res, 200, { ok: false, error: e.message });
    }
    return;
  }

  sendJSON(res, 404, { ok: false, error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`EBMEDS-testisilta käynnissä: http://localhost:${PORT}`);
  console.log('Pysäytä Ctrl+C.');
});
