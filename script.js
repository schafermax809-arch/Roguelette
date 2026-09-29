"use strict";

// Rules and scoring are independent of the interface so later roadmap systems
// can build on the same evaluation without changing the controls.
const RULES = Object.freeze({ spins: 5, numberScore: 100, outsideScore: 20, zeroMultiplier: 0.75, spinDuration: 2400 });
const CHIP_TYPES = [
    { name: "Basic", symbol: "•", effect: "Der verlässliche Allrounder. Normale Punkte auf jeder Wettart." },
    { name: "Crimson", symbol: "♦", effect: "×1,5 Punkte auf ROT. Alle anderen Wetten bleiben unverändert.", bonus: "red", multiplier: 1.5 },
    { name: "Onyx", symbol: "●", effect: "×1,5 Punkte auf SCHWARZ. Alle anderen Wetten bleiben unverändert.", bonus: "black", multiplier: 1.5 },
    { name: "Sniper", symbol: "⊕", effect: "×3 Punkte auf eine einzelne Zahl. Kein Bonus auf Außenwetten.", bonus: "number", multiplier: 3 },
    { name: "Balance", symbol: "±", effect: "×1,5 Punkte auf GERADE oder UNGERADE.", bonus: "parity", multiplier: 1.5 },
    { name: "Streak", symbol: "0", effect: "+25 % pro aufeinanderfolgendem Treffer. Ein Verlust setzt die Serie zurück.", streak: 0 }
];
const HIGH_ROLLER = { name: "High Roller", symbol: "♛", effect: "×1,5 Punkte auf HIGH (10–18). Alle anderen Wetten bleiben unverändert.", bonus: "high", multiplier: 1.5 };
const ZERO_CHIP = { name: "Zero", symbol: "Ø", effect: "×6 Punkte auf die Zahl 0. Andere Wetten bleiben normal; Null-Abzug gilt weiterhin.", rarity:"Epic", special:"zero" };
const GAMBLER_CHIP = { name: "Gambler", symbol: "?", effect: "Zahlenwetten ×3,5. Außenwetten nur ×0,75.", rarity:"Epic", special:"gambler" };
const EXTRA_CHIPS = [
 {name:'Low Rider',symbol:'↓',effect:'×1,75 Punkte auf LOW (1–9).',bonus:'low',multiplier:1.75,rarity:'Uncommon'},
 {name:'Oddball',symbol:'⅓',effect:'×2 Punkte auf UNGERADE.',bonus:'odd',multiplier:2,rarity:'Rare'},
 {name:'Even Steven',symbol:'Ⅱ',effect:'×2 Punkte auf GERADE.',bonus:'even',multiplier:2,rarity:'Rare'},
 {name:'Anchor',symbol:'⚓',effect:'×2 Punkte auf jede Außenwette. Zahlenwetten bleiben normal.',special:'outside',rarity:'Rare'},
 {name:'Ember',symbol:'♨',effect:'×2,25 Punkte auf ROT.',bonus:'red',multiplier:2.25,rarity:'Rare',unlock:'red-five'},
 {name:'Repeater',symbol:'»',effect:'×4 Punkte auf Zahlenwetten.',bonus:'number',multiplier:4,rarity:'Epic',unlock:'same-three'},
 {name:'Royal',symbol:'♔',effect:'×2,5 Punkte auf jede gewonnene Wette.',special:'royal',rarity:'Legendary'}
];
const CHIP_CATALOG = [...CHIP_TYPES, HIGH_ROLLER, ZERO_CHIP, GAMBLER_CHIP, ...EXTRA_CHIPS];
const MUTATIONS = Object.freeze({
    Polished: { symbol: "✦", description: "×1,5 auf die Punkte dieses Chips, zusätzlich zum Chip-Effekt." },
    Echo: { symbol: "↻", description: "25 % Chance auf genau eine zusätzliche Wertung bei einem Treffer." },
    Lucky: { symbol: "♣", description: "+1 Luck für seltenere Token-Upgrades. Pro Luck: Common −2 Prozentpunkte, Rare +1, Epic +0,7 und Legendary +0,3 (bis 10 Luck). Roulette bleibt unverändert." },
    Expanded: { symbol: "+", description: "+1 Chip-Platz, solange dieser Chip im Build bleibt." }
});
const WHEEL_ITEMS = Object.freeze({
    Duplicate: { rarity: "Common", description: "Dupliziert genau ein gewähltes Radfeld." },
    Repaint: { rarity: "Common", description: "Wechselt ein Feld zwischen Rot und Schwarz. Null bleibt grün." },
    Delete: { rarity: "Uncommon", description: "Entfernt ein Feld. Mindestens 6 Felder bleiben erhalten." },
    Rewrite: { rarity: "Uncommon", description: "Ändert die Zahl eines Feldes auf 0–18. Gleiche Zahlen sind erlaubt." },
    Clone: { rarity: "Rare", description: "Ersetzt ein Zielfeld durch eine Kopie eines anderen Feldes." },
    Mitosis: { rarity: "Epic", description: "Dupliziert alle Felder mit der gewählten Zahl." }
});
const WHEEL_LIMITS = Object.freeze({ min: 6, max: 38 });
const RELIC_TYPES = Object.freeze({
    "Blood Pact": { symbol: "♥", className: "blood-pact", description: "Bei einem roten Ergebnis: aktueller Spin-Score ×1,5." },
    "Lucky Seven": { symbol: "7", className: "lucky-seven", description: "Bei einer 7: jeder gewinnende Chip wird einmal zusätzlich gewertet. Chip-Effekt und Polished gelten, Echo wird nicht erneut gewürfelt und die Streak wächst nicht erneut." },
    "Lone Wolf": { symbol: "♠", className: "lone-wolf", description: "Wenn genau ein gesetzter Chip gewinnt: aktueller Spin-Score ×3. Echo und Lucky Seven zählen nicht als weitere Gewinner." },
    "Full Coverage": { symbol: "⊞", className: "full-coverage", description: "Wenn alle vier Wettarten gesetzt sind und mindestens ein Chip gewinnt: aktueller Spin-Score ×1,5. Wettarten: Zahl, Farbe, Gerade/Ungerade und Low/High." },
    "Night Market": {symbol:'☾',className:'night-market',rarity:'Common',description:'Bei SCHWARZ: aktueller Spin-Score ×1,5.'},
    "Safety Net": {symbol:'⌗',className:'safety-net',rarity:'Uncommon',description:'Mindestens ein Gewinner und ein Verlierer: +30 Punkte an dieser Relic-Position.'},
    "Crowd": {symbol:'♟',className:'crowd',rarity:'Rare',description:'Mindestens drei gewinnende Chips: aktueller Spin-Score ×1,75.'},
    "Bullseye": {symbol:'◎',className:'bullseye',rarity:'Rare',description:'Mindestens eine gewonnene Zahlenwette: aktueller Spin-Score ×1,75.'},
    "Green Seal": {symbol:'Ø',className:'green-seal',rarity:'Epic',description:'Bei einem Treffer auf 0: aktueller Spin-Score ×2. Der Null-Abzug folgt danach.'},
    "Phoenix": {symbol:"ϟ",className:"phoenix",rarity:"Epic",unlock:"house-win",description:"In den letzten zwei Spins eines Tisches: Spin-Score ×1,5, wenn mindestens ein Chip gewinnt."},
    "Crown": {symbol:'♔',className:'crown',rarity:'Legendary',description:'Mindestens drei Wettarten gesetzt und ein Gewinner: aktueller Spin-Score ×2,5.'},
    "Jackpot": { symbol: "★", className: "jackpot", description: "Wenn mindestens zwei Chips gesetzt sind und alle gewinnen: aktueller Spin-Score ×2." }
});
const ACHIEVEMENTS=[
 {id:'red-five',name:'Rot läuft',reward:'Ember',type:'chip',goal:5,description:'Gewinne Chips in 5 Spins mit rotem Ergebnis.'},
 {id:'same-three',name:'Immer dieselbe Zahl',reward:'Repeater',type:'chip',goal:3,description:'Triff dieselbe Zahl in 3 Spins mit einer Zahlenwette.'},
 {id:'house-win',name:'Das Haus fällt',reward:'Phoenix',type:'relic',goal:1,description:'Besiege The House im normalen Run.'}
];
const START_LOADOUTS=Object.freeze({basic:Object.freeze({id:'basic',name:'Basic',chips:['Basic']})});
function normalizeProgress(value){
 const p={version:1,redWins:0,numberHits:{},houseVictory:false,unlocks:[]};
 if(value?.version===1){if(Number.isSafeInteger(value.redWins)&&value.redWins>=0)p.redWins=value.redWins;p.houseVictory=value.houseVictory===true;for(let n=0;n<=18;n++){const hits=value.numberHits?.[n];if(Number.isSafeInteger(hits)&&hits>=0)p.numberHits[n]=hits;}}
 p.unlocks=ACHIEVEMENTS.filter(a=>achievementProgress(p,a)>=a.goal).map(a=>a.id);return p;
}
function achievementProgress(p,a){return a.id==='red-five'?p.redWins:a.id==='same-three'?Math.max(0,...Object.values(p.numberHits)):p.houseVictory?1:0;}
function recordAchievementSpin(profile,spin,normalWon){const p=normalizeProgress(profile);if(spin?.winners>0&&spin.result.color==='red')p.redWins++;if(spin?.numberWinners>0){const n=spin.result.number;p.numberHits[n]=(p.numberHits[n]||0)+1;}p.houseVictory=p.houseVictory||normalWon;return normalizeProgress(p);}
function contentUnlocked(state,content){return !content.unlock||(state.unlocks||[]).includes(content.unlock);}
function betFamily(bet) {
    if (bet.type === "number") return "number";
    if (["red", "black"].includes(bet.value)) return "color";
    if (["odd", "even"].includes(bet.value)) return "parity";
    if (["low", "high"].includes(bet.value)) return "range";
    return null;
}
// Chip values are calculated once. Relics pass the running total left to right.
// Lucky Seven adds one frozen chip subtotal, never re-entering chip triggers.
function applyRelics(relics, context, initialScore) {
    let score = initialScore;
    const trace = [];
    for (const relic of relics) {
        const before = score;
        let triggered = false;
        let effect = "Keine Bedingung erfüllt";
        switch (relic.name) {
            case "Blood Pact":
                triggered = context.result.color === "red";
                if (triggered) { score *= 1.5; effect = "ROT · ×1,5"; }
                break;
            case "Lucky Seven":
                triggered = context.result.number === 7 && context.winners > 0;
                if (triggered) { score += context.retriggerScore; effect = "7 · +" + context.retriggerScore + " aus " + context.winners + " Zusatzwertung(en)"; }
                break;
            case "Lone Wolf":
                triggered = context.winners === 1;
                if (triggered) { score *= 3; effect = "Genau ein Gewinner · ×3"; }
                break;
            case "Full Coverage":
                triggered = context.families.size >= 4 && context.winners > 0;
                if (triggered) { score *= 1.5; effect = "Vier Wettarten + Treffer · ×1,5"; }
                break;
            case "Night Market":
                triggered=context.result.color==='black';if(triggered){score*=1.5;effect='SCHWARZ · ×1,5';}break;
            case "Safety Net":
                triggered=context.winners>0&&context.winners<context.bets;if(triggered){score+=30;effect='Gewinner + Verlierer · +30';}break;
            case "Crowd":
                triggered=context.winners>=3;if(triggered){score*=1.75;effect='Mindestens 3 Gewinner · ×1,75';}break;
            case "Bullseye":
                triggered=(context.numberWinners||0)>0;if(triggered){score*=1.75;effect='Zahlentreffer · ×1,75';}break;
            case "Green Seal":
                triggered=context.result.number===0&&context.winners>0;if(triggered){score*=2;effect='Nulltreffer · ×2';}break;
            case "Phoenix":
                triggered=context.spinsLeft<=1&&context.winners>0;if(triggered){score*=1.5;effect="Letzte 2 Spins · ×1,5";}break;
            case "Crown":
                triggered=context.families.size>=3&&context.winners>0;if(triggered){score*=2.5;effect='3 Wettarten + Treffer · ×2,5';}break;
            case "Jackpot":
                triggered = context.bets >= 2 && context.winners === context.bets;
                if (triggered) { score *= 2; effect = "Alle gesetzten Chips gewinnen · ×2"; }
                break;
        }
        trace.push({ id: relic.id, name: relic.name, before, after: score, triggered, effect });
    }
    return { score, trace };
}
function moveRelic(state, relicId, direction) {
    if (!["ready", "won"].includes(state.phase) || ![-1, 1].includes(direction)) return false;
    const index = state.relics.findIndex(relic => relic.id === relicId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= state.relics.length) return false;
    [state.relics[index], state.relics[target]] = [state.relics[target], state.relics[index]];
    return true;
}
function removeRelic(state, relicId) {
    if (!["ready", "won"].includes(state.phase)) return false;
    const index = state.relics.findIndex(relic => relic.id === relicId);
    if (index < 0) return false;
    state.relics.splice(index, 1);
    return true;
}
function hasMutation(chip, name) { return (chip.mutations || []).includes(name); }
function chipDisplayName(state, chip) {
    return chip.name + (state.chips.filter(other => other.name === chip.name).length > 1 ? " · Platz " + (state.chips.indexOf(chip) + 1) : "");
}
function chipCapacity(state) { return 6 + state.chips.filter(chip => hasMutation(chip, "Expanded")).length; }
function updateBuildStats(state) {
    state.luck = state.chips.filter(chip => hasMutation(chip, "Lucky")).length;
    state.capacity = chipCapacity(state);
}
function removeChip(state, chipId) {
    if (!["ready", "won"].includes(state.phase) || state.placedBets.length || state.chips.length <= 1) return false;
    const index = state.chips.findIndex(chip => chip.id === chipId);
    if (index < 0) return false;
    state.chips.splice(index, 1);
    state.selectedChip = null;
    updateBuildStats(state);
    return true;
}
function tableRewards(state) {
    const mutations = ["Polished", "Echo", "Expanded", "Lucky"];
    const items = Object.keys(WHEEL_ITEMS);
    const recruits = [HIGH_ROLLER, ...CHIP_TYPES];
    const relicNames = Object.keys(RELIC_TYPES).filter(name=>contentUnlocked(state,RELIC_TYPES[name]));
    const relicPool = [...relicNames.slice((state.round - 1) % relicNames.length), ...relicNames.slice(0, (state.round - 1) % relicNames.length)];
    const nextRelic = relicPool.find(name => !state.relics.some(relic => relic.name === name));
    return [
        { type: "mutation", name: mutations[(state.round - 1) % mutations.length] },
        { type: "chip", name: recruits[(state.round - 1) % recruits.length].name },
        { type: "item", name: items[(state.round - 1) % items.length] },
        { type: "relic", name: nextRelic }
    ];
}
function claimReward(state, choice, targetId = null) {
    if (state.phase !== "won" || !state.rewardPending) return { ok: false, message: "Keine offene Belohnung." };
    const offer = state.rewards[choice];
    if (!offer) return { ok: false, message: "Wähle eine Belohnung." };
    if (offer.type === "mutation") {
        const chip = state.chips.find(chip => chip.id === targetId);
        if (!chip || hasMutation(chip, offer.name)) return { ok: false, message: "Wähle einen Chip ohne diese Mutation." };
        chip.mutations.push(offer.name);
    } else if (offer.type === "chip") {
        const template = CHIP_CATALOG.find(chip => chip.name === offer.name && chip.available !== false);
        if (!template || !contentUnlocked(state,template)) return { ok: false, message: "Dieser Chip ist noch nicht verfügbar." };
        const mutations=(offer.mutations||[]).filter(name=>MUTATIONS[name]);
        const extra=mutations.includes("Expanded")?1:0;
        const recruit=()=>({...createChip(template,state.nextChipId++),mutations:[...mutations]});
        if (targetId === null && state.chips.length < chipCapacity(state)+extra) state.chips.push(recruit());
        else {
            const index = state.chips.findIndex(chip => chip.id === targetId);
            if (index < 0) return { ok: false, message: "Alle Plätze belegt. Wähle bewusst einen Chip zum Ersetzen." };
            const capacityAfter = chipCapacity(state) - (hasMutation(state.chips[index], "Expanded") ? 1 : 0) + extra;
            if (state.chips.length > capacityAfter) return { ok: false, message: "Dieser Expanded-Chip hält einen belegten Zusatzplatz offen. Wähle einen anderen Chip." };
            state.chips[index] = recruit();
        }
    } else if (offer.type === "item") {
        if (state.items.length < 2) state.items.push({ id: state.nextItemId++, name: offer.name });
        else {
            const index = state.items.findIndex(item => item.id === targetId);
            if (index < 0) return { ok: false, message: "Inventar voll. Wähle ein Item zum Ersetzen." };
            state.items[index] = { id: state.nextItemId++, name: offer.name };
        }
    } else if (offer.type === "relic") {
        if (!RELIC_TYPES[offer.name] || !contentUnlocked(state,RELIC_TYPES[offer.name]) || state.relics.some(relic => relic.name === offer.name)) return { ok: false, message: "Dieses Relic ist bereits vorhanden oder nicht verfügbar." };
        const relic = { id: state.nextRelicId, name: offer.name };
        if (state.relics.length < 4) state.relics.push(relic);
        else {
            const index = state.relics.findIndex(relic => relic.id === targetId);
            if (index < 0) return { ok: false, message: "Alle vier Relic-Plätze sind belegt. Wähle ein Relic zum Ersetzen." };
            state.relics[index] = relic;
        }
        state.nextRelicId++;
    } else return { ok: false, message: "Unbekannte Belohnung." };
    state.rewardPending = false;
    state.selectedChip = null;
    updateBuildStats(state);
    return { ok: true, message: offer.name + " erhalten." };
}
function skipReward(state) {
    if (state.phase !== "won" || !state.rewardPending) return false;
    state.rewardPending = false;
    return true;
}
function useWheelItem(state, itemId, sourceIndex, options = {}) {
    if (state.bossWheel) {
        const base = { ...state, wheel: state.bossWheel.map(field => ({ ...field })), bossWheel: null };
        const result = useWheelItem(base, itemId, sourceIndex, options);
        if (result.ok) {
            const bets = state.placedBets;
            Object.assign(state, base, { bossWheel: base.wheel, wheel: [...base.wheel, { number: 0, color: "green" }, { number: 0, color: "green" }] });
            state.placedBets = bets.filter(bet => bet.type !== "number" || state.wheel.some(field => field.number === bet.value));
        }
        return result;
    }
    const fail = message => ({ ok: false, message });
    if (state.phase !== "ready") return fail("Radänderungen sind nur zwischen Spins möglich.");
    const inventoryIndex = state.items.findIndex(item => item.id === itemId);
    if (inventoryIndex < 0) return fail("Dieses Item ist nicht mehr vorhanden.");
    if (!Number.isInteger(sourceIndex) || !state.wheel[sourceIndex]) return fail("Wähle ein gültiges Radfeld.");
    const name = state.items[inventoryIndex].name;
    const source = state.wheel[sourceIndex];
    const next = state.wheel.map(field => ({ ...field }));
    if (name === "Duplicate") next.splice(sourceIndex + 1, 0, { ...source });
    else if (name === "Delete") {
        if (next.length <= WHEEL_LIMITS.min) return fail("Mindestens 6 Radfelder müssen erhalten bleiben.");
        next.splice(sourceIndex, 1);
    } else if (name === "Repaint") {
        if (source.number === 0) return fail("Die Null bleibt grün. Wähle ein anderes Feld.");
        next[sourceIndex].color = source.color === "red" ? "black" : "red";
    } else if (name === "Rewrite") {
        const value = options.number;
        if (!Number.isInteger(value) || value < 0 || value > 18) return fail("Die neue Zahl muss zwischen 0 und 18 liegen.");
        if (value === source.number) return fail("Wähle eine andere Zahl.");
        next[sourceIndex] = { number: value, color: value === 0 ? "green" : source.color === "green" ? (value % 2 ? "red" : "black") : source.color };
    } else if (name === "Clone") {
        if (!Number.isInteger(options.targetIndex) || !next[options.targetIndex] || sourceIndex === options.targetIndex) return fail("Wähle ein anderes Feld als Ziel.");
        next[options.targetIndex] = { ...source };
    } else if (name === "Mitosis") next.push(...state.wheel.filter(field => field.number === source.number).map(field => ({ ...field })));
    else return fail("Unbekanntes Item.");
    if (next.length > WHEEL_LIMITS.max) return fail("Maximal 38 Radfelder sind möglich. Das Item bleibt erhalten.");
    state.wheel = next;
    state.items.splice(inventoryIndex, 1);
    const before = state.placedBets.length;
    state.placedBets = state.placedBets.filter(bet => bet.type !== "number" || next.some(field => field.number === bet.value));
    state.selectedChip = null;
    return { ok: true, message: name + " angewendet." + (before !== state.placedBets.length ? " Chips auf entfernten Zahlen wurden zurückgelegt." : "") };
}
function createChip(template, id) {
    return { ...template, id, mutations: [...(template.mutations || [])] };
}
const OUTSIDE = [
    { value: "red", label: "ROT", subtitle: "×1,5 mit Crimson", color: "red" },
    { value: "black", label: "SCHWARZ", subtitle: "×1,5 mit Onyx", color: "black" },
    { value: "odd", label: "UNGERADE", subtitle: "1, 3, 5 …" },
    { value: "even", label: "GERADE", subtitle: "2, 4, 6 …" },
    { value: "low", label: "LOW", subtitle: "1 – 9" },
    { value: "high", label: "HIGH", subtitle: "10 – 18" }
];
function createState(random = Math.random, unlocks = []) {
    return { phase: "ready", round: 1, score: 0, spinsLeft: RULES.spins, target: 20,
        loadoutId:"basic", unlocks:unlocks.filter(id=>ACHIEVEMENTS.some(a=>a.id===id)), normalWon:false, endless:false, endlessRounds:0, roomSpins:0, activeHousePhase:1, floor: 1, map: createFloorMap(1,random), completedFloors: [], eventId:null, coins: 0, mapStep: 0, currentRoom: "entry", visited: ["entry"], cleared: [], shopOffers: [], rerolls: 0,
        totalScore: 0, bestSpin: 0, bossWheel: null, tokens: [], nextTokenId: 0, pendingToken: null,
        spinScore: 0, selectedChip: null, placedBets: [], history: [], breakdown: [],
        items: [], nextItemId: 0, nextChipId: 1, luck: 0, capacity: 6, rewardPending: false, rewards: [],
        relics: [], nextRelicId: 0, relicTrace: [], lastSpin: null,
        chips: START_LOADOUTS.basic.chips.map((name,id)=>createChip(CHIP_CATALOG.find(c=>c.name===name),id)),
        wheel: Array.from({ length: 19 }, (_, number) => ({ number, color: number === 0 ? "green" : number % 2 ? "red" : "black" })) };
}
function checkWin(bet, result) {
    if (bet.type === "number") return bet.value === result.number;
    if (result.number === 0) return false;
    switch (bet.value) {
        case "red": case "black": return bet.value === result.color;
        case "odd": return result.number % 2 === 1;
        case "even": return result.number % 2 === 0;
        case "low": return result.number >= 1 && result.number <= 9;
        case "high": return result.number >= 10 && result.number <= 18;
        default: return false;
    }
}
function calculateBetScore(bet) {
    const chip = bet.chip;
    let points = bet.type === "number" ? RULES.numberScore : RULES.outsideScore;
    const matches = chip.bonus === "number" ? bet.type === "number"
        : chip.bonus === "parity" ? bet.type === "outside" && ["odd", "even"].includes(bet.value)
        : bet.type === "outside" && chip.bonus === bet.value;
    if (matches) points *= chip.multiplier;
    if(chip.special==="zero"&&bet.type==="number"&&bet.value===0)points*=6;
    if(chip.special==="gambler")points*=bet.type==="number"?3.5:.75;
    if(chip.special==="outside"&&bet.type==="outside")points*=2;
    if(chip.special==="royal")points*=2.5;
    if (typeof chip.streak === "number") points *= 1 + chip.streak * 0.25;
    if (hasMutation(chip, "Polished")) points *= 1.5;
    return points;
}
function resolveSpin(state, result, random = Math.random) {
    if (state.phase !== "spinning") return false;
    let points = 0;
    state.breakdown = state.placedBets.map(bet => {
        const won = checkWin(bet, result);
        if (typeof bet.chip.streak === "number") bet.chip.streak = won ? bet.chip.streak + 1 : 0;
        const echo = won && hasMutation(bet.chip, "Echo") && random() < 0.25;
        const basePoints = won ? calculateBetScore(bet) : 0;
        const score = basePoints * (echo ? 2 : 1);
        points += score;
        return { name: chipDisplayName(state, bet.chip), basePoints, points: score, won, echo, mutations: [...bet.chip.mutations] };
    });
    const chipScore = points;
    const context = {
        result, spinsLeft:state.spinsLeft, bets: state.placedBets.length,
        numberWinners: state.placedBets.filter(bet=>bet.type==="number"&&checkWin(bet,result)).length,
        winners: state.breakdown.filter(entry => entry.won).length,
        retriggerScore: state.breakdown.reduce((sum, entry) => sum + entry.basePoints, 0),
        families: new Set(state.placedBets.map(betFamily).filter(Boolean))
    };
    const relicResult = applyRelics(state.relics, context, points);
    points = relicResult.score;
    state.relicTrace = relicResult.trace;
    const house=currentRoom(state)?.name==="The House",phase=state.activeHousePhase||1;
    const bossPenalty=(currentRoom(state)?.name==="The Taxman"||(house&&phase>=2))?Math.min(points*.25,10*(context.bets-context.winners)):0;
    points-=bossPenalty;
    const housePenalty=house&&phase!==2?points*.2:0;
    points-=housePenalty;
    if (result.number === 0) points *= RULES.zeroMultiplier;
    state.spinScore = Math.round(points * 100) / 100;
    state.lastSpin = { result: { ...result }, bets: context.bets, winners: context.winners, numberWinners:context.numberWinners, families: [...context.families], chipScore, bossPenalty, housePenalty, housePhase:house?phase:null, relicScore: relicResult.score, zeroMultiplier: result.number === 0 ? RULES.zeroMultiplier : 1, finalScore: state.spinScore };
    state.score = Math.round((state.score + state.spinScore) * 100) / 100;
    state.totalScore += state.spinScore;
    state.bestSpin = Math.max(state.bestSpin, state.spinScore);
    state.history.unshift({ ...result });
    state.history = state.history.slice(0, 8);
    state.phase = state.score >= state.target ? "won" : state.spinsLeft <= 0 ? "lost" : "ready";
    if (state.phase === "won") {
        state.coins += currentRoom(state).payout || 10;
        if(state.endless)state.endlessRounds++;
        if(state.floor===4&&currentRoom(state).name==="The House")state.normalWon=true;
        state.rewardPending = false;
        state.rewards = [];
    }
    if (state.phase !== "ready") {
        state.placedBets = [];
        state.selectedChip = null;
    }
    if (state.phase === "lost" && state.bossWheel) { state.wheel = state.bossWheel; state.bossWheel = null; }
    return true;
}
function startSpin(state) {
    if (state.phase !== "ready" || !state.placedBets.length || state.spinsLeft <= 0) return false;
    state.activeHousePhase=housePhase(state);state.roomSpins=(state.roomSpins||0)+1;
    state.phase = "spinning";
    state.selectedChip = null;
    state.spinsLeft -= 1;
    return true;
}
function nextRound(state) {
    if (state.phase !== "won" || state.rewardPending) return false;
    completeRoom(state);
    return true;
}
function placeBet(state, chipId, type, value) {
    if (state.phase !== "ready") return false;
    if(currentRoom(state)?.name==="The Minimalist" && state.placedBets.filter(bet=>bet.chip.id!==chipId).length>=3)return false;
    const chip = state.chips.find(item => item.id === chipId);
    if (!chip) return false;
    if (type === "number" ? !state.wheel.some(slot => slot.number === value)
        : type !== "outside" || !OUTSIDE.some(bet => bet.value === value)) return false;
    state.placedBets = state.placedBets.filter(bet => bet.chip.id !== chipId);
    state.placedBets.push({ chip, type, value });
    state.selectedChip = null;
    return true;
}
function returnChip(state, chipId) {
    if (state.phase !== "ready") return false;
    state.placedBets = state.placedBets.filter(bet => bet.chip.id !== chipId);
    state.selectedChip = null;
    return true;
}

