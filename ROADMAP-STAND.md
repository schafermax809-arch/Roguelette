# V2.3 – Direkte Wege und Fundkammer

Platzmarke aus dem Shop entfernt; bestehende Inventarerweiterungen bleiben save-kompatibel. Verfügbare Map-Symbole führen mit einem Klick/Tippen direkt in den Raum. Vorschau per Hover/Fokus, keine zweite Bestätigung. Neue große Fundkarte mit Kategorie-/Seltenheitssiegeln, gestaffelten Stopps und Fundstempel; Reduced Motion ohne diese Bewegung. Shop-Karten und Kaufmodell aus 2.2 bleiben bestehen. 159 Modelltests bestanden; neue Map- und Shop-Browserprüfung auf Desktop, kurzem iPad und Telefon in WebKit und Chromium.

# V2.2 – Händler und Aufdeckung

Drei feste Sofort-Tokens (Rad, Chip, Relic) und ein zufälliges Werkzeug. Die Kosten bleiben 8/8/10 plus Floor-Aufpreis. Neue Karten, kompakte Kaufleiste und hervorgehobener Fund bei der Aufdeckung. Voller Token-Beutel blockiert keinen Kauf; volle Zielinventare behalten die Ersatzwahl. Bestehende gespeicherte Angebote bleiben kompatibel. Der folgende 2.1-Stand ist historisch; seine Messwerte gelten für die damalige Shopverteilung.

# Aktueller Stand: V2.1 – Build-Kontrolle und Klarheit

01.10.2026. Der aktuelle vollständige Stand mit allen elf Arbeitsbereichen, 17 Abschlussfragen, Messungen und Testgrenzen steht in [CONTROL-UPDATE.md](CONTROL-UPDATE.md). 33 Chips, 26 Relics, 7 Mutationen, 10 Rad-Werkzeuge; 159 Modelltests. Nächster sinnvoller Schritt: menschliche Balance-/Pacing-Tests und echte iPad-Safari-Prüfung.

## Historischer Versionsverlauf

Die folgenden Abschnitte dokumentieren frühere Patches. Ihre Zählstände und damaligen nächsten Schritte sind keine aktuelle Aufgabenliste.

# V1.5: Game-Feel und UI/UX-Polish

Stand: 30.09.2026. Bestehende Spielregeln, Chip-/Relic-Werte, Zufalls-Slots, verzweigte Maps und Rad-Werkzeuge bleiben erhalten.

## Spielgefühl
- Neue wiederverwendbare Präsentationsschicht `feel.js`: aus aufgelösten Modell-Traces entsteht eine geordnete Effekt-Warteschlange. Basiswette → Chip-Bonus → Mutation/Curse/Zusatzwertung → Relics → Synergiehinweise und Abzüge → Punktezähler. Die exakten Berechnungen bleiben in `script.js`; die Anzeige erzeugt keine zweiten Würfe oder Belohnungen.
- Kurze, vom verantwortlichen Wettfeld, Chip oder Relic ausgehende Effektzettel, kleine mechanische Bewegungen und Übertragung zum Zähler. Normale Ketten dauern ungefähr 0,8–1,5 Sekunden; umfangreiche Builds etwas länger. Die vorhandene Detail-Auswertung bleibt nachlesbar.
- Ganzzahliger Zähler mit zwölf kurzen Schritten, stärkerem Akzent bei großen Gewinnen und leisem Ticken nur bei aktiviertem Ton. Nullpunkte erzeugen kein unnötiges Hochzählen.
- Roulette mit Anlauf, schneller Mittelphase, Abbremsung und feldabhängigen Klicks. Landung markiert das tatsächliche Radfeld und die gewinnende Zahl am Tisch. Der Safari-Fix für das runde Rad bleibt erhalten.
- Raumergebnis als kompaktes Abrechnungsticket mit Score/Ziel, Raumprämie, ausgelösten Effekten und stärkstem Spin. Weiter führt unmittelbar zur vorhandenen Map/Floor-Logik.

## Bedienung und Räume
- Touch: Antippen inspiziert den Chip, ohne ihn zu setzen oder zurückzunehmen. Das kontextuelle Panel zeigt Seltenheit, Effekt, Mutationen, Curse/Serie und relevante aktive Synergien. Auswahl bzw. Rücknahme ist eine ausdrückliche Aktion; Tippen außerhalb oder Escape schließt das Panel. Desktop behält die schnelle Auswahl, ergänzt um Hover, Shift-Klick und Rechtsklick für Infos.
- Eigener ✦-Button öffnet aktive Synergien. Die bestehende datengetriebene Erkennung wird wiederverwendet; der vollständige Build-Katalog bleibt separat erreichbar.
- Shop-Angebote zeigen Seltenheit, Wirkung und Preis, mit kurzem Anheben und VERKAUFT-Stempel. Zufalls-Slots verraten ihre Pools, nicht das noch ungewürfelte Ergebnis. Gekaufte Werkzeuge/Upgrades und gespeicherte Slot-Ergebnisse funktionieren weiterhin wie bisher.
- Neue Slot-Chip/Platzmarke erweitert sofort das Inventar um einen Platz, ohne Zielchip oder Ersatzwahl. Kosten 8, 12, 16, 20, 24, 28 Münzen; maximal sechs zusätzliche Plätze pro Run. Expanded bleibt zusätzlich wirksam. Alte Glücks-Tokens behalten ihre bisherige Funktion.
- Chip-Werkbank ergänzt die vorhandene kostenlose Rad-Werkstatt: physische Chip-Auswahl, bestehende Mutationen, Vorher/Nachher, Wirkungsbeschreibung, Preis und Bestätigung. Ein bezahlter Auftrag pro Raum: Polished 8, Echo 6 oder Lucky 5 Münzen. Keine Zahlung bei ungültiger Auswahl, bestehender Mutation oder fehlendem Geld. Auftrag und Mutation überleben Reload.
- Bestehende zufällige verzweigte Routen bleiben save-kompatibel. Raumtyp-Beschriftung, verbundene nächste Wege, gelaufene Route und Standort sind hervorgehoben. Die Karte öffnet am aktuellen Standort und scrollt innerhalb ihres eigenen Ausschnitts. Künftige Event-Ausgänge und exakte Tischprämien werden nicht vorab verraten.
- Gemeinsame Gestaltung in `feel.css`: Papierzettel, Stempel, gestrichelte Kanten und kurze mechanische Bewegungen. Popovers bleiben im sichtbaren Viewport; Dialoge besitzen eigene Höhenbegrenzungen. Keine globale Skalierung und keine neue Sperre des Seiten-Overflows.

## Technische Prüfung
- 132/132 Modelltests, darunter additive Save-Migration, atomare Platzkäufe/Werkstattaktionen und unveränderliche Effekt-Traces.
- `feel-browser.cjs`: WebKit + Chromium, jeweils iPad 1180×680/600, Telefon 390×844 und Desktop 1366×768; Touch, normale/reduzierte Bewegung, Inspektion, Spin, Ticket, Shop, Synergien, Prägung und Reload.
- `feel-edge-browser.cjs`: Nullpunkte, 18.900-Punkte-Spin und Reload mitten in der Auswertung; Ergebnis und Münzen werden genau einmal vergeben.
- `safari-viewport.cjs`: bisherige kurze Tablet-Höhen, volle Builds und runde Radgeometrie weiterhin geprüft.
- Bestehende Desktop-/Telefon-Endlosroute, zehn Event-Abläufe, Chip-/Relic-Erweiterungen, Slot-Recovery und Rad-Werkstatt bestanden; keine JS-Fehler in diesen Prüfungen.
- `tablet.css` bleibt unverändert. Echte iPad-Hardware wurde nicht getestet; neue Werkstattpreise und Platzmarken sollten zusätzlich anhand längerer menschlicher Runs balanciert werden.

# V1.4.2: Rundes Roulette-Rad in Safari

- Ursache gezielt in WebKit reproduziert: Der Rahmen war 230 × 230 Pixel groß, das innere Rad durch `height:100%` im gepolsterten Aspect-Ratio-Container jedoch 210 × 230 Pixel. Dadurch wurden Segmente und Zahlen versetzt bzw. abgeschnitten.
- `style.css`: Das innere Rad liegt mit gleichen 10-Pixel-Innenabständen im quadratischen Rahmen, ohne Prozenthöhe. Die Rad-Bühne wird außerdem nicht mehr durch Flex-Shrinking gestaucht. Größe, Drehung und bestehender Tisch bleiben erhalten.
- `tests/safari-viewport.cjs` prüft jetzt zusätzlich, dass Rahmen, Rad und Nabe über die getesteten Höhen, Bosszustände und Drehungen quadratisch bleiben. `index.html` lädt die korrigierte Basis-CSS mit neuer Cache-Version.

# V1.4.1: Safari-Viewport-Fix

Stand: 29.09.2026. Reiner CSS-Fix am bestehenden Spiel; Spielregeln und Save-Format unverändert.

- Ursache: `body` hatte `min-height:100vh`; Tablet-`.app` ersetzte die feste Desktop-Höhe durch `height:auto;min-height:100dvh`. Feste Mindesthöhen, große Zell-Stacks und content-basierte Grid-Zeilen ließen den Inhalt wachsen. Der bisherige Test erlaubte vertikales Scrollen: bei 1180 × 720 wurden 775 Pixel Seitenhöhe gemessen.
- `tablet.css`: `html`, `body` und `.app` nutzen im dreispaltigen Touch-Querformat die aktuelle dynamische Viewport-Höhe. App-Zeilen teilen das verfügbare Budget auf, der Spielbereich verwendet `minmax(0,1fr)` plus eine inhaltsgroße Chip-Zeile. Safe Areas, Rahmen und Außenabstände liegen innerhalb dieses Budgets.
- Kompaktere Relic-Leiste, Abstände, Run-Anzeige und Chip-Rack; Radgröße folgt der verfügbaren Höhe, mit zusätzlichem Platz für den Boss. Gesetzte Chips stehen neben ihrem Feldlabel und erzeugen keine zusätzliche hohe Zeile. Unter 651 Pixeln Höhe schrumpfen Zahlenfelder und Abstände etwas weiter. Rücknahme-Chips sind im Querformat 36 Pixel groß; Dialoge und Hauptaktionen behalten ihre größeren Touch-Ziele.
- Keine globale Overflow-Sperre, keine Skalierung, keine neue Geräteerkennung und kein Layout-JavaScript. Desktop ohne Touch, Hochformat und Telefon-Layouts behalten ihre bisherigen Regeln. Dialoge dürfen weiterhin innerhalb ihrer eigenen Höhe scrollen.
- Neuer Test `tests/safari-viewport.cjs`: Höhen 600, 650, 680, 700, 720, 744, 780 und 820 bei 1180 Breite; zusätzlich vier iPad-Pro-Querformate. Prüft Seitenmaße, Panel-Grenzen, drei Spalten, Hit-Tests der Buttons, Basic/gesetzte Chips, vollen Build, Boss, Spin, Reload und Rotation in WebKit und Chromium. Der bestehende Tablet-Test prüft nun auch vertikalen Seitenüberlauf im dreispaltigen Querformat.
- 128 Modelltests sowie Desktop-/Telefon-Regressionssuite bestanden. Prüfung per Browser-Emulation; kein physischer iPad-Test. Dynamische Einheiten folgen der aktuellen Browserfläche: [WebKit-Dokumentation](https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/).

# V1.4: iPad- und Touch-Patch

Stand: 29.09.2026. Enthält auch die bisher lokal entwickelten Updates V1.1–V1.3.

## Tablet-Oberfläche
- Eigene `tablet.css` für Touch-Geräte zwischen 701 und 1400 CSS-Pixeln. Erkennung über Touch-Punkte bzw. groben Zeiger; keine User-Agent-/Modellnamen-Abfrage. Hardware-Tastaturen und Trackpads schalten ein echtes Touch-Gerät nicht absichtlich aus dem Layout.
- Querformat: Rad, sechs-spaltige Zahlenwetten und Run-Steuerung nebeneinander; Chips unter Rad und Wetten.
- Hochformat: Rad und Wetten nebeneinander, darunter zentrierte Chips und eine kompakte dreispaltige Run-Steuerung. Bei knapper Höhe bleibt vertikales Scrollen möglich.
- Wetten, gesetzte Chips, Hauptaktionen, Relics, Werkzeuge und Werkstattfelder erhalten mindestens 44 CSS-Pixel hohe Touch-Ziele. Gesetzte Chips können durch Antippen wieder zurückgenommen werden.
- Größere lesbare Schriften und gezielte Abstände; keine Hover-Abhängigkeit. Die normale Desktop-Ansicht bleibt erhalten.
- Safe-Area-Abstände, `viewport-fit=cover`, dynamische Viewport-Höhe und mindestens 16-Pixel-Eingaben in der Touch-Werkstatt. Pinch-Zoom bleibt erlaubt.

## Map, Shop und Werkstatt
- Touch-Map mit größeren Knoten und mehr vertikalem Platz. Antippen wählt Details; Betreten bleibt eine eigene Aktion.
- Shop im Hochformat mit zwei Karten pro Reihe und seitlichem Kaufbereich, im Querformat vier Karten neben der Kaufansicht. Die Aktionsleiste bleibt bei langen Dialogen erreichbar.
- Werkstatt zeigt Rad und Vorschau plus ein großes Feldraster statt winziger Ring-Knöpfe. Auch 38 Felder lassen sich per Finger auswählen. Ausgewählte Felder sind deutlich umrandet; die Anwendung bleibt am unteren Dialogrand erreichbar.
- Schmale Split-View-Fenster verwenden den mobilen Ablauf mit vergrößerten Touch-Zielen und einem angepassten Werkstatt-Raster.

