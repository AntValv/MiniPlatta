# EBMEDS-skriptien testiajuri

Tämä kansio sisältää lääkintälaitteen päättelylogiikan (`example_javascript.js`) testaamiseen rakennetun ympäröivän järjestelmän. Se tulkitsee EBMEDS-tyylisen vastaussanoman, syöttää sen oikealle skriptille, ja linkittää skriptin tuottaman muistutteen oikeaan reminder-määrittelyyn (`example_reminder.json`), korvaten `@1`-merkit skriptin tuottamalla tekstillä.

Mitään ei tarvitse asentaa (`npm install`) — kaikki käyttää vain Node.js:n sisäänrakennettuja moduuleja.

## Tiedostot kansion juuressa

| Tiedosto | Sisältö |
|---|---|
| `example_javascript.js` | Testattava päättelylogiikka. Voi sisältää yhden tai useamman `scrNNNNN()`-skriptin. **Vaihda tämä tiedosto sitä mukaa kun testaat eri lomakkeita.** |
| `example_reminder.json` | Koko muistutekanta (satoja skripteja, tuhansia muistutteita). Sisältää `scriptId` + `messageNumber` -> `longMessage`/`patientMessage`/`suggestions`/`uuid`. |
| `test_response.json` | Yksittäinen testivastaussanoma CLI-ajoa varten (`harness/run.js`). **Muokkaa tätä itse** kokeillaksesi eri vastauksia. |
| `Postman_tests/*.postman_collection.json` | Exportatut Postman-kokoelmat (CDS Hooks -muotoiset testit). Lisää tähän kansioon mitä tahansa `*.postman_collection.json`-tiedostoja — ne löytyvät automaattisesti. |

## harness/-kansion moduulit

| Tiedosto | Tehtävä |
|---|---|
| `runtime.js` | Toteuttaa `libQuestions`, `libEBMEDS`, `libUser` ja muut skriptien tarvitsemat globaalit kirjastot. Sisältää myös tynkätoteutukset asioille, joita emme voi toisintaa täydellisesti (`lifetimeRiskService`, `createObservation`, `createScriptReminder`...). |
| `engine.js` | Ajaa skriptin Node:n `vm`-moduulissa annettua runtimea vasten. |
| `resolve.js` | Linkittää skriptin tuottamat `(scriptId, messageNumber)`-parit `example_reminder.json`:n muistutteisiin ja korvaa `@1`:t. |
| `scripts.js` | Skannaa `example_javascript.js`:n ja päättelee mitkä skriptit/lomakkeet siinä on juuri nyt (ei kovakoodattu). |
| `fhir.js` | Muuntaa Postman-testin FHIR `QuestionnaireResponse`-rakenteen samaan muotoon kuin EBMEDS-vastaussanomat. |
| `postman.js` | Skannaa `Postman_tests/`-kansion kokoelmat ja poimii testien odotusarvot (`expectedCode`, topic-UUID). |
| `run.js` | CLI-ajuri yksittäiselle testivastaukselle. |
| `postman-run.js` | CLI-ajuri Postman-regressiotesteille. |
| `server.js` | Paikallinen "bridge"-HTTP-palvelin selaimen bookmarkletille. |
| `bookmarklet.js` | Selainpuolen lähdekoodi (ks. käyttöohje alla). |

## 1. Yksittäisen vastauksen testaus (CLI)

Muokkaa `test_response.json` haluamaksesi vastaussanomaksi (tai luo oma tiedosto), ja aja:

```bash
node harness/run.js
```

Vaihtoehtoisesti eri tiedostoilla:

```bash
node harness/run.js polkuni/oma_response.json
node harness/run.js --script=toinen.js --reminders=toiset_reminderit.json
```

Tulostus näyttää kaikki skriptin tuottamat muistutteet, eroteltuna **"HOIDON TARPEEN ARVION SUOSITUS"** (potilaalle/ammattilaiselle, sisältää kiireellisyyden ja suositellut toimenpidekoodit) ja **"AMMATTILAISEN TIIVISTELMÄ"** (muistute, jonka `patientMessage` on tyhjä — vain ammattilaiselle).

## 2. Postman-regressiotestit

Pudota exportatut `.postman_collection.json`-tiedostot `Postman_tests/`-kansioon, ja aja:

```bash
node harness/postman-run.js
```