// A fixed first floor: every room in a row connects to both rooms in the next row.
const EVENTS = [
    {id:'cashbox',name:'Die verschlossene Kasse',text:'Ein versiegeltes Fach unter dem Tisch.',safe:6,reward:18,loss:8,chance:.5,safeLabel:'Wechselgeld nehmen',riskLabel:'Fach aufbrechen'},
    {id:'coinflip',name:'Kopf oder Krone',text:'Ein Fremder bietet dir einen letzten Münzwurf an.',safe:4,reward:24,loss:10,chance:.4,safeLabel:'Trinkgeld nehmen',riskLabel:'Wurf wagen'},
    {id:'envelope',name:'Der rote Umschlag',text:'Zwei Umschläge. Einer ist sicher, der andere versiegelt.',safe:8,reward:16,loss:6,chance:.6,safeLabel:'Offenen Umschlag nehmen',riskLabel:'Siegel brechen'}
];
const FLOORS = [
    {name:'Casino',scale:1,boss:'Double Zero',target:120,payout:30},
    {name:'High Roller',scale:2.5,boss:'The Taxman',target:360,payout:45},
    {name:'VIP',scale:5,boss:'The Minimalist',target:700,payout:60},
    {name:'Penthouse',scale:7,boss:'The House',target:1000,payout:100}
];
function floorConfig(floor){
    if(floor<=FLOORS.length)return FLOORS[floor-1];
    const level=floor-4,growth=Math.pow(1.45,level-1);
    return {name:'Endless '+level,scale:10*growth,boss:['Double Zero','The Taxman','The Minimalist','The House'][(level-1)%4],target:Math.round(1200*growth),payout:60+level*10};
}
function housePhase(state){return Math.min(3,1+Math.floor((state.roomSpins||0)/3));}
function housePhaseRule(state){const phase=state.phase==='spinning'?state.activeHousePhase:housePhase(state);return ['I · HAUSANTEIL: −20 % Spin-Score.','II · STEUER: −10 je verlorenem Chip, maximal 25 %.','III · FINALE: Steuer und danach −20 % Spin-Score.'][phase-1];}
function normalizeRecords(value){const result={version:1,normalVictory:false,endlessFloor:0,endlessRounds:0,bestSpin:0,bestRunScore:0};if(!value||value.version!==1)return result;for(const key of ['endlessFloor','endlessRounds','bestSpin','bestRunScore'])if(Number.isFinite(value[key])&&value[key]>=0)result[key]=value[key];result.normalVictory=value.normalVictory===true;return result;}
function updateRecords(records,state){const result=normalizeRecords(records);result.normalVictory=result.normalVictory||state.normalWon;result.bestSpin=Math.max(result.bestSpin,state.bestSpin);result.bestRunScore=Math.max(result.bestRunScore,state.totalScore);if(state.endless){result.endlessFloor=Math.max(result.endlessFloor,state.floor-4);result.endlessRounds=Math.max(result.endlessRounds,state.endlessRounds);}return result;}
function continueEndless(state,random=Math.random){if(state.phase!=='complete'||!state.normalWon||state.endless)return false;state.endless=true;state.phase='floor-clear';return advanceFloor(state,random);}
function createFloorMap(floor,random=Math.random) {
    const config=floorConfig(floor),prefix=floor===1?'':'f'+floor+'-';
    const table=(id,name,target,payout=10,spins=6)=>({id:prefix+id,type:'table',name,target:Math.round(target*config.scale),payout:payout+(floor-1)*5,spins});
    const room=(id,type,name)=>({id:prefix+id,type,name});
    const rows=floor===4?[
        [table("entry","Über den Dächern",50,25,7)],
        [room("workshop","workshop","Private Werkstatt"),table("stakes","Letzter großer Einsatz",80,40,7),room("unknown","event","Die letzte Einladung")],
        [room("final-shop","shop","Der letzte Händler")],
        [{id:prefix+"boss",type:"boss",name:config.boss,target:config.target,spins:8,payout:config.payout}]
    ]:[
        [table('entry',floor===1?'Ankommen':'Aufstieg · '+config.name,20,10,5)],
        [table('table-2','Grüner Tisch',40),table('stakes','High Stakes',60,20,5),table('side-table','Seitentisch',45,12)],
        [room('shop','shop','Der Händler'),room('workshop','workshop','Werkstatt'),room('side-event','event','Hinterzimmer')],
        [table('table-3','Letzter Einsatz',80,15),room('unknown','event','Unbekanntes Ereignis'),table('side-stakes','Letztes Risiko',100,25,5)],
        [room('final-shop','shop','Letzter Halt')],
        [{id:prefix+'boss',type:'boss',name:config.boss,target:config.target,spins:7,payout:config.payout}]
    ];
    // Only actual edges are playable. Every lane remains connected to the boss.
    rows.forEach((row,index)=>row.forEach((node,lane)=>{
        const next=rows[index+1]||[];
        if(row.length===1||next.length<=1) node.next=next.map(n=>n.id);
        else {
            const adjacent=lane===0?1:lane===2?1:random()<.5?0:2;
            node.next=[next[lane].id];
            if(lane===1||random()<.65)node.next.push(next[adjacent].id);
        }
    }));
    return rows;
}
const FLOOR_MAP=createFloorMap(1,()=>0);
function currentMap(state){return state.map||FLOOR_MAP;}
function currentRoom(state) { return currentMap(state).flat().find(room => room.id === state.currentRoom); }
function canEnterRoom(state,id){return state.phase==='map'&&currentRoom(state)?.next.includes(id)&&!state.visited.includes(id);}
function bossRule(room){return room.name==='The House'?'Spins 1–3: −20 %. Spins 4–6: Steuer. Ab Spin 7: beides.':room.name==='The Taxman'?'−10 Punkte pro verlorenem Chip, höchstens 25 % des Spin-Scores.':room.name==='The Minimalist'?'Maximal 3 Chips gleichzeitig setzen.':'+2 temporäre Nullfelder.';}
function completeRoom(state) {
    if (!state.cleared.includes(state.currentRoom)) state.cleared.push(state.currentRoom);
    if (state.bossWheel) { state.wheel = state.bossWheel; state.bossWheel = null; }
    const finished=state.mapStep===currentMap(state).length-1;
    state.phase = finished ? ((state.endless||state.floor<FLOORS.length)?'floor-clear':'complete') : 'map';
    if(finished&&!state.completedFloors.includes(state.floor))state.completedFloors.push(state.floor);
    state.placedBets = []; state.selectedChip = null;
}
function advanceFloor(state,random=Math.random){
    if(state.phase!=='floor-clear'||(!state.endless&&state.floor>=FLOORS.length))return false;
    state.floor++;state.map=createFloorMap(state.floor,random);state.mapStep=-1;
    const entry=state.map[0][0];state.phase='map';
    // The next floor starts with its entry table; every build component persists.
    state.currentRoom=entry.id;
    return enterRoom(state,entry.id,random,true);
}
function rollShop(state, random = Math.random) {
    const names=Object.keys(TOKEN_TYPES);
    const extra=names[weightedIndex([55,30,15],random)];
    state.shopOffers = [...names,extra].map(name => ({type:"token",name,price:TOKEN_TYPES[name].price-(state.floor===4?2:0),sold:false}));
}
function enterRoom(state, id, random = Math.random, floorEntry = false) {
    if (state.phase !== "map") return false;
    const room = currentMap(state)[state.mapStep + 1]?.find(candidate => candidate.id === id);
    if (!room || state.visited.includes(id) || (!floorEntry && !canEnterRoom(state,id))) return false;
    state.mapStep++; state.currentRoom = id; state.visited.push(id);
    if (["table", "boss"].includes(room.type)) {
        state.round++;
        Object.assign(state, { phase: "ready", roomSpins:0, activeHousePhase:1, target: room.target, spinsLeft: room.spins, score: 0, spinScore: 0, placedBets: [], selectedChip: null, breakdown: [], history: [], relicTrace: [], lastSpin: null });
        if (room.type === "boss" && room.name === "Double Zero") {
            state.bossWheel = state.wheel.map(field => ({ ...field }));
            // Boss fields are temporary and do not consume permanent wheel capacity.
            state.wheel.push({ number: 0, color: "green" }, { number: 0, color: "green" });
        }
    } else {
        state.phase = room.type;
        if (room.type === "shop") { state.rerolls = 0; rollShop(state, random); }
        if (room.type === "event") state.eventId=EVENTS[weightedIndex(EVENTS.map(()=>1),random)].id;
    }
    return true;
}
function buyOffer(state, index, targetId = null) {
    const offer = state.shopOffers[index];
    if (state.phase !== "shop" || !offer || offer.sold) return { ok: false, message: "Dieses Angebot ist nicht verfügbar." };
    if (state.coins < offer.price) return { ok: false, message: "Nicht genügend Run-Münzen." };
    if (offer.type === "mutation") return {ok:false,message:"Mutationen entstehen nur zufällig auf neuen Chips."};
    if (offer.type === "token") {
        if(!TOKEN_TYPES[offer.name])return {ok:false,message:"Unbekannter Token."};
        if (state.tokens.length >= 3) return { ok: false, message: "Deine drei Token-Plätze sind belegt." };
        state.tokens.push({ id: state.nextTokenId++, name: offer.name });
        state.coins -= offer.price; offer.sold = true;
        return { ok: true, message: offer.name + " gekauft." };
    }
    // Validate the complete purchase on a draft: no payment or partial changes on failure.
    const draft = structuredClone(state);
    Object.assign(draft, { phase: "won", rewardPending: true, rewards: [offer] });
    const result = claimReward(draft, 0, targetId);
    if (!result.ok) return result;
    draft.coins -= offer.price; draft.shopOffers[index].sold = true;
    Object.assign(draft, { phase: "shop", rewardPending: false, rewards: [] });
    Object.assign(state, draft);
    return { ok: true, message: offer.name + " gekauft · −" + offer.price + " Münzen." };
}
function rerollShop(state, random = Math.random) {
    const price = 3 + state.rerolls * 2;
    if (state.phase !== "shop" || state.coins < price) return false;
    state.coins -= price; state.rerolls++; rollShop(state, random); return true;
}
function resolveRoom(state, choice, random = Math.random) {
    let message;
    if (state.phase === "shop" && choice === "leave") message = "Weiter zum nächsten Raum.";
    else if (state.phase === "workshop" && (state.floor===4?["Clone","Mitosis","leave"]:["Duplicate", "Repaint", "leave"]).includes(choice)) {
        if (choice !== "leave") {
            if (state.items.length >= 2) return { ok: false, message: "Inventar voll. Du kannst den Raum ohne Item verlassen." };
            state.items.push({ id: state.nextItemId++, name: choice });
        }
        message = choice === "leave" ? "Werkstatt verlassen." : choice + " kostenlos erhalten. Wähle das Zielfeld am nächsten Tisch.";
    } else if (state.phase === "event" && ["safe", "risk"].includes(choice)) {
        const event=EVENTS.find(event=>event.id===state.eventId)||EVENTS[0];
        const change = choice === "safe" ? event.safe : random() < event.chance ? event.reward : -Math.min(event.loss, state.coins);
        state.coins += change; message = (change >= 0 ? "+" : "") + change + " Run-Münzen · " + event.name + ".";
    } else return { ok: false, message: "Diese Aktion ist gerade nicht möglich." };
    completeRoom(state); return { ok: true, message };
}

