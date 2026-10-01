# Roguelette — V2.0 · Die Roulette-Maschine

Ein Roulette-Roguelike auf einem gezeichneten Pokertisch. Starte mit einem Basic-Chip, baue dein Rad und deinen Build um und fordere The House heraus.

## Spielen

`index.html` in einem aktuellen Browser öffnen oder den Ordner mit einem statischen Webserver bereitstellen. Kein Build erforderlich. Für iPad/Safari die bereitgestellte HTTPS-Adresse öffnen; `index.html`, `script.js`, `feel.js`, `style.css`, `tablet.css` und `feel.css` müssen gemeinsam ausgeliefert werden.

## Enthalten

- Vier Floors, zufällige Routen mit zusätzlicher Etappe, garantierter Shop vor dem Boss und Endless
- 20 Chips, 16 Relics, sechs explizite Synergien, zufällige Mutationen und Chip-Flüche
- Gemischte Sofort-Slots, Werkbank mit echter Vorschau und gezielte Rad-Werkzeuge
- Entscheidungsevents, Freischaltungen, Bestwerte und Autosave mit Backup-Wiederherstellung
- Eigenes Touch-Layout für iPad 10 und iPad Pro in beiden Ausrichtungen sowie Split View
- Größere Touch-Ziele, Tablet-Werkstatt mit Feldraster, angepasste Map und Shop-Ansichten
- Sequentielle Chip-/Relic-/Synergie-Auswertung, mechanischer Punktezähler und Roulette-Landung
- Touch-Chip-Inspektion mit ausdrücklicher Auswahl/Rücknahme; am Desktop Hover und Shift-Klick
- Raum-Abrechnung als Ticket, aktive Synergien über ✦ und gestempelte Shop-Angebote
- Slot-Chip/Platzmarke: sofort +1 Inventarplatz; optionale Chip-Prägung in Werkstätten mit Vorher/Nachher-Vorschau

Spielstände bleiben lokal im Browser und gelten für dieselbe Spieladresse. Browserdaten löschen entfernt sie. Keine Cloud-Synchronisierung. Alte Saves werden weiter geladen; neue Floors nutzen die längere Route.

## Tests

Mit Node.js 22 oder neuer:

```sh
node --test "tests/*.test.cjs"
```

132 Modelltests. Browser-Tests benötigen zusätzlich Playwright und die passenden Browser:

```sh
npm install --no-save playwright
npx playwright install webkit
node tests/ipad-browser.cjs
node tests/safari-viewport.cjs
node tests/feel-browser.cjs
node tests/feel-edge-browser.cjs
```

Der Tablet-Test verwendet WebKit und Microsoft Edge. Edge muss separat installiert sein; mit `TABLET_ENGINE=webkit` kann ausschließlich WebKit geprüft werden. `TABLET_PROFILE=ipad10` beschränkt auf passende Profile. Die Umgebungsvariablen sind mit der Syntax der jeweiligen Shell zu setzen. Die Standardmatrix prüft 15 Ansichten je Engine, darunter verkleinerte Safari-Fenster und Split View; umfangreichere Dialog-/Kauf-/Werkstatt-Abläufe laufen in sieben repräsentativen Ansichten. Screenshots und Messwerte liegen in `test-results/ipad`.

Weitere aktuelle Browser-Suiten: `polish-browser.cjs`, `build-expansion-browser.cjs`, `build-systems-browser.cjs` (Microsoft Edge). `balance-simulation.cjs` dokumentiert die verwendete einfache Bot-Strategie; Ergebnisse sind keine menschlichen Gewinnraten.

Der Safari-Viewport-Test prüft das dreispaltige Touch-Querformat bei 1180 Pixeln Breite und 600–820 Pixeln verfügbarer Höhe in WebKit und Edge sowie vier Pro-Querformate. Er kontrolliert beide Seitenüberläufe, überlappende Panels, sichtbare/antippbare Buttons, Boss mit vollem Build, Setzen, Drehen, Reload und Rotation. Messwerte und Screenshots: `test-results/safari-viewport`. Mit `ENGINE=webkit` lässt sich dieser Test auf WebKit beschränken. V1.4.1 bindet `html`, `body` und `.app` im Tablet-Querformat an `100dvh`; Hochformat, schmale Split Views und Telefone behalten ihren Dokumentfluss. Es werden weder der Tisch skaliert noch Seiteninhalte per Overflow-Regel versteckt.

Die iPad-Prüfung erfolgt per Touch-/Viewport-Emulation in WebKit und Chromium. Ein Test auf physischer iPad-Hardware bleibt sinnvoll, insbesondere für Safari-Leisten, virtuelle Tastatur und Split View.

Die neuen Feel-Tests prüfen Chip-Inspektion, Auswahl/Rücknahme, Auswertung, Raumticket, Map, Shop-Kauf, Platzmarken und Werkstatt inklusive Reload auf Desktop, Telefon und kurzen Tablet-Viewports in beiden Engines. `feel-edge-browser.cjs` prüft Nullpunkte, 18.900 Punkte sowie Reload während der visuellen Auswertung. `feel.js` konsumiert ausschließlich die bereits berechneten Effekte; Animationen würfeln nichts und vergeben keine Punkte. Reduced Motion überspringt Rad- und Zählerbewegungen. Spielstände aus V1.4 bleiben gültig; neue optionale Save-Felder erhalten Standardwerte.