Tämä:
1. Päättelee mitkä skriptit/lomakkeet `example_javascript.js` juuri nyt toteuttaa.
2. Suodattaa Postman-kokoelmista vain niihin liittyvät testit (muut lomakkeet ohitetaan).
3. Ajaa jokaisen testin FHIR-vastaussanoman läpi oikeaa skriptiä vasten.
4. Vertaa tulosta testin odottamaan kiireellisyyskoodiin ja reminder-UUID:hen.
5. Tulostaa `PASS`/`FAIL` per testi + yhteenvedon (`X/Y testiä läpi`) ja epäonnistuneiden tarkat syyt.

**Huomio:** jos skripti riippuu ulkoisesta palvelusta, jota emme voi toisintaa (esim. `lifetimeRiskService`-elinaikariskilaskuri), kaikkien Postman-testien ei tarvitse mennä läpi — riittää että skripti ajaa kaatumatta ja tuottaa järkevän tuloksen. Täydellinen läpimenoprosentti ei ole aina tarpeen/mahdollinen.

## 3. Live-testaus suoraan editorista (bookmarklet)

Tämä toimii editorissa, jossa esikatselun tulos näkyy `<pre class="feedback-container">`-elementissä valmiina EBMEDS-vastaussanomana.

### Käyttöönotto (kerran)

1. Luo selaimeen uusi kirjanmerkki (esim. nimellä "Ajaa EBMEDS-testi").
2. Liitä kirjanmerkin URL-kenttään koko alla oleva `javascript:...`-merkkijono (se on yksi pitkä rivi):

```
javascript:(function () { var BRIDGE_URL = 'http://localhost:4757/run'; function findResponseJson() { var el = document.querySelector('.feedback-container'); if (!el) return null; var text = (el.textContent || '').trim(); if (!text) return null; try { return JSON.parse(text); } catch (e) { return null; } } function removeExistingPanel() { var existing = document.getElementById('ebmeds-test-panel'); if (existing) existing.remove(); } function renderPanel(html) { removeExistingPanel(); var panel = document.createElement('div'); panel.id = 'ebmeds-test-panel'; panel.style.cssText = 'position:fixed;top:10px;right:10px;width:440px;max-height:90vh;overflow:auto;' + 'background:#fff;border:2px solid #333;border-radius:6px;padding:12px;z-index:999999;' + 'font-family:sans-serif;font-size:13px;box-shadow:0 4px 16px rgba(0,0,0,.3);color:#000;'; panel.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' + '<strong>EBMEDS-testitulos</strong>' + '<button id="ebmeds-test-panel-close" style="cursor:pointer;">✕</button>' + '</div>' + html; document.body.appendChild(panel); document.getElementById('ebmeds-test-panel-close').onclick = removeExistingPanel; } function escapeHtml(s) { return String(s == null ? '' : s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); } function inlineMd(s) { return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); } function markdownToHtml(text) { if (!text) return ''; var lines = escapeHtml(text).split(/\r?\n/); var html = ''; var inList = false; function closeList() { if (inList) { html += '</ul>'; inList = false; } } lines.forEach(function (line) { var trimmed = line.trim(); var headingMatch = /^#{1,6}\s+(.*)/.exec(trimmed); var listMatch = /^[-*]\s+(.*)/.exec(trimmed); if (headingMatch) { closeList(); html += '<div style="font-weight:bold;margin-top:10px;">' + inlineMd(headingMatch[1]) + '</div>'; } else if (listMatch) { if (!inList) { html += '<ul style="margin:2px 0 2px 18px;padding:0;">'; inList = true; } html += '<li>' + inlineMd(listMatch[1]) + '</li>'; } else if (trimmed === '') { closeList(); } else { closeList(); html += '<div style="margin-top:2px;">' + inlineMd(trimmed) + '</div>'; } }); closeList(); return html; } function renderResult(data) { if (!data.ok) { renderPanel('<div style="color:#b00;">Virhe: ' + escapeHtml(data.error) + '</div>'); return; } var html = '<div style="margin-bottom:6px;color:#555;">scriptId: ' + escapeHtml(data.scriptId) + '</div>'; data.recommendations.forEach(function (r) { var label = r.isProfessionalOnly ? 'AMMATTILAISEN TIIVISTELMÄ' : 'HOIDON TARPEEN ARVION SUOSITUS'; html += '<div style="border-top:1px solid #ddd;padding:8px 0;">'; html += '<div style="font-weight:bold;">messageNumber ' + r.messageNumber + ' (urgency=' + r.urgency + ') – ' + label + '</div>'; if (r.longMessage) html += '<div style="margin-top:4px;"><em>longMessage:</em>' + markdownToHtml(r.longMessage) + '</div>'; if (r.patientMessage) html += '<div style="margin-top:4px;"><em>patientMessage:</em>' + markdownToHtml(r.patientMessage) + '</div>'; if (r.suggestions && r.suggestions.length) { html += '<div style="margin-top:4px;"><em>suggestions:</em><ul style="margin:4px 0 0 16px;">'; r.suggestions.forEach(function (s) { var codes = (s.codes || []).map(function (c) { return c.value; }).join(', '); html += '<li>' + escapeHtml(codes) + (codes ? ' — ' : '') + escapeHtml(s.text) + '</li>'; }); html += '</ul></div>'; } html += '</div>'; }); renderPanel(html); } var responseJson = findResponseJson(); if (!responseJson) { renderPanel( '<div style="color:#b00;">Ei löytynyt luettavaa vastaussanomaa elementistä ".feedback-container" tältä sivulta. Varmista, että esikatselu/palaute on generoitu.</div>', ); return; } renderPanel('<div>Ajetaan testi…</div>'); fetch(BRIDGE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ response: responseJson }), }) .then(function (res) { return res.json(); }) .then(renderResult) .catch(function (e) { renderPanel( '<div style="color:#b00;">Yhteys paikalliseen palvelimeen epäonnistui (' + escapeHtml(e.message) + ').<br>Käynnistä ensin: <code>node harness/server.js</code></div>', ); }); })(); void 0;
```

