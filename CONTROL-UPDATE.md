> Historischer Bericht für 2.1. Seit 2.2 hat der Shop drei garantierte Sofort-Tokens und ein zufälliges Werkzeug. Die folgenden 700 Simulationsruns beziehen sich auf die frühere Shopverteilung und sind keine Messung von 2.2.

# Roguelette 2.1 – Build-Kontrolle und Klarheit

Stand: 01.10.2026. Fokussierter Ausbau der vorhandenen 33 Chips, 26 Relics, 7 Mutationen und 10 Rad-Werkzeuge. Keine zusätzliche Währung, keine höheren Bosswerte und keine permanenten Startboni.

## Ausgangspunkt und Architektur

Vor den Änderungen wurden HTML, sämtliche CSS-Schichten, Modell, Erweiterung, Präsentation, Einführung, Dokumentation und Tests geprüft. 148 Modelltests bestanden. Der bestätigte Ausgangszustand hatte gemischte Slots ohne regelmäßige gezielte Beschaffung, eine unvollständige Regelverteilung, zu großzügig benannte Tag-Verbindungen und kaum vergleichbare Radinformationen. Bei kurzen Ansichten konkurrierten Einführung und Wettvorschau um dieselbe Fläche.

`script.js` bleibt das verbindliche Zustands-/Transaktionsmodell. `depth.js` ergänzt Effekte, Regeln und Events. `feel.js`, `depth-ui.js` und `onboarding.js` präsentieren dieses Modell; UI-Animationen vergeben keine Ergebnisse. Werkzeug- und Eventvorschauen rechnen auf Kopien. Neue Metadaten werden aus den bestehenden Katalogen abgeleitet.

## 1. Umfang der elf Bereiche

Alle elf Bereiche wurden bearbeitet: Tokens, Wettvorschau/Zustände, Synergie-Wahrheit, Regelverteilung, Simulation/Balance, Radinformationen, optionaler Bonuswurf, Bossvorbereitung, Events, Pacing und Sammlung/technische Konsolidierung. Der Bonuswurf ist bewusst ein kleiner schaltbarer Prototyp. Menschliche Zeitmessungen und Hardwareprüfungen werden nicht durch Bot-Daten ersetzt.

## 2. Tokens

- Gemischter Slot: unverändert 55 % Chip, 25 % Relic, 20 % Rad-Werkzeug; Grundpreis 6.
- Chip Token: garantiert einen Chip, Grundpreis 8.
- Relic Token: garantiert ein Relic, Grundpreis 10.
- Rad Token: garantiert ein Werkzeug, Grundpreis 8.
- Seltenheit, Luck, Ausschluss bereits gehaltener Relics und seltene vorgeprägte Mutationen verwenden die bisherigen Regeln.
- Shop: zwei gemischte Sofort-Slots, ein garantierter Typ-Token und ein sichtbares Werkzeug. Bestehende Platzmarke separat. Typ-Token-Aufpreis steigt je Floor bis +3. Der Beutel fasst weiterhin drei Tokens.
- Typ-Tokens werden gekauft und bewusst geöffnet. Ein Ergebnis bleibt bei vollem Inventar offen, bis ausdrücklich ersetzt oder verworfen wird. Reload würfelt es nicht neu.
- Manche neu erzeugten normalen Räume enthalten ein seltenes Rad-Token-Angebot als Siegprämie (15 %; freier Beutelplatz erforderlich). Erfüllte Tiefen-Herausforderungen gewähren höchstens einmal pro Run einen Typ-Token; bei vollem Beutel bleibt dieser Anspruch offen.
- Kein Mutations-Token: zufällige Vorprägungen, bestehende Werkstatt und Events behalten ihre Rolle.

## 3. Gezielter Build-Aufbau

Der regelmäßige Typ-Token, bekannte Werkzeuge und bossabhängige Vorbereitungsangebote schaffen planbarere Entscheidungen. Vor dem Kauf sind garantierte Kategorie, Seltenheitsgewichte, Luck und Platzlage einsehbar. Werkzeug- und Eventvorschauen zeigen tatsächliche Folgen vor der Bestätigung. Volle Inventare werden niemals still überschrieben.

