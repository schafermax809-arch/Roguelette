# Roguelette — V1.0

Ein Roulette-Roguelike im Stil eines gezeichneten Pokertischs. Baue deinen Run mit Chips, Relics und seltenen Mutationen auf und fordere The House heraus.

## Spielen

Repository herunterladen und `index.html` in einem aktuellen Browser öffnen oder den Ordner mit einem lokalen Webserver bereitstellen. Kein Build und keine Installation erforderlich.

## Features

- Vier Floors mit verzweigter Map, Shops, Ereignissen, Werkstätten und Bossen
- 16 Chips und 12 Relics inklusive freischaltbarer Inhalte
- Token-Slot mit Chips, Relics und Rad-Items
- The House mit drei Boss-Phasen und anschließendem Endless-Modus
- Achievements, Bestwerte und automatisches Speichern mit Backup-Wiederherstellung
- Responsive Oberfläche, Tastaturbedienung und optionale Sounds

Der Spielstand wird lokal im Browser gespeichert und gilt für dieselbe Spieladresse. Browserdaten löschen entfernt den Spielstand. Es gibt keinen Cloud-Sync.

## Tests

Mit Node.js 22 oder neuer:

```sh
node --test tests/*.test.cjs
```

83 Test-Runner-Fälle bestanden. Die mitgelieferten Tests benötigen keine zusätzlichen Pakete. Lokale Browser-QA-Skripte mit maschinenspezifischen Pfaden sind nicht Teil dieses Pakets.

## Entwicklungsstand

Siehe [ROADMAP-STAND.md](ROADMAP-STAND.md) für die genaue Feature-Liste und bisherige Entwicklung.