### Käyttö (joka kerta)

1. Käynnistä silta yhdessä terminaalissa ja pidä se auki testauksen ajan:
   ```bash
   node harness/server.js
   ```
2. Avaa editorin esikatselu ja vastaa kysymyksiin niin, että `.feedback-container`-elementti generoituu.
3. Klikkaa kirjanmerkkiä → tulos ilmestyy oikeaan yläkulmaan ponnahdusikkunaan, otsikoineen, listoineen ja lihavointeineen (skriptin tuottama Markdown renderöidään oikeasti, ei näytetä raakana tekstinä).

### ⚠️ Muista uudelleenkäynnistää palvelin

`node harness/server.js` lataa kaikki `harness/`-tiedostot muistiin **vain käynnistyshetkellä**. Jos muokkaat `example_javascript.js`:ää, `example_reminder.json`:ia tai mitä tahansa `harness/`-tiedostoa, **sammuta palvelin (Ctrl+C) ja käynnistä se uudelleen**, jotta muutokset tulevat voimaan.

### Bookmarkletin lähdekoodin muokkaaminen

Jos haluat muokata bookmarkletin toimintaa, muokkaa `harness/bookmarklet.js`:ää (luettava, kommentoitu lähdekoodi), ja generoi uusi minifioitu yksirivinen versio:

```bash
node -e "
const fs = require('fs');
const src = fs.readFileSync('harness/bookmarklet.js', 'utf8');
const lines = src.split('\n').filter(line => !line.trim().startsWith('//'));
const joined = lines.join(' ').replace(/\s+/g, ' ').trim();
console.log('javascript:' + joined + ' void 0;');
"
```

## Tunnetut rajoitukset

- **`lifetimeRiskService`** (elinaikariski/sydänikä-laskuri, käytössä esim. scr01900/lomake 153): emme voi toisintaa sen oikeaa laskentakaavaa. Tynkä palauttaa neutraalit/nolla-arvot, jotka voi ylikirjoittaa testidatan kentällä `response.lifetimeRiskService` (`{ additionalYears, ageRemainder, risks: { coronary: {cases, chartValue}, ... } }`), jos jokin testiskenaario nimenomaan tarvitsee tietyn riskitason.
- **Kielikoodin normalisointi**: `libUser.getLanguageCode()` normalisoi syötteen ("EN", "en-GB", "fi-FI" → "en"/"fi") ja olettaa kolme tuettua kieltä (fi/sv/en), oletuksena fi. Tämä on parhaan arvauksen toteutus oikean alustan normalisoinnista — tarkkaile testauksessa, onko se riittävän robusti.
- **Postman-ajurin kielivalinta**: `postman-run.js` käyttää FHIR-testeille aina kieltä `"fi"` riippumatta testin omasta kielikontekstista.
