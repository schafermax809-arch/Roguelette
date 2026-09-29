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

Direkt in C:\Users\repin\Desktop\chat aktualisiert. Zum Laden Strg + F5 drücken.

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

Direkt im Projekt C:\Users\repin\Desktop\chat aktualisiert. Zum Laden im Browser Strg + F5 drücken.

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
- Projekt direkt in C:\Users\repin\Desktop\chat aktualisiert. Browser mit Strg + F5 neu laden.
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