## 4. Synergien

Sechs bestehende Kombinationen mit eigener Berechnung heißen SONDERBONUS. Neun Verbindungen ohne zusätzliche Auszahlung heißen ZUSAMMENSPIEL. Beide zeigen konkrete beteiligte Chips/Relics statt Beschreibungstext-Suche.

Goldschleife, Glühwerk, Gravur, Null-Uhr, Paritätsantrieb, Bereichsantrieb, Chaosdruck, Spätschicht und Farbfaden verlangen konkrete passende Komponenten und gegebenenfalls Markierungen. Beispielsweise ist Velvet + Switchback allein keine Serien-Verbindung mehr. Ein passender Name löst keinen neuen Multiplikator aus. Entdeckungen werden gespeichert und nur einmal angezeigt.

## 5. Verteilung der Tischregeln

Ab Floor 2 zieht jeder geeignete normale Tisch aus einer pro Floor gemischten Liste aller acht Regeln. Innerhalb eines Floors gibt es keine Wiederholung. Einstiegstische, Floor 1 und Bossregeln bleiben geschützt. Die erzeugte Karte speichert ihre Regelzuordnung; Laden würfelt sie nicht neu.

## 6. Erreichbarkeit

Alle acht Regeln einschließlich „Zwei Takte“ sind in regulären Runs erreichbar. Der Modelltest prüft 400 Karten, Wiederholungsfreiheit, Boss-/Einstiegsschutz und Save-Roundtrips. Vorhandene alte Karten erhalten keine nachträglich eingewürfelten Regeln.

## 7. Rad- und Wettinformationen

Werkzeuge zeigen vorher/nachher: Feldzahl, Anteil der gewählten Zahl als Bruch und Prozent, Rot/Schwarz/Grün, markierte Felder und verschiedene Zahlen. Hinzu kommen relevante Auswirkungen für Carbon, Engraver, Closed Circuit, Prism Seal und Workshop Seal. Die Inspektion zeigt dieselbe Zusammenfassung und die einzelnen physischen Felder.

Die kontextuelle Wettvorschau verwendet die echte Auflösung auf Zustandskopien: Chance, Punktespanne, fehlendes Tischziel, verbleibende Spins und aktive Tischregel. Patient, Velvet, Last Light, Streak und Wechselbedingungen erhalten temporäre Zustandsangaben. Die Vorschau verschwindet bei Scrollen, Dialogen oder Drehen; keine neue dauerhafte Erklärung über dem Rad.

## 8. Optionaler Bonuswurf

Einmal je Floor ab Floor 2 nach dem ersten gewonnenen normalen Nicht-Einstiegstisch. Die Raumprämie ist bereits gutgeschrieben. AUSZAHLEN beendet die Entscheidung ohne Risiko. Der freiwillige Wurf verwendet die eingefrorenen Wetten des Gewinn-Spins: trifft irgendeine, gibt es +4 Münzen; andernfalls gehen höchstens 2 Münzen verloren. Die genaue Trefferquote steht im Ticket.

Der Tisch bleibt gewonnen. Keine weiteren Chip-/Relic-Effekte, Serien, Punkte oder Flüche werden ausgelöst. Angebot und Auflösung werden gespeichert; Reload zahlt nicht doppelt aus. `PRESS_RULE.enabled` kann den Prototyp deaktivieren. Dies ist kein neuer Kampf und kein verpflichtender Zwischenschritt.

## 9. Bossvorbereitung

Der garantierte letzte Shop zeigt den kommenden Boss und passende Angebote: Double Zero → Rad Token/Rewrite; Taxman → Rad Token/Clone; Minimalist → Chip Token/Duplicate; The House → Relic Token/Boost. Double Zero zeigt die reale Nullquote mit seinen temporären Feldern. Taxman erklärt den Einsatzverlust, Minimalist die Drei-Chip-Grenze. The House zeigt die nächste Phase, Abzug und verbleibende Spins kompakt. Bosswerte bleiben unverändert.

## 10. Events