const TOKEN_TYPES = Object.freeze({
    "Slot Token": { price: 6, type: null, symbol: "✦" },
    "Chip Token": { price: 8, type: "chip", symbol: "●" },
    "Relic Token": { price: 10, type: "relic", symbol: "♛" }
});
const RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
const TOKEN_ART_WEIGHTS = [{type:"chip",weight:55},{type:"relic",weight:25},{type:"item",weight:20}];
const TOKEN_POOLS = [
    ...CHIP_CATALOG.filter(chip => chip.available !== false).map(chip => ({type:"chip",name:chip.name,unlock:chip.unlock,rarity:chip.rarity||({Basic:"Common",Crimson:"Uncommon",Onyx:"Uncommon",Balance:"Uncommon",Sniper:"Rare","High Roller":"Rare",Streak:"Epic"})[chip.name]})),
    ...Object.keys(RELIC_TYPES).map(name => ({type:"relic",name,unlock:RELIC_TYPES[name].unlock,rarity:RELIC_TYPES[name].rarity||({"Blood Pact":"Common","Lone Wolf":"Uncommon","Lucky Seven":"Rare","Full Coverage":"Rare",Jackpot:"Epic"})[name]})),
    ...Object.entries(WHEEL_ITEMS).map(([name,item]) => ({type:"item",name,rarity:item.rarity}))
];
function rarityWeights(luck) {
    const value = Math.min(10, Math.max(0, Number(luck) || 0));
    return [60 - 2 * value, 25, 10 + value, 4 + .7 * value, 1 + .3 * value];
}
function weightedIndex(weights, random) {
    let value = Math.min(1 - Number.EPSILON, Math.max(0, random())) * weights.reduce((sum,n) => sum+n,0);
    for (let i=0;i<weights.length;i++) { value -= weights[i]; if(value<0) return i; }
    return weights.length-1;
}
function rollTokenReward(state, tokenName, random = Math.random) {
    const token = TOKEN_TYPES[tokenName];
    if (!token) return null;
    const type = token.type || TOKEN_ART_WEIGHTS[weightedIndex(TOKEN_ART_WEIGHTS.map(entry=>entry.weight),random)].type;
    const rolled = weightedIndex(rarityWeights(state.luck),random);
    const eligible = TOKEN_POOLS.filter(offer => offer.type === type && contentUnlocked(state,offer) && (type !== "relic" || !state.relics.some(relic=>relic.name===offer.name)) && (type !== "mutation" || state.chips.some(chip=>!hasMutation(chip,offer.name))));
    // Prefer the nearest lower occupied rarity, then the nearest higher one.
    const order = [...Array.from({length:rolled+1},(_,i)=>rolled-i),...Array.from({length:RARITIES.length-rolled-1},(_,i)=>rolled+i+1)];
    for (const index of order) {
        const pool = eligible.filter(offer=>offer.rarity===RARITIES[index]);
        if (pool.length) {
            const offer={...pool[weightedIndex(pool.map(()=>1),random)], rolledRarity:RARITIES[rolled], fallback:index!==rolled, tokenName};
            if(type==='chip') offer.mutations=random()<.1?[Object.keys(MUTATIONS)[weightedIndex([1,1,1,1],random)]]:[];
            return offer;
        }
    }
    return null;
}
function beginToken(state, tokenId, random = Math.random) {
    if (!["ready","won","map","shop"].includes(state.phase) || state.pendingToken || state.placedBets.length) return {ok:false,message:"Erst Wetten zurücknehmen oder den laufenden Vorgang beenden."};
    const index = state.tokens.findIndex(token=>token.id===tokenId);
    if (index<0) return {ok:false,message:"Token nicht verfügbar."};
    const outcome = rollTokenReward(state,state.tokens[index].name,random);
    if (!outcome) return {ok:false,message:"Kein passendes Upgrade verfügbar. Token bleibt erhalten."};
    state.pendingToken = {...outcome,returnPhase:state.phase};
    state.tokens.splice(index,1); state.selectedChip=null; state.phase="slot";
    return {ok:true,outcome:state.pendingToken};
}
function claimToken(state,targetId=null) {
    if(state.phase!=="slot" || !state.pendingToken) return {ok:false,message:"Kein offenes Token-Ergebnis."};
    const pending=state.pendingToken;
    const draft=structuredClone(state);
    Object.assign(draft,{phase:"won",rewardPending:true,rewards:[pending]});
    const result=claimReward(draft,0,targetId);
    if(!result.ok)return result;
    Object.assign(draft,{phase:pending.returnPhase,pendingToken:null,rewardPending:false,rewards:[]});
    Object.assign(state,draft);return result;
}
function discardToken(state) {
    if(state.phase!=="slot" || !state.pendingToken)return false;
    state.phase=state.pendingToken.returnPhase;state.pendingToken=null;return true;
}