## Patch-Details

[ROADMAP-STAND.md](ROADMAP-STAND.md) enthält die vollständigen Features, Balance-Werte, Save-Kompatibilität und den Versionsverlauf.

## V1.5.1 – Game-Feel-Pass

- Roulette: eine kontinuierliche Bewegung mit sanfter Beschleunigung und auslaufender Geschwindigkeit; Winkel und Klicks verwenden denselben Frame-Takt. Rotation bleibt zwischen Spins erhalten. Ein kleiner Zeigerimpuls beim tatsächlichen Stopp.
- Keine doppelte Rad-Landung, Helligkeitsblitze oder mehrfach überlappenden Score-Sprünge. Eine wiederverwendete Effektnotiz statt zusätzlichem sichtbarem Ticker und fliegender Punkteübertragung.
- Sequentielle Effekte: maximal 140 ms pro Schritt, nominell insgesamt höchstens 1,1 s; Zähler 140–240 ms mit absoluten Zeitmarken. Browser-Throttling kann die reale Dauer verlängern.
- Dezente Druckreaktionen erhalten vorhandene Chip-/Kartenrotationen und Map-Koordinaten. Shop-Übergang ohne künstliche 180-ms-Pause. Lange Chip-Infos bleiben beim eigenen Scrollen geöffnet.
- Spielregeln, Zufall, Preise, Saves und Layout bleiben kompatibel. Reduced Motion überspringt Bewegung.

Validierung: Modelltests; WebKit/Chromium mit zehn aufeinanderfolgenden Spins, kurzen iPad-Viewports, Desktop und Telefon; Nulltreffer, 18.900 Punkte und Reload während der Auswertung. Kein Test auf physischer iPad-Hardware: tatsächliche Bildrate und Audio dort noch subjektiv prüfen.

## V1.6 – Einstieg ohne Regelwand

- Aktionsgesteuerte erste Einführung: Basic wählen → setzen → Tischziel und Spins erkennen → drehen. Ziel und Spin-Hinweis erscheinen gemeinsam; kein Weiter-Klicken, kein erzwungener Timer. Überspringbar, nur einmal; das Tischbuch erlaubt einen Reset für den nächsten neuen Run.
- Gespeicherte Erstkontakt-Karten für Map, Shop, Werkstatt, Relics, Mutationen, Synergien, Rad-Werkzeuge, Bosse, Ereignisse und Endless. Immer nur eine relevante Karte.
- Wettvorschau auf Touch durch Setzen/Antippen einer belegten Wette oder Chip-Info; Desktop zusätzlich Fokus/Hover mit ausgewähltem Chip. Chance zählt die tatsächlichen aktuellen Radfelder. Treffer-Spannen werden mit startSpin/resolveSpin auf privaten Kopien ermittelt, inklusive anderer gesetzter Chips, Relics, Null, Bossen und Zufallseffekten. Kein Verbrauch von Math.random und keine Änderung am Live-Save.
- Tischziel, fehlende Punkte und SPINS ÜBRIG sichtbar; Anzahl getroffener Wetten öffnet die detaillierte Rechnung. Kein-Treffer erklärt die verfehlte Wette in der schnellen Auswertung.
- Acht aufklappbare Tischbuch-Kapitel; nur Grundlagen zunächst geöffnet. Einheitliche Begriffe: Chip-Platz, Platzmarke und Rad-Werkzeug; alte Tokens bleiben aus Kompatibilitätsgründen als solche benannt.
- Keine Balance-, Preis-, Drop- oder Routenänderung. Bestehende Saves mit Run-Fortschritt starten keine Einführung. Onboarding nutzt den separaten, fehlertoleranten Browser-Schlüssel roguelette-onboarding-v1.

Neue Tests: onboarding.test.cjs, onboarding-browser.cjs und onboarding-concepts-browser.cjs. WebKit/Chromium prüfen frischen Start, Touch/Desktop, Vorschau, Überspringen, Reload, Map/Shop, einmalige Konzepte und Reset; die bestehenden Safari-Viewport- und vollständigen Run-Tests bleiben erhalten.

## V1.6.1 – Ruhiger Tisch

Automatische Wettvorschauen und Entdeckungskarten über dem Rad im normalen Spiel entfernt. Vorschau weiterhin in der Chip-Info; kurze Erst-Run-Einführung und Raumhinweise bleiben. Spin-Zeile auf SPIN ↗ verkürzt; Plus-Punkte bleiben auch bei großen Zahlen einzeilig. Auf WebKit in 1180×600, 1366×768 und 390×844 geprüft.

## V2.0 – Content & Gameplay-Tiefe

Alle Inhalte, Freischaltungen, Tests und Grenzen: [CONTENT-V2.md](CONTENT-V2.md). Zusätzlich auszuliefern: `depth.js`, `depth-ui.js`, `depth.css`.

### UI-Polish V2.0.2
- Einheitliche Buttons, Dialograhmen, Auswahlzustände und zurückhaltendere Schatten.
- Gerade Shopkarten, klarere Detailflächen und ruhigere Map-Markierungen.
- Die aktive Tischregel färbt nun auch UI-Akzente; normale Tische setzen die Farben zurück.
- `polish.css` bündelt den visuellen Feinschliff, ohne die vorhandene Viewport-Geometrie zu ersetzen.