Goldschmied: zusätzlich garantierter Relic Token für 10 Münzen. Heizer: Markierung gegen Rad Token statt eines weiteren gleichen Münzverkaufs. Überdruck: zwei vorhandene Markierungen zu Boosted auf dem gewählten Feld verschmelzen; die zweite verbrauchte Markierung wird ausdrücklich genannt. Leerer Platz: Feldkopie und +5 Münzen kosten jetzt einen Spin am nächsten Tisch (Schuldenlimit 2). Dunkler Stempel erklärt die vollständige Cursed-Regel.

Alle Entscheidungen bleiben atomar, mit kostenlosem Ausgang. Feldwahl zeigt Position, Zahl, Farbe, Markierung und Anteil. Zufällige Änderungen werden als zufällig angekündigt; die Vorschau täuscht kein festes Ergebnis vor.

## 11. Pacing-Messung

700 deterministische Runs, sieben Strategien à 100, ohne freigeschaltete Startinhalte. Die Simulation kauft, öffnet Tokens, ersetzt, füllt Shops nach, benutzt Werkzeuge, besucht Events und löst echte Modell-Spins einschließlich Flüchen und Mutationen aus. Der Planer ist eine vereinfachte Ein-Schritt-Heuristik, keine optimale KI.

| Strategie | Erreichte Floors 1/2/3/4 | Siege | Spins je Tisch |
| --- | --- | --- | --- |
| Sicher | 100/55/37/23 | 20 | 3,36 |
| Präzision | 100/30/9/2 | 2 | 3,68 |
| Radbau | 100/19/1/0 | 0 | 3,88 |
| Ökonomie | 100/49/36/22 | 21 | 3,38 |
| Chaos | 100/52/33/20 | 16 | 3,42 |
| Null | 100/38/14/8 | 7 | 3,63 |
| Flexibel | 100/52/34/19 | 18 | 3,34 |

Etwa 36–48 % der ausgewerteten Tische enden mit nur einem positiven Spin. Serien wiederholen sich bei geeigneten Builds nicht zuverlässig. Das spricht für weitere Spieltests statt pauschal größerer Ziele. Erfasst sind außerdem Käufe, Restgeld, tote Angebote, erhaltene Inhalte, Werkzeuge, Ereignisse, Nachfüllen, Ersetzungen, Menü-Räume, erste Build-Entscheidung und Spins zwischen Build-Wechseln. Rohdaten: `tests/control-balance-report.json`. Häufigkeiten zählen erhaltene Token-Ergebnisse, auch später verworfene; keine Interpretation als Nutzungsstärke.

Es wurden keine menschlichen Sekundenwerte erfunden. Normale Routen und Spinbudgets bleiben erhalten. Wiederholte gleichartige visuelle Effekte werden zusammengefasst, höchstens sechs Zwischenschritte plus Ergebnis; die vollständige Detail-Auswertung bleibt abrufbar. Reduced Motion bleibt erhalten.

## 12. Begründete Balanceänderungen

Hot und Kiln lesen jetzt erfolgreiche Treffer derselben Zahl innerhalb des Raums. Kopierte gleichzahlige Hot-Felder teilen damit ihren Aufbau; die physische Tischregel-Hitze bleibt getrennt. Caps bleiben ×3 beziehungsweise ×2, Reset bleibt am Raumende.

Das isolierte, reproduzierbare Hitzeexperiment betrachtet 10.000 Räume à sechs Spins auf 19 Feldern: bei drei Kopien steigt die Zahl bereits aufgebauter Hot-Landungen von 1.124 (physisch) auf 3.083 (gleiche Zahl), bei sechs von 2.375 auf 10.129. Bei einem Hot-Feld bleibt der Wert identisch (432). Das misst Verfügbarkeit, keine Run-Gewinnrate; die vollständige Simulation endet manche Räume früher.

Die kostenlose Kombination aus Feldkopie und +5 Münzen im Event hatte vorher keinen unmittelbaren Preis und dominierte den Ausgang. Der zusätzliche nächste Spinverlust macht daraus einen ausdrücklichen Tausch. Cursed bleibt ×2 auch bei leerem Geldbeutel, erhebt aber nur vorhandenes Geld vor dem Spin; frisch ausgezahlte Raumprämien finanzieren keinen rückwirkenden Verlust. Ziele, Basiswerte und Bosse wurden nicht pauschal angehoben.