## Zielgrößen und Prüfung
Die CSS-Viewport-Matrix deckt iPad 10 (820 × 1180), iPad Pro 11 (834 × 1194 bzw. 834 × 1210), Pro 12,9 (1024 × 1366) und Pro 13 (1032 × 1376) jeweils in beiden Ausrichtungen ab. Dazu kommen verkleinerte Fenster für Browserleisten, Split View und frei skalierte Tablet-Fenster. Es handelt sich um Layout-Profile, nicht um echte Geräteerkennung.

Die Displaygrundlagen stammen von Apple: [iPad 10](https://support.apple.com/en-za/111840), [iPad Pro 11, ältere Generation](https://support.apple.com/en-by/111897), [iPad Pro, aktuelle Spezifikationen](https://www.apple.com/ca/ipad-pro/specs/). Die Tests verwenden CSS-Pixel, nicht native Display-Pixel.

- 128/128 Modelltests bestanden.
- Desktop-/Mobile-Regressionssuite `polish-browser.cjs` bestanden, inklusive kompletter Route bis Endless, Autosave während Slot-Animation und Werkbank.
- `ipad-browser.cjs`: 15 Layout-Profile je Engine in WebKit und Chromium (Edge), insgesamt 30 Ansichten. Haupttisch, Touch-Zielgrößen, Setzen/Drehen/Reload und Rotation in allen Profilen; Map, Shop, Slot-Kauf und 38-Felder-Werkstatt in sieben repräsentativen Profilen je Engine.
- Keine horizontalen Seiten-/Dialogüberläufe oder JavaScript-Fehler in diesen Prüfungen. Die kleineren Ansichten dürfen vertikal scrollen. Screenshots wurden auf Lesbarkeit und Anordnung geprüft.
- iPad-10-Hoch-/Querformat zusätzlich mit 2× Pixeldichte in WebKit geprüft. Die große Matrix verwendet 1× Screenshot-Auflösung bei denselben CSS-Abmessungen.

## Dateien und Veröffentlichung
Geändert: `index.html` (Viewport und Stylesheet), `script.js` (Touch-Erkennung und Feldraster-Zeilen), `README.md`, `ROADMAP-STAND.md`. Neu: `tablet.css`, `tests/ipad-browser.cjs`. Spielregeln und Save-Format wurden für diesen Patch nicht verändert.

Das Repo erhält den vollständigen aktuellen Stand inklusive der zuvor lokalen Build-/Map-/Balance-Updates. Veröffentlicht werden Spiel-Dateien, Dokumentation, Modelltests und aktuelle portable Browser-Tests; historische lokale Browser-Skripte und Screenshots werden nicht ins Repo übernommen.

Offen: Prüfung auf physischer iPad-Hardware, insbesondere virtuelle Tastatur, Safari-Leisten und OS-Fenstermanagement. WebKit-Emulation ist kein vollständiger Ersatz dafür.

---

# V1.3: Neue Build-Werkzeuge, längere Route und Progressions-Balancing

Stand: 29.09.2026. Im bestehenden Vanilla-Projekt umgesetzt. Dieser Abschnitt ersetzt die unten archivierten Angaben zur Länge und Schwierigkeit neuer Maps.

## Vier neue Chips — jetzt insgesamt 20
| Chip | Seltenheit / Build | Effekt |
| --- | --- | --- |
| Drifter | Common / Farbwechsel | Außenwetten erhalten +20 Basispunkte, wenn Rot auf Schwarz oder Schwarz auf Rot folgt. Der erste Spin und Null aktivieren den Bonus nicht. |
| Collector | Common / Kleine Crew | Außenwetten erhalten +4 Basispunkte je freiem Chip-Platz, maximal +16. Heavy und Expanded beeinflussen freie Kapazität. |
| Surveyor | Uncommon / Breites Netz | Außenwetten erhalten +10 Basispunkte je anderer tatsächlich gewinnender Wettart in diesem Spin, maximal +30. Mehrere gleiche Wettarten zählen einmal. |
| Carbon | Rare / Radbau | Zahlenwetten erhalten +100 Basispunkte je zusätzlicher Kopie der Zahl im permanenten Rad, maximal +400. Temporäre Bossfelder zählen nicht. |

Diese Basisboni werden vor Polished, Curse und Echo berechnet. Lucky Seven verwendet danach den einmal eingefrorenen Chip-Wert und löst keine neue Zufallswertung aus. Chip-Details kennzeichnen den jeweiligen Build-Typ.

## Vier neue Relics — jetzt insgesamt 16
| Relic | Seltenheit / Build | Effekt an seiner Auswertungsposition |
| --- | --- | --- |
| Metronome | Uncommon / Farbwechsel | +25 Punkte bei echtem Rot-/Schwarz-Wechsel und mindestens einem Gewinner. |
| Afterimage | Rare / Radbau | +100 Punkte, wenn dieselbe Zahl wie im vorherigen Spin fällt und mindestens ein Chip gewinnt. Null bleibt möglich; der Null-Abzug folgt danach. |
| Compass | Rare / Breites Netz | Ab zwei verschiedenen gewinnenden Wettarten: +20 Punkte je gewinnender Wettart. |
| Workshop Seal | Epic / Kompaktes Rad | +60 Punkte bei höchstens 12 permanenten Radfeldern und mindestens einem Gewinner. Temporäre Bossfelder zählen nicht. |

Alle acht Inhalte gehören zum gemischten Slot-Pool. Legendary-Chancen und bestehende Freischaltungen bleiben erhalten. Beispiele: Drifter + Metronome für Farbwechsel; Collector + vorhandenes Lone Wolf für wenige starke Chips; Surveyor + Compass für Abdeckung; Carbon + Afterimage für mehrfach vorhandene Zahlen. Workshop Seal belohnt konsequentes Verkleinern des Rads. Es gibt keine zusätzlichen versteckten Set-Multiplikatoren für diese Kombinationen.

## Eine zusätzliche Map-Etappe pro Floor
Vor dem garantierten letzten Shop liegt eine neue verzweigte Ebene:
- **Seitenwerkstatt:** kostenlos Delete oder Rewrite wählen und sofort anwenden oder behalten. Damit lässt sich der Radbau gezielter verfolgen.
- **Eine letzte Gelegenheit:** reguläres zufälliges Event mit Entscheidung und Ausweg.
- **Doppelter Boden:** optionaler riskanter Tisch mit sechs Spins und 6 Münzen plus dem bisherigen Floor-Zuschlag (höchstens 4).

Neue Maps haben sieben Ebenen inklusive Einstieg, im Penthouse fünf. Pro normalem Vier-Floor-Run werden 26 statt 22 Räume durchlaufen. Jede zusätzliche Etappe verlangt eine Pfadentscheidung; es gibt keinen zusätzlichen Pflichtkampf. Linien, Erreichbarkeit und ein Shop direkt vor dem Boss bleiben erhalten. Höhere Map-Flächen und kleinere Knoten auf kurzen Desktops schaffen Platz.

## Balancing
- Der Basic-Start und Floor 1 bleiben bei ihren bisherigen Zielen. Die zusätzliche Etappe gibt vor dem Boss eine weitere Gelegenheit zum Verbessern des Builds.
- In neuen Maps: Floor-2-Ziele ×0,9, Floor 3 ×0,8, Floor 4 ×0,85, jeweils auf Zehner gerundet. Boss-Ziele sind damit **120 / 320 / 560 / 850** bei unveränderten Spin-Budgets.
- Endless behält seine wachsenden Ziele. Die zusätzliche Etappe bleibt dort erhalten.
- Gemischte Slot-Preise, Nachfüllkosten und normale Raumauszahlungen bleiben auf dem V1.2-Niveau. Kein allgemeiner Geldbonus; nur der optionale zusätzliche Risikotisch zahlt weitere Münzen aus.
- Zwei neue Common-Chips verbreitern die frühen Ergebnisse: Common muss nicht immer einen weiteren Basic liefern.

### Reproduzierbarer Vorher-/Nachher-Vergleich
Je 1.000 Runs mit Startwerten 1–1000 und derselben einfachen Entscheidungsstrategie: Wetten nach erwartetem Score, bevorzugt Shops/Werkstätten, sichere Events oder Überspringen, Slot-Käufe ohne Ersetzen/Nachfüllen, keine Freischaltungen. Werkzeug-Nutzung ist heuristisch. Das ist ein technischer Vergleich, keine Schätzung menschlicher Gewinnraten.

| Messwert | V1.2 | V1.3 |
| --- | ---: | ---: |
| Floor 2 erreicht | 379 | 454 |
| Floor 3 erreicht | 145 | 251 |
| Floor 4 erreicht | 37 | 79 |
| Normalen Run gewonnen | 23 | 53 |
| Durchschnittliche Slot-Käufe | 2.27 | 3.24 |
| Durchschnittliche Münzen am Run-Ende | 8.49 | 9.29 |

Mehr Runs erreichen spätere Floors, und mehr Geld wird tatsächlich ausgegeben; das durchschnittliche Restbudget steigt nur leicht. Die Strategie ist weder optimal noch menschlich. Einzelne Builds, riskante Events und Inventarersatz benötigen weiter praktische Spieltests. Bericht: `tests/balance-report.json`; Simulation: `node tests/balance-simulation.cjs ../script.js 1000`.


## Shop-UI
- Kompakte Karten zeigen 55 % Chip, 25 % Relic und 20 % Rad-Item anstelle des langen Erklärungstexts.
- Vor dem Kauf steht das verbleibende Budget direkt am Kaufbereich.
- Ein unverkauftes Angebot ist beim Betreten vorausgewählt; nach einem Kauf wird das nächste ausgewählt.
- Nicht bezahlbare Angebote haben gedämpfte Preisschilder, verkaufte Angebote bleiben klar markiert.
- Mobil steht der Kaufbereich oben. Die Auswahl einer Karte führt direkt dorthin; Nachfüllen und Zur-Map bleiben beim Scrollen erreichbar.
- Werkzeugkauf, explizites Ersetzen bei vollem Inventar und der unmittelbare Slot-Kauf bleiben erhalten.

## Save/Load und Tests
- Map-Version 3 für neue Maps. Version 1 und 2 werden weiterhin mit ihrer bisherigen Raumanzahl, Kanten, Zielen und Auszahlungen geladen. Der nächste Floor nutzt Version 3. Alte laufende Runs werden nicht mitten auf ihrer Route verlängert.
- Neue Chips und Relics, gesetzte Wetten, Verlauf und Auswertung werden vollständig gespeichert. Farbwechsel-/Wiederholungsbedingungen bleiben nach Reload erhalten und starten am nächsten Tisch mit leerem Verlauf.
- **128/128 Modelltests bestanden**, darunter zehn neue Tests für Bedingungen, Caps, Relic-Reihenfolge, Echo/Polished/Lucky Seven, Save/Load und die neue Seitenwerkstatt.
- 500 generierte Maps: gültige Kanten, keine Sackgassen, mehrere Routen, Shop/Boss erreichbar, exakter Save-Roundtrip.
- `polish-browser.cjs`: gesamter Run bis Endless, Slot-Kauf/Reload, Haupttisch, Dialoge und 38-Felder-Werkbank auf Desktop/Mobil.
- `build-systems-browser.cjs`: die bisherigen zehn Event-Entscheidungen, Curses, Synergien und Reload während einer Drehung.
- `build-expansion-browser.cjs`: neue Build-Tags und Relics, tatsächliche neue Scoring-Traces, Save/Load, längere Map, Delete aus Seitenwerkstatt, Shop-Restbudget und mobile Angebotsauswahl; 1366 × 768, 1366 × 600 und 390 × 844. Screenshots unter `test-results/v13` geprüft; keine JavaScript-Fehler.

## Dateien und nächste Schritte
Geändert: `script.js`, `style.css`, `index.html`, `ROADMAP-STAND.md` und die betroffenen Tests. Neu: `build-expansion.test.cjs`, `build-expansion-browser.cjs`, `balance-simulation.cjs` und die gemeinsame Routen-Testhilfe `route.fixture.cjs`.

Als Nächstes: echte Spieler-Runs für Balance-Feedback, besonders Collector im frühen Spiel und Carbon mit stark verändertem Rad; mehr boss-spezifische Gegenentscheidungen. Die vorhandenen sechs expliziten Synergien bleiben zusätzlich zu den neuen natürlichen Kombinationen bestehen. Kleine Ansichten scrollen bei längeren Dialogen weiterhin vertikal. Änderungen sind lokal und im ZIP, nicht automatisch auf GitHub veröffentlicht.

---

# V1.2: Spielwelt, Werkbank, Zufalls-Slots und Economy

Stand: 29.09.2026. Direkt im bestehenden Vanilla-Projekt umgesetzt. Dieser Abschnitt beschreibt die aktuellen Regeln; ältere Abschnitte darunter dokumentieren frühere Versionen.

## Was neu ist
- Einheitlicher Filz-/Papier-/Messing-Look mit kräftigen Konturen, versetzten Karten und einem Roguelette-Stempel. Dialoge, Buttons, Karten und Details verwenden dieselbe Gestaltung.
- Zentrierte Chip-Slots mit festen Chip-/Namenszeilen; Desktop bleibt auch bei 1366 × 600 im Fenster. Mobile Dialoge scrollen vertikal ohne horizontale Überläufe.
- Werkbank mit großem Rad, physischen Feldplättchen, Werkzeug-Auswahl, markierter Quelle/Ziel und einer echten Vorher-/Nachher-Vorschau. Vorschau nutzt dieselbe Logik wie die Anwendung, verändert aber den Run nicht. Werkzeuge können direkt nach dem Werkstattbesuch verwendet werden.
- Ausgebautes Rad bis 38 Felder: zwei Auswahlringe am Desktop, Feldraster auf Mobilgeräten. Die Aktionszeile bleibt beim Scrollen erreichbar.
- Alle Punktanzeigen verwenden dieselbe Ganzzahl-Rundung, einschließlich Auswertung, Verlauf und Bestwerten. Interne Bruchteile bleiben erhalten; Wahrscheinlichkeiten und Multiplikatoren behalten nötige Nachkommastellen.

## Neues Slot-System
Jeder neue Shop enthält **Slot A, B und C plus ein zufälliges Rad-Werkzeug**. Die drei Slots ziehen aus demselben gemischten Pool: 55 % Chips, 25 % Relics, 20 % Rad-Items. Keine Kategorie-Vorwahl und kein vorgelagerter Token-Beutel: Kaufen bezahlt und würfelt sofort, anschließend läuft die kurze Slot-Animation. Der wirkungslose Hebel wird beim bereits gekauften Ergebnis ausgeblendet.

Seltenheit, Luck, Freischaltungen und der bestehende Fallback für leere Pools bleiben wirksam. Legendary bleibt selten. Neue Chips können weiterhin mit 10 % Chance eine Mutation tragen; separate Mutationen sind nicht kaufbar. Bei vollem Inventar bleibt das Ergebnis bestehen, bis ausdrücklich ersetzt oder verworfen wird. Kauf, Ergebnis und Geldstand sind vor der Animation gespeichert; Neuladen würfelt nicht neu und vergibt nichts doppelt.

Alte Spielstände behalten ihre laufende Map samt damaligen Belohnungen und bereits erzeugten Shop-Angeboten. Vorhandene ältere Tokens bleiben verwendbar. Ab dem nächsten Floor wird das neue Map-Format verwendet; neu erzeugte Shops nutzen die neuen Angebote.

## Economy
| Regel | Neuer Wert |
| --- | --- |
| Einstiegstisch | 6 Münzen + Floor-Zuschlag |
| Normaler Tisch | 4 Münzen + Floor-Zuschlag |
| High Stakes | 8 Münzen + Floor-Zuschlag |
| Floor-Zuschlag | Floor − 1, maximal 4 Münzen |
| Boss | 10 + 2 × Floor, maximal 20 Münzen |
| Gemischter Slot | 6 + Floor − 1, maximal 16 Münzen |
| Direktes Rad-Werkzeug | Slot-Preis + 1 / 3 / 5 je Common / Rare / Epic |
| Shop nachfüllen | 4 + höchstens 4 Floor-Zuschlag + 3 pro bisherigem Nachfüllen in diesem Shop |

Ein normaler erster Weg bringt 10 Münzen: genug für einen Slot, nicht für zwei oder den ganzen Shop. Ein riskanter High-Stakes-Weg bringt mehr Kaufkraft. Kein pauschaler Penthouse-Rabatt mehr. Endless erhöht Preise länger als normale Raumauszahlungen; wiederholtes Nachfüllen ist eine zusätzliche Münzsenke. Event-Handel und spezielle Build-Effekte bleiben eigenständige Einnahmequellen.

## Zufällige Route
Jeder Floor erzeugt eine neue Anordnung mit echten Kanten. Nach dem Einstiegstisch folgen drei bis fünf Route-Ebenen. Mehrspurige Ebenen bieten pro Raum höchstens zwei Folgewege, keine vollständige Verbindung aller Räume. Alle Knoten besitzen einen Weg zum Boss, ohne verwaiste Räume oder Sackgassen. Raumpositionen, passende Werkstatt-/Tisch-Ebenen und Verbindungen variieren. Es gibt mindestens drei mögliche Routen; ein Shop unmittelbar vor dem letzten Boss ist garantiert.

Die gezeichnete Map zeigt besuchte Wege, erreichbare Räume, die aktuelle Position und einen großen Boss-Knoten. Hover, Tastaturfokus und Antippen zeigen Details. Gespeicherte Kanten bleiben beim Laden identisch.

## Content-Vorbereitung
Der gemischte Pool wird aus den vorhandenen Chip-, Relic- und Rad-Item-Katalogen erzeugt. Einträge ohne Seltenheitsangabe erhalten Common als Fallback. Die bestehende Freischaltungsprüfung bleibt zentral wirksam, Detailkarten passen sich responsiv an. Dieser Pass fügt keine zusätzlichen Chips oder Relics hinzu; er bereitet deren Ausbau vor und konzentriert sich auf die Spielabläufe.

## Geänderte Dateien
- `script.js`: Economy, Map-Versionierung/Generierung/Laden, unmittelbarer Slot-Kauf, Pool-Aufbau, Ganzzahl-Formatter, Werkbank/Vorschau, UI-Ansteuerung.
- `index.html`: Werkbank-Szene, aktuelle Spielhilfe und Versionsangabe.
- `style.css`: gemeinsame Gestaltung, Chip-Zentrierung, Map, Shop und Werkstatt inklusive kleiner Bildschirme.
- `tests/polish.test.cjs`: neue Modelltests; `tests/polish-browser.cjs`: neuer Browser-Durchlauf.
- Bestehende Economy-/Shop-/Save-/Map-Tests und die deterministische Roster-Fixture an die beabsichtigten Regeln angepasst.
- `ROADMAP-STAND.md`: dieser Änderungsstand.

## Prüfung
- **118/118 Node-Tests bestanden** (`node --test "tests/*.test.cjs"`).
- 500 generierte Maps inklusive Save/Load: gültige Kanten, Erreichbarkeit, mindestens drei Routen, garantierter Shop/Boss und mehr als 400 unterschiedliche Karten.
- Sofortiger Slot-Kauf für alle drei Angebote und alle Ergebnistypen; einmalige Zahlung, Ersatz/Verwerfen bei vollem Inventar, alte Saves/Tokens und neue gespeicherte Ergebnisse.
- Alle sechs Rad-Werkzeuge: atomare Vorschau, Feldgrenzen und direkte Benutzung im Werkstattraum.
- `polish-browser.cjs` in Headless Edge: 1920 × 1080, 1366 × 768, 1366 × 600, 390 × 844 und 844 × 390 am Tisch; zentrale Dialoge Desktop/Mobil; 38-Felder-Werkbank, Shop, Map, Neuladen während Slot-Animation; kompletter Routenablauf durch vier Floors und bis Floor 6 in Endless. Keine JavaScript-Fehler. Der Durchlauf verwendet einen gezielt starken Test-Build und ist kein Nachweis der Gewinnrate mit Basic.
- `build-systems-browser.cjs` in Headless Edge: alle zehn neuen Event-Entscheidungen, Zielauswahl und Reload, Curse-/Synergie-Ansicht, Score-Traces und Speichern während einer Drehung. Keine JavaScript-Fehler.
- Screenshots unter `test-results/v12` visuell kontrolliert; Preisschild-Überlappung, abgeschnittene Tooltips, Map-Positionslabel und Werkbank-Fit korrigiert.
- Historische Browser-Skripte vor V1.2 enthalten teilweise alte Shop-Erwartungen. Für den aktuellen Shop-/Routenablauf gilt `polish-browser.cjs`; die vollständige Modelltestsuite bleibt aktiv.

## Offen / als Nächstes sinnvoll
- Economy mit normalen Spieler-Runs über mehrere Build-Typen abstimmen: technisch geprüfte Preise ersetzen keinen längeren Balancing-Playtest. Münz-Builds, Event-Gewinne und bereits reiche alte Saves können weiterhin größere Guthaben erzeugen.
- Zusätzliche Map-Layouts mit variabler Spurenanzahl und mehr floor-spezifischen Raumkombinationen; derzeit variieren bewährte Raum-Sets und Verbindungen.
- Neue Chips/Relics nach Build-Archetypen sowie markante Boss-/Event-Illustrationen.
- Weitere Browser-Engines prüfen; dieser Pass wurde in Edge/Chromium getestet.
- Sehr kleine Bildschirme nutzen bewusst vertikales Scrollen, insbesondere Werkbank und Shop. Browser-Autosaves bleiben lokal im jeweiligen Browser-Profil.

---

# V1.1: Build-Synergien, Entscheidungen und Chip-Flüche

## Sechs automatisch erkannte Synergien
Aktive Synergien stehen in der Build-Ansicht mit Effekt und erfüllten Bedingungen. Noch inaktive Kombinationen lassen sich unter „Weitere Builds entdecken“ nachlesen. Die Erkennung erfolgt aus dem aktuellen Build und dem permanenten Rad; temporäre Double-Zero-Bossfelder zählen nicht.

| Synergie | Voraussetzung | Effekt |
| --- | --- | --- |
| Roter Faden | Crimson oder Ember + Blood Pact + mehr als 50 % rote Radfelder | Ein Treffer eines Crimson/Ember auf ROT gibt einmal pro Spin +1 Münze. |
| Präzision | Sniper oder Repeater + Bullseye + doppelte Nichtnull-Zahl im Rad | Zahlen-Treffer dieses Spezialisten auf einer mehrfach vorhandenen Zahl: 15 % Chance auf eine Zusatzwertung; mit Echo insgesamt 40 %. |
| Grüner Pakt | Zero + Green Seal + mindestens 3 permanente Nullfelder | Bei einem Zero-Treffer auf 0 entfällt der Null-Abzug dieses Spins. |
| Zweite Chance | Streak + Safety Net + mindestens 60 % rote oder schwarze Felder | Der erste verlierende Streak-Chip mit einer Serie behält pro Tisch einmal die aufgerundete Hälfte seiner Serie. |
| Resonanz | Mindestens 2 Echo-Chips + Lucky Seven | Echo-Chance 40 %. Lucky Seven würfelt kein neues Echo aus. |
| Breites Netz | Balance + Anchor + Full Coverage | Full Coverage benötigt nur 3 statt 4 tatsächlich gesetzte Wettarten und einen Gewinner. |

Präzision und Echo teilen sich dieselbe Zusatzwertung: keine rekursiven Trigger und maximal eine zufällige Zusatzwertung pro Chip. Lucky Seven addiert weiterhin den eingefrorenen Chip-Grundwert genau einmal an seiner Relic-Position.

## Zehn neue Events, zusätzlich zu den drei bisherigen
Jeder Raum bietet mindestens eine Handelsentscheidung und einen kostenlosen Ausweg. Ziel-Chips, Relics, Mutationen und Radfelder werden ausdrücklich ausgewählt. Gesperrte Entscheidungen zeigen den Grund. Fehlgeschlagene Entscheidungen verändern weder Inventar noch Geld; erfolgreiche Entscheidungen sind nur einmal möglich.

| Event | Entscheidung und Preis |
| --- | --- |
| Der schmale Kreis | Letzte 3 Radfelder entfernen, Crown erhalten. Mindestens 6 Felder bleiben. Bei 4 Relics muss ausdrücklich eines ersetzt werden. |
| Rote Tinte | Bis zu 3 schwarze Felder werden rot; dafür kommt eine permanente Null hinzu. |
| Zwei für einen | Gewählten Chip einschließlich Mutation und Curse opfern; 2 zufällige freigeschaltete Chips ohne Zusatzeffekte erhalten. |
| Das doppelte Siegel | 2 zufällige, unterschiedliche neue Mutationen auf einem Chip; dazu einen von 6 Curses wählen. |
| Der Pfandleiher | Relic verkaufen: entweder +18 Münzen oder +1 permanentes Event-Luck (maximal 5). |
| Blinde Wäsche | Für 3 Münzen eine gewählte Mutation gegen eine andere zufällige, noch nicht vorhandene tauschen. |
| Geborgte Zeit | Gewähltes Radfeld duplizieren; nächster Kampftisch −1 Spin. |
| Der Glückspass | Für 12 Münzen +3 Luck ausschließlich im nächsten Floor; nächster Kampftisch −1 Spin. |
| Der Entflucher | Gewählten Curse gegen 10 Münzen oder eine gewählte Mutation entfernen. Erzeugte Nullfelder bleiben. |
| Die dunkle Schmiede | Polished + Heavy für 8 Münzen oder Echo + Greedy für 6 Münzen. |

Inventargrenzen: 2 Rad-Items, 3 Tokens, 4 Relics, 6 Chip-Plätze plus Expanded; Heavy belegt einen Zusatzplatz. Das permanente Rad bleibt zwischen 6 und 38 Feldern. Höchstens 2 fehlende Spins werden vorgemerkt; am nächsten Kampftisch bleibt mindestens ein Spin. Ein Glückspass kann nicht gestapelt werden. Die letzte Event-Entscheidung und vorgemerkte Effekte sind in der Build-Ansicht sichtbar.

## Sechs separate Chip-Curses
Ein Chip besitzt zusätzlich zu normalen Mutationen höchstens einen Curse. Neue Startchips bleiben ohne Mutation und Curse. Curses sind ausschließlich über Events erhältlich und sind keine Shop-/Token-Kategorie.

| Curse | Bonus | Nachteil |
| --- | --- | --- |
| Greedy | ×2 Chip-Punkte | Muss jeden Spin gesetzt werden. Bei The Minimalist sind nur die ersten 3 Greedy-Chips im Inventar pflichtig, damit der Boss spielbar bleibt. |
| Fragile | ×2,5 Chip-Punkte | Zerbricht nach 3 verlorenen gesetzten Spins. Gewinne heilen den Zähler nicht. Zerbricht der letzte Chip, kommt ein unmutierter, unverfluchter Basic ins Inventar. |
| Cursed | ×3 Chip-Punkte | Beim Erhalt einmalig +1 permanente Null. Entfluchen entfernt sie nicht. |
| Addicted | Gleiche Wettart wie beim vorherigen Einsatz: ×1,5 | Wechsel der Wettart: ×0,5. Erster Einsatz ×1. Familien: Zahl, Farbe, Parität, Bereich. |
| Volatile | Bei Treffer 35 % Chance auf ×3, sonst ×1 | Bei Verlust −10 Punkte nach Relics und Boss-Abzügen, gedeckelt am verbleibenden Spin-Score. |
| Heavy | ×2 Chip-Punkte | Belegt 2 Chip-Plätze. Expanded gleicht den zusätzlichen Platz aus. |

Chip-Abzeichen und Details zeigen den Curse; Fragile zeigt seinen Verlustzähler, Addicted seine letzte Wettart. Die Spin-Auswertung erklärt Curse-Multiplikatoren, Zusatzwertungen, Synergie-Auslösungen und Volatile-Abzüge. Reihenfolge: Chip-Effekt/Streak → Polished → Curse → Zusatzwertung → Relics → Boss-Abzüge → Volatile → Null-Abzug. Finale Rundung weiterhin auf 2 Nachkommastellen.

## Speicherung und Kompatibilität
- Bestehende Version-1-Spielstände bleiben ladbar; neue optionale Zustandsfelder erhalten sichere Standardwerte.
- Curse-Name, Verlustzähler und Wettart, Streak-Schutz, permanentes Event-Luck, nächster-Floor-Bonus, Spin-Schuld und Event-Entscheidung werden gespeichert und validiert.
- Synergien werden aus dem wiederhergestellten Build neu berechnet.
- Curses, permanente Änderungen und Event-Luck werden in Endless übernommen; zeitlich begrenzte Floor-Boni laufen korrekt aus.
- Shops und Token-Ersetzungen berücksichtigen Heavy und Expanded gemeinsam.
- Rad-Items und sämtliche bisherigen Mutationen, Relics und Achievements bleiben aktiv.

## Prüfungen
- 109 Test-Runner-Fälle bestanden, davon 26 neue Fälle für diese Systeme.
- Alle 10 Event-Typen über die Browser-UI abgeschlossen und vor/nach der Auswahl neu geladen.
- Zielauswahl, volle Inventare, ungültige Aktionen ohne Teiländerungen, kostenlose Auswege und einmalige Vergabe geprüft.
- Drei gleichzeitig aktive Synergien und verfluchter Chip inklusive Spin-Auswertung im Browser geprüft.
- Reload während der Roulette-Animation: verfluchtes Ergebnis bleibt erhalten, Zahltreffer-Achievement zählt genau einmal.
- Neue Event-/Build-Dialoge bei 1366×768 und 390×844 geprüft, keine horizontale Überbreite; lange Inhalte sind scrollbar.
- Bestehender vollständiger Browser-Run durch alle vier Floors, alle drei House-Phasen, Endless-Boss und folgende Niederlage bestanden. Shops, Slot, Mutationen, Freischaltungen und gesperrter Speicher weiter funktionsfähig.
- Keine JavaScript-Fehler in diesen Browser-Durchläufen.

## Wichtigste Dateien und Funktionen
- `script.js`: `CURSES`, `grantCurse`, `chipLoad`, `missingGreedy`, `detectSynergies`, `activeSynergies`, `curseMultiplier`, `resolveSpin`, `BUILD_EVENTS`, `resolveBuildEvent`, `renderEventChoices`, `renderBuild`, `decodeRun`, `enterRoom`, `advanceFloor`, `claimReward`.
- `index.html`: Synergiebereich im bestehenden Build-Dialog, aktualisierte Wertungsreihenfolge, V1.1-Anzeige.
- `style.css`: Curse-Siegel, Synergiekarten und responsive Event-Zielauswahl im bestehenden Stil.
- `tests/build-systems.test.cjs`: neue System- und Integrationsprüfungen.
- `tests/build-systems-browser.cjs`: portable Browser-Prüfung; benötigt Playwright und standardmäßig Edge (`BROWSER_CHANNEL` optional). Screenshots entstehen in `test-results/`.
- `tests/events.test.cjs`, `tests/save.test.cjs`, `tests/basic-start.test.cjs`: feste Test-Zufallswerte an den erweiterten Event-Pool angepasst.

## Offene Punkte
Keine bekannten Blocker in den geprüften Abläufen. Langzeit-Balancing über viele zufällige Runs ist noch offen, insbesondere Cursed/Polished/Zero-Kombinationen und hohe Endless-Floors. Die zufälligen neuen Chips/Mutationen werden bewusst erst beim tatsächlichen Event-Abschluss gezogen. Cloud-Sync und Spielstand-Export bleiben außerhalb dieses Blocks.

---
Archiv früherer Entwicklungsstände. Die folgenden Feature-Zahlen und Einschränkungen beschreiben den damaligen Stand.

# V1.0: Automatische Speicherung und Release-Polish

Roadmap-Block 100–104: Run Save/Load umgesetzt. Dazu gezielter UI- und Bedienungs-Feinschliff für den ersten Versionsstand.

## Neu eingebaut
- Automatisches lokales Speichern nach Spielaktionen und beim Verlassen bzw. Ausblenden der Seite.
- WEITERSPIELEN im Startmenü stellt den laufenden Run wieder her: Floor, Map-Pfad, Raum, Punkte, Spins, Münzen, Chips, Mutationen, gesetzte Wetten, Relic-Reihenfolge, Tokens und Rad-Items.
- Shop-Angebote, bereits gekaufte Karten, Ereignisse und offene Slot-Ergebnisse bleiben erhalten.
- Ein Reload während eines Roulette-Spins übernimmt das bereits bestimmte Ergebnis genau einmal. Punkte und Achievement-Fortschritt werden nicht doppelt gezählt.
- Ein Reload während der Slot-Animation würfelt die Belohnung nicht erneut aus und vergibt sie nicht doppelt.
- Versioniertes Speicherformat mit Datenprüfung. Bei beschädigtem Hauptstand wird der letzte gültige Sicherungsstand verwendet, sofern vorhanden.
- Neuere Bestwerte und Freischaltungen bleiben bei der Wiederherstellung eines älteren Sicherungsstands erhalten.
- Neustart eines vorhandenen Runs verlangt eine Bestätigung. Abbrechen setzt den bestehenden Run fort; Freischaltungen und Bestwerte bleiben bei einem Neustart erhalten.
- Ton-Einstellung bleibt nach einem Reload erhalten.
- Startmenü zeigt Speicherstatus und aktuellen Ort sowie die Versionsnummer V1.0.
- Alle Menüaktionen passen auch bei geringer Bildschirmhöhe ins Bild; das Querformat erhält eine kompakte Zweispaltenansicht.
- Sichtbare Tastatur-Fokusmarkierungen und überarbeiteter Neustart-Dialog.
- Spielhilfe erklärt das automatische Speichern. Die dekorative Slot-Rolle zeigt keine separat erhältlichen Mutationen mehr.

## Geprüft
- 83 Test-Runner-Fälle bestanden, einschließlich neuer Save/Load-Prüfungen.
- Vollständiger normaler Run, alle drei House-Phasen, Endless-Boss und anschließende Niederlage im Browser geprüft.
- Alle drei Freischaltungen und ein freigeschalteter Repeater aus einem Token geprüft.
- Reload auf Tisch, Map, im Shop, während Roulette und während Slot-Animation geprüft; keine doppelten Belohnungen.
- Beschädigter Hauptstand mit Backup-Wiederherstellung, gesperrter Speicher, Neustart-Abbruch und Bestätigung geprüft.
- Ton-Einstellung bleibt erhalten; alle Startmenü-Aktionen bei 1366×600, 390×844 und 844×390 vollständig sichtbar.
- Keine JavaScript-Fehler in den Browser-Durchläufen.

## Speicherort und Grenzen
Der Spielstand liegt lokal im Browserspeicher und gilt für denselben Browser und dieselbe Spieladresse. Das Löschen der Browserdaten entfernt auch den Spielstand. Bei gesperrtem Speicher bleibt das Spiel spielbar und zeigt an, dass nicht gespeichert werden konnte. Cloud-Sync und Datei-Export sind noch nicht enthalten.

Die folgenden Einträge dokumentieren frühere Entwicklungsstände; Aussagen über damals fehlendes Save/Load sind damit überholt. Dies ist ein V1-Stand, keine Erklärung, dass jede verbleibende Roadmap-Aufgabe abgeschlossen ist.

---

# Roadmap 95–99: Meta-Fortschritt und Freischaltungen

## Drei Achievements mit neuen Inhalten
| Achievement | Bedingung über alle Runs | Freischaltung |
| --- | --- | --- |
| Rot läuft | Fünf Spins mit rotem Ergebnis und mindestens einem gewinnenden Chip | Ember (Rare): ROT ×2,25 |
| Immer dieselbe Zahl | Dieselbe Zahl in drei Spins mit einer Zahlenwette treffen | Repeater (Epic): Zahlenwetten ×4 |
| Das Haus fällt | The House im normalen Run besiegen | Phoenix (Epic-Relic): In den letzten zwei Spins eines Tisches ×1,5 Spin-Score, wenn mindestens ein Chip gewinnt |

- Mehrere gewinnende Chips zählen für ein Achievement nur einmal pro Spin.
- Außenwetten erhöhen den Zahltreffer-Zähler nicht. Unterschiedliche Zahlen besitzen getrennte Fortschritte.
- Der bestehende Inhalt bleibt verfügbar: 14 sofort spielbare Chips und 11 Relics. Mit den neuen Freischaltungen gibt es insgesamt 16 Chips und 12 Relics.
- Neue Inhalte sind vor der Freischaltung aus den Token-Pools ausgeschlossen und können auch nicht durch eine ungültige Belohnungsübernahme erhalten werden.
- Nach dem Unlock stehen sie sofort im laufenden Run und in späteren Runs im passenden Token-Pool zur Verfügung. Es wird kein kostenloser Chip bzw. kein kostenloses Relic ins Inventar gelegt.
- Ein kurzer Hinweis meldet neue Freischaltungen.

## Eigene Übersicht
- Im Hauptmenü: „Freischaltungen“ mit Belohnungsname, Anforderung, aktuellem Fortschritt und Effekt.
- Freigeschaltete Karten werden markiert. Gesperrte Inhalte und Bedingungen sind sichtbar.
- Breite Kartenansicht am PC; gestapelte Karten und scrollbar auf dem Handy.

## Dauerhafter Fortschritt
- Eigenes versioniertes Meta-Profil, getrennt von Run und Bestwerten.
- Fortschritt bleibt bei neuem Run und Browser-Reload erhalten.
- Ein bereits in den Bestwerten gespeicherter Sieg über The House wird für Phoenix berücksichtigt.
- Ungültige oder unbekannte Profilversionen erhalten sichere Standardwerte. Gesperrter Browserspeicher führt zu einer klar bezeichneten Sitzungsvariante statt zu einem Absturz.
- Startaufstellungen sind als Datenmodell vorbereitet (Aufgabe 99). Es ist weiterhin ausschließlich der Basic-Start aktiv: ein unmutierter Basic-Chip, keine zusätzlichen Startvorteile.
- Laufende Runs werden noch nicht gespeichert; Run Save/Load folgt mit Aufgaben 100–104.

## Prüfung
- Alle 78 Test-Runner-Fälle bestanden (inklusive Kernpaket mit 11 Einzelprüfungen).
- Achievement-Grenzen, Zählung pro Spin, getrennte Zahl-Zähler, gesperrte Pools und Belohnungen, Datenvalidierung sowie alle drei neuen Effekte geprüft.
- Browser: vollständiger normaler Run und Endless, alle drei Freischaltungen regulär erreicht, Repeater aus einem Token erhalten, Fortschritt nach Reload und Basic-Neustart erhalten.
- Blockierter Speicher geprüft; keine JavaScript-Fehler.
- Freischaltungsansicht am PC und auf Handybreite visuell geprüft. Zu schmale Desktop-Karten korrigiert.

---
Archiv früherer Entwicklungsstände.

# Großer Roadmap-Block: Boss-Phasen, Endless und Bestwerte

Aufgaben 88 bis 94 umgesetzt.

## The House: drei Phasen
- Spins 1–3: Hausanteil zieht 20 % des Spin-Scores nach Relics ab.
- Spins 4–6: Steuer zieht 10 Punkte pro verlorenem Chip ab, maximal 25 % des Spin-Scores.
- Ab Spin 7: zuerst Steuer, danach 20 % Hausanteil.
- Die aktive Regel erscheint im Boss-Banner. Der Wechsel gilt für den nächsten Spin; ein bereits laufender Spin behält seine gestartete Phase.
- Die Auswertung speichert die damalige Phase und beide Abzüge. Null ×0,75 folgt weiterhin zuletzt.

## Sieg und Endless
- Nach The House: CONTINUE / ENDLESS oder RUN BEENDEN. Bestwerte sind auch hier abrufbar.
- CONTINUE übernimmt Chips, Mutationen, Relics, Tokens, Rad-Items, Münzen, dauerhaftes Rad und Run-Statistiken vollständig.
- Endless beginnt nach dem Penthouse; nach jedem Boss geht es in einen weiteren Floor, ohne festes letztes Level.
- Pro Endless-Floor neue Map-Verbindungen mit normalen Tischen, High Stakes, Shops, Werkstatt und Ereignissen. Letzter Shop vor dem Boss bleibt garantiert.
- Die Bossfolge rotiert: Double Zero, Taxman, Minimalist, The House.
- Endless-Ziele wachsen mit Faktor 1,45 pro Floor. Boss-Ziele starten bei 1.200, dann 1.740, 2.523 …; normale Tischziele skalieren entsprechend.
- Höhere Floors zahlen mehr Münzen aus. Der Penthouse-Rabatt bleibt eine Besonderheit des normalen Final-Shops.
- Eine Endless-Niederlage zeigt ein eigenes Ergebnis. Der vorherige Sieg über The House bleibt als normaler Run-Sieg gewertet.
- Temporäre Boss-Radänderungen werden auch bei einer Niederlage entfernt.
- RUN BEENDEN führt ins Hauptmenü; ein neuer Run startet wieder mit einem unmutierten Basic.

## Dauerhafte Bestwerte
- Höchster erreichter Endless-Floor.
- Höchste Anzahl gewonnener Endless-Tische in einem Run, einschließlich Boss-Tischen.
- Höchster Spin-Score und Run-Gesamtscore, auch aus normalen Runs.
- Dauerhafte Markierung, dass The House besiegt wurde.
- Eigene Bestwerte-Ansicht im Hauptmenü, Sieg- und Endless-Endbildschirm.
- Versionierte, lokal gespeicherte Daten; neue Runs überschreiben keine höheren Rekorde.
- Beschädigte oder unbekannte Datenformate werden auf sichere Standardwerte zurückgesetzt. Bei blockiertem Speicher bleibt das Spiel bedienbar und kennzeichnet die Werte als nur für diese Sitzung verfügbar.
- Aktive Runs werden noch nicht gespeichert: Neuladen setzt den Run zurück, behält aber die Bestwerte. Run Save/Load ist ein späterer Roadmap-Block.

## Geprüft
- Alle 73 Test-Runner-Fälle bestanden, inklusive des Kernpakets mit 11 Einzelprüfungen.
- Neue Tests für alle House-Phasen und deren Grenzen, einmaligen Endless-Einstieg, vollständige Build-Übernahme, wachsende Ziele, Bossrotation, endgültige Niederlage und monotone Rekorde.
- Browser: kompletter normaler Run, alle drei House-Phasen bis Spin 8, CONTINUE, vollständiger erster Endless-Floor, Niederlage auf dem zweiten Endless-Floor, RUN BEENDEN und Bestwerte nach Reload.
- Beschädigter/gesperrter Browserspeicher separat im Browser geprüft; keine JavaScript-Fehler.
- Boss-Phasen, Ergebnis und Bestwerte visuell kontrolliert; Bestwerte auch auf Handybreite ohne horizontalen Überlauf geprüft.

## Nächste größere Blöcke
Meta-Progression und Achievements (95–99), danach versioniertes Run Save/Load (100–104). Die optionalen Bossvarianten Locksmith/Croupier bleiben ebenfalls offen.

---
Archiv früherer Stände: fehlende Boss-Phasen, Endless und persistente Bestwerte sind inzwischen umgesetzt.

# Roadmap-Update: Penthouse und The House

## Aufgaben 85–87 umgesetzt
- Nach Casino, High Roller und VIP geht der Run ins Penthouse statt direkt zum Sieg.
- Kurzer vierter Floor: Eingangstisch, eine Entscheidung zwischen drei Räumen, garantierter Final-Shop und The House. Insgesamt 22 besuchte Räume pro vollständigem Run.
- Alle Chips, Mutationen, Relics, Tokens, Rad-Items, Münzen, Radänderungen und Statistiken bleiben beim Aufstieg erhalten.
- Penthouse-Eingang: 350 Punkte in 7 Spins, 40 Münzen Gewinn.
- Letzter großer Einsatz: 560 Punkte in 7 Spins, 55 Münzen Gewinn.
- Private Werkstatt: kostenloses Clone oder Mitosis wählen; zwei Item-Plätze und Schutz vor doppelter Vergabe bleiben aktiv.
- Alternativ ein Ereignis aus dem bestehenden Pool.
- Alle Wege führen zwingend durch den letzten Händler. Tokens kosten dort jeweils 2 Münzen weniger: Standard 4, Chip 6, Relic 8. Auch nach dem Nachfüllen bleiben diese Preise bestehen.
- The House: 1.000 Punkte in 8 Spins. Das Haus behält 20 % jedes Spin-Scores nach den Relics und vor dem Null-Abzug. Die Auswertung zeigt den Abzug separat.
- Bossregel in Map-Vorschau, Final-Shop und aktivem Banner sichtbar.
- Sieg nach The House zeigt Gesamtpunkte, stärksten Spin, Münzen und Build sowie Neustart.

## UI
- Map-Positionen richten sich jetzt nach der Zahl ihrer Reihen. Der kürzere Penthouse-Abschnitt nutzt die Fläche gleichmäßig.
- Start- und Hilfetexte beschreiben den Run mit vier Floors.

## Verifiziert
- Alle 68 Test-Runner-Fälle bestanden.
- Modelltest durch alle vier Floors, Übernahme des Builds und endgültiger Sieg.
- Final-Shop kann nicht übersprungen werden; Rabatt bleibt nach Nachfüllen erhalten.
- Premium-Werkstatt gibt nur einmal ein Item aus.
- The-House-Abzug und anschließender Null-Abzug gezielt geprüft.
- Vollständiger Browser-Run über 22 Räume bis zum Sieg, ohne JavaScript-Fehler. Boss- und Abschlussansicht visuell kontrolliert.

## Noch offen
The House hat bewusst zunächst eine Grundphase (Aufgabe 87). Phasenwechsel (88), END RUN / CONTINUE (Rest von 89) und Endless (90–94) folgen. Locksmith und Croupier (81/84) sind ebenfalls noch offen.

---
Frühere Entwicklungsstände: Das bisherige Run-Ende nach VIP ist ersetzt.

# Neue Chips und Relics

Jetzt insgesamt 14 spielbare Chips und 11 Relics. Alle neuen Inhalte sind in den passenden Token-Pools verfügbar; es gibt keine direkten Shop-Käufe. Die 10-%-Chance auf eine zufällige Mutation gilt auch für neue Chips. Der Start bleibt ein unmutierter Basic.

## Sieben neue spielbare Chips
| Chip | Seltenheit | Effekt |
| --- | --- | --- |
| Low Rider | Uncommon | LOW ×1,75; andere Wetten unverändert. |
| Oddball | Rare | UNGERADE ×2. |
| Even Steven | Rare | GERADE ×2. |
| Anchor | Rare | Jede Außenwette ×2; Zahlen normal. |
| Zero | Epic | Zahlenwette auf 0 ×6; Null-Abzug bleibt bestehen. |
| Gambler | Epic | Zahlenwetten ×3,5; Außenwetten nur ×0,75. |
| Royal | Legendary | Jede gewonnene Wette ×2,5. |

Zero und Gambler waren bisher vorbereitete Datenobjekte und sind jetzt vollständig spielbar. Alle Chips besitzen eigene Symbole, passende Farben und Effektbeschreibungen. Polished und Echo wirken zusätzlich zu ihren Spezialeffekten.

## Sechs neue Relics
| Relic | Seltenheit | Effekt |
| --- | --- | --- |
| Night Market | Common | Schwarzes Ergebnis: Spin-Score ×1,5. |
| Safety Net | Uncommon | Mindestens ein Gewinner und ein Verlierer: +30 Punkte. |
| Crowd | Rare | Mindestens drei gewinnende Chips: Spin-Score ×1,75. |
| Bullseye | Rare | Mindestens eine gewonnene Zahlenwette: Spin-Score ×1,75. |
| Green Seal | Epic | Nulltreffer: Spin-Score ×2, danach normaler Null-Abzug. |
| Crown | Legendary | Mindestens drei gesetzte Wettarten und ein Gewinner: Spin-Score ×2,5. |

Relics werden weiterhin von links nach rechts ausgewertet. Das ist insbesondere bei Safety Net wichtig: spätere Multiplikatoren verstärken die addierten 30 Punkte. Kein zusätzlicher Echo-Wurf durch Relics. Doppelte Relics bleiben ausgeschlossen.

## Darstellung und Pools
- Royal und Crown füllen erstmals die Legendary-Pools für Chips und Relics.
- Bei Rad-Items ohne Legendary bleibt die dokumentierte Ausweichregel aktiv.
- Die letzte Slot-Karte zeigt jetzt das individuelle Chip-/Relic-Symbol.
- Effekte stehen in den bestehenden Chip- und Relic-Details sowie beim Token-Ergebnis.

## Geprüft
- Alle 67 Test-Runner-Fälle bestanden (inklusive Kernpaket mit 11 Einzelprüfungen).
- Neue Tests für passende/unpassende Wetten aller sieben Chips, Bedingungen aller sechs Relics, Relic-Reihenfolge, komplette Fehlwürfe und Null-Kombination mit Polished/Echo/Green Seal.
- Jedes Pool-Upgrade besitzt eine gültige Seltenheit und lässt sich übernehmen.
- Browserprüfung: Royal und Crown über gekaufte Tokens erhalten, Legendary-Reveal, individuelle Symbole, Inventarübernahme und mobile Breite. Keine JavaScript-Fehler.

---
Archiv: frühere Angaben zu inaktiven Zero-/Gambler-Chips oder leeren Legendary-Pools sind überholt.

# Update: echte Routen und drei Floors

## Map und Pfadentscheidungen
- Drei Routen durch Tisch-, High-Stakes-, Shop-, Werkstatt- und Ereignisräume.
- Jeder Raum besitzt explizite Verbindungen. Nur verbundene Räume der nächsten Stufe können betreten werden; freie Sprünge zwischen allen Spalten sind gesperrt.
- Die Verbindungen werden pro neuem Floor erzeugt. Gerade Wege bleiben offen; Abzweigungen führen höchstens auf eine benachbarte Route. Kein Pfad endet in einer Sackgasse.
- Gezeichnet werden ausschließlich tatsächlich spielbare Verbindungen. Gewählter Weg, aktueller Raum und nächste erreichbare Räume sind markiert.
- Details erklären bei einem nicht verbundenen Raum, weshalb er gesperrt ist. Beim Öffnen ist direkt ein erreichbarer Raum ausgewählt.
- Alle Pfade führen vor dem Boss zu einem garantierten letzten Shop.

## Mehr Levels
- Drei Floors mit jeweils sechs besuchten Räumen: insgesamt 18 Räume bis zum Run-Sieg.
- Casino: Einstieg mit Basic, unveränderte frühe Ziele und Double Zero (120 Punkte / 7 Spins).
- High Roller: normale Tischziele ×2,5; höhere Münzgewinne; The Taxman (360 Punkte / 7 Spins).
- VIP: normale Tischziele ×5; nochmals höhere Münzgewinne; The Minimalist (700 Punkte / 7 Spins).
- Nach Floor 1 und 2 erscheint der Übergang zum nächsten Floor. Chips, Mutationen, Relics, Rad-Items, Tokens, Münzen, dauerhaftes Rad und Run-Statistiken bleiben erhalten.
- Nach Floor 3 erscheint der Run-Sieg mit Build und Statistiken. Penthouse, The House und Endless bleiben weitere Roadmap-Arbeit.

## Bossregeln
- Double Zero: zwei temporäre Nullfelder, anschließend Wiederherstellung des dauerhaft bearbeiteten Rads.
- The Taxman: 10 Punkte Abzug pro verlorenem Chip, begrenzt auf 25 % des aktuellen Spin-Scores. Kein negativer Spin-Score. Abzug in der Auswertung sichtbar.
- The Minimalist: maximal drei Chips gleichzeitig setzen. Wetten verschieben und zurücknehmen bleibt möglich. Das Limit und ein Hinweis bei Überschreitung sind sichtbar.
- Bossname, Regel und Ziel erscheinen in Map-Vorschau, letztem Shop und aktivem Boss-Banner.

## UI-Korrekturen
- Map-Knoten mit ausreichenden Abständen bei drei Spalten; keine überlappenden Symbole in den geprüften Auflösungen.
- Kompakte Desktop-Map für niedrige Fenster, insbesondere 1366×600; kein abgeschnittener unterer Knoten mehr.
- Handy-Map mit lesbaren Symbolen, darunter Raumdetails und Betreten-Schaltfläche.
- Dynamische Floor-Namen und Bossvorschauen statt fest eingebauter Floor-1-Texte.

## Prüfung
- 62 Test-Runner-Fälle bestanden, einschließlich des Kernpakets mit 11 Einzelprüfungen.
- 40 erzeugte Maps auf gültige Verbindungen, Abzweigungen, fehlende Sackgassen und gesperrte Seitensprünge geprüft.
- Drei Floors im Modell und im Browser vollständig durchgespielt; Build-Übernahme, Bossregeln, Rad-Rückbau, Floor-Wechsel und endgültiger Run-Sieg geprüft.
- Browser ohne JavaScript-Fehler. Map bei 1440×900, 1366×600 und 390×844 auf Knotenüberlappung und horizontales Abschneiden geprüft und visuell kontrolliert.

Roadmap-Fortschritt: 72 (Map-Verbindungen pro Floor), 77/78 (High Roller/VIP), 80 (Taxman), 83 (Minimalist). Die Raumreihen bleiben bewusst strukturiert; zufällig sind die Verbindungen.

---
Archiv früherer Entwicklungsstände; Aussagen zum Ende nach Floor 1 sind überholt.

# Update: Glücksblatt, seltene Chip-Mutationen und neue Ereignisse

## Slot im Spielstil
- Drei leicht versetzte Papierkarten auf grünem Filz ersetzen das metallische Automatengehäuse.
- Flache Farben, gedruckte Symbole und Kartenschatten passen zu Shop und Pokertisch.
- Sichtbar laufende Rollen und ihr nacheinander erfolgendes Stoppen bleiben erhalten.
- Seitliche Zugkarte am PC; große Ziehen-Schaltfläche am Handy.
- Neue Mutation direkt beim Ergebnis sichtbar; Einzelheiten stehen beim Chip und beim Erhalt.

## Mutationen
- Mutation Token entfernt. Mutationen können nicht mehr gekauft oder gezielt auf einen Chip angewendet werden.
- Jeder neue Chip aus einem Token hat unabhängig von seiner Seltenheit 10 % Chance auf genau eine bereits vorhandene Mutation.
- Polished, Echo, Lucky und Expanded sind dabei gleich wahrscheinlich (je 2,5 % insgesamt).
- 90 % der neuen Chips haben keine Mutation. Der Basic-Startchip ist immer unmutiert.
- Mutation wird mit dem Token-Ergebnis einmalig gespeichert, nicht erst beim Übernehmen gewürfelt. Wiederöffnen verändert nichts.
- Lucky und Expanded aktualisieren Luck und Kapazität sofort. Ein neu erhaltener Expanded-Chip bringt seinen eigenen zusätzlichen Platz mit.

## Roadmap weitergeführt
- Aufgaben 64/66: Drei garantierte Angebote (Slot, Chip, Relic) und ein zufälliges viertes Token-Angebot. Nachfüllen würfelt das vierte Angebot neu; Preise steigen weiterhin 3, 5, 7 … Münzen.
- Aufgabe 75: Datenbasierter Ereignis-Pool; ein Ereignis wird beim Betreten gezogen und bleibt bis zur Entscheidung gleich.
- Die verschlossene Kasse: sicher +6 oder 50 % auf +18, sonst bis zu −8 Münzen.
- Kopf oder Krone: sicher +4 oder 40 % auf +24, sonst bis zu −10 Münzen.
- Der rote Umschlag: sicher +8 oder 60 % auf +16, sonst bis zu −6 Münzen.
- Alle Entscheidungen sind einmalig; Verluste gehen höchstens bis auf 0 Münzen. Chancen und Beträge stehen vor der Entscheidung sichtbar an den Schaltflächen.
- Offen bleiben insbesondere die zufällige Map (72) und weitere Floors (77/78). Der aktuelle Run endet weiterhin nach Double Zero auf Floor 1.

## Prüfung
- 58 Test-Runner-Fälle bestanden (einschließlich des Kernpakets mit 11 Einzelprüfungen).
- Abgedeckt: 10-%-Grenze, alle vier Mutationen, kein Mutationskauf, unvermutierter Start, Expanded-Kapazität, wechselnde Token-Angebote, alle Ereignisentscheidungen und Verlustgrenzen.
- Browser: tatsächliche Animation, Bedienung, Ergebnis-Erhalt, Token-Käufe, angeborene Mutation, Chip-/Relic-Erhalt, Nachfüllen und vollständiger Boss-Durchlauf ohne JavaScript-Fehler.
- Slot und Shop auf Desktop und Handy visuell geprüft; Slot bei vier Bildschirmgrößen und Tisch bei sechs Desktopgrößen getestet.

---
Archiv früherer Stände: Angaben zu kaufbaren Mutationen und Mutation-Tokens sind überholt.

# Neu: echte Slot-Machine und reiner Token-Shop

## Features dieses Updates
- Drei echte, vertikal laufende Symbolrollen mit einzelnem Abbremsen für Art, Seltenheit und Upgrade.
- Automatengehäuse mit Rollenfenstern, Lichtleiste und bedienbarem Hebel im bisherigen Filz-, Papier- und Messingstil.
- Token zuerst auswählen, dann am Hebel starten. Die Auswahl allein kostet keinen Token.
- Der Shop verkauft ausschließlich Token-Karten im bisherigen Item-Kartenstil. Direkte Upgrade-Angebote und die zusätzliche Token-Leiste entfallen.
- Vier Angebote: Slot Token (6 Münzen), Chip Token (8), Relic Token (10), Mutation Token (8).
- Standard-Tokens liefern mit 55 % einen Chip, 25 % eine Relic und 20 % ein Rad-Item. Spezial-Tokens garantieren ihre Kategorie.
- Mutation-Tokens halten Polished, Lucky, Echo und Expanded verfügbar. Vor dem Übernehmen wird ein geeigneter Chip gewählt; bereits vorhandene Mutationen werden ausgeschlossen.
- Nachfüllen erneuert verkaufte Token-Angebote; die Kosten beginnen bei 3 Münzen und steigen pro Nutzung um 2.
- Kaufbereich, Kartenbeschriftungen und Shop-Schaltflächen passen sich schmalen Ansichten an. Lange Inhalte bleiben im Dialog scrollbar.
- Auch auf dem Handy bleiben die drei Rollen nebeneinander. Kleine Bildschirmhöhen bekommen kompaktere Rollen und Dialogabstände.
- Ergebnis und Token-Verbrauch bleiben gegen Doppelklicks und Schließen/Wiederöffnen geschützt. Reduzierte Bewegung wird berücksichtigt.
- Spielregeln und Map-Shopbeschreibung erklären den neuen Ablauf.

## Geprüft
- Alle 55 vom Test-Runner gemeldeten Tests bestanden; darin enthalten sind zusätzlich 11 einzelne Kernprüfungen, insgesamt 65 logische Prüfungen.
- Browserdurchlauf: Token-Kauf, Auswahl ohne Verbrauch, tatsächliche Rollenanimation, Sperren während des Spins, unverändertes Ergebnis nach Wiederöffnen, Chip-/Relic-Erhalt, Mutation-Zielwahl, Nachfüllen und kompletter Weg bis zum Boss.
- Slot-Dialog bei 1440×900, 1366×600, 1100×650 und 390×844 geprüft; Desktop-Tisch zusätzlich in sechs Auflösungen von 1100×650 bis 1920×1080.
- Keine JavaScript-Fehler im getesteten Browserdurchlauf. Shop und Slot visuell auf Desktop und Handy kontrolliert.

---
Frühere Entwicklungsstände (Shop-Verhalten oben ersetzt die damaligen direkten Käufe):

# Neu: ruhigere UI, Slot-Tokens und aktives Luck

## Oberfläche aufgeräumt
- Dauerhafte Kleinsttexte, Slogans, Footer, doppelte Ergebnislabels, Wettfeld-Untertitel und wiederholte Bedienhinweise aus der sichtbaren Spieloberfläche entfernt.
- Keine permanente Chip-Beschreibung und keine lange Spin-Aufschlüsselung auf dem Tisch. Chip-Effekte bleiben per Tooltip und Chip-Details erreichbar; die Rechnung über Auswertung.
- Wichtige Werte bleiben sichtbar: Score, Ziel, Spins, Luck, Token-Anzahl, Inventar und Bossregeln.
- Kurze Rückmeldungen erscheinen bei relevanten Aktionen als vorübergehende Meldung statt als dauerhafter Textblock.
- Größere Score-Anzeige, klarere Bedienelemente, reduzierte leere Inventarplätze, mehr Platz für Rad und Wettfeld.
- Shop und Startbildschirm von zusätzlichen Erklärungstexten befreit. Kaufdetails erscheinen nach Auswahl; Bosswarnungen bleiben erhalten.

## Roadmap 55–62: Slot-Tokens
- Slot Token: 6 Münzen, Art zufällig – 55 % Chip, 25 % Relic, 20 % Rad-Item.
- Chip Token: 8 Münzen, Art immer Chip.
- Relic Token: 10 Münzen, Art immer Relic.
- Alle drei Token-Arten sind im Shop zusätzlich zu direkten Upgrades verfügbar. Pro Angebotsrunde kann jedes Angebot einmal gekauft werden; neue Angebote setzen auch die Token-Angebote zurück.
- Separate Token-Tasche mit drei Plätzen. Die zwei Plätze für Rad-Items bleiben davon unabhängig.
- Öffnen über ✦ am Tisch oder die Token-Leiste im Shop.
- Benutzen verbraucht genau einen Token. Zuerst gesetzte Wetten zurücknehmen; während Roulette-Spins ist die Nutzung gesperrt.
- Drei sichtbare Rollen: ART, SELTENHEIT und UPGRADE. Sie stoppen nacheinander; reduzierte Bewegung wird berücksichtigt.
- Das Ergebnis wird einmal vor der Animation ermittelt. Schließen und Wiederöffnen würfelt nicht erneut. Während der Animation ist Schließen gesperrt.
- Ein noch offenes Ergebnis muss übernommen oder verworfen werden, bevor der Run weitergeht.
- Bei vollem Chip-, Relic- oder Rad-Item-Inventar: konkreten Ersatz wählen oder das Ergebnis verwerfen. Kein stilles Überschreiben, kein doppelter Erhalt.
- Expanded schützt weiterhin belegte Zusatzplätze. Bereits vorhandene Relics werden bei Token-Rolls ausgelassen.

## Seltenheiten und Luck
| Seltenheit | Chance bei Luck 0 | Änderung je Luck |
| --- | ---: | ---: |
| Common | 60 % | −2 Prozentpunkte |
| Uncommon | 25 % | unverändert |
| Rare | 10 % | +1 Prozentpunkt |
| Epic | 4 % | +0,7 Prozentpunkte |
| Legendary | 1 % | +0,3 Prozentpunkte |

- Lucky ist jetzt aktiv für Token-Seltenheiten. Der Einfluss ist bei 10 Luck gedeckelt; Roulette-Wahrscheinlichkeiten bleiben unverändert.
- Aktuelle Chancen sind unter „Luck & Chancen“ in der Slot-Machine einsehbar.
- Upgrade-Pools sind nach Art und Seltenheit aufgeteilt. Die dritte Rolle verwendet nur passende Einträge.
- Ist ein Pool leer, wird zuerst die nächstniedrigere belegte Seltenheit, sonst die nächsthöhere gewählt. Die tatsächliche Seltenheit und der Fallback werden sichtbar angezeigt.
- Es gibt noch keine Legendary-Upgrades. Ein Legendary-Roll fällt deshalb aktuell auf einen passenden niedrigeren Pool zurück. Silver-, Gold- und Chaos-Tokens sind noch offen.

## Bestehender Ablauf bleibt erhalten
- Start mit einem Basic-Chip, Ausbau im Shop.
- Keine automatische Belohnungsauswahl nach gewonnenen Tischen. Die Slot-Machine öffnet sich nur bei selbst benutzten Tokens.
- Bisherige Zielwerte und Bossregeln bleiben erhalten.
- Der Spielumfang bleibt Floor 01. Weitere Floors, zusätzliche Bosse, Endless und gespeicherte Runs sind noch offen.

## Geprüft
- 64 Logikprüfungen bestanden: bisherige Regeln plus Token-Arten, Wahrscheinlichkeiten, Luck, leere Pools, Kaufgrenzen, einmaliger Verbrauch, Ersatzwahl und Zustandswechsel.
- Browser: alle drei Token-Arten kaufen und benutzen; animiertes Reveal, Schließen/Wiederöffnen ohne neuen Roll, Übernehmen, Verwerfen und sechs volle Chip-Plätze mit bewusster Ersatzwahl.
- Erneuter vollständiger Browserdurchlauf vom Basic-Start bis zum Boss-Sieg und Neustart.
- Sechs PC-Größen von 1100 × 650 bis 1920 × 1080 einschließlich 1366 × 600 sowie mobile Token-Ansicht bei 390 Pixel Breite geprüft. Keine JavaScript-Fehler.
- Tests: node --test tests/*.test.cjs

Direkt in dem Projektordner aktualisiert. Zum Laden Strg + F5 drücken.

---
## Historie – frühere Angaben zu inaktivem Luck und fehlenden Tokens sind oben ersetzt
# Neu: klarere Bosse und Start mit einem Basic-Chip

## Ein Basic zum Start
- Jeder neue Run startet mit genau einem unveränderten Basic-Chip.
- Das Limit bleibt bei sechs Chips: fünf sichtbare freie Plätze für spätere Käufe.
- Die kostenlose Startaufstellung ist entfernt. Chip-Details zeigt den aktuellen Build; den letzten Chip kann man nicht ablegen.
- Neue Chips stammen aus dem Shop. Der erste zusätzliche Chip kostet weiterhin 8 Münzen; bereits der erste Tisch zahlt 10 Münzen aus.
- Normale Punktwerte bleiben gleich: Zahl 100, Außenwette 20. Keine versteckte Änderung der Roulette-Wahrscheinlichkeiten.

## Angepasste Schwierigkeit
| Tisch | Ziel | Spins | Münzen |
| --- | ---: | ---: | ---: |
| Ankommen | 20 | 5 | 10 |
| Grüner Tisch | 40 | 6 | 10 |
| High Stakes | 60 | 5 | 20 |
| Letzter Einsatz | 80 | 6 | 15 |
| Double Zero | 120 | 7 | 30 |

- Der erste Tisch benötigt nur einen erfolgreichen Basic-Treffer auf einer Außenwette.
- Der zweite normale Tisch benötigt zwei solche Treffer; kein zusätzlicher Chip ist vor dem ersten Shop erforderlich.
- Zwei Basic-Chips auf derselben Außenwette benötigen beim Boss drei gemeinsame Treffer. Upgrades können das verbessern.
- Rechnerische Orientierung bei unverändertem Rad und gleichbleibender Außenwette: erster Tisch ca. 96 %, zweiter normaler Tisch ca. 86,4 %, High Stakes ca. 45,1 %. Beim Boss mit zwei Basic-Chips und 21 Feldern ca. 64,1 %. Das sind theoretische Chancen unter diesen konkreten Bedingungen, keine Sieggarantie oder abgeschlossene Langzeit-Balance.

## Boss besser erkennbar
- Größere, rot-goldene Krone mit dauerhaftem FLOOR-BOSS-Schild auf der Map – ohne Hover sichtbar.
- Vor dem Boss wechselt die Map zur klaren Warnung „Als Nächstes: Floor-Boss Double Zero“ und bekommt einen farbigen Rahmen.
- Die Aktion heißt „Boss herausfordern“. Name, Ziel, Spins und Sonderregel stehen in der Vorschau.
- Der letzte Shop warnt ausdrücklich vor dem nächsten Boss und nennt 120 Punkte, sieben Spins und zwei zusätzliche Nullfelder.
- Am Tisch: BOSS AKTIV im Kopfbereich, farbiger Tischrahmen und ein festes Double-Zero-Banner oberhalb des Rades.
- Das Banner nennt die tatsächliche Anzahl der Nullfelder und deren aktuellen Radanteil. Es bleibt während und zwischen Spins sichtbar und verschwindet bei Sieg/Niederlage.
- Neustart setzt Chips, Ziele und Bossdarstellung zurück.

## Geprüft
- 56 Logikprüfungen bestanden. Bisherige Scoring-Tests verwenden ausdrücklich zusammengestellte Test-Builds; neue Tests prüfen den echten Start mit einem Basic.
- Browser: erster Tisch mit Außenwette, zweiter Tisch, Rekrutierung im Shop, Bosswarnungen, Bosskampf, Sieg und Neustart; keine JavaScript-Fehler.
- Bossansicht bei 1440 × 900, 1366 × 768, 1366 × 600, 1100 × 650 und 390 × 844 geprüft. Keine Überschneidung mit dem Inventar und auf den geprüften PC-Größen kein Seitenscrollen.
- Tests starten: node --test tests/*.test.cjs

Direkt im Projekt dem Projektordner aktualisiert. Zum Laden im Browser Strg + F5 drücken.

---
## Historie – frühere Startaufstellungen und Zielwerte sind oben ersetzt
# Roguelette – Startbildschirm, Karten-Shop und Symbol-Map

## Startbildschirm
- Eigener Titelbildschirm mit Roulette-Rad, Kartenfächer, Chips und langsam animiertem Rad.
- Run starten, Spielregeln und – bei einem laufenden Run – Weiterspielen.
- Hauptmenü über ☰ oder das Roguelette-Logo erreichbar. Während eines Spins gesperrt.
- Weiterspielen behält den laufenden Run in dieser Sitzung. Neustart ist als „Run verwerfen“ gekennzeichnet. Neuladen speichert den Run weiterhin nicht.
- Animation berücksichtigt die Systemeinstellung für reduzierte Bewegung.

## Karten-Shop
- Vier visuelle Angebotskarten statt einer Textliste: Rad-Item, Relic, Mutation und Chip.
- Eigene SVG-Symbole, farbige Kartenränder, Preisschilder, Auswahlbewegung und Verkauft-Markierung.
- Hover und Tastaturfokus zeigen die Kartenbeschreibung. Anklicken oder Antippen öffnet den Kaufbereich.
- Karte auswählen, erforderlichen Zielchip oder Ersatzplatz wählen, dann bewusst kaufen.
- Relics kosten 14 Münzen, Mutationen 10, Chips 8. Rad-Items weiterhin je nach Seltenheit 8/12/16/20.
- Mutationen ohne geeigneten Zielchip und bereits besessene Relics werden beim Erstellen der Angebote ausgelassen.
- Volle Inventare erlauben einen ausdrücklich gewählten Ersatz. Ersetzte Chips verlieren ihre Mutationen; belegte Expanded-Zusatzplätze bleiben geschützt.
- Kaufprüfung erfolgt vor Änderungen: Bei fehlenden Münzen, ungültigem Ziel oder doppeltem Relic bleiben Guthaben und Build unverändert.
- Rerolls kosten weiterhin 3, 5, 7 usw. Münzen und setzen sich je Shop zurück.
- Münzstand, belegte Item-/Relic-Plätze, neue Karten und Rückkehr zur Map sind sichtbar.

## Symbol-Map
- Räume als gezeichnete Symbole: Roulette-Tisch, High-Stakes-Diamant, Laden, Werkstatt, Fragezeichen und Bosskrone.
- Verbindungslinien zeigen die tatsächlichen Wege. Besucht und erreichbar haben unterschiedliche Hervorhebungen.
- Hover, Tastaturfokus oder Antippen zeigt Name, Punkteziel, Spins, Münzgewinn beziehungsweise Raumregeln im Detailbereich.
- „Betreten“ startet nur einen tatsächlich erreichbaren Raum. Spätere und übersprungene Räume bleiben gesperrt, können aber angesehen werden.
- Kompakte Legende; keine dauerhaften Erklärungstexte an jedem Raum.

## Belohnungsauswahl entfernt
- Gewonnene Tische geben automatisch Münzen, danach führt „Weiter zur Map“ direkt zur Route.
- Kein Auswahlfenster für Chips, Mutationen, Rad-Items oder Relics mehr nach Tischen oder Boss.
- Diese Build-Upgrades sind jetzt im Shop kaufbar. Die optionale Werkstatt bleibt ein eigener Raum mit einem kostenlosen Werkzeug.
- Hilfe und Inventarhinweise wurden an den neuen Ablauf angepasst.

## Prüfung und Dateien
- 52 Logikprüfungen bestanden, einschließlich Kauftransaktionen, Zielauswahl, doppelten Relics, Expanded und dem Wegfall der Tischbelohnungen.
- Browserdurchlauf: Startmenü, Hilfe, Fortsetzen, Map mit Hover und Touch, Relic- und Mutationskauf, Ereignis, letzter Shop, Boss und Neustart; keine JavaScript-Fehler.
- Sieben PC-Größen bis 1366 × 600 mit verteilten und gestapelten Chips geprüft. Startbildschirm und Map zusätzlich auf Tablet und 390 Pixel breitem Handy geprüft.
- Shop auf Desktop und Mobil visuell geprüft; Preisschilder verdecken keine Kartennamen.
- Projekt direkt in dem Projektordner aktualisiert. Browser mit Strg + F5 neu laden.
- Tests: node --test tests/*.cjs

Der Umfang bleibt der erste Casino-Floor. Weitere Floors, Slot-Machine, aktiver Luck-Einfluss und gespeicherte Runs sind weiterhin offen.

Visuelle Referenz für die Karten-Auslage: [Balatro-Shop-Screenshot bei Nintendo Life](https://www.nintendolife.com/games/switch-eshop/balatro). Die verwendeten Grafiken sind eigene SVG-/CSS-Elemente; es werden keine fremden Spielgrafiken geladen.

---
## Historie – frühere Angaben zur Belohnungsauswahl und zum Shop sind oben ersetzt
# Neu in diesem Update: größere UI und erster spielbarer Floor

## Größere PC-Oberfläche
- Chips auf regulären PC-Fenstern 54 statt 44 Pixel, ab 800 Pixel Fensterhöhe 62 Pixel; bei niedrigen Fenstern 48 Pixel.
- Größere Namen, Zielanzeige, Spins, Punkteaufschlüsselung, Statusmeldungen, Rad-Items und Drehbutton. Breitere Seitenleiste.
- Pokerfilz, gedrucktes Wettfeld und physische Chip-Optik bleiben erhalten.
- Auf sehr niedrigen PC-Fenstern lassen sich viele Chips auf einer Zahl innerhalb des Feldes seitlich scrollen.

## Rundenablauf: Floor 01 – Casino
Der erste Tisch startet direkt. Nach dem Sieg: genau eine Build-Belohnung wählen oder überspringen, anschließend einen erreichbaren Raum auf der Map wählen. Jede Station ist mit allen Stationen der nächsten Reihe verbunden. Vergangene Räume und übersprungene Alternativen sind gesperrt.

| Reihe | Räume | Regeln |
| --- | --- | --- |
| 1 | Ankommen | 100 Punkte, 5 Spins, 10 Münzen |
| 2 | Grüner Tisch / High Stakes | 250 Punkte, 5 Spins, 10 Münzen / 450 Punkte, 4 Spins, 20 Münzen |
| 3 | Händler / Werkstatt | Einkaufen / ein kostenloses Duplicate oder Repaint |
| 4 | Letzter Einsatz / verschlossene Kasse | 550 Punkte, 5 Spins, 15 Münzen / Ereignis |
| 5 | Letzter Halt | Garantierter Shop vor dem Boss |
| 6 | Double Zero | 900 Punkte, 5 Spins, 30 Münzen und zwei temporäre Nullfelder |

- Die Map zeigt aktuellen Raum, abgeschlossene Räume, erreichbare Räume und spätere Stationen. Sie lässt sich über den Kopfbereich erneut öffnen.
- Chips, Mutationen, Relics, Streak, Inventar und verändertes Rad bleiben zwischen Räumen erhalten.
- Raumaktionen, Spins und Belohnungen sind durch den jeweiligen Zustand gesperrt; keine wiederholten Auszahlungen.
- High Stakes gibt mehr Münzen, aber weiterhin genau eine Build-Belohnung.

## Run-Münzen und Shop
- Münzen gibt es einmal pro gewonnenem Tisch. Sie sind ausschließlich Shop-Währung, keine Wetteinsätze.
- Jeder Shop bietet drei verschiedene zufällige Rad-Items direkt zum Kauf an.
- Preise nach Seltenheit: Common 8, Uncommon 12, Rare 16, Epic 20.
- Gekaufte Angebote sind ausverkauft. Ein volles Inventar oder zu wenig Münzen verhindert den Kauf ohne Abzug.
- Angebote neu würfeln kostet zuerst 3, danach 5, 7 usw. Münzen. Der Preis setzt sich im nächsten Shop zurück.
- Werkstatt: ein kostenloses Duplicate oder Repaint mitnehmen, sofern ein Platz frei ist. Das Zielfeld wird am nächsten Tisch gewählt. Überspringen ist möglich.
- Ereignis: sicher +6 Münzen oder Risiko mit 50 % auf +18, sonst Verlust von bis zu 8 Münzen. Das Guthaben fällt nie unter null. Jede Entscheidung ist einmalig.

## Boss und Abschluss
- Double Zero ergänzt genau zwei temporäre grüne Nullfelder. Das erhöht die Null-Chance abhängig vom gebauten Rad.
- Rad-Items bearbeiten beim Boss weiterhin die permanenten Felder. Die zusätzlichen Bossfelder sind gesperrt und markiert. Normale Änderungen bleiben erhalten.
- Sieg und Niederlage entfernen die temporären Felder zuverlässig.
- Nach Boss-Sieg und Belohnung endet der Floor mit Raumanzahl, Gesamtpunkten, stärkstem Spin, Münzen, Chips, Mutationen und Relics.
- Neuer Run setzt den kompletten Run zurück.

## Umfang und offene Roadmap
Dieser Stand ersetzt die bisherige endlose Tischfolge durch einen festen ersten Floor. Teile der Aufgaben 54 und 63–76 sowie Double Zero aus 82 sind umgesetzt. Shop und Werkstatt sind bewusst erste Versionen mit direkten Rad-Items. Aufgaben 55–62 (Slot Tokens, Slot-Machine, Rarity-Rolls und Luck-Einfluss), zufällig erzeugte Maps, weitere Events, Floors 2/3, Penthouse, The House, Endless und Speichern bleiben offen. Lucky verändert weiterhin keine Zufallschancen. Der Casino-Floor ist noch kein vollständiger Sieg über The House.

## Prüfung
- PC-Tisch bei sieben Größen von 1100 × 650 bis 1920 × 1080 sowie 1366 × 600 geprüft; gestapelte und verteilte Chips bleiben bedienbar, ohne Seitenscrollen des Dokuments.

- 47 Logikprüfungen inklusive bisheriger Chips, Mutationen, Rad-Items und Relics sowie neuer Map-, Shop-, Ereignis- und Boss-Prüfungen.
- Zwei vollständige Browser-Routen über Shop/Tisch und Werkstatt/Ereignis bis zum Boss-Sieg und Neustart.
- Responsive Map bei 390, 768, 1100 und 1440 Pixel Breite; keine JavaScript-Fehler.
- Starten: index.html öffnen beziehungsweise im bereits geöffneten Spiel Strg + F5 drücken.
- Logiktests: node --test tests/*.cjs

---
## Historischer Stand vor diesem Update (abweichende Abläufe oben ersetzt)
# Roguelette Stand 28.09.2026

## Neu: Relics, Aufgaben 45 bis 53

### Inventar und Erhalt
- Vier sichtbare Relic-Plätze oberhalb des Tisches, in Auswertungsreihenfolge von links nach rechts.
- Relics sind die vierte Option im Belohnungsfenster neben Mutation, Chip und Rad-Item. Weiterhin nur eine Belohnung je gewonnenem Tisch.
- Angebote überspringen bereits ausgerüstete Relic-Typen. Jeder Typ kann einmal im Build vorkommen.
- Bei vier belegten Plätzen muss ein konkretes Relic zum Ersetzen gewählt werden. Das neue Relic bleibt an dessen Position; kein stilles Überschreiben.
- Relics bleiben zwischen Tischen erhalten und werden bei einem neuen Run zurückgesetzt.

### Die fünf Effekte
| Relic | Bedingung und Wirkung |
| --- | --- |
| Blood Pact | Bei Rot: aktueller Spin-Score x1,5. Entscheidend ist die tatsächliche Farbe des Radfelds, auch nach Repaint. |
| Lucky Seven | Bei einer 7: jeder gewinnende Chip einmal zusätzlich. Chip-Effekt, Streak-Bonus und Polished gelten. Keine neuen Echo-Würfe und kein weiterer Streak-Zuwachs. |
| Lone Wolf | Genau ein gewinnender Chip: aktueller Spin-Score x3. Zusatzwertungen durch Echo oder Lucky Seven zählen nicht als weitere Gewinner. |
| Full Coverage | Alle vier Wettarten benutzt und mindestens ein Treffer: aktueller Spin-Score x1,5. Die Gruppen sind Zahl, Farbe, Gerade/Ungerade und Low/High. Rot und Schwarz zählen beispielsweise zusammen als eine Wettart. |
| Jackpot | Mindestens zwei gesetzte Chips und alle gewinnen: aktueller Spin-Score x2. Ein einzelner gesetzter Chip genügt nicht. |

### Reihenfolge und Verwaltung
- Chips inklusive Mutationen werden zuerst gewertet; anschließend jedes Relic in seiner Position von links nach rechts; Null x0,75 zuletzt.
- Lucky Seven addiert eine zusätzliche Chip-Summe an seiner jeweiligen Stelle. Frühere Relic-Multiplikatoren werden nicht rückwirkend darauf angewandt. Beispiel bei einer roten 7 und 100 Chip-Punkten ohne Echo: Blood Pact vor Lucky Seven ergibt 250, umgekehrt 300.
- Relic antippen öffnet Effekte, Bedingungen und Links-/Rechts-Buttons. Ablegen entfernt das Relic aus dem aktuellen Run.
- Verschieben und Ablegen sind während eines Spins sowie nach einer Niederlage gesperrt. Informationen bleiben lesbar.
- Ausgelöste Relics werden markiert und erscheinen in der kompakten Spin-Auswertung.

### Nachvollziehbare Spin-Rechnung
- Klick auf Letzter Spin öffnet Chip-Einzelwerte inklusive Echo, Chip-Summe, alle Relics in der tatsächlich verwendeten Reihenfolge, nicht ausgelöste Bedingungen, Null-Effekt und Endergebnis.
- Verschieben oder Ablegen nach einem Spin verändert dessen aufgezeichnete Rechnung nicht. Der neue Aufbau gilt ab dem nächsten Spin.
- Erst der finale Spin-Score wird auf zwei Nachkommastellen gerundet.

### Aktuell geprüft
- 42 Logikprüfungen insgesamt (11 bisherige Basisprüfungen, 16 Mutations-/Itemprüfungen, 15 neue Relic-Prüfungen).
- Relic-Tests umfassen Reihenfolge, Farbänderungen, begrenzte Retrigger, Full-Coverage-Gruppen, Jackpot-Mindestanzahl, Null-Auswertung, vier Inventarplätze, doppelte Relics, Ersatzpositionen und unveränderte historische Auswertungen.
- Browserdurchlauf mit allen fünf Relic-Belohnungen, Ersatz bei vollem Inventar, Links-/Rechts-Steuerung, Ablegen, mobiler Infoansicht und Sperren während der echten Spin-Animation bestanden. Keine JavaScript-Fehler.
- Vorhandene Browserprüfungen für Runde, Neustart und Wetten bestehen. Kompakte Desktopgrößen einschließlich 1366 x 600 und 1100 x 650 sowie Handy-/Tablet-Breiten sind weiterhin geprüft.


## Vorheriger Block: Aufgaben 27 bis 44
Roadmap-Aufgaben 27 bis 44: Mutationen, veränderbares Rad und Consumable-Inventar. Die bereits vorhandene Rad-Darstellung wurde dafür erweitert und mit den Zahlenwetten gemeinsam aktualisiert.

### Vier kombinierbare Mutationen
- Polished: Punkte dieses Chips x1,5, nach dessen normalem Spezialeffekt und Streak-Bonus.
- Echo: 25 Prozent Chance auf genau eine zusätzliche Wertung eines gewinnenden Chips. Kein rekursiver Trigger, kein zweiter Streak-Zuwachs. Echo erscheint in der Spin-Auswertung.
- Lucky: +1 Luck je aktivem Lucky-Chip, sichtbar im Run. Roulette-Wahrscheinlichkeiten bleiben unverändert. Der spätere Einfluss auf Slot Tokens ist noch nicht implementiert.
- Expanded: +1 Platz je aktivem Expanded-Chip, zusätzlich zu den sechs Basisplätzen. Der Platz bleibt zunächst leer und kann durch eine Chip-Belohnung gefüllt werden. Beim Entfernen des Trägers fällt der Platz weg.
- Mehrere unterschiedliche Mutationen können gleichzeitig auf einem Chip liegen. Dieselbe Mutation wird nicht doppelt vergeben. Mutationen und Streak bleiben zwischen Tischen erhalten.
- Badges am Chip, Mutationsnamen in der Chip-Info und vollständige Beschreibungen unter Chip-Details.

### Belohnungen als spielbarer Zugang
Nach jedem gewonnenen Tisch: genau eine von drei Belohnungen auswählen (Mutation, Chip oder Rad-Item). Das System bietet zunächst deterministisch wechselnde Angebote; kein Rarity-Roll und kein Shop.
- Mutationen wechseln in der Reihenfolge Polished, Echo, Expanded, Lucky.
- Rad-Items wechseln in der Reihenfolge Duplicate, Repaint, Delete, Rewrite, Clone, Mitosis.
- Mutation: Zielchip auswählen; bereits vorhandene Mutationen sind gesperrt.
- Chip: freien Platz füllen oder einen vorhandenen Chip bewusst ersetzen. Ersetzen entfernt dessen Mutationen. Ein belegter Expanded-Zusatzplatz darf dabei nicht versehentlich verloren gehen.
- Item: in einen freien Platz legen oder bei vollem Inventar eines der vorhandenen Items ausdrücklich ersetzen.
- Belohnungsfenster schließen ändert die Angebote nicht. Wiederöffnen oder Überspringen ist möglich. Pro Tisch gibt es nur eine Belohnung.

### Chip-Verwaltung
- Startaufstellung weiterhin vor dem ersten Spin ohne gesetzte Wetten verfügbar.
- Danach zeigt Chip-Details die normalen Effekte und alle Mutationen.
- Chips können ohne gesetzte Wetten abgelegt werden. Der letzte Chip bleibt geschützt. Luck und Platzlimit werden neu berechnet.
- Gleiche Chip-Typen aus Belohnungen sind erlaubt. In Zielauswahl und Details werden sie bei Bedarf mit Platznummern unterschieden.
- Dynamische freie Plätze und bei großen Builds eine horizontal scrollbare Chip-Reihe am PC. Tastatur 1 bis 9 wählt nach aktueller Inventarposition.

### Sechs benutzbare Rad-Items
- Duplicate (Common): dupliziert ein ausgewähltes Feld.
- Repaint (Common): wechselt Rot und Schwarz. Die Null bleibt grün.
- Delete (Uncommon): entfernt ein Feld, solange mindestens sechs Felder übrig bleiben.
- Rewrite (Uncommon): ändert ein Feld auf eine Zahl von 0 bis 18. Mehrere gleiche Zahlen sind erlaubt. Null wird grün; bei sonstigen Zahlen bleibt die bestehende Farbe erhalten. Wird eine grüne Null zu einer anderen Zahl, erhält sie deren anfängliche Rot/Schwarz-Farbe.
- Clone (Rare): erst Quellfeld, dann Zielfeld wählen; das Ziel wird durch eine unabhängige Kopie ersetzt.
- Mitosis (Epic): dupliziert alle aktuell vorhandenen Felder der gewählten Zahl.

### Inventar und Werkstatt
- Zwei Item-Plätze rechts am Tisch. Leere Plätze, Name und Benutzbarkeit sind sichtbar.
- Werkstatt zeigt jedes tatsächliche Radfeld einzeln, inklusive vorhandener Duplikate. Auswahl ist vor Anwendung sichtbar und zurücksetzbar.
- Ein Item wird nur nach einer gültigen, bestätigten Anwendung verbraucht. Schließen, ungültige Ziele und verletzte Grenzen verbrauchen nichts.
- Radgröße begrenzt auf 6 bis 38 Felder. Beide Grenzen werden im Fenster genannt.
- Rad und Zahlenwetten aktualisieren sich gemeinsam ohne doppelte Listener. Bei mehr als 28 Feldern werden am kleinen Rad wechselnde Zahlen durch Punkte ersetzt; alle Felder und Zahlen bleiben in der Werkstatt einzeln sichtbar.
- Zahlenfelder zeigen Kopienzahl und per Tooltip ihren tatsächlichen Anteil am Rad. Gemischte Farben derselben Zahl erhalten eine gestreifte Darstellung.
- Chips auf einer vollständig entfernten Zahl kehren automatisch zurück. Alle weiterhin gültigen Wetten bleiben liegen.
- Während des Spins sind Radänderungen und Chip-Verwaltung gesperrt. Beim neuen Run werden Rad, Items, Mutationen, Luck und Chips zurückgesetzt.

## Prüfung
- PC-Tisch bei sieben Größen von 1100 × 650 bis 1920 × 1080 sowie 1366 × 600 geprüft; gestapelte und verteilte Chips bleiben bedienbar, ohne Seitenscrollen des Dokuments.
en des vorherigen Blocks
- 27 automatisierte Logikprüfungen: bisherige Regeln plus Mutationenkombinationen, Echo-Grenze, Null-Auswertung, Belohnungssperren, Expanded, Inventargrenzen, alle Rad-Items und atomare Fehlerfälle.
- Browserdurchläufe über zwei Runs mit insgesamt 18 gewonnenen Tischen: Belohnungen, mehrere Mutationen auf einem Chip, acht aktive Chips, Slotverlust und Luck-Änderung, jedes Rad-Item, voller Item-Speicher und mobile Werkstatt.
- PC-Layout bei sieben Größen, bis hinunter zu 1366 x 600, mit verstreuten und gestapelten Chips ohne Seitenscrollen. Erweiterter Build zusätzlich bei 1366 x 600, 1366 x 650 und 1440 x 900 geprüft.
- Bestehende Browserprüfungen für Sieg, Niederlage, Neustart, Hilfe und vier responsive Breiten bestanden; keine JavaScript-Fehler.

## Nächster Roadmap-Block
Aufgaben 54 bis 62: Run-Währung, Slot Tokens, Slot-Machine, Rarity-Pools und Luck-Einfluss. Anschließend Shop und Map. Zero und Gambler bleiben vorbereitete Chips ohne aktiven Spezialeffekt.

## Starten und testen
index.html im Browser öffnen. Nach einem Update Strg + F5 verwenden.
Die Logiktests benötigen nur Node.js: node --test tests/core.test.cjs tests/game.test.cjs tests/relics.test.cjs

## V1.5.1 – Bestehendes Spiel poliert

Kontinuierliche Roulette-Kurve statt linearer Geschwindigkeitsstufen, eine Landung, synchronisierte Klicks, kurze begrenzte Score-Auswertung und dezente Interaktionen. Alte Rad-Transition und redundante Flash-/Transfer-Effekte entfernt. Keine neuen Gameplay-Systeme. Regressionen für zehn Spins und die mathematische Bewegungskurve ergänzt. Physischer iPad-Safari-Test für Bildrate/Audio bleibt offen.

## V1.6 – First-Time User Experience

Kurze überspringbare Einführung im ersten echten Run, gespeicherte einmalige Konzeptkarten, zustandsgetreue Wettvorschau, sichtbares Tischziel/Restpunkte/Spins und gegliedertes Tischbuch umgesetzt. Kein neues Gameplay und keine Balanceänderung. Weiter offen: echte Erstspieler beobachten (insbesondere Punktespannen großer Builds) und physisches iPad Safari testen.

## V1.6.1 – Ruhiger Tisch

Automatische Wettvorschauen und Entdeckungskarten über dem Rad im normalen Spiel entfernt. Vorschau weiterhin in der Chip-Info; kurze Erst-Run-Einführung und Raumhinweise bleiben. Spin-Zeile auf SPIN ↗ verkürzt; Plus-Punkte bleiben auch bei großen Zahlen einzeilig. Auf WebKit in 1180×600, 1366×768 und 390×844 geprüft.

## V2.0 – Die Roulette-Maschine

13 Chips, 10 Relics, 3 Mutationen, 4 Feldmarkierungen/Werkzeuge, 9 benannte Verbindungen, 8 Tischregeln ab Floor 2, 8 Events, 5 Herausforderungen und eine persistente Sammlung. Details: CONTENT-V2.md.