const SAVE_VERSION=1;
function mergeProgress(a,b){a=normalizeProgress(a);b=normalizeProgress(b);const numberHits={};for(let n=0;n<=18;n++)numberHits[n]=Math.max(a.numberHits[n]||0,b.numberHits[n]||0);return normalizeProgress({version:1,redWins:Math.max(a.redWins,b.redWins),houseVictory:a.houseVictory||b.houseVictory,numberHits});}
function mergeRecords(a,b){a=normalizeRecords(a);b=normalizeRecords(b);for(const k of ['endlessFloor','endlessRounds','bestSpin','bestRunScore'])a[k]=Math.max(a[k],b[k]);a.normalVictory=a.normalVictory||b.normalVictory;return a;}
function encodeRun(state,profile,records){if(state.phase==='spinning')throw Error('Unresolved spin cannot be saved');return JSON.stringify({version:SAVE_VERSION,savedAt:Date.now(),state,profile:normalizeProgress(profile),records:normalizeRecords(records)});}
function decodeRun(text){
 try{
  if(typeof text!=='string'||text.length>2000000)throw Error('Invalid save');const data=JSON.parse(text);
  if(data?.version!==SAVE_VERSION)return {ok:false,reason:'version'};
  const raw=data.state;if(!raw||typeof raw!=='object')throw Error('Missing run');
  const check=(condition)=>{if(!condition)throw Error('Invalid run data');};
  const num=(v)=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
  const int=(v)=>Number.isSafeInteger(v)&&v>=0;
  const s=createState(()=>0);for(const key of Object.keys(s))if(Object.hasOwn(raw,key))s[key]=raw[key];s.eventId=raw.eventId??null;
  check(['ready','won','lost','map','shop','workshop','event','floor-clear','complete','slot'].includes(s.phase));
  check(int(s.floor)&&s.floor>=1&&s.floor<=1000&&int(s.round)&&s.round>=1);
  for(const key of ['score','spinScore','target','coins','totalScore','bestSpin'])check(num(s[key]));
  for(const key of ['spinsLeft','roomSpins','rerolls','endlessRounds'])check(int(s[key]));check(s.spinsLeft<=8&&s.roomSpins<=8);
  check(typeof s.endless==='boolean'&&typeof s.normalWon==='boolean');check(s.floor<=4||s.endless&&s.normalWon);
  const template=createFloorMap(s.floor,()=>0);check(Array.isArray(s.map)&&s.map.length===template.length);
  s.map=template.map((row,i)=>{check(Array.isArray(raw.map[i])&&raw.map[i].length===row.length);return row.map((node,j)=>{const saved=raw.map[i][j];check(saved.id===node.id&&Array.isArray(saved.next));check(saved.next.length===(new Set(saved.next)).size);check(saved.next.every(id=>template[i+1]?.some(n=>n.id===id)));check(i===template.length-1?saved.next.length===0:saved.next.length>0);return {...node,next:[...saved.next]};});});
  check(int(s.mapStep)&&s.mapStep<s.map.length&&s.map[s.mapStep].some(n=>n.id===s.currentRoom));
  const room=currentRoom(s),roomIds=new Set(s.map.flat().map(n=>n.id));
  for(const key of ['visited','cleared']){check(Array.isArray(s[key])&&s[key].every(id=>typeof id==='string'&&id.length<100));check(new Set(s[key]).size===s[key].length);}
  check(s.visited.includes(s.currentRoom));check(Array.isArray(s.completedFloors)&&s.completedFloors.every(n=>int(n)&&n>=1&&n<=s.floor));
  check(Array.isArray(s.unlocks)&&s.unlocks.every(id=>ACHIEVEMENTS.some(a=>a.id===id)));
  const validateInventory=(values,max,known)=>{check(Array.isArray(values)&&values.length<=max);check(new Set(values.map(v=>v.id)).size===values.length);values.forEach(v=>check(int(v.id)&&known(v.name)));};
  validateInventory(s.chips,512,name=>CHIP_CATALOG.some(c=>c.name===name));check(s.chips.length>0);
  s.chips=s.chips.map(c=>{const base=CHIP_CATALOG.find(t=>t.name===c.name);check(Array.isArray(c.mutations)&&new Set(c.mutations).size===c.mutations.length&&c.mutations.every(m=>MUTATIONS[m]));const copy={...createChip(base,c.id),mutations:[...c.mutations]};if(typeof base.streak==='number'){check(int(c.streak));copy.streak=c.streak;}return copy;});
  validateInventory(s.relics,4,n=>!!RELIC_TYPES[n]);check(new Set(s.relics.map(r=>r.name)).size===s.relics.length);
  validateInventory(s.items,2,n=>!!WHEEL_ITEMS[n]);validateInventory(s.tokens,3,n=>!!TOKEN_TYPES[n]);
  for(const [key,counter]of [['chips','nextChipId'],['relics','nextRelicId'],['items','nextItemId'],['tokens','nextTokenId']])s[counter]=Math.max(int(s[counter])?s[counter]:0,...s[key].map(v=>v.id+1));
  const field=f=>f&&int(f.number)&&f.number<=18&&['red','black','green'].includes(f.color)&&(f.number===0?f.color==='green':f.color!=='green');
  check(Array.isArray(s.wheel)&&s.wheel.length>=6&&s.wheel.length<=40&&s.wheel.every(field));
  if(s.bossWheel!==null){check(room.name==='Double Zero'&&Array.isArray(s.bossWheel)&&s.bossWheel.length>=6&&s.bossWheel.length<=38&&s.bossWheel.every(field));check(JSON.stringify(s.wheel)===JSON.stringify([...s.bossWheel,{number:0,color:'green'},{number:0,color:'green'}]));}else check(s.wheel.length<=38);
  check(Array.isArray(s.placedBets)&&s.placedBets.length<=s.chips.length);const betIds=new Set();s.placedBets=s.placedBets.map(b=>{const chip=s.chips.find(c=>c.id===b.chip?.id);check(chip&&!betIds.has(chip.id));betIds.add(chip.id);check(b.type==='number'?s.wheel.some(f=>f.number===b.value):b.type==='outside'&&OUTSIDE.some(o=>o.value===b.value));return {chip,type:b.type,value:b.value};});
  s.selectedChip=s.chips.some(c=>c.id===s.selectedChip)?s.selectedChip:null;
  check(Array.isArray(s.shopOffers)&&s.shopOffers.length<=4);s.shopOffers.forEach(o=>check(o.type==='token'&&TOKEN_TYPES[o.name]&&num(o.price)&&typeof o.sold==='boolean'));
  if(s.phase==='event')check(EVENTS.some(e=>e.id===s.eventId));
  if(s.phase==='slot'){const p=s.pendingToken;check(p&&['ready','won','map','shop'].includes(p.returnPhase)&&TOKEN_POOLS.some(o=>o.type===p.type&&o.name===p.name&&o.rarity===p.rarity));check(RARITIES.includes(p.rolledRarity));if(p.mutations)check(Array.isArray(p.mutations)&&p.mutations.every(m=>MUTATIONS[m]));}else check(s.pendingToken===null);
  check(Array.isArray(s.history)&&s.history.length<=8&&s.history.every(field));
  check(Array.isArray(s.breakdown)&&s.breakdown.length<=512&&s.breakdown.every(b=>typeof b.name==='string'&&num(b.points)&&num(b.basePoints)&&Array.isArray(b.mutations)&&b.mutations.every(m=>MUTATIONS[m])));
  check(Array.isArray(s.relicTrace)&&s.relicTrace.length<=4&&s.relicTrace.every(t=>RELIC_TYPES[t.name]&&num(t.before)&&num(t.after)));
  if(s.lastSpin!==null)check(field(s.lastSpin.result)&&num(s.lastSpin.finalScore)&&num(s.lastSpin.relicScore)&&num(s.lastSpin.chipScore)&&int(s.lastSpin.bets)&&int(s.lastSpin.winners)&&Array.isArray(s.lastSpin.families));
  if(['ready','won','lost'].includes(s.phase)){check(['table','boss'].includes(room.type)&&s.target===room.target);if(s.phase==='ready')check(s.spinsLeft>0&&s.score<s.target);if(s.phase==='won')check(s.score>=s.target);if(s.phase==='lost')check(s.spinsLeft===0&&s.score<s.target);}
  if(['shop','workshop','event'].includes(s.phase))check(room.type===s.phase);
  if(s.phase==='complete')check(s.floor===4&&s.normalWon&&!s.endless&&room.type==='boss');
  if(s.phase==='floor-clear')check(room.type==='boss'&&(s.floor<4||s.endless));
  s.rewardPending=false;s.rewards=[];updateBuildStats(s);check(s.chips.length<=s.capacity);
  return {ok:true,state:s,profile:normalizeProgress(data.profile),records:normalizeRecords(data.records),savedAt:num(data.savedAt)?data.savedAt:0};
 }catch{return {ok:false,reason:'invalid'};}
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { RULES, CHIP_TYPES, HIGH_ROLLER, ZERO_CHIP, GAMBLER_CHIP, CHIP_CATALOG, MUTATIONS, WHEEL_ITEMS, WHEEL_LIMITS, RELIC_TYPES, betFamily, applyRelics, moveRelic, removeRelic, hasMutation, chipCapacity, updateBuildStats, removeChip, tableRewards, claimReward, skipReward, useWheelItem, createChip, createState, checkWin, calculateBetScore, resolveSpin, startSpin, nextRound, placeBet, returnChip };
    Object.assign(module.exports, { SAVE_VERSION, encodeRun, decodeRun, mergeProgress, mergeRecords, ACHIEVEMENTS, START_LOADOUTS, normalizeProgress, recordAchievementSpin, contentUnlocked, EVENTS, FLOORS, floorConfig, housePhase, normalizeRecords, updateRecords, continueEndless, createFloorMap, currentMap, canEnterRoom, advanceFloor, FLOOR_MAP, currentRoom, enterRoom, buyOffer, rerollShop, resolveRoom });
    Object.assign(module.exports, {TOKEN_TYPES,TOKEN_POOLS,TOKEN_ART_WEIGHTS,RARITIES,rarityWeights,rollTokenReward,beginToken,claimToken,discardToken});
}
if (typeof document !== "undefined") initializeGame();

