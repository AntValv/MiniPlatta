// Source for the "Ajaa EBMEDS-testi" bookmarklet, used against the form
// editor's preview page. Reads the already-generated response message out of
// the page's own ".feedback-container" element (the same JSON shape as
// test_response.json), sends it to the local bridge server
// (node harness/server.js), and renders the result as an overlay panel.
//
// To rebuild the minified single-line bookmarklet string, see the bottom of
// this file for the manual steps (no build tooling required).
(function () {
  var BRIDGE_URL = 'http://localhost:4757/run';

  function findResponseJson() {
    var el = document.querySelector('.feedback-container');
    if (!el) return null;
    var text = (el.textContent || '').trim();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (e) {
      return null;
    }
  }

  function removeExistingPanel() {
    var existing = document.getElementById('ebmeds-test-panel');
    if (existing) existing.remove();
  }

  function renderPanel(html) {
    removeExistingPanel();
    var panel = document.createElement('div');
    panel.id = 'ebmeds-test-panel';
    panel.style.cssText =
      'position:fixed;top:10px;right:10px;width:440px;max-height:90vh;overflow:auto;' +
      'background:#fff;border:2px solid #333;border-radius:6px;padding:12px;z-index:999999;' +
      'font-family:sans-serif;font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,.3);color:#000;';
    panel.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
      '<strong>EBMEDS-testitulos</strong>' +
      '<button id="ebmeds-test-panel-close" style="cursor:pointer;">✕</button>' +
      '</div>' +
      html;
    document.body.appendChild(panel);
    document.getElementById('ebmeds-test-panel-close').onclick = removeExistingPanel;
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
    });
  }

  // Reminder texts (longMessage/patientMessage) carry lightweight markdown
  // (## headings, **bold**, "- " bullet lists) that plain text rendering
  // collapses into a single run-on line. Render it as real HTML instead, the
  // same way the text reads when printed to a terminal.
  function inlineMd(s) {
    return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  function markdownToHtml(text) {
    if (!text) return '';
    var lines = escapeHtml(text).split(/\r?\n/);
    var html = '';
    var inList = false;
    function closeList() {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
    }
    lines.forEach(function (line) {
      var trimmed = line.trim();
      var headingMatch = /^#{1,6}\s+(.*)/.exec(trimmed);
      var listMatch = /^[-*]\s+(.*)/.exec(trimmed);
      if (headingMatch) {
        closeList();
        html += '<div style="font-weight:bold;margin-top:10px;">' + inlineMd(headingMatch[1]) + '</div>';
      } else if (listMatch) {
        if (!inList) {
          html += '<ul style="margin:2px 0 2px 18px;padding:0;">';
          inList = true;
        }
        html += '<li>' + inlineMd(listMatch[1]) + '</li>';
      } else if (trimmed === '') {
        closeList();
      } else {
        closeList();
        html += '<div style="margin-top:2px;">' + inlineMd(trimmed) + '</div>';
      }
    });
    closeList();
    return html;
  }

  function renderResult(data) {
    if (!data.ok) {
      renderPanel('<div style="color:#b00;">Virhe: ' + escapeHtml(data.error) + '</div>');
      return;
    }
    var html = '<div style="margin-bottom:6px;color:#555;">scriptId: ' + escapeHtml(data.scriptId) + '</div>';
    data.recommendations.forEach(function (r) {
      var label = r.isProfessionalOnly ? 'AMMATTILAISEN TIIVISTELMÄ' : 'HOIDON TARPEEN ARVION SUOSITUS';
      html += '<div style="border-top:1px solid #ddd;padding:8px 0;">';
      html +=
        '<div style="font-weight:bold;">messageNumber ' +
        r.messageNumber +
        ' (urgency=' +
        r.urgency +
        ') – ' +
        label +
        '</div>';
      if (r.longMessage)
        html +=
          '<div style="margin-top:4px;"><em>longMessage:</em>' + markdownToHtml(r.longMessage) + '</div>';
      if (r.patientMessage)
        html +=
          '<div style="margin-top:4px;"><em>patientMessage:</em>' + markdownToHtml(r.patientMessage) + '</div>';
      if (r.suggestions && r.suggestions.length) {
        html += '<div style="margin-top:4px;"><em>suggestions:</em><ul style="margin:4px 0 0 16px;">';
        r.suggestions.forEach(function (s) {
          var codes = (s.codes || []).map(function (c) { return c.value; }).join(', ');
          html += '<li>' + escapeHtml(codes) + (codes ? ' — ' : '') + escapeHtml(s.text) + '</li>';
        });
        html += '</ul></div>';
      }
      html += '</div>';
    });
    renderPanel(html);
  }

  var responseJson = findResponseJson();
  if (!responseJson) {
    renderPanel(
      '<div style="color:#b00;">Ei löytynyt luettavaa vastaussanomaa elementistä ".feedback-container" tältä sivulta. Varmista, että esikatselu/palaute on generoitu.</div>',
    );
    return;
  }

  renderPanel('<div>Ajetaan testi…</div>');

  fetch(BRIDGE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ response: responseJson }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(renderResult)
    .catch(function (e) {
      renderPanel(
        '<div style="color:#b00;">Yhteys paikalliseen palvelimeen epäonnistui (' +
          escapeHtml(e.message) +
          ').<br>Käynnistä ensin: <code>node harness/server.js</code></div>',
      );
    });
})();