## 13. Technische Konsolidierung

`contentEntries()` leitet Seltenheit, Tags, Freischaltungen und Texte aus bestehenden Katalogen ab. Die Inspektion besitzt keine zweite Seltenheitsliste mehr. Quellen-IDs ersetzen Beschreibungssuchen. Gemeinsame Helfer liefern Radanteile, Build-Hinweise, Chip-Zustände, Bossvorbereitung und Tokeninformationen. Wirkungsberechnungen bleiben im Modell. Eine schrittweise Konsolidierung, kein riskanter Komplettumbau sämtlicher Kataloge.

## 14. Save-Kompatibilität

Version-1-Saves bleiben lesbar. Neue optionale Felder für Bonuswurf, bereits gewährte Herausforderungstokens und Sammlung bekommen Standardwerte. Alte Tokens bleiben gültig. Gespeicherte Karten/Regeln/Ergebnisse bleiben fest. Sammlung wird mit bestehenden lokalen Entdeckungen vereinigt und in Run-Backup/Autosave aufgenommen. Unbekannte Profileversionen geben keine neuen Tiefen-Freischaltungen frei. Ungültige Zustände werden zurückgewiesen; vorhandene Backup-Wiederherstellung bleibt bestehen.

## 15. Dateien

Spiel: `script.js`, `depth.js`, `depth-ui.js`, `feel.js`, `onboarding.js`, `index.html`, neu `control.css`.

Tests: neue `control.test.cjs`, `control-browser.cjs`, `control-rooms-browser.cjs`, `control-simulation.cjs`, `control-balance-report.json`, `heat-experiment.cjs`, `heat-experiment.json`; angepasste Erwartungen in Events/Map/Polish/Floors/Depth/Onboarding und bessere Safari-Fehlerdiagnose. Dokumentation: README, ROADMAP-STAND, CONTENT-V2 und dieser Bericht.

## 16. Prüfung

159 Modelltests bestanden. Die aktuellen Browser-Suiten decken WebKit und Chromium/Edge, Desktop, Telefon, kurze iPad-Ansichten, Touch, Reduced Motion, volle Inventare, alle Tokenarten, Reload, Map, Shop, Werkstatt, Radinspektion, Kontextvorschau, Bossvorbereitung, Fusion, Sammlung und den einmaligen Bonuswurf ab. `polish-browser`, `depth-browser`, `feel-browser` und `safari-viewport` bestanden ebenfalls. Die letzten Abschlussläufe bestanden: `control-browser` sechs Profile, `control-rooms-browser` vier Profile, `onboarding-browser` sechs Profile; jeweils in beiden Engines.

Schon im unveränderten Ausgangsstand scheiterten mehrere historische Browser-Skripte an veralteten Annahmen: drei Sofort-Slots, Drehen ohne Raumticket oder nur zehn Eventdefinitionen (`content`, `endless`, `floors`, `meta`, `penthouse`, `real-slot`, `build-systems`). Diese werden nicht als bestandene Tests ausgegeben. Der vollständige historische iPad-Sweep überschritt das Zeitlimit; die gezielte aktuelle Safari-Viewport-Matrix bestand. Modelltests und neue Ablaufprüfungen ersetzen keine Hardwaremessung.

## 17. Offene menschliche Prüfungen

Echtes iPad Safari mit ein-/ausfahrenden Browserleisten, Touch und Tastatur; subjektive Lesbarkeit und Tempo; langfristige Motivation des Bonuswurfs; tatsächliche Attraktivität garantierter Tokens; Spielstärke präziser und reiner Rad-Builds. Die schwache Radbau-Heuristik investiert früh in Werkzeuge statt ausreichend Chips und ist kein Beweis, dass menschliche Rad-Builds nicht gewinnen können. Shop-/Denkzeit und Build-Verständnis müssen mit Menschen gemessen werden.