function initializeGame() {
    const $ = id => document.getElementById(id);
    let state = createState();
    let rotation = 0;
    let soundEnabled = false;
    try{soundEnabled=localStorage.getItem("roguelette-sound-v1")==="on";}catch{}
    $("sound").textContent=soundEnabled?"Ton an":"Ton aus";$("sound").setAttribute("aria-pressed",String(soundEnabled));
    let audioContext;
    let inspectedChip = null;

    let shopChoice = null;
    let selectedMapRoom = null;
    let runStarted = false;
    const runKey='roguelette-run-v1',backupKey='roguelette-run-backup-v1';let pendingSpinSnapshot=null,lastSaveSignature='',saveMessage='Neuer Run bereit.',lastSaveTime=0,recoveryNotice='';
    function refreshSaveLabel(){const room=currentRoom(state);$('save-status').textContent=saveMessage+(runStarted?' · '+floorConfig(state.floor).name+' / '+room.name:'');}
    function autoSave(){if(!runStarted)return;const snapshot=pendingSpinSnapshot||state;if(snapshot.phase==='spinning')return;try{const signature=JSON.stringify({snapshot,profile,records});if(signature!==lastSaveSignature){const previous=localStorage.getItem(runKey);if(previous&&decodeRun(previous).ok)localStorage.setItem(backupKey,previous);localStorage.setItem(runKey,encodeRun(snapshot,profile,records));lastSaveSignature=signature;lastSaveTime=Date.now();}saveMessage=recoveryNotice||'Automatisch gespeichert';}catch{saveMessage='Speichern nicht möglich – bitte Browser-Speicher erlauben.';}refreshSaveLabel();}
    function removeRunSave(){try{localStorage.removeItem(runKey);localStorage.removeItem(backupKey);saveMessage='Run beendet.';}catch{saveMessage='Gespeicherter Run konnte nicht entfernt werden.';}lastSaveSignature='';}
    function restoreSavedRun(){try{const raw=localStorage.getItem(runKey);if(!raw){refreshSaveLabel();return;}let saved=decodeRun(raw),recovered=false;if(!saved.ok){const backup=localStorage.getItem(backupKey);if(backup){const candidate=decodeRun(backup);if(candidate.ok){saved=candidate;recovered=true;}}}if(!saved.ok){saveMessage=saved.reason==='version'?'Speicherstand aus einer anderen Version. Neuer Run möglich.':'Speicherstand beschädigt. Neuer Run möglich.';refreshSaveLabel();return;}state=saved.state;profile=mergeProgress(profile,saved.profile);records=mergeRecords(records,saved.records);state.unlocks=[...new Set([...state.unlocks,...profile.unlocks])];runStarted=true;lastSaveTime=saved.savedAt;recoveryNotice=recovered?'Letzten intakten Sicherungsstand geladen.':'';saveMessage=recoveryNotice||'Gespeicherten Run gefunden.';refreshSaveLabel();}catch{saveMessage='Browser-Speicher nicht verfügbar. Nur Sitzungsspiel möglich.';refreshSaveLabel();}}
    window.addEventListener('pagehide',autoSave);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')autoSave();});

    const recordsKey='roguelette-records-v1';let records=normalizeRecords(null),storageAvailable=true;
    try{records=normalizeRecords(JSON.parse(localStorage.getItem(recordsKey)));}catch{storageAvailable=false;}
    const progressKey='roguelette-progress-v1';let profile=normalizeProgress(null),progressStorage=true;
    try{profile=normalizeProgress(JSON.parse(localStorage.getItem(progressKey)));}catch{progressStorage=false;}
    if(records.normalVictory)profile=normalizeProgress({...profile,houseVictory:true});
    state.unlocks=[...profile.unlocks];
    function freshRun(){return createState(Math.random,profile.unlocks);}
    function saveProgress(){try{localStorage.setItem(progressKey,JSON.stringify(profile));progressStorage=true;}catch{progressStorage=false;}}
    function showCollection(){
      $('collection-grid').replaceChildren(...ACHIEVEMENTS.map(a=>{const unlocked=profile.unlocks.includes(a.id),card=document.createElement('article');card.className='unlock-card'+(unlocked?' unlocked':'');card.dataset.achievement=a.id;const title=document.createElement('h3');title.textContent=(unlocked?'✓ ':'◇ ')+a.reward;const info=document.createElement('p');info.textContent=a.description;const progress=document.createElement('strong');progress.textContent=unlocked?'IM TOKEN-POOL':Math.min(a.goal,achievementProgress(profile,a))+' / '+a.goal;const effect=document.createElement('p');effect.className='unlock-effect';effect.textContent=a.type==='chip'?CHIP_CATALOG.find(c=>c.name===a.reward).effect:RELIC_TYPES[a.reward].description;card.append(title,info,progress,effect);return card;}));
      $('collection-status').textContent=profile.unlocks.length+' / '+ACHIEVEMENTS.length+' freigeschaltet · Fortschritt über alle Runs.'+(progressStorage?'':' Speicher gesperrt: nur in dieser Sitzung.');$('collection-dialog').showModal();
    }
    $('open-collection').addEventListener('click',showCollection);$('close-collection').addEventListener('click',()=>$('collection-dialog').close());
    function saveRecords(){records=updateRecords(records,state);try{localStorage.setItem(recordsKey,JSON.stringify(records));storageAvailable=true;}catch{storageAvailable=false;}}
    function showRecords(){const labels={endlessFloor:'Höchster Endless-Floor',endlessRounds:'Gewonnene Endless-Tische',bestSpin:'Stärkster Spin',bestRunScore:'Höchster Run-Score'};$('records-grid').replaceChildren(...Object.entries(labels).map(([key,label])=>{const card=document.createElement('div');const title=document.createElement('span');title.textContent=label;const number=document.createElement('strong');number.textContent=format(records[key]);card.append(title,number);return card;}));$('records-status').textContent=(records.normalVictory?'♛ The House besiegt. ':'')+(storageAvailable?'Bestwerte lokal gespeichert.':'Speicher nicht verfügbar – Bestwerte gelten nur für diese Sitzung.');$('records-dialog').showModal();}
    $('open-records').addEventListener('click',showRecords);$('close-records').addEventListener('click',()=>$('records-dialog').close());
    function endRun(){saveRecords();runStarted=false;pendingSpinSnapshot=null;removeRunSave();$('room-dialog').close();$('map-dialog').close();openMenu();}

    let tokenAnimating = false;
    let selectedTokenId = null;
    let noticeTimer;
    let workshopItemId = null;
    let workshopSource = null;
    let workshopTarget = null;
    let inspectedRelic = null;
    const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
    const format = value => numberFormat.format(value);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const betCells = new Map();
    const key = (type, value) => type + ":" + value;

    function say(message) {
        $("status").textContent = message;
        clearTimeout(noticeTimer);
        $("status").classList.toggle("notice", /zuerst|nicht|belegt|geschafft|beendet|angewendet|erhalten|gekauft/i.test(message));
        noticeTimer = setTimeout(() => $("status").classList.remove("notice"), 4200);
    }
    function tone(frequency) {
        if (!soundEnabled) return;
        try {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) return;
            audioContext ||= new Audio();
            audioContext.resume().catch(() => {});
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            oscillator.frequency.value = frequency;
            gain.gain.setValueAtTime(0.035, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.13);
        } catch { /* Audio support must never block a spin. */ }
    }
    function makeBet(type, value, label, color, subtitle) {
        // A group holds separate buttons; chip buttons are never nested in buttons.
        const cell = document.createElement("div");
        cell.className = "bet-cell " + (color || "");
        cell.dataset.type = type;
        cell.dataset.value = value;
        const button = document.createElement("button");
        button.className = "bet-target";
        button.type = "button";
        button.textContent = label;
        button.title = String(label) + (subtitle ? " · " + subtitle : "") + (type === "number" ? " · 100 Basispunkte" : " · 20 Basispunkte");
        button.setAttribute("aria-label", type === "number" ? "Auf Zahl " + value + " setzen" : "Auf " + label + " setzen");
        if (subtitle) {
            const sub = document.createElement("span");
            sub.className = "bet-subtitle";
            sub.textContent = subtitle;
            button.append(sub);
        }
        button.addEventListener("click", () => {
            if (state.phase !== "ready") return;
            if (state.selectedChip === null) { say("Wähle zuerst einen Chip aus deinem Inventar."); return; }
            const chip = state.chips.find(item => item.id === state.selectedChip);
            if (placeBet(state, chip.id, type, value)) {
                render();
                say(chip.name + " gesetzt. Du kannst weitere Chips setzen oder drehen.");
            } else say("The Minimalist: maximal 3 Chips. Nimm zuerst einen gesetzten Chip zurück.");
        });
        const stack = document.createElement("div");
        stack.className = "bet-stack";
        cell.append(button, stack);
        betCells.set(key(type, value), { cell, stack, button });
        return cell;
    }
    function renderBoard() {
        betCells.clear();
        $("outside-bets").replaceChildren(...OUTSIDE.map(bet => makeBet("outside", bet.value, bet.label, bet.color, bet.subtitle)));
        const unique = [...new Set(state.wheel.map(slot => slot.number))].sort((a, b) => a - b);
        $("number-bets").replaceChildren(...unique.map(number => {
            const fields = state.wheel.filter(slot => slot.number === number);
            const colors = [...new Set(fields.map(field => field.color))];
            const cell = makeBet("number", number, number, colors.length > 1 ? "mixed" : colors[0]);
            const target = cell.querySelector("button");
            target.title = fields.length + " von " + state.wheel.length + " Feldern · " + format(fields.length / state.wheel.length * 100) + " %";
            if (fields.length > 1) {
                const copies = document.createElement("small"); copies.className = "field-copies"; copies.textContent = "×" + fields.length; target.append(copies);
            }
            return cell;
        }));
        const colors = { red: "#873b40", black: "#1c2822", green: "#397554" };
        const size = 360 / state.wheel.length;
        $("wheel").style.background = "conic-gradient(" + state.wheel.map((slot, i) => colors[slot.color] + " " + i * size + "deg " + (i + 1) * size + "deg").join(",") + ")";
        $("wheel").replaceChildren(...state.wheel.map((slot, i) => {
            const label = document.createElement("span");
            label.className = "wheel-number";
            label.textContent = state.wheel.length > 28 && i % 2 ? "·" : slot.number;
            label.title = "Feld " + (i + 1) + ": " + slot.number + " · " + slot.color;
            label.dataset.angle = (i + 0.5) * size;
            return label;
        }));
        positionWheelNumbers();
    }
    function positionWheelNumbers() {
        const radius = $("wheel").clientWidth * 0.437;
        $("wheel").querySelectorAll(".wheel-number").forEach(label => {
            label.style.transform = "translate(-50%,-50%) rotate(" + label.dataset.angle + "deg) translateY(-" + radius + "px)";
        });
    }
    function chipButton(chip, placed) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip-element " + chip.name.replaceAll(" ", "-") + (state.selectedChip === chip.id ? " selected" : "");
        button.disabled = state.phase !== "ready";
        button.dataset.chip = chip.id;
        button.title = chip.name + ": " + chip.effect + chip.mutations.map(name => "\n" + name + ": " + MUTATIONS[name].description).join("");
        button.setAttribute("aria-label", chipDisplayName(state, chip) + (placed ? " zurücknehmen" : " auswählen"));
        button.setAttribute("aria-pressed", String(state.selectedChip === chip.id));
        const symbol = document.createElement("span");
        symbol.textContent = typeof chip.streak === "number" ? chip.streak : chip.symbol;
        button.append(symbol);
        if (chip.mutations.length) {
            button.classList.add("mutated");
            const badge = document.createElement("i"); badge.className = "mutation-badge";
            badge.textContent = chip.mutations.map(name => MUTATIONS[name].symbol).join("");
            badge.setAttribute("aria-hidden", "true"); button.append(badge);
        }
        button.addEventListener("click", () => {
            if (state.phase !== "ready") return;
            inspectedChip = chip.id;
            if (placed) {
                returnChip(state, chip.id);
                render();
                say(chip.name + " zurückgelegt. Auswahl aufgehoben.");
            } else {
                state.selectedChip = state.selectedChip === chip.id ? null : chip.id;
                render();
                say(state.selectedChip === null ? "Auswahl aufgehoben." : chip.name + " ausgewählt. Wähle jetzt ein Wettfeld.");
            }
            $("chips").querySelector('[data-chip="' + chip.id + '"]')?.focus({ preventScroll: true });
        });
        return button;
    }
    function renderChips() {
        betCells.forEach(({ stack, button }) => {
            stack.replaceChildren();
            button.disabled = state.phase !== "ready";
        });
        $("chips").replaceChildren(...state.chips.map(chip => {
            const slot = document.createElement("div");
            slot.className = "chip-slot";
            const placed = state.placedBets.find(bet => bet.chip.id === chip.id);
            if (placed) {
                const label = document.createElement("span");
                label.className = "placed-label";
                label.textContent = "↗ " + (placed.type === "number" ? placed.value : OUTSIDE.find(bet => bet.value === placed.value).label);
                slot.append(label);
                betCells.get(key(placed.type, placed.value)).stack.append(chipButton(chip, true));
            } else slot.append(chipButton(chip, false));
            const name = document.createElement("span");
            name.className = "chip-name";
            name.textContent = chip.name;
            slot.append(name);
            return slot;
        }));
        for (let i = state.chips.length; i < chipCapacity(state); i++) {
            const slot = document.createElement("div"); slot.className = "chip-slot empty-slot";
            slot.textContent = "+"; slot.title = "Freier Platz: Im Shop einen Chip kaufen."; $("chips").append(slot);
        }
        $("chips").style.setProperty("--slot-count", chipCapacity(state));
        const chip = state.chips.find(item => item.id === (state.selectedChip ?? inspectedChip));
        $("chip-info").querySelector("strong").textContent = chip ? chip.name : "Ein Chip. Viele Möglichkeiten.";
        $("chip-info").querySelector("span").textContent = chip ? chip.effect + (typeof chip.streak === "number" ? " Aktuelle Serie: " + chip.streak + " · ×" + format(1 + chip.streak * .25) : "") : "Wähle einen Chip, um seinen Effekt zu sehen.";
        $("chip-mutations").replaceChildren(...(chip ? chip.mutations.map(name => {
            const tag = document.createElement("span"); tag.textContent = name; tag.title = MUTATIONS[name].description; return tag;
        }) : []));
    }
    function render() {
        autoSave();
        $("open-tokens").textContent = "✦ " + state.tokens.length;
        $("open-tokens").disabled = !["ready","won","map","shop","slot"].includes(state.phase);
        const bossActive = currentRoom(state).type === "boss" && ["ready", "spinning"].includes(state.phase);
        document.querySelector(".game-layout").classList.toggle("boss-active", bossActive);
        $("table-number").classList.toggle("boss-label", bossActive);
        $("boss-banner").hidden = !bossActive;
        if (bossActive) {
            const zeros = state.wheel.filter(field => field.number === 0).length;
            $("boss-rule").textContent = (currentRoom(state).name==="The House"?housePhaseRule(state):bossRule(currentRoom(state))) + (currentRoom(state).name==="Double Zero" ? " · "+format(100*zeros/state.wheel.length)+" % Null" : "");
            document.querySelector("#boss-banner strong").textContent=currentRoom(state).name.toUpperCase();
        }
        $("open-menu").disabled = ["spinning","slot"].includes(state.phase);
        $("show-map").textContent = "♧ Floor-Map · " + state.coins + " Münzen";
        $("show-map").disabled = ["spinning","slot"].includes(state.phase);
        renderChips();
        renderRelics();
        $("show-scoring").disabled = !state.lastSpin || state.phase === "spinning";
        if ($("relic-dialog").open) renderRelicDetails();
        $("edit-build").disabled = state.phase === "spinning";
        $("edit-build").textContent = "Chip-Details";
        $("edit-build").title = "Effekte und Mutationen ansehen; Chips ohne gesetzte Wetten ablegen";
        $("capacity-label").textContent = state.chips.length + " / " + chipCapacity(state);
        $("luck").textContent = state.luck;
        $("wheel-count").textContent = state.wheel.length + " FELDER";
        renderItems();
        $("table-number").textContent = String(state.floor).padStart(2,"0")+" / " + currentRoom(state).name.toUpperCase();
        if (bossActive) $("table-number").textContent = "♛ BOSS AKTIV · "+currentRoom(state).name.toUpperCase();
        $("score").textContent = format(state.score);
        $("target-label").textContent = "Ziel: " + format(state.target);
        $("progress-label").textContent = Math.min(100, Math.floor(state.score / state.target * 100)) + " %";
        $("progress").max = state.target;
        $("progress").value = Math.min(state.target, state.score);
        $("spins").textContent = state.spinsLeft;
        $("spin-dots").replaceChildren(...Array.from({ length: currentRoom(state).spins || RULES.spins }, (_, i) => {
            const dot = document.createElement("i"); dot.className = i >= state.spinsLeft ? "used" : ""; return dot;
        }));
        $("spin-score").textContent = "+" + format(state.spinScore);
        $("bet-count").textContent = state.placedBets.length + " / " + (bossActive && currentRoom(state).name==="The Minimalist" ? Math.min(3,state.chips.length) : state.chips.length) + " gesetzt";
        $("clear").disabled = state.phase !== "ready" || state.placedBets.length === 0;
        $("spin").disabled = state.phase === "spinning" || (state.phase === "ready" && !state.placedBets.length);
        $("spin").textContent = state.phase === "won" ? "WEITER ZUR MAP →" : state.phase === "lost" ? (state.endless?"ENDLESS-ERGEBNIS →":"NEUER RUN ↻") : state.phase === "spinning" ? "DAS RAD DREHT …" : "RAD DREHEN ↗";
        if (state.phase === "slot") $("spin").textContent = "UPGRADE ANSEHEN ✦";
        if (["map", "shop", "workshop", "event", "floor-clear", "complete"].includes(state.phase)) $("spin").textContent = state.phase === "map" ? "WEG WÄHLEN →" : state.phase === "complete" ? "RUN GEWONNEN ★" : "RAUM ÖFFNEN →";
        $("wheel-status").textContent = { ready: "DER TISCH WARTET", spinning: "DAS GLÜCK NIMMT SEINEN LAUF", won: "TISCH GESCHAFFT", lost: "RUN BEENDET" }[state.phase];
        if (!["ready", "spinning", "won", "lost"].includes(state.phase)) $("wheel-status").textContent = "WÄHLE DEINEN WEG";
        $("breakdown").replaceChildren(...(state.breakdown.length ? state.breakdown.map(item => {
            const row = document.createElement("li");
            const label = document.createElement("span"); label.textContent = item.name + (item.echo ? " ↻ ECHO" : "");
            const points = document.createElement("span"); points.textContent = item.won ? "+" + format(item.points) : "Kein Treffer";
            row.append(label, points); return row;
        }) : [Object.assign(document.createElement("li"), { textContent: "Deine Gewinne erscheinen hier." })]));
        state.relicTrace.filter(entry => entry.triggered).forEach(entry => {
            const row = document.createElement("li"); row.className = "relic-trigger-row";
            const name = document.createElement("span"); name.textContent = RELIC_TYPES[entry.name].symbol + " " + entry.name;
            const points = document.createElement("span"); points.textContent = format(entry.before) + " → " + format(entry.after);
            row.append(name, points); $("breakdown").append(row);
        });
        if (state.lastSpin?.zeroMultiplier !== 1 && state.lastSpin) {
            const row = document.createElement("li"); row.textContent = "Null ×0,75 → " + format(state.spinScore); $("breakdown").append(row);
        }
        $("history").replaceChildren(...state.history.map(result => {
            const badge = document.createElement("span"); badge.className = result.color; badge.textContent = result.number; return badge;
        }));
    }
    function resetResult() {
        $("result").textContent = "—";
        $("result-detail").textContent = state.wheel.length + " Felder. Dein verändertes Glück.";
    }
    $("spin").addEventListener("click", () => {
        if (state.phase === "slot") { openTokens(); return; }
        if (["map", "shop", "workshop", "event", "floor-clear", "complete"].includes(state.phase)) { showJourney(); return; }
        if (state.phase === "won") {

            nextRound(state); renderBoard(); render(); showJourney();
            return;
        }
        if (state.phase === "lost" && state.endless) {showRoom();return;}
        if (state.phase === "lost") {
            state = freshRun(); inspectedChip = null; renderBoard(); resetResult(); render();
            say("Neuer Run: ein Basic-Chip und fünf Spins.");
            return;
        }
        if (!startSpin(state)) return;
        const resultIndex = Math.floor(Math.random() * state.wheel.length);
        const result = state.wheel[resultIndex];
        pendingSpinSnapshot=structuredClone(state);resolveSpin(pendingSpinSnapshot,result);
        const previousUnlocks=new Set(profile.unlocks);profile=recordAchievementSpin(profile,pendingSpinSnapshot.lastSpin,pendingSpinSnapshot.normalWon);pendingSpinSnapshot.unlocks=[...profile.unlocks];records=updateRecords(records,pendingSpinSnapshot);saveProgress();
        const newUnlocks=ACHIEVEMENTS.filter(a=>profile.unlocks.includes(a.id)&&!previousUnlocks.has(a.id));
        const angle = (resultIndex + .5) * 360 / state.wheel.length;
        const desired = (360 - angle) % 360;
        rotation += 1080 + (desired - rotation % 360 + 360) % 360;
        $("wheel").style.transform = "rotate(" + rotation + "deg)";
        $("result").textContent = "…";
        $("result-detail").textContent = "Deine Wetten sind jetzt gesperrt.";
        render(); say("Das Rad dreht. Ein Spin wurde eingesetzt."); tone(440);
        setTimeout(() => {
            state=pendingSpinSnapshot;pendingSpinSnapshot=null;saveRecords();
            $("result").textContent = result.number + " · " + ({ red: "ROT", black: "SCHWARZ", green: "GRÜN" }[result.color]);
            $("result-detail").textContent = result.number === 0 ? "Null-Effekt: Gesamter Spin ×0,75." : "+" + format(state.spinScore) + " Punkte in diesem Spin";
            renderBoard(); render(); tone(state.spinScore > 0 ? 740 : 240);
            if (state.phase === "won") say("Tisch geschafft! +" + currentRoom(state).payout + " Münzen. Weiter zur Map.");
            else if (state.phase === "lost" && state.endless) showRoom();
            else if (state.phase === "lost") say("Run beendet. " + format(state.target - state.score) + " Punkte fehlten zum Ziel. Starte einen neuen Versuch.");
            else say(state.spinScore ? "Treffer! Wetten beibehalten oder deinen Build anpassen." : "Kein Treffer. Du hast noch " + state.spinsLeft + " Spins.");
        if(newUnlocks.length)say("Freigeschaltet: "+newUnlocks.map(a=>a.reward).join(", ")+" · Ab jetzt in deinen Tokens!");
        }, reducedMotion.matches ? 100 : RULES.spinDuration);
    });
    $("clear").addEventListener("click", () => {
        if (state.phase !== "ready") return;
        state.placedBets = []; state.selectedChip = null; render(); say("Alle Chips zurückgelegt.");
    });
    $("sound").addEventListener("click", () => {
        soundEnabled =
         !soundEnabled;
        $("sound").textContent = soundEnabled ? "Ton an" : "Ton aus";
        $("sound").setAttribute("aria-pressed", String(soundEnabled));
        try{localStorage.setItem("roguelette-sound-v1",soundEnabled?"on":"off");}catch{}
        tone(600);
    });
    $("help").addEventListener("click", () => $("help-dialog").showModal());
    $("close-help").addEventListener("click", () => $("help-dialog").close());
    function renderBuild() {
        $("build-title").textContent = "Deine Chips & Mutationen";
        $("build-description").textContent = "Du startest mit einem Basic-Chip. Weitere Chips kaufst du im Shop. Ablegen entfernt den Chip und seine Mutationen; der letzte Chip bleibt erhalten.";
            $("build-catalog").replaceChildren(...state.chips.map(chip => {
                const card = document.createElement("div"); card.className = "roster-detail";
                const name = document.createElement("strong"); name.textContent = chipDisplayName(state, chip);
                const effect = document.createElement("p"); effect.textContent = chip.effect;
                card.append(name, effect);
                chip.mutations.forEach(mutation => {
                    const line = document.createElement("p"); line.className = "mutation-description";
                    line.textContent = mutation + ": " + MUTATIONS[mutation].description; card.append(line);
                });
                const remove = document.createElement("button"); remove.className = "quiet"; remove.textContent = chipDisplayName(state, chip) + " ablegen";
                remove.disabled = state.placedBets.length > 0 || state.chips.length <= 1 || !["ready", "won"].includes(state.phase);
                remove.addEventListener("click", () => { if (removeChip(state, chip.id)) { inspectedChip = null; render(); renderBuild(); } });
                card.append(remove); return card;
            }));

    }
    $("edit-build").addEventListener("click", () => {
        if (state.phase === "spinning") return;
        renderBuild();

        $("build-dialog").showModal();
    });
    $("close-build").addEventListener("click", () => $("build-dialog").close());
    function rewardDescription(offer) {
        if (offer.type === "token") return TOKEN_TYPES[offer.name].type ? "Garantiert " + ({chip:"einen Chip",relic:"ein Relic",mutation:"eine Mutation"}[TOKEN_TYPES[offer.name].type]) + ". Seltenheit und Upgrade bestimmt die Slot-Machine." : "55 % Chip · 25 % Relic · 20 % Rad-Item. Luck verbessert die Seltenheit.";
        if (offer.type === "mutation") return MUTATIONS[offer.name].description;
        if (offer.type === "item") return WHEEL_ITEMS[offer.name].rarity + " · " + WHEEL_ITEMS[offer.name].description;
        if (offer.type === "relic") return RELIC_TYPES[offer.name].description;
        return CHIP_CATALOG.find(chip => chip.name === offer.name).effect + (offer.mutations?.length ? " · ✦ " + offer.mutations.map(name=>name+": "+MUTATIONS[name].description).join(" · ") : "");
    }
    function renderItems() {
        $("items").replaceChildren(...Array.from({ length: 2 }, (_, index) => {
            const item = state.items[index];
            const button = document.createElement("button"); button.className = "item-slot";
            button.textContent = item ? item.name : "+";
            button.title = item ? WHEEL_ITEMS[item.name].description : "Rad-Items im Shop kaufen oder in der Werkstatt erhalten";
            button.disabled = !item || state.phase !== "ready";
            if (item) button.addEventListener("click", () => {
                workshopItemId = item.id; workshopSource = null; workshopTarget = null;
                $("workshop-title").textContent = item.name;
                $("workshop-description").textContent = WHEEL_ITEMS[item.name].description;
                $("rewrite-control").hidden = item.name !== "Rewrite";
                $("rewrite-number").value = "7";
                $("workshop-feedback").textContent = item.name === "Clone" ? "Zuerst Quelle wählen, dann das zu ersetzende Zielfeld." : "Wähle ein Feld. Das Item bleibt bis zur Bestätigung erhalten.";
                renderWorkshop(); $("workshop-dialog").showModal();
            });
            return button;
        }));
    }
    function renderWorkshop() {
        const item = state.items.find(item => item.id === workshopItemId);
        if (!item) return;
        $("wheel-fields").replaceChildren(...state.wheel.map((field, index) => {
            const button = document.createElement("button");
            button.className = "wheel-field " + field.color;
            button.dataset.index = index;
            button.textContent = field.number;
            if (state.bossWheel && index >= state.bossWheel.length) {
                button.disabled = true; button.dataset.selection = "BOSS";
                button.title = "Temporäres Bossfeld – nicht veränderbar";
            }
            button.setAttribute("aria-label", "Feld " + (index + 1) + ": " + field.number + " " + field.color);
            button.setAttribute("aria-pressed", String(index === workshopSource || index === workshopTarget));
            if (index === workshopSource) button.dataset.selection = "QUELLE";
            if (index === workshopTarget) button.dataset.selection = "ZIEL";
            button.addEventListener("click", () => {
                if (item.name === "Clone" && workshopSource !== null) workshopTarget = index;
                else workshopSource = index;
                $("workshop-feedback").textContent = item.name === "Clone" ? "Quelle: Feld " + (workshopSource + 1) + (workshopTarget !== null ? " → Ziel: Feld " + (workshopTarget + 1) : ". Jetzt Zielfeld wählen.") : "Gewählt: Feld " + (index + 1) + " mit Zahl " + field.number + ".";
                renderWorkshop();
            });
            return button;
        }));
        $("apply-item").disabled = workshopSource === null || (item.name === "Clone" && workshopTarget === null);
    }
    $("apply-item").addEventListener("click", () => {
        const rawNumber = $("rewrite-number").value.trim();
        const result = useWheelItem(state, workshopItemId, workshopSource, { number: rawNumber === "" ? NaN : Number(rawNumber), targetIndex: workshopTarget });
        if (!result.ok) { $("workshop-feedback").textContent = result.message; return; }
        $("workshop-dialog").close();
        renderBoard(); render(); say(result.message);
    });
    $("reset-workshop").addEventListener("click", () => { workshopSource = null; workshopTarget = null; renderWorkshop(); $("workshop-feedback").textContent = "Auswahl aufgehoben. Wähle ein Feld."; });
    $("close-workshop").addEventListener("click", () => $("workshop-dialog").close());
    function renderRelics() {
        $("relic-slots").replaceChildren(...Array.from({ length: 4 }, (_, index) => {
            const relic = state.relics[index];
            const definition = relic ? RELIC_TYPES[relic.name] : null;
            const button = document.createElement("button");
            button.className = "relic-slot " + (definition?.className || "empty-relic");
            if (relic && state.relicTrace.some(entry => entry.id === relic.id && entry.triggered)) button.classList.add("relic-triggered");
            const symbol = document.createElement("strong"); symbol.textContent = definition?.symbol || "+";
            const label = document.createElement("span"); label.textContent = relic?.name || "";
            button.append(symbol, label);
            button.title = relic ? definition.description : "Relics im Shop kaufen. Antippen für alle Effekte.";
            button.setAttribute("aria-label", "Relic-Platz " + (index + 1) + ": " + (relic?.name || "leer") + " – Infos");
            button.addEventListener("click", () => {
                inspectedRelic = relic?.name || null;
                $("relic-feedback").textContent = "Maximal vier Relics. Jeder Typ kann einmal ausgerüstet sein. Ablegen entfernt ein Relic aus diesem Run.";
                renderRelicDetails(); $("relic-dialog").showModal();
            });
            return button;
        }));
    }
    function renderRelicDetails() {
        const names = [...state.relics.map(relic => relic.name), ...Object.keys(RELIC_TYPES).filter(name => !state.relics.some(relic => relic.name === name))];
        $("relic-catalog").replaceChildren(...names.map(name => {
            const definition = RELIC_TYPES[name];
            const index = state.relics.findIndex(relic => relic.name === name);
            const relic = state.relics[index];
            const card = document.createElement("article"); card.className = "relic-detail " + definition.className + (inspectedRelic === name ? " inspected" : "");
            const heading = document.createElement("h3"); heading.textContent = definition.symbol + " " + name;
            const position = document.createElement("small"); position.textContent = relic ? "PLATZ " + (index + 1) : "NOCH NICHT IM BUILD · IM SHOP ERHÄLTLICH";
            const description = document.createElement("p"); description.textContent = definition.description;
            card.append(position, heading, description);
            if (relic) {
                const controls = document.createElement("div"); controls.className = "relic-controls";
                const locked = !["ready", "won"].includes(state.phase);
                for (const [direction, label] of [[-1, "links"], [1, "rechts"]]) {
                    const button = document.createElement("button"); button.className = "quiet";
                    button.textContent = direction < 0 ? "← Links" : "Rechts →";
                    button.setAttribute("aria-label", name + " nach " + label);
                    button.disabled = locked || index + direction < 0 || index + direction >= state.relics.length;
                    button.addEventListener("click", () => {
                        if (moveRelic(state, relic.id, direction)) {
                            inspectedRelic = name; render();
                            $("relic-feedback").textContent = name + " auf Platz " + (state.relics.findIndex(entry => entry.id === relic.id) + 1) + " verschoben. Gilt ab dem nächsten Spin.";
                            const replacement = [...$("relic-catalog").querySelectorAll("button")].find(node => node.getAttribute("aria-label") === name + " nach " + label);
                            if (replacement && !replacement.disabled) replacement.focus({ preventScroll: true });
                        }
                    });
                    controls.append(button);
                }
                const remove = document.createElement("button"); remove.className = "quiet"; remove.textContent = "Ablegen";
                remove.setAttribute("aria-label", name + " ablegen"); remove.disabled = locked;
                remove.addEventListener("click", () => {
                    if (removeRelic(state, relic.id)) { inspectedRelic = name; render(); $("relic-feedback").textContent = name + " aus dem Run entfernt. Der Platz ist wieder frei."; }
                });
                controls.append(remove); card.append(controls);
            }
            return card;
        }));
    }
    $("close-relics").addEventListener("click", () => $("relic-dialog").close());
    $("show-scoring").addEventListener("click", () => {
        if (!state.lastSpin || state.phase === "spinning") return;
        const spin = state.lastSpin;
        $("scoring-context").textContent = "Ergebnis " + spin.result.number + " · " + { red: "ROT", black: "SCHWARZ", green: "GRÜN" }[spin.result.color] + " · " + spin.winners + " von " + spin.bets + " Chips gewinnen · " + spin.families.length + " von 4 Wettarten gesetzt.";
        const steps = [];
        const step = (title, text, className = "") => {
            const row = document.createElement("li"); row.className = className;
            const label = document.createElement("strong"); label.textContent = title;
            const detail = document.createElement("span"); detail.textContent = text; row.append(label, detail); steps.push(row);
        };
        state.breakdown.forEach(entry => step(entry.name, entry.won ? format(entry.basePoints) + (entry.echo ? " ×2 durch Echo" : "") + " = " + format(entry.points) : "Kein Treffer · 0"));
        step("Chip-Summe", format(spin.chipScore));
        state.relicTrace.forEach((entry, index) => step((index + 1) + ". " + entry.name, entry.triggered ? entry.effect + " · " + format(entry.before) + " → " + format(entry.after) : "Nicht ausgelöst · " + format(entry.after), entry.triggered ? "triggered-step" : "inactive-step"));
        if(spin.housePhase)step("The House", "Phase "+spin.housePhase);
        if(spin.housePenalty)step("The House · 20 %", "−"+format(spin.housePenalty)+" Punkte");
        if(spin.bossPenalty)step(spin.housePhase?"Haussteuer":"The Taxman", "−"+format(spin.bossPenalty)+" Punkte");
        if (spin.zeroMultiplier !== 1) step("Null-Effekt", format(spin.relicScore-(spin.bossPenalty||0)-(spin.housePenalty||0)) + " ×0,75 = " + format(spin.finalScore));
        step("Spin-Punkte", "+" + format(spin.finalScore), "final-step");
        $("scoring-steps").replaceChildren(...steps); $("scoring-dialog").showModal();
    });
    $("close-scoring").addEventListener("click", () => $("scoring-dialog").close());
    document.addEventListener("keydown", event => {
        if (!runStarted || document.querySelector("dialog[open]") || state.phase !== "ready" || event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "Escape") { state.selectedChip = null; render(); say("Auswahl aufgehoben."); }
        if (/^[1-9]$/.test(event.key)) {
            const id = state.chips[Number(event.key) - 1]?.id;
            if (state.placedBets.some(bet => bet.chip.id === id)) return;
            if (!state.chips.some(chip => chip.id === id)) return;
            state.selectedChip = id; inspectedChip = id; render(); say(state.chips.find(chip => chip.id === id).name + " ausgewählt.");
        }
    });
    function journeyButton(label, action, disabled = false) {
        const button = document.createElement("button"); button.className = "journey-button";
        button.textContent = label; button.disabled = disabled; button.addEventListener("click", action); return button;
    }
    function gameIcon(kind) {
        const paths = {
            table: '<circle cx="32" cy="32" r="24"/><circle cx="32" cy="32" r="16"/><path d="M32 9v9m0 28v9M9 32h9m28 0h9M16 16l7 7m18 18 7 7M16 48l7-7m18-18 7-7"/>',
            stakes: '<path d="m32 5 22 27-22 27L10 32Z"/><path d="m32 16 12 16-12 16-12-16Z"/>',
            shop: '<path d="M10 29v26h44V29M8 27l7-17h34l7 17M8 27q6 12 12 0 6 12 12 0 6 12 12 0 6 12 12 0M26 55V39h13v16M23 10l-3 17m21-17 3 17M32 10v17"/>',
            workshop: '<path d="m12 40 6 12h27l5-12H12Zm4-7h36l7-10H16v10ZM30 40V28M19 9l19 13m-3-17 10 7-6 9-10-7Z"/>',
            event: '<path d="M21 20c0-16 27-16 27 0 0 12-16 10-16 23M32 52v2"/>',
            boss: '<path d="m9 19 13 13L32 9l11 23 12-13-6 32H15ZM15 57h34"/>',
            Duplicate: '<rect x="11" y="10" width="30" height="35" rx="3"/><rect x="24" y="23" width="30" height="35" rx="3"/><path d="M32 40h14m-7-7v14"/>',
            Repaint: '<path d="m18 38 24-28 12 10-25 27Z"/><path d="M27 45c-2 14-15 15-19 10 8-1 1-12 10-17"/>',
            Delete: '<circle cx="32" cy="32" r="24"/><path d="m23 23 18 18m0-18L23 41"/>',
            Rewrite: '<path d="M14 12h20M14 12v40h36V33M23 39l4-13L46 7l10 10-19 19Z"/>',
            Clone: '<rect x="7" y="19" width="21" height="29" rx="3"/><rect x="37" y="19" width="21" height="29" rx="3"/><path d="M14 9h33l-5-5m5 5-5 5M16 28v11m28-6h7"/>',
            Mitosis: '<circle cx="32" cy="13" r="8"/><circle cx="14" cy="47" r="10"/><circle cx="50" cy="47" r="10"/><path d="M32 21v7L14 37m18-9 18 9"/>',
            mutation: '<path d="m32 6 7 18 19 8-19 7-7 19-8-19-18-7 18-8Z"/><circle cx="32" cy="32" r="5"/>',
            relic: '<path d="m32 5 21 12v27L32 59 11 44V17Z"/><circle cx="32" cy="31" r="12"/>',
            chip: '<circle cx="32" cy="32" r="25"/><circle cx="32" cy="32" r="18"/><path d="M29 23h6v18h-6M23 32h18"/>'
        };
        return '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[kind] || paths.relic) + '</svg>';
    }
    function roomInfo(room) {
        return room.target ? room.target + ' Punkte · ' + room.spins + ' Spins\n+' + room.payout + ' Münzen' + (room.type === 'boss' ? '\n'+bossRule(room) : '') : { shop: 'Tokens kaufen und an der Slot-Machine einlösen. Nachfüllen ab 3 Münzen.', workshop: state.floor===4?'Ein kostenloses Clone oder Mitosis. Benötigt einen freien Item-Platz.':'Ein kostenloses Duplicate oder Repaint. Benötigt einen freien Item-Platz.', event: 'Ein zufälliges Ereignis. Sichere Münzen oder Risiko – du entscheidest.' }[room.type];
    }
    function inspectMapRoom(room) {
        selectedMapRoom = room.id;
        const row = currentMap(state).findIndex(rooms => rooms.some(item => item.id === room.id));
        const available = canEnterRoom(state,room.id);
        $('map-room-icon').innerHTML = gameIcon(room.id.endsWith('stakes') ? 'stakes' : room.type);
        $('map-room-name').textContent = room.name;
        $('map-room-name').classList.toggle('boss-preview-title', room.type === 'boss');
        if (room.type === 'boss') $('map-room-name').textContent = '♛ FLOOR-BOSS: ' + room.name;
        $('map-room-detail').textContent = roomInfo(room);
        $('map-room-state').textContent = state.cleared.includes(room.id) ? '✓ Abgeschlossen' : room.id === state.currentRoom ? '● Dein aktueller Raum' : available ? 'Bereit für deinen nächsten Zug' : row <= state.mapStep ? 'Dieser Weg wurde nicht gewählt' : row === state.mapStep+1 ? 'Keine Verbindung von deinem Raum' : 'Noch nicht erreichbar';
        $('enter-map-room').disabled = !available;
        $('enter-map-room').textContent = available ? (room.type === 'boss' ? 'BOSS HERAUSFORDERN →' : 'BETRETEN →') : 'GESPERRT';
        $('floor-map').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.room === room.id)));
    }
    function showJourney() {
        if(state.endless&&state.phase==="lost"){showRoom();return;}
        if (['shop', 'workshop', 'event', 'floor-clear', 'complete'].includes(state.phase)) { showRoom(); return; }
        $('map-description').textContent = floorConfig(state.floor).name.toUpperCase()+' / FLOOR '+state.floor+' · '+state.coins+' MÜNZEN';
        if (state.phase === 'map' && state.mapStep === currentMap(state).length - 2) $('map-description').textContent = '♛ ALS NÄCHSTES: '+floorConfig(state.floor).boss.toUpperCase();
        $('map-dialog').classList.toggle('boss-next', state.phase === 'map' && state.mapStep === currentMap(state).length - 2);
        document.querySelector('#map-dialog .eyebrow').textContent='FLOOR '+state.floor+' · '+floorConfig(state.floor).name.toUpperCase();
        $('floor-map').replaceChildren();
        const points = currentMap(state).map((rooms, row) => rooms.map((room, index) => ({ room, x: rooms.length === 1 ? 300 : 120 + index * 180, y: 425 - row * (360/(currentMap(state).length-1)) })));
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 600 480'); svg.setAttribute('preserveAspectRatio', 'none'); svg.classList.add('route-lines'); svg.setAttribute('aria-hidden','true');
        points.slice(0,-1).forEach((row,index) => row.forEach(from => points[index+1].filter(to=>from.room.next.includes(to.room.id)).forEach(to => {
            const path = document.createElementNS(svg.namespaceURI,'path');
            path.setAttribute('d', 'M'+from.x+','+from.y+' C'+from.x+','+(from.y-39)+' '+to.x+','+(to.y+39)+' '+to.x+','+to.y);
            path.setAttribute('class', state.visited.includes(from.room.id) && state.visited.includes(to.room.id) ? 'walked' : state.phase === 'map' && index === state.mapStep && from.room.id === state.currentRoom ? 'next-path' : '');
            svg.append(path);
        })));
        $('floor-map').append(svg);
        points.flat().forEach(({room,x,y}) => {
            const row = currentMap(state).findIndex(rooms => rooms.includes(room));
            const available = canEnterRoom(state,room.id);
            const button = journeyButton('', () => inspectMapRoom(room));
            button.className = 'route-node ' + room.type + (available ? ' reachable' : '') + (state.visited.includes(room.id) ? ' visited' : '');
            button.dataset.room = room.id; button.style.left = x/6+'%'; button.style.top = y/4.8+'%';
            button.innerHTML = gameIcon(room.id.endsWith('stakes') ? 'stakes' : room.type);
            if (room.type === 'boss') { const label = document.createElement('span'); label.className = 'boss-node-label'; label.textContent = 'FLOOR-BOSS'; button.append(label); }
            button.setAttribute('aria-label', room.name + '. ' + roomInfo(room));
            button.setAttribute('aria-describedby','map-room-detail');
            if (state.currentRoom === room.id) button.setAttribute('aria-current','step');
            button.addEventListener('mouseenter',()=>inspectMapRoom(room)); button.addEventListener('focus',()=>inspectMapRoom(room));
            if (state.cleared.includes(room.id)) { const check=document.createElement('small'); check.textContent='✓'; button.append(check); }
            $('floor-map').append(button);
        });
        const initial = currentMap(state).flat().find(room=>room.id===selectedMapRoom && canEnterRoom(state,room.id)) || currentMap(state).flat().find(room=>canEnterRoom(state,room.id)) || currentRoom(state);
        inspectMapRoom(initial);
        $('map-feedback').textContent = '';
        if (!$('map-dialog').open) $('map-dialog').showModal();
    }
    $('enter-map-room').addEventListener('click',()=>{
        if (!enterRoom(state,selectedMapRoom)) return;
        $('map-dialog').close(); shopChoice=null; renderBoard(); resetResult(); render();
        if (state.phase !== 'ready') showRoom();
        else say(currentRoom(state).name + ' · ' + roomInfo(currentRoom(state)).replaceAll('\n',' · '));
    });
    function selectShopOffer(index) {
        shopChoice=index;
        const offer=state.shopOffers[index];
        $('shop-stock').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
        const pane=$('shop-inspector');pane.replaceChildren();
        const heading=document.createElement('h3');heading.textContent=offer.name;
        const description=document.createElement('p');description.textContent=rewardDescription(offer);
        const feedback=document.createElement('p');feedback.className='purchase-warning';
        if(state.tokens.length>=3)feedback.textContent='Token-Tasche voll. Benutze zuerst einen Token.';
        else if(state.coins<offer.price)feedback.textContent='Es fehlen '+(offer.price-state.coins)+' Münzen.';
        const purchase=journeyButton(offer.sold?'VERKAUFT ✓':'KAUFEN · '+offer.price+' ◉',()=>{
            const result=buyOffer(state,index);render();renderShop();$('room-feedback').textContent=result.message;if(result.ok)tone(660);
        },offer.sold || state.coins<offer.price || state.tokens.length>=3);
        purchase.id='purchase-offer';purchase.classList.add('purchase-button');pane.append(heading,description,feedback,purchase);
    }
    function renderShop() {
        $('room-dialog').classList.add('shop-scene');
        $('room-title').textContent='DER HÄNDLER';$('room-description').textContent='';
        if (state.currentRoom.endsWith('final-shop')) $('room-description').textContent='♛ '+floorConfig(state.floor).boss+' · '+floorConfig(state.floor).target+' Punkte · '+bossRule(currentMap(state).at(-1)[0]);
        if(state.floor===4)$('room-description').textContent+=' · Finale: alle Tokens 2 Münzen günstiger.';
        $('room-eyebrow').textContent='FLOOR '+state.floor+' · '+state.coins+' MÜNZEN';
        $('room-actions').replaceChildren();
        const layout=document.createElement('div');layout.className='shop-layout';
        const shelf=document.createElement('div');shelf.className='shop-stock';shelf.id='shop-stock';
        state.shopOffers.forEach((offer,index)=>{
            const token=TOKEN_TYPES[offer.name];
            const card=journeyButton('',()=>selectShopOffer(index));card.className='goods-card '+(token.type||'item')+(offer.sold?' sold':'');card.dataset.offer=index;
            const category=document.createElement('small');category.textContent='SLOT TOKEN';
            const art=document.createElement('span');art.className='goods-art';art.innerHTML=gameIcon(token.type||'table');
            const symbol=document.createElement('b');symbol.textContent=token.symbol;art.append(symbol);
            const name=document.createElement('strong');name.textContent=offer.name;
            const price=document.createElement('span');price.className='price-tag';price.textContent=offer.sold?'VERKAUFT':offer.price+' ◉';
            const tip=document.createElement('span');tip.className='goods-tooltip';tip.id='offer-tip-'+index;tip.textContent=rewardDescription(offer);tip.setAttribute('role','tooltip');
            card.setAttribute('aria-label',offer.name+', '+offer.price+' Münzen'+(offer.sold?', verkauft':''));card.setAttribute('aria-describedby',tip.id);
            card.append(category,art,name,price,tip);shelf.append(card);
        });
        const pane=document.createElement('aside');pane.id='shop-inspector';pane.className='shop-inspector';
        pane.innerHTML='<span class="shop-cursor">↖</span><h3>Karte wählen</h3>';
        layout.append(shelf,pane);
        const footer=document.createElement('div');footer.className='shop-controls';
        const wallet=document.createElement('div');wallet.className='shop-wallet';wallet.innerHTML='<small>DEINE MÜNZEN</small><strong>'+state.coins+' ◉</strong><span>Items '+state.items.length+'/2 · Relics '+state.relics.length+'/4</span>';
        footer.append(wallet,journeyButton('↻ NACHFÜLLEN · '+(3+state.rerolls*2)+' ◉',()=>{if(rerollShop(state)){shopChoice=null;render();renderShop();$('room-feedback').textContent='Tokens nachgefüllt.';}},state.coins<3+state.rerolls*2),journeyButton('ZUR MAP →',()=>{resolveRoom(state,'leave');$('room-dialog').close();render();selectedMapRoom=null;showJourney();}));
        footer.insertBefore(journeyButton('✦ '+state.tokens.length+' / 3 · SLOT',openTokens),footer.children[1]);
        $("room-actions").append(layout,footer);
        if(shopChoice!==null && state.shopOffers[shopChoice])selectShopOffer(shopChoice);
    }

    function showRoom() {
        const room = currentRoom(state);
        $("room-eyebrow").textContent = "FLOOR " + state.floor + " · " + state.coins + " RUN-MÜNZEN";
        $("room-title").textContent = state.phase === "complete" ? "The House besiegt · Run gewonnen!" : room.name;
        $("room-actions").replaceChildren();
        const add = (label, action, disabled) => $("room-actions").append(journeyButton(label, action, disabled));
        const finish = choice => {
            const result = resolveRoom(state, choice);
            if (!result.ok) { $("room-feedback").textContent = result.message; return; }
            $("room-dialog").close(); render(); say(result.message); showJourney(); $("map-feedback").textContent = result.message;
        };
        $("room-dialog").classList.remove("shop-scene");
        if (state.phase === "shop") {
            renderShop();
        } else if (state.phase === "workshop") {
            $("room-description").textContent = "Nimm ein kostenloses Werkzeug mit. Das genaue Zielfeld wählst du am nächsten Tisch. Aktuell " + state.items.length + " / 2 Item-Plätze belegt.";
            (state.floor===4?["Clone","Mitosis"]:["Duplicate", "Repaint"]).forEach(name => add(name + " — " + WHEEL_ITEMS[name].description, () => finish(name), state.items.length >= 2));
            add("Ohne Werkzeug weiter →", () => finish("leave"));
        } else if (state.phase === "event") {
            const event=EVENTS.find(event=>event.id===state.eventId)||EVENTS[0];
            $('room-title').textContent=event.name;$('room-description').textContent=event.text;
            add(event.safeLabel+' · sicher +'+event.safe+' Münzen',()=>finish('safe'));
            add(event.riskLabel+' · '+Math.round(event.chance*100)+' % +'+event.reward+', sonst bis zu −'+event.loss+' Münzen',()=>finish('risk'));
        } else if (state.phase === "floor-clear") {
            $("room-title").textContent=floorConfig(state.floor).name+" geschafft!";
            $("room-description").textContent="♛ "+room.name+" besiegt. Weiter zu "+floorConfig(state.floor+1).name+". Dein gesamter Build und deine Münzen bleiben erhalten.";
            add("FLOOR "+(state.floor+1)+" BETRETEN →",()=>{if(advanceFloor(state)){selectedMapRoom=null;shopChoice=null;$("room-dialog").close();renderBoard();resetResult();render();}});
        } else if(state.phase==="lost"&&state.endless){
            $("room-title").textContent="Endless beendet · Run bleibt gewonnen";
            $("room-description").textContent=(state.floor-4)+" Endless-Floors erreicht · "+state.endlessRounds+" Tische gewonnen · "+format(state.totalScore)+" Gesamtpunkte · stärkster Spin "+format(state.bestSpin)+". The House bleibt besiegt.";
            add("BESTWERTE",showRecords);add("RUN BEENDEN →",endRun);
        } else if (state.phase === "complete") {
            $("room-description").textContent = "Vier Floors geschafft. " + state.cleared.length + " Räume abgeschlossen · " + format(state.totalScore) + " Gesamtpunkte · stärkster Spin " + format(state.bestSpin) + " · " + state.coins + " Münzen. Dein Build: " + state.chips.map(chip => chip.name + (chip.mutations.length ? " [" + chip.mutations.join(", ") + "]" : "")).join(" · ") + ". Relics: " + (state.relics.map(relic => relic.name).join(", ") || "keine") + ". Casino, High Roller, VIP und Penthouse abgeschlossen.";
            add("CONTINUE · ENDLESS →",()=>{if(continueEndless(state)){saveRecords();selectedMapRoom=null;shopChoice=null;$("room-dialog").close();renderBoard();resetResult();render();}});
            add("RUN BEENDEN →",endRun);add("BESTWERTE",showRecords);
        }
        if (!$("room-dialog").open) { $("room-feedback").textContent = ""; $("room-dialog").showModal(); }
    }
    $("show-map").addEventListener("click", showJourney);
    $("close-map").addEventListener("click", () => $("map-dialog").close());
    const reelIds=['reel-type','reel-rarity','reel-upgrade'];
    const typeNames={chip:'CHIP',relic:'RELIC',item:'RAD-ITEM',mutation:'MUTATION'};
    function reelTile(value) {
        const tile=document.createElement('div');tile.className='reel-tile';
        const art=document.createElement('span');art.className='reel-symbol';
        if(value.icon)art.innerHTML=gameIcon(value.icon);else art.textContent=value.symbol||'✦';
        if(value.color)art.style.color=value.color;
        const label=document.createElement('b');label.textContent=value.label;
        tile.append(art,label);return tile;
    }
    function finalReelValues(pending) {
        return [
            {label:typeNames[pending.type],icon:pending.type},
            {label:pending.rarity,symbol:['◆','◆◆','★','✦','♛'][RARITIES.indexOf(pending.rarity)],color:['#667855','#467b6a','#317eab','#995fb3','#a77d23'][RARITIES.indexOf(pending.rarity)]},
            {label:pending.name+(pending.mutations?.length?' ✦':''),icon:pending.type==='item'?pending.name:null,symbol:pending.type==='chip'?CHIP_CATALOG.find(chip=>chip.name===pending.name).symbol:RELIC_TYPES[pending.name]?.symbol}
        ];
    }
    function staticReels(values) {
        reelIds.forEach((id,index)=>{
            $(id).getAnimations().forEach(animation=>animation.cancel());
            $(id).replaceChildren(reelTile(values[index]));$(id).style.transform='';
            $(id).closest('.slot-reel').classList.remove('rolling');
        });
    }
    function prepareSlot(tokenId) {
        const token=state.tokens.find(entry=>entry.id===tokenId);
        selectedTokenId=token?.id??null;
        $('slot-lever').disabled=!token;
        $('slot-status').textContent=token?token.name.toUpperCase()+' · BEREIT':'TOKEN EINLEGEN';
        $('token-inventory').querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.tokenId)===selectedTokenId)));
        const type=token?TOKEN_TYPES[token.name].type:null;
        staticReels([{label:type?typeNames[type]:'ART',icon:type||'table'},{label:'SELTENHEIT',symbol:'★'},{label:'UPGRADE',symbol:'?'}]);
        delete $('slot-machine').dataset.rarity;
    }
    function openTokens() {
        if(tokenAnimating)return;
        $('token-feedback').textContent='';$('slot-machine').hidden=false;
        $('token-odds').textContent='Luck '+state.luck+' · '+RARITIES.map((name,index)=>name+' '+format(rarityWeights(state.luck)[index])+' %').join(' · ')+'. Standard: 55 % Chip / 25 % Relic / 20 % Rad-Item. Luck verändert das Roulette nicht.';
        $('token-inventory').hidden=!!state.pendingToken;
        if(!$('token-dialog').open)$('token-dialog').showModal();
        if(state.pendingToken){revealToken();renderTokenResult();}
        else {
            $('token-result').replaceChildren();
            $('token-inventory').replaceChildren(...state.tokens.map(token=>{
                const button=journeyButton('',()=>prepareSlot(token.id));button.className='token-use';button.dataset.tokenId=token.id;
                const coin=document.createElement('span');coin.textContent=TOKEN_TYPES[token.name].symbol;
                const label=document.createElement('strong');label.textContent=token.name;
                button.append(coin,label);button.title='Einlegen – erst der Hebel verbraucht den Token.';return button;
            }));
            if(!state.tokens.length)$('token-inventory').textContent='Keine Tokens · Im Shop erhältlich';
            prepareSlot(state.tokens.some(token=>token.id===selectedTokenId)?selectedTokenId:null);
        }
    }
    async function spinSlot() {
        if(tokenAnimating || selectedTokenId===null)return;
        const result=beginToken(state,selectedTokenId);
        if(!result.ok){$('token-feedback').textContent=result.message;return;}
        selectedTokenId=null;tokenAnimating=true;render();
        $('close-tokens').disabled=true;$('slot-lever').disabled=true;
        $('slot-machine').classList.add('spinning');delete $('slot-machine').dataset.rarity;
        $('slot-status').textContent='DIE ROLLEN DREHEN';$('token-inventory').hidden=true;$('token-result').replaceChildren();
        $('token-feedback').textContent='';
        const final=finalReelValues(state.pendingToken);
        const strips=[
            ['chip','relic','item'].map(type=>({label:typeNames[type],icon:type})),
            RARITIES.map((label,index)=>({label,symbol:['◆','◆◆','★','✦','♛'][index]})),
            TOKEN_POOLS.filter(offer=>contentUnlocked(state,offer)).map(offer=>({label:offer.name,icon:offer.type==='item'?offer.name:offer.type}))
        ];
        try {
            await Promise.all(reelIds.map(async(id,index)=>{
                const strip=$(id);const column=strip.closest('.slot-reel');column.classList.add('rolling');
                if(reducedMotion.matches)await new Promise(resolve=>setTimeout(resolve,70*(index+1)));
                else {
                    const count=24+index*8;
                    const values=Array.from({length:count},(_,i)=>strips[index][i%strips[index].length]);values.push(final[index]);
                    strip.replaceChildren(...values.map(reelTile));
                    const height=strip.parentElement.clientHeight;
                    strip.querySelectorAll('.reel-tile').forEach(tile=>tile.style.height=height+'px');
                    const animation=strip.animate([{transform:'translateY(0)'},{transform:'translateY(-'+count*height+'px)'}],{duration:1300+index*600,easing:'cubic-bezier(.12,.68,.12,1)',fill:'forwards'});
                    await animation.finished;animation.cancel();
                }
                strip.replaceChildren(reelTile(final[index]));strip.style.transform='';column.classList.remove('rolling');tone(420+index*170);
            }));
        } finally {
            tokenAnimating=false;$('close-tokens').disabled=false;$('slot-machine').classList.remove('spinning');
            revealToken();renderTokenResult();
        }
    }
    $('slot-lever').addEventListener('click',spinSlot);
    function revealToken() {
        const pending=state.pendingToken;if(!pending)return;
        staticReels(finalReelValues(pending));$('slot-lever').disabled=true;
        $('slot-status').textContent='UPGRADE BEREIT';
        $('slot-machine').dataset.rarity=pending.rarity.toLowerCase();
        $('token-feedback').textContent=pending.fallback?pending.rolledRarity+' → '+pending.rarity+' · Gewürfelter Pool leer.':'';
    }

    function renderTokenResult() {
        const offer=state.pendingToken;if(!offer)return;
        const pane=$('token-result');pane.replaceChildren();
        
        const description=document.createElement('p');description.textContent=rewardDescription(offer);
        const targets=document.createElement('div');targets.className='purchase-targets';
        const needsTarget=offer.type==='mutation'||(offer.type==='chip'?state.chips.length>=chipCapacity(state)+(offer.mutations?.includes('Expanded')?1:0):offer.type==='item'?state.items.length>=2:state.relics.length>=4);
        let target=null;
        const finish=()=>{$('token-dialog').close();render();if(state.phase==='shop')showRoom();};
        const take=journeyButton('ÜBERNEHMEN →',()=>{const result=claimToken(state,target);if(result.ok)finish();else $('token-feedback').textContent=result.message;},needsTarget);
        take.id='claim-token';take.classList.add('purchase-button');
        if(needsTarget){
            const hint=document.createElement('p');hint.textContent=offer.type==='mutation'?'Zielchip wählen':'Inventar voll · Ersatz wählen';pane.append(hint);
            const pool=['chip','mutation'].includes(offer.type)?state.chips:offer.type==='item'?state.items:state.relics;
            pool.forEach(entry=>{
                const locked=offer.type==='mutation'?hasMutation(entry,offer.name):offer.type==='chip'&&hasMutation(entry,'Expanded')&&!offer.mutations?.includes('Expanded')&&state.chips.length>=chipCapacity(state);
                const button=journeyButton(entry.name,()=>{target=entry.id;targets.querySelectorAll('button').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));take.disabled=false;$('token-feedback').textContent=offer.type==='mutation'?offer.name+' für '+entry.name+'.':entry.name+' wird ersetzt'+(entry.mutations?.length?' und verliert '+entry.mutations.join(', '):'')+'.';},locked);
                button.dataset.tokenTarget=entry.id;targets.append(button);
            });
        }
        const actions=document.createElement('div');actions.className='token-result-actions';
        actions.append(journeyButton('Verwerfen',()=>{if(discardToken(state))finish();}),take);
        pane.append(description,targets,actions);
    }
    $('open-tokens').addEventListener('click',openTokens);
    function closeTokenView() {
        if(tokenAnimating)return;
        $('token-dialog').close();
        if(state.pendingToken) { $('room-dialog').close(); $('map-dialog').close(); }
    }
    $('close-tokens').addEventListener('click',closeTokenView);
    $('token-dialog').addEventListener('cancel',event=>{event.preventDefault();closeTokenView();});
    function openMenu() {
        if (state.phase==="spinning") return;
        refreshSaveLabel();
        $("resume-run").hidden = !runStarted;
        $("start-run").textContent = runStarted ? "NEUSTART · RUN VERWERFEN" : "RUN STARTEN ♠";
        $("start-screen").showModal();
    }
    $("start-screen").addEventListener("cancel", event => { if (!runStarted) event.preventDefault(); });
    $("open-menu").addEventListener("click", openMenu);
    document.querySelector(".brand").addEventListener("click", event => { event.preventDefault(); openMenu(); });
    $("menu-help").addEventListener("click", () => $("help-dialog").showModal());
    $("resume-run").addEventListener("click", () => { $("start-screen").close(); if(state.phase==="slot")openTokens();else if (["map","shop","workshop","event","floor-clear","complete"].includes(state.phase)||state.endless&&state.phase==="lost") showJourney(); });
    function startNewRun(){
        pendingSpinSnapshot=null;recoveryNotice="";removeRunSave();lastSaveSignature="";
        state = freshRun(); runStarted = true; shopChoice = null; selectedMapRoom = null; inspectedChip = null;
        $("start-screen").close(); renderBoard(); resetResult(); render(); say("Dein Run beginnt. Setze deinen ersten Chip.");
    }
    $("start-run").addEventListener("click",()=>{if(runStarted)$("restart-dialog").showModal();else startNewRun();});
    $("cancel-restart").addEventListener("click",()=>$("restart-dialog").close());
    $("confirm-restart").addEventListener("click",()=>{$("restart-dialog").close();startNewRun();});
    restoreSavedRun();renderBoard(); render();
    if(state.lastSpin){$("result").textContent=state.lastSpin.result.number+" · "+({red:"ROT",black:"SCHWARZ",green:"GRÜN"}[state.lastSpin.result.color]);}
    openMenu();
    new ResizeObserver(positionWheelNumbers).observe($("wheel"));
}
