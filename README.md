# Roguelette — V1.4.1 · Safari-Viewport-Fix

Ein Roulette-Roguelike auf einem gezeichneten Pokertisch. Starte mit einem Basic-Chip, baue dein Rad und deinen Build um und fordere The House heraus.

## Spielen

`index.html` in einem aktuellen Browser öffnen oder den Ordner mit einem statischen Webserver bereitstellen. Kein Build erforderlich. Für iPad/Safari die bereitgestellte HTTPS-Adresse öffnen; `index.html`, `script.js`, `style.css` und `tablet.css` müssen gemeinsam ausgeliefert werden.

## Enthalten

- Vier Floors, zufällige Routen mit zusätzlicher Etappe, garantierter Shop vor dem Boss und Endless
- 20 Chips, 16 Relics, sechs explizite Synergien, zufällige Mutationen und Chip-Flüche
- Gemischte Sofort-Slots, Werkbank mit echter Vorschau und gezielte Rad-Werkzeuge
- Entscheidungsevents, Freischaltungen, Bestwerte und Autosave mit Backup-Wiederherstellung
- Eigenes Touch-Layout für iPad 10 und iPad Pro in beiden Ausrichtungen sowie Split View
- Größere Touch-Ziele, Tablet-Werkstatt mit Feldraster, angepasste Map und Shop-Ansichten

Spielstände bleiben lokal im Browser und gelten für dieselbe Spieladresse. Browserdaten löschen entfernt sie. Keine Cloud-Synchronisierung. Alte Saves werden weiter geladen; neue Floors nutzen die längere Route.

## Tests

Mit Node.js 22 oder neuer:

```sh
node --test "tests/*.test.cjs"
```

128 Modelltests. Browser-Tests benötigen zusätzlich Playwright und die passenden Browser:

```sh
npm install --no-save playwright
npx playwright install webkit
node tests/ipad-browser.cjs
node tests/safari-viewport.cjs
```

Der Tablet-Test verwendet WebKit und Microsoft Edge. Edge muss separat installiert sein; mit `TABLET_ENGINE=webkit` kann ausschließlich WebKit geprüft werden. `TABLET_PROFILE=ipad10` beschränkt auf passende Profile. Die Umgebungsvariablen sind mit der Syntax der jeweiligen Shell zu setzen. Die Standardmatrix prüft 15 Ansichten je Engine, darunter verkleinerte Safari-Fenster und Split View; umfangreichere Dialog-/Kauf-/Werkstatt-Abläufe laufen in sieben repräsentativen Ansichten. Screenshots und Messwerte liegen in `test-results/ipad`.

Weitere aktuelle Browser-Suiten: `polish-browser.cjs`, `build-expansion-browser.cjs`, `build-systems-browser.cjs` (Microsoft Edge). `balance-simulation.cjs` dokumentiert die verwendete einfache Bot-Strategie; Ergebnisse sind keine menschlichen Gewinnraten.

Der Safari-Viewport-Test prüft das dreispaltige Touch-Querformat bei 1180 Pixeln Breite und 600–820 Pixeln verfügbarer Höhe in WebKit und Edge sowie vier Pro-Querformate. Er kontrolliert beide Seitenüberläufe, überlappende Panels, sichtbare/antippbare Buttons, Boss mit vollem Build, Setzen, Drehen, Reload und Rotation. Messwerte und Screenshots: `test-results/safari-viewport`. Mit `ENGINE=webkit` lässt sich dieser Test auf WebKit beschränken. V1.4.1 bindet `html`, `body` und `.app` im Tablet-Querformat an `100dvh`; Hochformat, schmale Split Views und Telefone behalten ihren Dokumentfluss. Es werden weder der Tisch skaliert noch Seiteninhalte per Overflow-Regel versteckt.

Die iPad-Prüfung erfolgt per Touch-/Viewport-Emulation in WebKit und Chromium. Ein Test auf physischer iPad-Hardware bleibt sinnvoll, insbesondere für Safari-Leisten, virtuelle Tastatur und Split View.

## Patch-Details

[ROADMAP-STAND.md](ROADMAP-STAND.md) enthält die vollständigen Features, Balance-Werte, Save-Kompatibilität und den Versionsverlauf.
