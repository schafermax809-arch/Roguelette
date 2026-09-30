"use strict";

// Rules and scoring are independent of the interface so later roadmap systems
// can build on the same evaluation without changing the controls.
const RULES = Object.freeze({ spins: 5, numberScore: 100, outsideScore: 20, zeroMultiplier: 0.75, spinDuration: 2400 });
const CHIP_TYPES = [
    { name: "Basic", symbol: "•", effect: "Bei jedem Treffer: normale Basispunkte. Außenwette +20, Zahlenwette +100 vor Tischregeln." },
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
const BUILD_CHIPS = [
 {name:'Drifter',symbol:'⇄',rarity:'Common',special:'drifter',build:'Farbwechsel',effect:'Außenwetten: +20 Basispunkte, wenn Rot auf Schwarz oder Schwarz auf Rot folgt. Der erste Spin und Null zählen nicht als Wechsel.'},
 {name:'Collector',symbol:'◇',rarity:'Common',special:'collector',build:'Kleine Crew',effect:'Außenwetten: +4 Basispunkte je freiem Chip-Platz, höchstens +16. Heavy und Expanded zählen mit.'},
 {name:'Surveyor',symbol:'⌖',rarity:'Uncommon',special:'surveyor',build:'Breites Netz',effect:'Außenwetten: +10 Basispunkte für jede andere in diesem Spin gewinnende Wettart. Maximal +30.'},
 {name:'Carbon',symbol:'▧',rarity:'Rare',special:'carbon',build:'Radbau',effect:'Zahlenwetten: +100 Basispunkte je zusätzlicher Kopie der gesetzten Zahl im permanenten Rad, maximal +400. Temporäre Bossfelder zählen nicht.'}
];
const CHIP_CATALOG = [...CHIP_TYPES, HIGH_ROLLER, ZERO_CHIP, GAMBLER_CHIP, ...EXTRA_CHIPS, ...BUILD_CHIPS];
const MUTATIONS = Object.freeze({
    Polished: { symbol: "✦", description: "×1,5 auf die Punkte dieses Chips, zusätzlich zum Chip-Effekt." },
    Echo: { symbol: "↻", description: "25 % Chance auf genau eine zusätzliche Wertung bei einem Treffer." },
    Lucky: { symbol: "♣", description: "+1 Luck für seltenere Slot-Gewinne. Pro Luck: Common −2 Prozentpunkte, Rare +1, Epic +0,7 und Legendary +0,3 (bis 10 Luck). Roulette bleibt unverändert." },
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
    "Jackpot": { symbol: "★", className: "jackpot", description: "Wenn mindestens zwei Chips gesetzt sind und alle gewinnen: aktueller Spin-Score ×2." },
    'Metronome':{symbol:'⇋',className:'metronome',rarity:'Uncommon',build:'Farbwechsel',description:'Rot und Schwarz wechseln gegenüber dem letzten Spin: +25 Punkte, wenn mindestens ein Chip gewinnt. Null unterbricht die Folge.'},
    'Afterimage':{symbol:'◉',className:'afterimage',rarity:'Rare',build:'Radbau',description:'Dieselbe Zahl wie im vorherigen Spin und mindestens ein Gewinner: +100 Punkte. Gilt auch bei Null; der Null-Abzug folgt danach.'},
    'Compass':{symbol:'✥',className:'compass',rarity:'Rare',build:'Breites Netz',description:'Mindestens zwei verschiedene gewinnende Wettarten: +20 Punkte je gewinnender Wettart. Verlorene Wetten zählen nicht.'},
    'Workshop Seal':{symbol:'⚒',className:'workshop-seal',rarity:'Epic',build:'Kompaktes Rad',description:'Höchstens 12 permanente Radfelder und mindestens ein Gewinner: +60 Punkte. Temporäre Bossfelder zählen nicht.'}
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
            case 'Metronome': triggered=context.winners>0&&isColorSwitch(context.previous,context.result);if(triggered){score+=25;effect='Farbwechsel · +25';}break;
            case 'Afterimage': triggered=context.winners>0&&context.previous?.number===context.result.number;if(triggered){score+=100;effect='Gleiche Zahl · +100';}break;
            case 'Compass': {const count=context.winningFamilies?.size||0;triggered=context.winners>0&&count>=2;if(triggered){score+=20*count;effect=count+' gewinnende Wettarten · +'+20*count;}break;}
            case 'Workshop Seal': triggered=context.winners>0&&context.wheelSize>=6&&context.wheelSize<=12;if(triggered){score+=60;effect='Kompaktes Rad · +60';}break;
            case "Blood Pact":
                triggered = context.result.color === "red";
                if (triggered) { score *= 1.5; effect = "ROT · ×1,5"; }
                break;
            case "Lucky Seven":
                triggered = context.result.number === 7 && context.winners > 0;
                if (triggered) { score += context.retriggerScore; effect = "7 · +" + formatPoints(context.retriggerScore) + " aus " + context.winners + " Zusatzwertung(en)"; }
                break;
            case "Lone Wolf":
                triggered = context.winners === 1;
                if (triggered) { score *= 3; effect = "Genau ein Gewinner · ×3"; }
                break;
            case "Full Coverage":
                triggered = context.families.size >= (context.coverageSynergy?3:4) && context.winners > 0;
                if (triggered) { score *= 1.5; effect = (context.coverageSynergy?"Breites Netz: 3 Wettarten":"Vier Wettarten") + " + Treffer · ×1,5"; }
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
const CURSES = Object.freeze({
 Greedy:{symbol:'¤',description:'×2 Punkte. Muss jeden Spin gesetzt sein. Beim Minimalist sind nur die ersten drei Greedy-Chips im Inventar pflichtig.'},
 Fragile:{symbol:'⌁',description:'×2,5 Punkte. Zerbricht nach 3 verlorenen gesetzten Spins. Als letzter Chip wird er durch einen Basic ersetzt.'},
 Cursed:{symbol:'Ø',description:'×3 Punkte. Beim Erhalt kommt dauerhaft eine Null ins Rad; Entfluchen entfernt diese Null nicht.'},
 Addicted:{symbol:'↺',description:'Gleiche Wettart wie im vorherigen Einsatz: ×1,5; sonst ×0,5. Erster Einsatz ×1. Farbe, Zahl, Parität und Bereich zählen als Wettart.'},
 Volatile:{symbol:'ϟ',description:'Bei Treffer: 35 % Chance auf ×3, sonst ×1. Bei Verlust −10 vom Spin nach Relics und Boss-Abzügen, höchstens bis 0.'},
 Heavy:{symbol:'▣',description:'×2 Punkte, belegt einen zusätzlichen Chip-Platz. Expanded gleicht diesen Platz aus.'}
});
function permanentWheel(state){return state.bossWheel||state.wheel;}
function chipLoad(state){return state.chips.length+state.chips.filter(c=>c.curse?.name==='Heavy').length;}
function buildFits(state){return state.chips.length>0&&chipLoad(state)<=chipCapacity(state);}
function greedyRequired(state){const chips=state.chips.filter(c=>c.curse?.name==='Greedy');return currentRoom(state)?.name==='The Minimalist'?chips.slice(0,3):chips;}
function missingGreedy(state){return greedyRequired(state).filter(c=>!state.placedBets.some(b=>b.chip.id===c.id));}
function grantCurse(state,chipId,name){
 const chip=state.chips.find(c=>c.id===chipId);if(!chip||chip.curse||!Object.hasOwn(CURSES,name))return {ok:false,message:'Wähle einen Chip ohne Curse.'};
 if(name==='Heavy'&&chipLoad(state)+1>chipCapacity(state))return {ok:false,message:'Heavy braucht einen freien Chip-Platz.'};
 const wheel=permanentWheel(state);if(name==='Cursed'&&wheel.length>=WHEEL_LIMITS.max)return {ok:false,message:'Für den Curse fehlt ein freies Radfeld.'};
 chip.curse={name,losses:0,lastFamily:null};
 if(name==='Cursed'){wheel.push({number:0,color:'green'});if(state.bossWheel)state.wheel=[...wheel.map(f=>({...f})),{number:0,color:'green'},{number:0,color:'green'}];}
 updateBuildStats(state);return {ok:true,message:name+' erhalten.'};
}
function detectSynergies(state){
 const wheel=permanentWheel(state),has=n=>state.chips.some(c=>c.name===n),relic=n=>state.relics.some(r=>r.name===n),red=wheel.filter(f=>f.color==='red').length;
 const counts={};wheel.forEach(f=>counts[f.number]=(counts[f.number]||0)+1);
 const dominant=Math.max(...['red','black'].map(color=>wheel.filter(f=>f.color===color).length))/wheel.length;
 return [
 {id:'red',name:'Roter Faden',active:(has('Crimson')||has('Ember'))&&relic('Blood Pact')&&red>wheel.length/2,description:'Ein roter Treffer mit Crimson/Ember auf ROT zahlt +1 Münze pro Spin.',reason:'Crimson/Ember + Blood Pact + über 50 % rote Radfelder.'},
 {id:'number',name:'Präzision',active:(has('Sniper')||has('Repeater'))&&relic('Bullseye')&&Object.entries(counts).some(([n,c])=>+n>0&&c>=2),description:'Sniper/Repeater auf einer mehrfach vorhandenen Nichtnull-Zahl: 15 % Zusatzwertung. Mit Echo 40 % insgesamt; maximal eine Zusatzwertung.',reason:'Sniper/Repeater + Bullseye + doppelte Nichtnull-Zahl im Rad.'},
 {id:'zero',name:'Grüner Pakt',active:has('Zero')&&relic('Green Seal')&&(counts[0]||0)>=3,description:'Trifft dein Zero-Chip die 0, entfällt für diesen Spin der Null-Abzug.',reason:'Zero + Green Seal + mindestens 3 permanente Nullfelder.'},
 {id:'streak',name:'Zweite Chance',active:has('Streak')&&relic('Safety Net')&&dominant>=.6,description:'Pro Tisch behält der erste verlierende Streak-Chip die Hälfte seiner Serie, aufgerundet.',reason:'Streak + Safety Net + mindestens 60 % einer Radfarbe.'},
 {id:'echo',name:'Resonanz',active:state.chips.filter(c=>hasMutation(c,'Echo')).length>=2&&relic('Lucky Seven'),description:'Echo-Chance steigt auf 40 %. Lucky Seven würfelt kein weiteres Echo aus.',reason:'Mindestens 2 Echo-Chips + Lucky Seven.'},
 {id:'coverage',name:'Breites Netz',active:has('Balance')&&has('Anchor')&&relic('Full Coverage'),description:'Full Coverage löst bereits mit 3 verschiedenen Wettarten und einem Treffer aus.',reason:'Balance + Anchor + Full Coverage.'}
 ];
}
const activeSynergies=state=>detectSynergies(state).filter(s=>s.active);
function curseMultiplier(chip,bet,won,random){
 const curse=chip.curse;if(!curse)return {multiplier:1,penalty:0,note:''};
 let multiplier=1,penalty=0,note='';
 if(curse.name==='Greedy'||curse.name==='Heavy')multiplier=2;
 if(curse.name==='Fragile'){multiplier=2.5;if(!won)curse.losses++;note=`${curse.losses}/3 Verluste`;}
 if(curse.name==='Cursed')multiplier=3;
 if(curse.name==='Addicted'){const family=betFamily(bet);multiplier=curse.lastFamily===null?1:curse.lastFamily===family?1.5:.5;curse.lastFamily=family;}
 if(curse.name==='Volatile'){if(won)multiplier=random()<.35?3:1;else penalty=10;}
 return {multiplier,penalty,note:curse.name+' · '+(won?'×'+multiplier:penalty?'−10 nach Relics':'kein Treffer')+(note?' · '+note:'')};
}

function hasMutation(chip, name) { return (chip.mutations || []).includes(name); }
function chipDisplayName(state, chip) {
    return chip.name + (state.chips.filter(other => other.name === chip.name).length > 1 ? " · Platz " + (state.chips.indexOf(chip) + 1) : "");
}
function chipCapacity(state) { return 6 + (state.slotUpgrades || 0) + state.chips.filter(chip => hasMutation(chip, "Expanded")).length; }
const CHIP_WORK = Object.freeze({Polished:{price:8},Echo:{price:6},Lucky:{price:5}});
function slotUpgradePrice(state){return 8+4*(state.slotUpgrades||0);}
function buySlotUpgrade(state){
    if(state.phase!=='shop'||(state.slotUpgrades||0)>=6)return {ok:false,message:'Keine weitere Platzmarke verfügbar.'};
    const price=slotUpgradePrice(state);if(state.coins<price)return {ok:false,message:'Nicht genügend Münzen.'};
    state.coins-=price;state.slotUpgrades=(state.slotUpgrades||0)+1;updateBuildStats(state);
    return {ok:true,message:'+1 permanenter Chip-Platz · kein Zielchip nötig.'};
}
function previewChipWork(state,chipId,mutation){
    const chip=state.chips.find(c=>c.id===chipId),work=CHIP_WORK[mutation];
    if(state.phase!=='workshop'||!chip||!work)return {ok:false,message:'Wähle Chip und Arbeit.'};
    if(state.workshopServiced===state.floor+':'+state.currentRoom)return {ok:false,message:'Dieser Werkstattauftrag ist bereits erledigt.'};
    if(hasMutation(chip,mutation))return {ok:false,message:mutation+' ist bereits vorhanden.'};
    if(state.coins<work.price)return {ok:false,message:'Du brauchst '+work.price+' Münzen.'};
    return {ok:true,price:work.price,before:[...chip.mutations],after:[...chip.mutations,mutation],message:MUTATIONS[mutation].description};
}
function applyChipWork(state,chipId,mutation){
    const preview=previewChipWork(state,chipId,mutation);if(!preview.ok)return preview;
    state.coins-=preview.price;state.chips.find(c=>c.id===chipId).mutations.push(mutation);
    state.workshopServiced=state.floor+':'+state.currentRoom;updateBuildStats(state);
    return {ok:true,message:mutation+' eingeprägt · −'+preview.price+' Münzen.'};
}
function updateBuildStats(state) {
    state.luck = state.chips.filter(chip => hasMutation(chip, "Lucky")).length + (state.bonusLuck||0) + (state.floorBoon?.floor===state.floor?3:0);
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
        if (targetId === null && chipLoad(state) < chipCapacity(state)+extra) state.chips.push(recruit());
        else {
            const index = state.chips.findIndex(chip => chip.id === targetId);
            if (index < 0) return { ok: false, message: "Alle Plätze belegt. Wähle bewusst einen Chip zum Ersetzen." };
            const capacityAfter = chipCapacity(state) - (hasMutation(state.chips[index], "Expanded") ? 1 : 0) + extra;
            if (chipLoad(state) - (state.chips[index].curse?.name === "Heavy" ? 1 : 0) > capacityAfter) return { ok: false, message: "Dieser Expanded-Chip hält einen belegten Zusatzplatz offen. Wähle einen anderen Chip." };
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
    if (state.phase !== "ready" && !(state.phase==='map'&&currentRoom(state)?.type==='workshop'&&state.cleared.includes(state.currentRoom))) return fail("Radänderungen sind nur zwischen Spins oder am Werkstatttisch möglich.");
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
function previewWheelItem(state,itemId,index,options={}){const draft=structuredClone(state);const result=useWheelItem(draft,itemId,index,options);return {...result,wheel:result.ok?draft.wheel:state.wheel};}
function wheelComposition(wheel){return ['red','black','green'].map(color=>({color,count:wheel.filter(f=>f.color===color).length}));}
function createChip(template, id) {
    return { ...template, id, mutations: [...(template.mutations || [])], curse:null };
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
    return { phase: "ready", slotUpgrades:0, workshopServiced:null, round: 1, score: 0, spinsLeft: RULES.spins, target: 20,
        mapVersion:3, bonusLuck:0, nextTableSpinDebt:0, floorBoon:null, streakGuardUsed:false, lastEvent:null, synergyTrace:[],
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
function isColorSwitch(previous,result){return previous&&result&&['red','black'].includes(previous.color)&&['red','black'].includes(result.color)&&previous.color!==result.color;}
function calculateBetScore(bet,context={}) {
    const chip = bet.chip;
    let points = bet.type === "number" ? RULES.numberScore : RULES.outsideScore;
    const step=(name,value,operation='multiply')=>{const before=points;points=operation==='add'?points+value:points*value;if(points!==before)context.trace?.push({name,before,after:points,label:(operation==='add'?'+':'×')+String(value).replace('.',',')});};
    context.trace?.push({name:'Basiswette',before:0,after:points,label:'+'+points});
    const matches = chip.bonus === "number" ? bet.type === "number"
        : chip.bonus === "parity" ? bet.type === "outside" && ["odd", "even"].includes(bet.value)
        : bet.type === "outside" && chip.bonus === bet.value;
    if (matches) step(chip.name,chip.multiplier);
    if(chip.special==="zero"&&bet.type==="number"&&bet.value===0)step(chip.name,6);
    if(chip.special==="gambler")step(chip.name,bet.type==="number"?3.5:.75);
    if(chip.special==="outside"&&bet.type==="outside")step(chip.name,2);
    if(chip.special==="royal")step(chip.name,2.5);
    const state=context.state;
    if(state&&bet.type==='outside'){
        if(chip.special==='drifter'&&isColorSwitch(state.history[0],context.result))step(chip.name,20,'add');
        if(chip.special==='collector')step(chip.name,4*Math.min(4,Math.max(0,chipCapacity(state)-chipLoad(state))),'add');
        if(chip.special==='surveyor'&&context.result){const others=new Set((context.bets||state.placedBets).filter(b=>checkWin(b,context.result)).map(betFamily));others.delete(betFamily(bet));step(chip.name,10*others.size,'add');}
    }
    if(state&&chip.special==='carbon'&&bet.type==='number')step(chip.name,100*Math.min(4,Math.max(0,permanentWheel(state).filter(f=>f.number===bet.value).length-1)),'add');
    if (typeof chip.streak === "number") step('Streak',1 + chip.streak * 0.25);
    if (hasMutation(chip, "Polished")) step('Polished',1.5);
    return points;
}
function resolveSpin(state, result, random = Math.random) {
    if (state.phase !== "spinning") return false;
    let points = 0, cursePenalty = 0;
    const active=new Set(activeSynergies(state).map(s=>s.id));state.synergyTrace=[];
    state.breakdown = state.placedBets.map(bet => {
        const won = checkWin(bet, result);
        if (typeof bet.chip.streak === "number") {
            if(!won&&bet.chip.streak>0&&active.has('streak')&&!state.streakGuardUsed){bet.chip.streak=Math.ceil(bet.chip.streak/2);state.streakGuardUsed=true;state.synergyTrace.push('Zweite Chance · halbe Serie behalten');}
            else bet.chip.streak=won?bet.chip.streak+1:0;
        }
        const precise=active.has('number')&&['Sniper','Repeater'].includes(bet.chip.name)&&bet.type==='number'&&bet.value!==0&&permanentWheel(state).filter(f=>f.number===bet.value).length>=2;
        const chance=hasMutation(bet.chip,'Echo')?((active.has('echo')||precise) ? .4 : .25):(precise ? .15 : 0);
        const echo=won&&chance>0&&random()<chance;
        if(echo&&(precise||active.has('echo')))state.synergyTrace.push((precise?'Präzision':'Resonanz')+' · Zusatzwertung für '+bet.chip.name);
        const curse=curseMultiplier(bet.chip,bet,won,random);cursePenalty+=curse.penalty;
        const effects=[];
        const basePoints = won ? calculateBetScore(bet,{state,result,trace:effects})*curse.multiplier : 0;
        if(won&&curse.multiplier!==1)effects.push({name:bet.chip.curse.name,before:basePoints/curse.multiplier,after:basePoints,label:'×'+String(curse.multiplier).replace('.',',')});
        const score = basePoints * (echo ? 2 : 1);
        points += score;
        if(echo)effects.push({name:'Zusatzwertung',before:basePoints,after:score,label:'+'+formatPoints(basePoints)});
        return { chipId:bet.chip.id,betType:bet.type,betValue:bet.value,effects,name: chipDisplayName(state, bet.chip), basePoints, points: score, won, echo, curse:bet.chip.curse?.name||null, curseNote:curse.note, mutations: [...bet.chip.mutations] };
    });
    const chipScore = points;
    const context = {
        previous:state.history[0],wheelSize:permanentWheel(state).length,
        winningFamilies:new Set(state.placedBets.filter(b=>checkWin(b,result)).map(betFamily)),
        result, coverageSynergy:active.has('coverage'), spinsLeft:state.spinsLeft, bets: state.placedBets.length,
        numberWinners: state.placedBets.filter(bet=>bet.type==="number"&&checkWin(bet,result)).length,
        winners: state.breakdown.filter(entry => entry.won).length,
        retriggerScore: state.breakdown.reduce((sum, entry) => sum + entry.basePoints, 0),
        families: new Set(state.placedBets.map(betFamily).filter(Boolean))
    };
    const relicResult = applyRelics(state.relics, context, points);
    points = relicResult.score;
    state.relicTrace = relicResult.trace;
    if(active.has('coverage')&&state.relicTrace.some(r=>r.name==='Full Coverage'&&r.triggered)&&context.families.size===3)state.synergyTrace.push('Breites Netz · Full Coverage mit 3 Wettarten');
    const house=currentRoom(state)?.name==="The House",phase=state.activeHousePhase||1;
    const bossPenalty=(currentRoom(state)?.name==="The Taxman"||(house&&phase>=2))?Math.min(points*.25,10*(context.bets-context.winners)):0;
    points-=bossPenalty;
    const housePenalty=house&&phase!==2?points*.2:0;
    points-=housePenalty;
    const green=active.has('zero')&&result.number===0&&state.placedBets.some(b=>b.chip.name==='Zero'&&b.type==='number'&&b.value===0);
    const zeroMultiplier=result.number===0&&!green?RULES.zeroMultiplier:1;
    if(green)state.synergyTrace.push('Grüner Pakt · Null-Abzug entfällt');
    if(active.has('red')&&result.color==='red'&&state.placedBets.some(b=>['Crimson','Ember'].includes(b.chip.name)&&b.type==='outside'&&b.value==='red')){state.coins++;state.synergyTrace.push('Roter Faden · +1 Münze');}
    const appliedCursePenalty=Math.min(points,cursePenalty);points-=appliedCursePenalty;
    points *= zeroMultiplier;
    state.spinScore = Math.round(points * 100) / 100;
    state.lastSpin = { result: { ...result }, bets: context.bets, winners: context.winners, numberWinners:context.numberWinners, families: [...context.families], chipScore, bossPenalty, housePenalty, housePhase:house?phase:null, relicScore: relicResult.score, cursePenalty:appliedCursePenalty, zeroMultiplier, finalScore: state.spinScore };
    state.score = Math.round((state.score + state.spinScore) * 100) / 100;
    state.totalScore += state.spinScore;
    state.bestSpin = Math.max(state.bestSpin, state.spinScore);
    state.history.unshift({ ...result });
    state.history = state.history.slice(0, 8);
    const broken=state.chips.filter(c=>c.curse?.name==='Fragile'&&c.curse.losses>=3);
    state.chips=state.chips.filter(c=>!broken.includes(c));state.placedBets=state.placedBets.filter(b=>!broken.includes(b.chip));
    if(!state.chips.length)state.chips.push(createChip(CHIP_TYPES[0],state.nextChipId++));
    broken.forEach(c=>state.synergyTrace.push(c.name+' · Fragile zerbrochen'));updateBuildStats(state);
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
// Preview resolves private copies through the real spin pipeline; never consumes game RNG.
function previewBet(state,chipId,type,value){
 const base=structuredClone(state);base.phase='ready';
 if(!placeBet(base,chipId,type,value))return null;
 const bet=base.placedBets.find(b=>b.chip.id===chipId),hits=base.wheel.filter(field=>checkWin(bet,field));
 const totals=[],chipPoints=[],traces=[];
 for(const result of hits)for(const random of [()=>.999999,()=>0]){
  const sample=structuredClone(base);if(!startSpin(sample))return {blocked:true,hits:hits.length,total:base.wheel.length};
  resolveSpin(sample,result,random);const entry=sample.breakdown.find(e=>e.chipId===chipId);
  totals.push(sample.spinScore);chipPoints.push(entry.points);traces.push(entry.effects);
 }
 return {hits:hits.length,total:base.wheel.length,min:totals.length?Math.min(...totals):0,max:Math.max(0,...totals),chipMin:chipPoints.length?Math.min(...chipPoints):0,chipMax:Math.max(0,...chipPoints),effects:traces[0]||[],varies:totals.some(n=>n!==totals[0]),multiple:base.placedBets.length>1};
}
function startSpin(state) {
    if (state.phase !== "ready" || !state.placedBets.length || state.spinsLeft <= 0 || missingGreedy(state).length) return false;
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
const BUILD_EVENTS = [
 {id:'altar',name:'Der schmale Kreis',text:'Drei Radfelder für eine Krone.',choices:[{id:'trade',label:'Letzte 3 Radfelder entfernen → Crown',target:'relic'}]},
 {id:'red-dye',name:'Rote Tinte',text:'Die ersten drei schwarzen Felder werden rot. Eine neue Null bleibt.',choices:[{id:'paint',label:'Bis zu 3 SCHWARZ → ROT · +1 Null'}]},
 {id:'twins',name:'Zwei für einen',text:'Ein Chip verschwindet samt Mutation und Curse. Zwei zufällige Chips kommen.',choices:[{id:'trade',label:'Chip opfern → 2 zufällige Chips',target:'chip'}]},
 {id:'brand',name:'Das doppelte Siegel',text:'Zwei neue zufällige Mutationen. Ein Curse als Preis.',choices:Object.keys(CURSES).map(name=>({id:name,label:'2 Mutationen + '+name,target:'chip'}))},
 {id:'pawn',name:'Der Pfandleiher',text:'Ein Relic verlässt deinen Build.',choices:[{id:'cash',label:'Relic verkaufen → +18 Münzen',target:'relic'},{id:'luck',label:'Relic opfern → +1 permanentes Luck (max. 5)',target:'relic'}]},
 {id:'wash',name:'Blinde Wäsche',text:'Eine gewählte Mutation wird durch eine andere zufällige ersetzt. Kostet 3 Münzen.',choices:[{id:'wash',label:'Mutation tauschen · −3 Münzen',target:'mutation'}]},
 {id:'borrow',name:'Geborgte Zeit',text:'Ein zusätzliches Radfeld. Dafür ein Spin weniger am nächsten Tisch.',choices:[{id:'double',label:'Feld verdoppeln · nächster Tisch −1 Spin',target:'field'}]},
 {id:'boon',name:'Der Glückspass',text:'Nur im nächsten Floor: +3 Luck. Kostet 12 Münzen; der nächste Tisch verliert einen Spin.',choices:[{id:'buy',label:'Glückspass kaufen · −12 Münzen / −1 Spin'}]},
 {id:'purge',name:'Der Entflucher',text:'Curse entfernen. Bereits erzeugte Nullfelder bleiben.',choices:[{id:'pay',label:'Entfluchen · −10 Münzen',target:'chip'},{id:'mutation',label:'Entfluchen · gewählte Mutation opfern',target:'mutation'}]},
 {id:'forge',name:'Die dunkle Schmiede',text:'Eine garantierte Mutation mit einem festen Preis.',choices:[{id:'heavy',label:'Polished + Heavy · −8 Münzen',target:'chip'},{id:'greedy',label:'Echo + Greedy · −6 Münzen',target:'chip'}]}
];
function resolveBuildEvent(state,choice,options={},random=Math.random){
 const event=BUILD_EVENTS.find(e=>e.id===state.eventId);
 if(state.phase!=='event'||!event)return {ok:false,message:'Kein offenes Build-Event.'};
 if(choice==='leave'){state.lastEvent={name:event.name,message:'Ohne Handel weiter.'};completeRoom(state);return {ok:true,message:'Ohne Handel weiter.'};}
 if(!event.choices.some(c=>c.id===choice))return {ok:false,message:'Ungültige Entscheidung.'};
 // Work on a draft: failed choices never spend currency or destroy inventory.
 const d=structuredClone(state),chip=d.chips.find(c=>c.id===options.chipId),relic=d.relics.find(r=>r.id===options.relicId),fail=message=>({ok:false,message});
 let message='',wheel=permanentWheel(d);
 const pay=amount=>{if(d.coins<amount)return false;d.coins-=amount;return true;};
 const pick=items=>items[weightedIndex(items.map(()=>1),random)];
 if(event.id==='altar'){
  if(wheel.length<9)return fail('Mindestens 6 Radfelder müssen bleiben.');
  if(d.relics.some(r=>r.name==='Crown'))return fail('Crown ist bereits vorhanden.');
  if(d.relics.length>=4&&!relic)return fail('Wähle ausdrücklich ein Relic zum Ersetzen.');
  const removed=wheel.splice(-3,3);if(relic)d.relics=d.relics.filter(r=>r.id!==relic.id);
  d.relics.push({id:d.nextRelicId++,name:'Crown'});message='Crown erhalten · entfernt: '+removed.map(f=>f.number).join(', ')+(relic?' · '+relic.name+' ersetzt':'');
 }else if(event.id==='red-dye'){
  if(wheel.length>=WHEEL_LIMITS.max)return fail('Kein Platz für die zusätzliche Null.');
  const fields=wheel.filter(f=>f.color==='black').slice(0,3);if(!fields.length)return fail('Keine schwarzen Felder vorhanden.');fields.forEach(f=>f.color='red');wheel.push({number:0,color:'green'});message=fields.length+' Felder rot gefärbt · +1 permanente Null';
 }else if(event.id==='twins'){
  if(!chip)return fail('Wähle den Chip, den du opferst.');d.chips=d.chips.filter(c=>c.id!==chip.id);
  if(chipLoad(d)+2>chipCapacity(d))return fail('Für zwei neue Chips fehlen Plätze; Expanded wird mit geopfert.');
  const pool=CHIP_CATALOG.filter(c=>contentUnlocked(d,c));const recruits=[pick(pool),pick(pool)];recruits.forEach(c=>d.chips.push(createChip(c,d.nextChipId++)));message=chip.name+' geopfert → '+recruits.map(c=>c.name).join(' + ');
 }else if(event.id==='brand'){
  if(!chip||chip.curse)return fail('Wähle einen Chip ohne Curse.');const mutations=Object.keys(MUTATIONS).filter(m=>!hasMutation(chip,m));if(mutations.length<2)return fail('Der Chip braucht zwei freie Mutationen.');
  const result=grantCurse(d,chip.id,choice);if(!result.ok)return result;
  const first=pick(mutations),second=pick(mutations.filter(m=>m!==first));chip.mutations.push(first,second);message=chip.name+': '+first+' + '+second+' · Curse '+choice;
 }else if(event.id==='pawn'){
  if(!relic)return fail('Wähle das Relic, das du abgibst.');if(choice==='luck'&&d.bonusLuck>=5)return fail('Das permanente Event-Luck ist bereits bei 5.');
  d.relics=d.relics.filter(r=>r.id!==relic.id);if(choice==='cash')d.coins+=18;else d.bonusLuck++;message=relic.name+' abgegeben · '+(choice==='cash'?'+18 Münzen':'+1 permanentes Luck');
 }else if(event.id==='wash'){
  if(!chip||!hasMutation(chip,options.mutation))return fail('Wähle Chip und vorhandene Mutation.');if(!pay(3))return fail('Du brauchst 3 Münzen.');
  const pool=Object.keys(MUTATIONS).filter(m=>!hasMutation(chip,m));if(!pool.length)return fail('Keine andere freie Mutation.');
  chip.mutations=chip.mutations.filter(m=>m!==options.mutation);if(!buildFits(d))return fail('Expanded hält einen belegten Platz offen.');
  const mutation=pick(pool);chip.mutations.push(mutation);message=chip.name+': '+options.mutation+' → '+mutation+' · −3 Münzen';
 }else if(event.id==='borrow'){
  if(!Number.isInteger(options.fieldIndex)||!wheel[options.fieldIndex])return fail('Wähle ein Radfeld.');if(wheel.length>=WHEEL_LIMITS.max)return fail('Das Rad ist voll.');if(d.nextTableSpinDebt>=2)return fail('Höchstens 2 Spins dürfen vorgemerkt fehlen.');
  wheel.push({...wheel[options.fieldIndex]});d.nextTableSpinDebt++;message='Feld '+wheel[options.fieldIndex].number+' verdoppelt · nächster Tisch −1 Spin';
 }else if(event.id==='boon'){
  if(d.floorBoon||d.nextTableSpinDebt>=2)return fail('Ein Glückspass oder die maximale Spin-Schuld ist bereits aktiv.');if(!pay(12))return fail('Du brauchst 12 Münzen.');d.floorBoon={floor:d.floor+1};d.nextTableSpinDebt++;message='Floor '+(d.floor+1)+': +3 Luck · −12 Münzen · nächster Tisch −1 Spin';
 }else if(event.id==='purge'){
  if(!chip?.curse)return fail('Wähle einen verfluchten Chip.');
  if(choice==='pay'){if(!pay(10))return fail('Du brauchst 10 Münzen.');}else{if(!hasMutation(chip,options.mutation))return fail('Wähle eine vorhandene Mutation.');chip.mutations=chip.mutations.filter(m=>m!==options.mutation);}
  const name=chip.curse.name;chip.curse=null;message=chip.name+': '+name+' entfernt · '+(choice==='pay'?'−10 Münzen':options.mutation+' geopfert');
 }else if(event.id==='forge'){
  if(!chip||chip.curse)return fail('Wähle einen Chip ohne Curse.');const mutation=choice==='heavy'?'Polished':'Echo',curse=choice==='heavy'?'Heavy':'Greedy';if(hasMutation(chip,mutation))return fail(mutation+' ist bereits vorhanden.');if(!pay(choice==='heavy'?8:6))return fail('Zu wenige Münzen.');const result=grantCurse(d,chip.id,curse);if(!result.ok)return result;chip.mutations.push(mutation);message=chip.name+': '+mutation+' + '+curse+' · −'+(choice==='heavy'?8:6)+' Münzen';
 }
 if(!buildFits(d))return fail('Diese Entscheidung würde belegte Chip-Plätze entfernen.');
 d.placedBets=[];d.selectedChip=null;updateBuildStats(d);d.lastEvent={name:event.name,message};completeRoom(d);Object.assign(state,d);return {ok:true,message};
}

const EVENTS = [
    {id:'cashbox',name:'Die verschlossene Kasse',text:'Ein versiegeltes Fach unter dem Tisch.',safe:6,reward:18,loss:8,chance:.5,safeLabel:'Wechselgeld nehmen',riskLabel:'Fach aufbrechen'},
    {id:'coinflip',name:'Kopf oder Krone',text:'Ein Fremder bietet dir einen letzten Münzwurf an.',safe:4,reward:24,loss:10,chance:.4,safeLabel:'Trinkgeld nehmen',riskLabel:'Wurf wagen'},
    {id:'envelope',name:'Der rote Umschlag',text:'Zwei Umschläge. Einer ist sicher, der andere versiegelt.',safe:8,reward:16,loss:6,chance:.6,safeLabel:'Offenen Umschlag nehmen',riskLabel:'Siegel brechen'},
    ...BUILD_EVENTS
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
function legacyFloorMap(floor,random=Math.random) {
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
function versionTwoFloorMap(floor,random=Math.random){
 const rows=legacyFloorMap(floor,()=>0),bonus=Math.min(4,floor-1);
 rows.flat().forEach(n=>{if(n.type==='boss')n.payout=10+Math.min(10,floor*2);else if(n.type==='table')n.payout=(n.id.endsWith('entry')?6:n.id.endsWith('stakes')?8:4)+bonus;});
 // The entry table is the starting position; 3–5 route tiers follow it.
 // Permute rooms between the middle tiers as well as across lanes.
 if(floor!==4&&random()>.45){const a=rows[2].findIndex(n=>n.type==='workshop'),b=rows[3].findIndex(n=>n.id.endsWith('table-3'));[rows[2][a],rows[3][b]]=[rows[3][b],rows[2][a]];}
 for(const row of rows.slice(1,-2)){for(let i=row.length-1;i>0;i--){if(random()>.35){const j=Math.floor(random()*(i+1));[row[i],row[j]]=[row[j],row[i]];}}}
 rows.forEach((row,i)=>{const next=rows[i+1]||[];row.forEach((node,lane)=>{if(row.length===1||next.length<=1)node.next=next.map(n=>n.id);else{node.next=[next[lane%next.length].id];const side=lane===0?1:lane===row.length-1?lane-1:random()<.5?0:2;if(lane===1||random()<.65)node.next.push(next[side].id);}});});return rows;
}
function createFloorMap(floor,random=Math.random){
 const rows=versionTwoFloorMap(floor,random),prefix=floor===1?'':'f'+floor+'-',config=floorConfig(floor);
 // One additional choice before the guaranteed shop; no extra compulsory fight.
 const tier=[{id:prefix+'detour-workshop',type:'workshop',name:'Die Seitenwerkstatt'},
 {id:prefix+'detour-event',type:'event',name:'Eine letzte Gelegenheit'},
 {id:prefix+'detour-stakes',type:'table',name:'Doppelter Boden',target:Math.round(90*config.scale),spins:6,payout:6+Math.min(4,floor-1)}];
 for(let i=tier.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[tier[i],tier[j]]=[tier[j],tier[i]];}
 rows.splice(rows.length-2,0,tier);
 const before=rows.at(-4),shop=rows.at(-2)[0];
 before.forEach((node,lane)=>{node.next=[tier[lane%tier.length].id,tier[(lane+1)%tier.length].id];});tier.forEach(n=>n.next=[shop.id]);
 // Smooth the jump between floors, while optional stakes remain the risky path.
 if(floor>=2&&floor<=4)rows.flat().filter(n=>n.target).forEach(n=>n.target=Math.round(n.target*({2:.9,3:.8,4:.85}[floor])/10)*10);
 return rows;
}
const ECONOMY=Object.freeze({slotBase:6,slotFloorCap:10,refillBase:4,refillStep:3});
function slotPrice(state){return ECONOMY.slotBase+Math.min(ECONOMY.slotFloorCap,state.floor-1);}
function refillPrice(state){return ECONOMY.refillBase+Math.min(4,Math.floor((state.floor-1)/2))+state.rerolls*ECONOMY.refillStep;}
function formatPoints(value){return new Intl.NumberFormat('de-DE',{maximumFractionDigits:0}).format(Math.round(value));}
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
    state.floor++;if(state.floorBoon&&state.floorBoon.floor<state.floor)state.floorBoon=null;updateBuildStats(state);state.map=createFloorMap(state.floor,random);state.mapVersion=3;state.mapStep=-1;
    const entry=state.map[0][0];state.phase='map';
    // The next floor starts with its entry table; every build component persists.
    state.currentRoom=entry.id;
    return enterRoom(state,entry.id,random,true);
}
function rollShop(state,random=Math.random){
 state.shopOffers=['A','B','C'].map(letter=>({type:'slot',name:'Slot '+letter,price:slotPrice(state),sold:false}));
 const pool=Object.keys(WHEEL_ITEMS),name=pool[weightedIndex(pool.map(n=>WHEEL_ITEMS[n].rarity==='Epic'?1:WHEEL_ITEMS[n].rarity==='Rare'?2:4),random)];
 state.shopOffers.push({type:'item',name,price:slotPrice(state)+(WHEEL_ITEMS[name].rarity==='Epic'?5:WHEEL_ITEMS[name].rarity==='Rare'?3:1),sold:false});
}
function enterRoom(state, id, random = Math.random, floorEntry = false) {
    if (state.phase !== "map") return false;
    const room = currentMap(state)[state.mapStep + 1]?.find(candidate => candidate.id === id);
    if (!room || state.visited.includes(id) || (!floorEntry && !canEnterRoom(state,id))) return false;
    state.mapStep++; state.currentRoom = id; state.visited.push(id);
    if (["table", "boss"].includes(room.type)) {
        state.round++;
        Object.assign(state, { phase: "ready", streakGuardUsed:false, synergyTrace:[], roomSpins:0, activeHousePhase:1, target: room.target, spinsLeft: room.spins, score: 0, spinScore: 0, placedBets: [], selectedChip: null, breakdown: [], history: [], relicTrace: [], lastSpin: null });
        state.spinsLeft=Math.max(1,state.spinsLeft-(state.nextTableSpinDebt||0));state.nextTableSpinDebt=0;
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
function buyOffer(state, index, targetId = null, random = Math.random) {
    const offer = state.shopOffers[index];
    if (state.phase !== "shop" || !offer || offer.sold) return { ok: false, message: "Dieses Angebot ist nicht verfügbar." };
    if (state.coins < offer.price) return { ok: false, message: "Nicht genügend Run-Münzen." };
    if(offer.type==='slot'){
        const outcome=rollTokenReward(state,'Slot Token',random);if(!outcome)return {ok:false,message:'Kein Upgrade verfügbar.'};
        state.coins-=offer.price;offer.sold=true;state.pendingToken={...outcome,returnPhase:'shop'};state.phase='slot';state.selectedChip=null;
        return {ok:true,message:offer.name+' dreht.',outcome:state.pendingToken};
    }
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
    const price = refillPrice(state);
    if (state.phase !== "shop" || state.coins < price) return false;
    state.coins -= price; state.rerolls++; rollShop(state, random); return true;
}
function workshopChoices(state){return state.currentRoom.includes('detour-workshop')?['Delete','Rewrite']:state.floor===4?['Clone','Mitosis']:['Duplicate','Repaint'];}
function resolveRoom(state, choice, random = Math.random, options = {}) {
    if(state.phase==='event'&&BUILD_EVENTS.some(e=>e.id===state.eventId))return resolveBuildEvent(state,choice,options,random);
    let message;
    if (state.phase === "shop" && choice === "leave") message = "Weiter zum nächsten Raum.";
    else if (state.phase === "workshop" && [...workshopChoices(state),'leave'].includes(choice)) {
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
function buildTokenPool(){return [
    ...CHIP_CATALOG.filter(chip => chip.available !== false).map(chip => ({type:"chip",name:chip.name,unlock:chip.unlock,rarity:chip.rarity||({Basic:"Common",Crimson:"Uncommon",Onyx:"Uncommon",Balance:"Uncommon",Sniper:"Rare","High Roller":"Rare",Streak:"Epic"})[chip.name]||"Common"})),
    ...Object.keys(RELIC_TYPES).map(name => ({type:"relic",name,unlock:RELIC_TYPES[name].unlock,rarity:RELIC_TYPES[name].rarity||({"Blood Pact":"Common","Lone Wolf":"Uncommon","Lucky Seven":"Rare","Full Coverage":"Rare",Jackpot:"Epic"})[name]||"Common"})),
    ...Object.entries(WHEEL_ITEMS).map(([name,item]) => ({type:"item",name,rarity:item.rarity}))
].map(entry=>Object.fromEntries(Object.entries(entry).filter(([,value])=>value!==undefined)));}
const TOKEN_POOLS=buildTokenPool();
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
  check(int(s.slotUpgrades)&&s.slotUpgrades<=6);check(s.workshopServiced===null||typeof s.workshopServiced==='string'&&s.workshopServiced.length<120);
  check(['ready','won','lost','map','shop','workshop','event','floor-clear','complete','slot'].includes(s.phase));
  check(int(s.floor)&&s.floor>=1&&s.floor<=1000&&int(s.round)&&s.round>=1);
  for(const key of ['score','spinScore','target','coins','totalScore','bestSpin'])check(num(s[key]));
  for(const key of ['spinsLeft','roomSpins','rerolls','endlessRounds'])check(int(s[key]));check(s.spinsLeft<=8&&s.roomSpins<=8);
  check(int(s.bonusLuck)&&s.bonusLuck<=5&&int(s.nextTableSpinDebt)&&s.nextTableSpinDebt<=2&&typeof s.streakGuardUsed==='boolean');
  check(s.floorBoon===null||int(s.floorBoon.floor)&&s.floorBoon.floor>=s.floor&&s.floorBoon.floor<=s.floor+1);
  check(s.lastEvent===null||typeof s.lastEvent.name==='string'&&s.lastEvent.name.length<=100&&typeof s.lastEvent.message==='string'&&s.lastEvent.message.length<=1000);
  check(Array.isArray(s.synergyTrace)&&s.synergyTrace.length<=1024&&s.synergyTrace.every(t=>typeof t==='string'&&t.length<=200));
  check(typeof s.endless==='boolean'&&typeof s.normalWon==='boolean');check(s.floor<=4||s.endless&&s.normalWon);
  s.mapVersion=raw.mapVersion??1;check([1,2,3].includes(s.mapVersion));const template=(s.mapVersion===1?legacyFloorMap:s.mapVersion===2?versionTwoFloorMap:createFloorMap)(s.floor,()=>0);check(Array.isArray(s.map)&&s.map.length===template.length);
  const catalog=new Map(template.flat().map(n=>[n.id,n])),seen=new Set();
  s.map=raw.map.map((row,i)=>{check(Array.isArray(row)&&row.length===template[i].length);return row.map(saved=>{const node=catalog.get(saved.id);check(node&&!seen.has(node.id));seen.add(node.id);check(Array.isArray(saved.next)&&new Set(saved.next).size===saved.next.length);check(saved.next.every(id=>raw.map[i+1]?.some(n=>n.id===id)));check(i===template.length-1?saved.next.length===0:saved.next.length>0);return {...node,next:[...saved.next]};});});
  check(s.map[0][0].id===template[0][0].id&&s.map.at(-1)[0].type==='boss'&&s.map.at(-2)[0].type==='shop');
  for(let i=1;i<s.map.length;i++)check(s.map[i].every(n=>s.map[i-1].some(p=>p.next.includes(n.id))));
  check(int(s.mapStep)&&s.mapStep<s.map.length&&s.map[s.mapStep].some(n=>n.id===s.currentRoom));
  const room=currentRoom(s),roomIds=new Set(s.map.flat().map(n=>n.id));
  for(const key of ['visited','cleared']){check(Array.isArray(s[key])&&s[key].every(id=>typeof id==='string'&&id.length<100));check(new Set(s[key]).size===s[key].length);}
  check(s.visited.includes(s.currentRoom));check(Array.isArray(s.completedFloors)&&s.completedFloors.every(n=>int(n)&&n>=1&&n<=s.floor));
  check(Array.isArray(s.unlocks)&&s.unlocks.every(id=>ACHIEVEMENTS.some(a=>a.id===id)));
  const validateInventory=(values,max,known)=>{check(Array.isArray(values)&&values.length<=max);check(new Set(values.map(v=>v.id)).size===values.length);values.forEach(v=>check(int(v.id)&&known(v.name)));};
  validateInventory(s.chips,512,name=>CHIP_CATALOG.some(c=>c.name===name));check(s.chips.length>0);
  s.chips=s.chips.map(c=>{const base=CHIP_CATALOG.find(t=>t.name===c.name);check(Array.isArray(c.mutations)&&new Set(c.mutations).size===c.mutations.length&&c.mutations.every(m=>MUTATIONS[m]));const copy={...createChip(base,c.id),mutations:[...c.mutations]};if(typeof base.streak==='number'){check(int(c.streak));copy.streak=c.streak;}if(c.curse!=null){check(c.curse&&Object.hasOwn(CURSES,c.curse.name)&&int(c.curse.losses)&&c.curse.losses<3&&[null,'number','color','parity','range'].includes(c.curse.lastFamily));copy.curse={name:c.curse.name,losses:c.curse.losses,lastFamily:c.curse.lastFamily};}return copy;});
  validateInventory(s.relics,4,n=>!!RELIC_TYPES[n]);check(new Set(s.relics.map(r=>r.name)).size===s.relics.length);
  validateInventory(s.items,2,n=>!!WHEEL_ITEMS[n]);validateInventory(s.tokens,3,n=>!!TOKEN_TYPES[n]);
  for(const [key,counter]of [['chips','nextChipId'],['relics','nextRelicId'],['items','nextItemId'],['tokens','nextTokenId']])s[counter]=Math.max(int(s[counter])?s[counter]:0,...s[key].map(v=>v.id+1));
  const field=f=>f&&int(f.number)&&f.number<=18&&['red','black','green'].includes(f.color)&&(f.number===0?f.color==='green':f.color!=='green');
  check(Array.isArray(s.wheel)&&s.wheel.length>=6&&s.wheel.length<=40&&s.wheel.every(field));
  if(s.bossWheel!==null){check(room.name==='Double Zero'&&Array.isArray(s.bossWheel)&&s.bossWheel.length>=6&&s.bossWheel.length<=38&&s.bossWheel.every(field));check(JSON.stringify(s.wheel)===JSON.stringify([...s.bossWheel,{number:0,color:'green'},{number:0,color:'green'}]));}else check(s.wheel.length<=38);
  check(Array.isArray(s.placedBets)&&s.placedBets.length<=s.chips.length);const betIds=new Set();s.placedBets=s.placedBets.map(b=>{const chip=s.chips.find(c=>c.id===b.chip?.id);check(chip&&!betIds.has(chip.id));betIds.add(chip.id);check(b.type==='number'?s.wheel.some(f=>f.number===b.value):b.type==='outside'&&OUTSIDE.some(o=>o.value===b.value));return {chip,type:b.type,value:b.value};});
  s.selectedChip=s.chips.some(c=>c.id===s.selectedChip)?s.selectedChip:null;
  check(Array.isArray(s.shopOffers)&&s.shopOffers.length<=4);s.shopOffers.forEach(o=>check((o.type==='token'&&TOKEN_TYPES[o.name]||o.type==='slot'&&/^Slot [ABC]$/.test(o.name)||o.type==='item'&&WHEEL_ITEMS[o.name])&&num(o.price)&&typeof o.sold==='boolean'));
  if(s.phase==='event')check(EVENTS.some(e=>e.id===s.eventId));
  if(s.phase==='slot'){const p=s.pendingToken;check(p&&['ready','won','map','shop'].includes(p.returnPhase)&&TOKEN_POOLS.some(o=>o.type===p.type&&o.name===p.name&&o.rarity===p.rarity));check(RARITIES.includes(p.rolledRarity));if(p.mutations)check(Array.isArray(p.mutations)&&p.mutations.every(m=>MUTATIONS[m]));}else check(s.pendingToken===null);
  check(Array.isArray(s.history)&&s.history.length<=8&&s.history.every(field));
  check(Array.isArray(s.breakdown)&&s.breakdown.length<=512&&s.breakdown.every(b=>typeof b.name==='string'&&num(b.points)&&num(b.basePoints)&&Array.isArray(b.mutations)&&b.mutations.every(m=>MUTATIONS[m])));
  for(const b of s.breakdown){
   if(b.chipId!==undefined)check(int(b.chipId));
   if(b.effects!==undefined)check(Array.isArray(b.effects)&&b.effects.length<=24&&b.effects.every(e=>typeof e.name==='string'&&e.name.length<=100&&typeof e.label==='string'&&e.label.length<=200&&num(e.before)&&num(e.after)));
   if(b.betType!==undefined)check(b.betType==='number'?int(b.betValue)&&b.betValue<=18:b.betType==='outside'&&OUTSIDE.some(o=>o.value===b.betValue));
  }
  check(Array.isArray(s.relicTrace)&&s.relicTrace.length<=4&&s.relicTrace.every(t=>RELIC_TYPES[t.name]&&num(t.before)&&num(t.after)));
  if(s.lastSpin!==null)check(field(s.lastSpin.result)&&num(s.lastSpin.finalScore)&&num(s.lastSpin.relicScore)&&num(s.lastSpin.chipScore)&&int(s.lastSpin.bets)&&int(s.lastSpin.winners)&&Array.isArray(s.lastSpin.families));
  if(['ready','won','lost'].includes(s.phase)){check(['table','boss'].includes(room.type)&&s.target===room.target);if(s.phase==='ready')check(s.spinsLeft>0&&s.score<s.target);if(s.phase==='won')check(s.score>=s.target);if(s.phase==='lost')check(s.spinsLeft===0&&s.score<s.target);}
  if(['shop','workshop','event'].includes(s.phase))check(room.type===s.phase);
  if(s.phase==='complete')check(s.floor===4&&s.normalWon&&!s.endless&&room.type==='boss');
  if(s.phase==='floor-clear')check(room.type==='boss'&&(s.floor<4||s.endless));
  s.rewardPending=false;s.rewards=[];updateBuildStats(s);check(buildFits(s));
  return {ok:true,state:s,profile:normalizeProgress(data.profile),records:normalizeRecords(data.records),savedAt:num(data.savedAt)?data.savedAt:0};
 }catch{return {ok:false,reason:'invalid'};}
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { previewBet, RULES, CHIP_TYPES, HIGH_ROLLER, ZERO_CHIP, GAMBLER_CHIP, CHIP_CATALOG, MUTATIONS, WHEEL_ITEMS, WHEEL_LIMITS, RELIC_TYPES, betFamily, applyRelics, moveRelic, removeRelic, hasMutation, chipCapacity, updateBuildStats, removeChip, tableRewards, claimReward, skipReward, useWheelItem, createChip, createState, checkWin, calculateBetScore, resolveSpin, startSpin, nextRound, placeBet, returnChip };
    Object.assign(module.exports, { workshopChoices, versionTwoFloorMap, buildTokenPool, previewWheelItem, wheelComposition, legacyFloorMap, ECONOMY, slotPrice, refillPrice, formatPoints, BUILD_EVENTS, resolveBuildEvent, CURSES, chipLoad, buildFits, grantCurse, detectSynergies, activeSynergies, missingGreedy, SAVE_VERSION, encodeRun, decodeRun, mergeProgress, mergeRecords, ACHIEVEMENTS, START_LOADOUTS, normalizeProgress, recordAchievementSpin, contentUnlocked, EVENTS, FLOORS, floorConfig, housePhase, normalizeRecords, updateRecords, continueEndless, createFloorMap, currentMap, canEnterRoom, advanceFloor, FLOOR_MAP, currentRoom, enterRoom, buyOffer, rerollShop, resolveRoom });
    Object.assign(module.exports, {TOKEN_TYPES,TOKEN_POOLS,TOKEN_ART_WEIGHTS,RARITIES,rarityWeights,rollTokenReward,beginToken,claimToken,discardToken,CHIP_WORK,previewChipWork,applyChipWork,buySlotUpgrade,slotUpgradePrice});
}
if (typeof document !== "undefined") initializeGame();

function initializeGame() {
    document.documentElement.classList.toggle('touch-device',navigator.maxTouchPoints>0||matchMedia('(any-pointer:coarse)').matches);
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
    const format = formatPoints;
    const formatRate = value => numberFormat.format(value);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const betCells = new Map();
    const key = (type, value) => type + ":" + value;
    const feel=GameFeel.create({getState:()=>state,render,tone,soundEnabled:()=>soundEnabled,mutations:MUTATIONS,curses:CURSES,work:CHIP_WORK,
        synergies:()=>activeSynergies(state),room:()=>currentRoom(state),
        previewChip:id=>{const bet=state.placedBets.find(b=>b.chip.id===id);return bet?Onboarding.previewText(previewBet(state,id,bet.type,bet.value)):null;},
        previewWork:(id,m)=>previewChipWork(state,id,m),applyWork:(id,m)=>applyChipWork(state,id,m),
        chooseChip:(id,placed)=>{if(state.phase!=='ready')return;if(placed)returnChip(state,id);else state.selectedChip=id;render();say(placed?'Chip zurückgenommen.':'Chip gewählt. Jetzt ein Wettfeld antippen.');},
        advance:()=>{if(nextRound(state)){renderBoard();render();showJourney();}}
    });
    $('show-synergies').addEventListener('click',()=>feel.showSynergies());

    function say(message) {
        $("status").textContent = message;
        clearTimeout(noticeTimer);
        $("status").classList.toggle("notice", /zuerst|nicht|belegt|geschafft|beendet|angewendet|erhalten|gekauft/i.test(message));
        noticeTimer = setTimeout(() => $("status").classList.remove("notice"), 4200);
    }
    function tone(frequency,volume=.035,duration=.12) {
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
            gain.gain.setValueAtTime(volume, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration + .01);
        } catch { /* Audio support must never block a spin. */ }
    }
    const guide=Onboarding.create({getState:()=>state,started:()=>runStarted,room:()=>currentRoom(state),synergies:()=>activeSynergies(state),preview:(id,type,value)=>previewBet(state,id,type,value)});
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
            if (state.selectedChip === null) { guide.preview(type,value);say("Wähle einen Chip zum Setzen. Gesetzte Wetten kannst du hier prüfen."); return; }
            const chip = state.chips.find(item => item.id === state.selectedChip);
            if (placeBet(state, chip.id, type, value)) {
                feel.closeInfo();
                render();
                say(chip.name + " gesetzt. Du kannst weitere Chips setzen oder drehen.");
            } else say("The Minimalist: maximal 3 Chips. Nimm zuerst einen gesetzten Chip zurück.");
        });
        button.addEventListener("pointerenter",event=>{if(event.pointerType==='mouse')guide.preview(type,value);});
        button.addEventListener("focus",()=>guide.preview(type,value));
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
            target.title = fields.length + " von " + state.wheel.length + " Feldern · " + formatRate(fields.length / state.wheel.length * 100) + " %";
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
        if(chip.curse){button.classList.add('cursed-chip');button.title+='\n'+chip.curse.name+': '+CURSES[chip.curse.name].description;const seal=document.createElement('b');seal.className='curse-badge';seal.textContent=CURSES[chip.curse.name].symbol;seal.setAttribute('aria-hidden','true');button.append(seal);}
        button.setAttribute("aria-label", chipDisplayName(state, chip) + (chip.curse?' · Curse '+chip.curse.name:'') + (placed ? " zurücknehmen" : " auswählen"));
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
            feel.closeInfo();
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
        feel.bindChip(button,chip,placed);
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
        for (let i = chipLoad(state); i < chipCapacity(state); i++) {
            const slot = document.createElement("div"); slot.className = "chip-slot empty-slot";
            slot.textContent = "+"; slot.title = "Freier Platz: Im Shop einen Chip kaufen."; $("chips").append(slot);
        }
        $("chips").style.setProperty("--slot-count", chipCapacity(state));
        const chip = state.chips.find(item => item.id === (state.selectedChip ?? inspectedChip));
        $("chip-info").querySelector("strong").textContent = chip ? chip.name : "Ein Chip. Viele Möglichkeiten.";
        $("chip-info").querySelector("span").textContent = chip ? chip.effect + (typeof chip.streak === "number" ? " Aktuelle Serie: " + chip.streak + " · ×" + formatRate(1 + chip.streak * .25) : "") : "Wähle einen Chip, um seinen Effekt zu sehen.";
        $("chip-mutations").replaceChildren(...(chip ? chip.mutations.map(name => {
            const tag = document.createElement("span"); tag.textContent = name; tag.title = MUTATIONS[name].description; return tag;
        }) : []));
    }
    function render() {
        queueMicrotask(()=>guide.update());
        autoSave();
        $("open-tokens").textContent = "✦ " + state.tokens.length;$("open-tokens").hidden=!state.tokens.length&&!state.pendingToken;
        $("open-tokens").disabled = !["ready","won","map","shop","slot"].includes(state.phase);
        const bossActive = currentRoom(state).type === "boss" && ["ready", "spinning"].includes(state.phase);
        document.querySelector(".game-layout").classList.toggle("boss-active", bossActive);
        $("table-number").classList.toggle("boss-label", bossActive);
        $("boss-banner").hidden = !bossActive;
        if (bossActive) {
            const zeros = state.wheel.filter(field => field.number === 0).length;
            $("boss-rule").textContent = (currentRoom(state).name==="The House"?housePhaseRule(state):bossRule(currentRoom(state))) + (currentRoom(state).name==="Double Zero" ? " · "+formatRate(100*zeros/state.wheel.length)+" % Null" : "");
            document.querySelector("#boss-banner strong").textContent=currentRoom(state).name.toUpperCase();
        }
        $("open-menu").disabled = ["spinning","slot"].includes(state.phase);
        $("show-map").textContent = "♧ Floor-Map · " + state.coins + " Münzen";
        $("show-map").disabled = ["spinning","slot"].includes(state.phase);
        renderChips();
        renderRelics();
        $("show-scoring").disabled = !state.lastSpin || state.phase === "spinning";
        $('show-scoring').textContent='SPIN ↗';
        $('show-scoring').setAttribute('aria-label',state.lastSpin ? state.lastSpin.winners+' von '+state.lastSpin.bets+' Wetten getroffen. Auswertung öffnen.' : 'Spin-Auswertung');
        $('show-scoring').title=$('show-scoring').getAttribute('aria-label');
        if ($("relic-dialog").open) renderRelicDetails();
        $("edit-build").disabled = state.phase === "spinning";
        $("edit-build").textContent = 'Build';
        $('show-synergies').textContent='✦ '+activeSynergies(state).length;
        $('show-synergies').setAttribute('aria-label',activeSynergies(state).length+' aktive Synergien ansehen');
        $('show-synergies').disabled=state.phase==='spinning';
        $("edit-build").title = "Effekte und Mutationen ansehen; Chips ohne gesetzte Wetten ablegen";
        $("capacity-label").textContent = chipLoad(state) + " / " + chipCapacity(state);
        $("luck").textContent = state.luck;
        $("wheel-count").textContent = state.wheel.length + " FELDER";
        renderItems();
        $("table-number").textContent = String(state.floor).padStart(2,"0")+" / " + currentRoom(state).name.toUpperCase();
        if (bossActive) $("table-number").textContent = "♛ BOSS AKTIV · "+currentRoom(state).name.toUpperCase();
        $("score").textContent = format(state.score);
        $("target-label").textContent = "TISCHZIEL " + format(state.target);
        $("progress-label").textContent = state.score>=state.target ? "ZIEL ERREICHT" : "Noch " + format(state.target-state.score);
        $("progress").max = state.target;
        $("progress").value = Math.min(state.target, state.score);
        $("spins").textContent = state.spinsLeft;
        $("spin-dots").replaceChildren(...Array.from({ length: currentRoom(state).spins || RULES.spins }, (_, i) => {
            const dot = document.createElement("i"); dot.className = i >= state.spinsLeft ? "used" : ""; return dot;
        }));
        $("spin-score").textContent = "+" + format(state.spinScore);
        $("spin-score").style.setProperty("--score-digits",$("spin-score").textContent.length);
        $("bet-count").textContent = state.placedBets.length + " / " + (bossActive && currentRoom(state).name==="The Minimalist" ? Math.min(3,state.chips.length) : state.chips.length) + " gesetzt";
        $("clear").disabled = state.phase !== "ready" || state.placedBets.length === 0;
        $("spin").disabled = state.phase === "spinning" || (state.phase === "ready" && (!state.placedBets.length || missingGreedy(state).length>0));
        $("spin").title=missingGreedy(state).length?'Greedy zuerst setzen: '+missingGreedy(state).map(c=>chipDisplayName(state,c)).join(', '):state.phase==='ready'&&!state.placedBets.length?'Setze zuerst einen Chip auf ein Wettfeld.':'';
        if(state.phase==='ready'&&missingGreedy(state).length)$('bet-count').textContent+=' · '+missingGreedy(state).length+' Greedy fehlt';
        $("spin").textContent = state.phase === "won" ? "WEITER ZUR MAP →" : state.phase === "lost" ? (state.endless?"ENDLESS-ERGEBNIS →":"NEUER RUN ↻") : state.phase === "spinning" ? "DAS RAD DREHT …" : "RAD DREHEN ↗";
        if (state.phase === "slot") $("spin").textContent = "UPGRADE ANSEHEN ✦";
        if (["map", "shop", "workshop", "event", "floor-clear", "complete"].includes(state.phase)) $("spin").textContent = state.phase === "map" ? "WEG WÄHLEN →" : state.phase === "complete" ? "RUN GEWONNEN ★" : "RAUM ÖFFNEN →";
        $("wheel-status").textContent = { ready: "DER TISCH WARTET", spinning: "DAS GLÜCK NIMMT SEINEN LAUF", won: "TISCH GESCHAFFT", lost: "RUN BEENDET" }[state.phase];
        if (!["ready", "spinning", "won", "lost"].includes(state.phase)) $("wheel-status").textContent = "WÄHLE DEINEN WEG";
        $("breakdown").replaceChildren(...(state.breakdown.length ? state.breakdown.map(item => {
            const row = document.createElement("li");
            const label = document.createElement("span"); label.textContent = item.name + (item.echo ? " ↻ ZUSATZWERTUNG" : "");
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
    $("spin").addEventListener("click", async () => {
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
        const scoreBefore=state.score,rotationBefore=rotation;
        const resultIndex = Math.floor(Math.random() * state.wheel.length);
        const result = state.wheel[resultIndex];
        pendingSpinSnapshot=structuredClone(state);resolveSpin(pendingSpinSnapshot,result);
        const previousUnlocks=new Set(profile.unlocks);profile=recordAchievementSpin(profile,pendingSpinSnapshot.lastSpin,pendingSpinSnapshot.normalWon);pendingSpinSnapshot.unlocks=[...profile.unlocks];records=updateRecords(records,pendingSpinSnapshot);saveProgress();
        const newUnlocks=ACHIEVEMENTS.filter(a=>profile.unlocks.includes(a.id)&&!previousUnlocks.has(a.id));
        const angle = (resultIndex + .5) * 360 / state.wheel.length;
        const desired = (360 - angle) % 360;
        rotation += 1080 + (desired - rotation % 360 + 360) % 360;
        $("result").textContent = "…";
        $("result-detail").textContent = "Deine Wetten sind jetzt gesperrt.";
        render(); say("Das Rad dreht. Ein Spin wurde eingesetzt."); tone(440);
        try{await feel.spin(rotationBefore,rotation,RULES.spinDuration,state.wheel.length);
        $('result').textContent=result.number+' · '+({red:'ROT',black:'SCHWARZ',green:'GRÜN'}[result.color]);
        $('spin').textContent='AUSWERTUNG …';
        await feel.scoring(pendingSpinSnapshot,scoreBefore,resultIndex);}finally{
            state=pendingSpinSnapshot;pendingSpinSnapshot=null;saveRecords();
            $("result").textContent = result.number + " · " + ({ red: "ROT", black: "SCHWARZ", green: "GRÜN" }[result.color]);
            $("result-detail").textContent = result.number === 0 ? (state.lastSpin.zeroMultiplier===1?"Grüner Pakt: kein Null-Abzug.":"Null-Effekt: Gesamter Spin ×0,75.") : "+" + format(state.spinScore) + " Punkte in diesem Spin";
            renderBoard(); render();
            document.querySelector('.bet-cell[data-type="number"][data-value="'+result.number+'"]')?.classList.add('landing-hit');
            $('wheel').children[resultIndex]?.classList.add('landing-hit');
            if(['won','lost'].includes(state.phase))feel.roomReceipt();
            if (state.phase === "won") say("Tisch geschafft! +" + currentRoom(state).payout + " Münzen. Weiter zur Map.");
            else if (state.phase === "lost" && state.endless) say('Endless beendet. Dein normaler Sieg bleibt erhalten.');
            else if (state.phase === "lost") say("Run beendet. " + format(state.target - state.score) + " Punkte fehlten zum Ziel. Starte einen neuen Versuch.");
            else say(state.spinScore ? "Treffer! Wetten beibehalten oder deinen Build anpassen." : "Kein Treffer. Du hast noch " + state.spinsLeft + " Spins.");
        if(newUnlocks.length)say("Freigeschaltet: "+newUnlocks.map(a=>a.reward).join(", ")+" · Ab jetzt im Slot-Pool!");
        }
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
        $("build-title").textContent = 'Dein Build';
        const synergyArea=$('build-synergies');synergyArea.replaceChildren();
        const active=activeSynergies(state);
        const heading=document.createElement('h3');heading.textContent='Synergien · '+active.length+' aktiv';synergyArea.append(heading);
        const appendSynergy=(target,synergy)=>{const card=document.createElement('article');card.className='synergy-card'+(synergy.active?' active':'');const name=document.createElement('strong');name.textContent=(synergy.active?'✦ ':'◇ ')+synergy.name;const description=document.createElement('p');description.textContent=synergy.description;const why=document.createElement('small');why.textContent=(synergy.active?'Aktiv: ':'Benötigt: ')+synergy.reason;card.append(name,description,why);target.append(card);};
        active.forEach(synergy=>appendSynergy(synergyArea,synergy));
        const inactive=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Weitere Builds entdecken';inactive.append(summary);detectSynergies(state).filter(x=>!x.active).forEach(x=>appendSynergy(inactive,x));synergyArea.append(inactive);
        const status=document.createElement('p');status.className='build-status';status.textContent=[state.bonusLuck?'+'+state.bonusLuck+' permanentes Event-Luck':'',state.floorBoon?'Glückspass: Floor '+state.floorBoon.floor+' · +3 Luck':'',state.nextTableSpinDebt?'Nächster Tisch: −'+state.nextTableSpinDebt+' Spin(s)':''].filter(Boolean).join(' · ');synergyArea.append(status);
        if(state.lastEvent){const last=document.createElement('p');last.className='build-status';last.textContent=state.lastEvent.name+': '+state.lastEvent.message;synergyArea.append(last);}
        $("build-description").textContent = "Chips, Synergien und Flüche. Ablegen entfernt den Chip dauerhaft; der letzte Chip bleibt erhalten. Heavy belegt zwei Plätze.";
            $("build-catalog").replaceChildren(...state.chips.map(chip => {
                const card = document.createElement("div"); card.className = "roster-detail";
                const name = document.createElement("strong"); name.textContent = chipDisplayName(state, chip);
                const effect = document.createElement("p"); effect.textContent = chip.effect;
                card.append(name, effect);if(chip.build){const tag=document.createElement('small');tag.className='build-tag';tag.textContent=chip.build;card.prepend(tag);}
                chip.mutations.forEach(mutation => {
                    const line = document.createElement("p"); line.className = "mutation-description";
                    line.textContent = mutation + ": " + MUTATIONS[mutation].description; card.append(line);
                });
                if(chip.curse){const curse=document.createElement('p');curse.className='curse-description';curse.textContent=CURSES[chip.curse.name].symbol+' '+chip.curse.name+': '+CURSES[chip.curse.name].description+(chip.curse.name==='Fragile'?' · '+chip.curse.losses+'/3 Verluste':'')+(chip.curse.name==='Addicted'?' · letzte Wettart: '+(chip.curse.lastFamily||'keine'):'');card.append(curse);}
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
        if(offer.type==='slot')return 'Sofortiger Zufalls-Spin · 55 % Chip, 25 % Relic, 20 % Rad-Werkzeug. Alle drei Slots nutzen denselben Pool. Luck erhöht die Seltenheit.';
        if (offer.type === "token") return TOKEN_TYPES[offer.name].type ? "Garantiert " + ({chip:"einen Chip",relic:"ein Relic",mutation:"eine Mutation"}[TOKEN_TYPES[offer.name].type]) + ". Seltenheit und Upgrade bestimmt die Slot-Machine." : "55 % Chip · 25 % Relic · 20 % Rad-Werkzeug. Luck verbessert die Seltenheit.";
        if (offer.type === "mutation") return MUTATIONS[offer.name].description;
        if (offer.type === "item") return WHEEL_ITEMS[offer.name].rarity + " · " + WHEEL_ITEMS[offer.name].description;
        if (offer.type === "relic") return RELIC_TYPES[offer.name].description;
        return CHIP_CATALOG.find(chip => chip.name === offer.name).effect + (offer.mutations?.length ? " · ✦ " + offer.mutations.map(name=>name+": "+MUTATIONS[name].description).join(" · ") : "");
    }
    function openWorkbench(item){
        workshopItemId=item.id;workshopSource=null;workshopTarget=null;
        $('workshop-title').textContent='DIE RADWERKSTATT';$('workshop-description').textContent=item.name+' · '+WHEEL_ITEMS[item.name].description;
        $('rewrite-control').hidden=item.name!=='Rewrite';$('rewrite-number').value='7';
        $('workshop-feedback').textContent=item.name==='Clone'?'Quelle wählen, dann Ziel.':'Ein Bauteil wählen.';
        renderWorkshop();if(!$('workshop-dialog').open)$('workshop-dialog').showModal();
    }
    function wheelPrint(element,wheel){
        const colors={red:'#b9574f',black:'#17382f',green:'#558c74'},angle=360/wheel.length;
        element.style.background='conic-gradient('+wheel.map((f,i)=>colors[f.color]+' '+(i*angle)+'deg '+((i+1)*angle)+'deg').join(',')+')';
        element.dataset.count=wheel.length;
    }
    function renderItems() {
        $("items").replaceChildren(...Array.from({ length: 2 }, (_, index) => {
            const item = state.items[index];
            const button = document.createElement("button"); button.className = "item-slot";
            button.textContent = item ? item.name : "+";
            button.title = item ? WHEEL_ITEMS[item.name].description : "Rad-Werkzeuge im Shop kaufen oder in der Werkstatt erhalten";
            button.disabled = !item || !(state.phase==='ready'||state.phase==='map'&&currentRoom(state)?.type==='workshop');
            if (item) button.addEventListener("click", () => {
                openWorkbench(item);
            });
            return button;
        }));
    }
    function renderWorkshop() {
        const item = state.items.find(item => item.id === workshopItemId);
        if (!item) return;
        const tools=$('workbench-tools');tools.replaceChildren(...state.items.map(tool=>{const button=journeyButton(tool.name,()=>openWorkbench(tool));button.innerHTML=gameIcon(tool.name)+'<span>'+tool.name+'</span>';button.setAttribute('aria-pressed',String(tool.id===item.id));return button;}));
        wheelPrint($('workbench-wheel'),state.wheel);
        $('workshop-dialog').style.setProperty('--field-rows',Math.ceil(state.wheel.length/8));
        $('workshop-dialog').style.setProperty('--touch-field-rows',Math.ceil(state.wheel.length/5));
        $('workshop-dialog').classList.toggle('dense-wheel',state.wheel.length>26);
        $('workbench-tool-name').textContent=item.name;
        $("wheel-fields").replaceChildren(...state.wheel.map((field, index) => {
            const button = document.createElement("button");
            button.className = "wheel-field " + field.color;
            button.dataset.index = index;
            button.textContent = field.number;
            const dense=state.wheel.length>26, slots=dense?Math.ceil(state.wheel.length/2):state.wheel.length;
            const angle=(dense?Math.floor(index/2):index)/slots*Math.PI*2-Math.PI/2,radius=dense?(index%2?33:46):42;button.style.left=(50+radius*Math.cos(angle))+'%';button.style.top=(50+radius*Math.sin(angle))+'%';
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
        const preview=previewWheelItem(state,item.id,workshopSource,{number:Number($('rewrite-number').value),targetIndex:workshopTarget});
        $('apply-item').disabled=!preview.ok;
        wheelPrint($('workbench-after'),preview.wheel);
        const words={red:'ROT',black:'SCHWARZ',green:'NULL'};
        $('workbench-comparison').replaceChildren(...wheelComposition(state.wheel).map((entry,i)=>{const row=document.createElement('div');row.className=entry.color;row.textContent=words[entry.color]+' '+entry.count+' → '+wheelComposition(preview.wheel)[i].count;return row;}));
        $('workbench-preview').textContent=workshopSource===null?'Wähle ein Radfeld.':preview.ok?item.name+' · '+state.wheel.length+' → '+preview.wheel.length+' Felder · Item wird verbraucht.':preview.message;
        $('workbench-after').classList.toggle('preview-ready',preview.ok);
    }
    $("apply-item").addEventListener("click", () => {
        const rawNumber = $("rewrite-number").value.trim();
        const result = useWheelItem(state, workshopItemId, workshopSource, { number: rawNumber === "" ? NaN : Number(rawNumber), targetIndex: workshopTarget });
        if (!result.ok) { $("workshop-feedback").textContent = result.message; return; }
        $("workshop-dialog").close();
        renderBoard(); render(); say(result.message);if(state.phase==='map')showJourney();
    });
    $("reset-workshop").addEventListener("click", () => { workshopSource = null; workshopTarget = null; renderWorkshop(); $("workshop-feedback").textContent = "Auswahl aufgehoben. Wähle ein Feld."; });
    $('rewrite-number').addEventListener('input',renderWorkshop);
    $('close-workshop').addEventListener('click',()=>{$('workshop-dialog').close();if(state.phase==='map')showJourney();});
    $('workshop-dialog').addEventListener('cancel',()=>{if(state.phase==='map')setTimeout(showJourney,0);});
    function renderRelics() {
        $("relic-slots").replaceChildren(...Array.from({ length: 4 }, (_, index) => {
            const relic = state.relics[index];
            const definition = relic ? RELIC_TYPES[relic.name] : null;
            const button = document.createElement("button");
            button.className = "relic-slot " + (definition?.className || "empty-relic");
            if(relic)button.dataset.relic=relic.id;
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
            card.append(position, heading, description);if(definition.build){const tag=document.createElement('small');tag.className='build-tag';tag.textContent=definition.build;card.insertBefore(tag,description);}
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
        state.breakdown.forEach(entry => step(entry.name, (entry.won ? format(entry.basePoints) + (entry.echo ? ' ×2 Zusatzwertung' : '') + ' = ' + format(entry.points) : 'Kein Treffer · 0')+(entry.curseNote?' · '+entry.curseNote:'')));
        (state.synergyTrace||[]).forEach(note=>step('Build-Effekt',note,'triggered-step'));
        step("Chip-Summe", format(spin.chipScore));
        state.relicTrace.forEach((entry, index) => step((index + 1) + ". " + entry.name, entry.triggered ? entry.effect + " · " + format(entry.before) + " → " + format(entry.after) : "Nicht ausgelöst · " + format(entry.after), entry.triggered ? "triggered-step" : "inactive-step"));
        if(spin.housePhase)step("The House", "Phase "+spin.housePhase);
        if(spin.housePenalty)step("The House · 20 %", "−"+format(spin.housePenalty)+" Punkte");
        if(spin.bossPenalty)step(spin.housePhase?"Haussteuer":"The Taxman", "−"+format(spin.bossPenalty)+" Punkte");
        if(spin.cursePenalty)step('Volatile · nach Relics/Boss','−'+format(spin.cursePenalty)+' Punkte');
        if (spin.zeroMultiplier !== 1) step("Null-Effekt", format(spin.relicScore-(spin.bossPenalty||0)-(spin.housePenalty||0)-(spin.cursePenalty||0)) + " ×0,75 = " + format(spin.finalScore));
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
        return room.target ? room.target + ' Punkte · ' + room.spins + ' Spins\n'+(state.visited.includes(room.id)?'+'+room.payout+' Münzen':'Raumprämie nach dem Sieg') + (room.type === 'boss' ? '\n'+bossRule(room) : '') : { shop: 'Drei gemischte Zufalls-Spins, ein Werkzeug und eine Platzmarke. Nachfüllen ab '+refillPrice(state)+' Münzen.', workshop: 'Kostenlos: '+workshopChoices({...state,currentRoom:room.id}).join(' oder ')+'. Chip-Prägung optional gegen Münzen.', event: 'Ein Handel mit Folgen. Was dich erwartet, erfährst du im Raum.' }[room.type];
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
        $('floor-map').replaceChildren();$('floor-map').classList.toggle('extended-map',currentMap(state).length>6);
        $('floor-map').style.setProperty('--route-rows',currentMap(state).length);
        $('map-title').textContent='DER WEG ZUM HAUS';
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
            button.className = 'route-node ' + room.type + (room.id===state.currentRoom?' current':'') + (available ? ' reachable' : '') + (state.visited.includes(room.id) ? ' visited' : '');
            button.dataset.room = room.id; button.style.left = x/6+'%'; button.style.top = y/4.8+'%';
            button.innerHTML = gameIcon(room.id.endsWith('stakes') ? 'stakes' : room.type);
            if(room.type!=='boss'){const label=document.createElement('span');label.className='route-type-label';label.textContent=room.id.endsWith('stakes')?'RISIKO':({table:'TISCH',shop:'SHOP',workshop:'WERKSTATT',event:'EREIGNIS'}[room.type]);button.append(label);}
            if (room.type === 'boss') { const label = document.createElement('span'); label.className = 'boss-node-label'; label.textContent = 'FLOOR-BOSS'; button.append(label); }
            button.setAttribute('aria-label', (room.id===state.currentRoom?'Du bist hier. ':available?'Wählbar. ':'Gesperrt. ')+room.name + '. ' + roomInfo(room));
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
        const routeScroll=document.querySelector('.route-scroll'),current=$('floor-map').querySelector('[aria-current="step"]');
        if(current)routeScroll.scrollTop=Math.max(0,current.offsetTop-routeScroll.clientHeight*.72);
    }
    $('enter-map-room').addEventListener('click',()=>{
        if (!enterRoom(state,selectedMapRoom)) return;
        $('map-dialog').close(); shopChoice=null; renderBoard(); resetResult(); render();
        if (state.phase !== 'ready') showRoom();
        else say(currentRoom(state).name + ' · ' + roomInfo(currentRoom(state)).replaceAll('\n',' · '));
    });
    function selectShopOffer(index){
        shopChoice=index;const offer=state.shopOffers[index];
        $('shop-stock').querySelectorAll('button').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
        const pane=$('shop-inspector');pane.replaceChildren();
        const heading=document.createElement('h3');heading.textContent=offer.name;
        const description=document.createElement('p');description.textContent=offer.type==='slot'?'Ein Kauf. Ein sofortiger Zufalls-Spin.':rewardDescription(offer);
        const feedback=document.createElement('p');feedback.className='purchase-warning';
        let target=null;const full=offer.type==='item'&&state.items.length>=2;
        const purchase=journeyButton(offer.sold?'VERKAUFT ✓':(offer.type==='slot'?'KAUFEN & DREHEN':'KAUFEN')+' · '+offer.price+' ◉',()=>{
            const result=buyOffer(state,index,target);render();
            if(result.ok)purchase.disabled=true;
            if(result.ok)feel.sold(index);
            if(result.ok&&state.phase==='slot'){$('room-dialog').querySelectorAll('button').forEach(b=>b.disabled=true);openTokens();spinSlot(true);}
            else{renderShop();$('room-feedback').textContent=result.message;}
        },offer.sold||state.coins<offer.price||full||(offer.type==='token'&&state.tokens.length>=3));
        purchase.id='purchase-offer';purchase.classList.add('purchase-button');
        if(state.coins<offer.price)feedback.textContent='Es fehlen '+(offer.price-state.coins)+' Münzen.';
        if(full){feedback.textContent='Inventar voll · Werkzeug zum Ersetzen wählen.';const targets=document.createElement('div');targets.className='purchase-targets';state.items.forEach(item=>targets.append(journeyButton(item.name,()=>{target=item.id;purchase.disabled=offer.sold||state.coins<offer.price;feedback.textContent=item.name+' wird ersetzt.';})));pane.append(targets);}
        pane.prepend(heading,description);
        if(offer.type==='slot'){const odds=document.createElement('div');odds.className='shop-pool';odds.innerHTML='<span>● <b>55 %</b><small>CHIP</small></span><span>♛ <b>25 %</b><small>RELIC</small></span><span>⚒ <b>20 %</b><small>RAD</small>';pane.append(odds);}
        const budget=document.createElement('p');budget.className='shop-budget';budget.textContent=offer.sold?'Bereits gekauft':state.coins>=offer.price?'Danach '+(state.coins-offer.price)+' ◉':'Es fehlen '+(offer.price-state.coins)+' ◉';pane.append(budget,feedback,purchase);
    }
    function renderShop() {
        $('room-dialog').classList.add('shop-scene');
        $('room-title').textContent='DER HÄNDLER';$('room-description').textContent='';
        if (state.currentRoom.endsWith('final-shop')) $('room-description').textContent='♛ '+floorConfig(state.floor).boss+' · '+currentMap(state).at(-1)[0].target+' Punkte · '+bossRule(currentMap(state).at(-1)[0]);

        $('room-eyebrow').textContent='FLOOR '+state.floor+' · '+state.coins+' MÜNZEN';
        $('room-actions').replaceChildren();
        const layout=document.createElement('div');layout.className='shop-layout';
        const shelf=document.createElement('div');shelf.className='shop-stock';shelf.id='shop-stock';
        state.shopOffers.forEach((offer,index)=>{
            const token=TOKEN_TYPES[offer.name]||{type:offer.type==='slot'?null:'item',symbol:offer.type==='slot'?'?':'⚒'};
            const card=journeyButton('',()=>{selectShopOffer(index);if(matchMedia('(max-width:700px)').matches)$('shop-inspector').scrollIntoView({block:'start',behavior:'instant'});});card.className='goods-card '+(token.type||'item')+(offer.sold?' sold':'')+(!offer.sold&&state.coins<offer.price?' unaffordable':'');card.dataset.offer=index;
            const category=document.createElement('small');category.textContent=offer.type==='slot'?'ZUFALL · COMMON–LEGENDARY':offer.type==='item'?WHEEL_ITEMS[offer.name].rarity+' · WERKZEUG':'ALTER TOKEN';
            const art=document.createElement('span');art.className='goods-art';art.innerHTML=gameIcon(offer.type==='item'?offer.name:token.type||'table');
            const symbol=document.createElement('b');symbol.textContent=token.symbol;art.append(symbol);
            const name=document.createElement('strong');name.textContent=offer.name;
            const price=document.createElement('span');price.className='price-tag';price.textContent=offer.sold?'VERKAUFT':offer.price+' ◉';
            const tip=document.createElement('span');tip.className='goods-tooltip';tip.id='offer-tip-'+index;tip.textContent=rewardDescription(offer);tip.setAttribute('role','tooltip');
            card.setAttribute('aria-label',offer.name+', '+offer.price+' Münzen'+(offer.sold?', verkauft':''));card.setAttribute('aria-describedby',tip.id);
            const effect=document.createElement('span');effect.className='goods-effect';effect.textContent=offer.type==='slot'?'Zufälliger Chip, Relic oder Rad-Werkzeug':rewardDescription(offer);
            card.append(category,art,name,effect,price,tip);shelf.append(card);
        });
        const pane=document.createElement('aside');pane.id='shop-inspector';pane.className='shop-inspector';
        pane.innerHTML='<span class="shop-cursor">↖</span><h3>Karte wählen</h3>';
        layout.append(shelf,pane);
        const footer=document.createElement('div');footer.className='shop-controls';
        const wallet=document.createElement('div');wallet.className='shop-wallet';wallet.innerHTML='<small>DEINE MÜNZEN</small><strong>'+state.coins+' ◉</strong><span>Items '+state.items.length+'/2 · Relics '+state.relics.length+'/4</span>';
        footer.append(wallet,journeyButton('↻ NACHFÜLLEN · '+refillPrice(state)+' ◉',()=>{if(rerollShop(state)){shopChoice=null;render();renderShop();$('room-feedback').textContent='Angebote nachgefüllt.';}},state.coins<refillPrice(state)),journeyButton('ZUR MAP →',()=>{resolveRoom(state,'leave');$('room-dialog').close();render();selectedMapRoom=null;showJourney();}));
        if(state.tokens.length)footer.insertBefore(journeyButton('✦ '+state.tokens.length+' ALTE TOKENS',openTokens),footer.children[1]);
        $("room-actions").append(layout,footer);
        const capacity=document.createElement('div');capacity.className='capacity-offer';
        const slotText=document.createElement('span');slotText.textContent='⊕ PLATZMARKE · Common · +1 Chip-Platz für diesen Run';
        const slotBuy=journeyButton((state.slotUpgrades>=6?'AUSVERKAUFT':slotUpgradePrice(state)+' ◉ · KAUFEN'),()=>{const result=buySlotUpgrade(state);render();renderShop();$('room-feedback').textContent=result.message;if(result.ok){feel.punch($('capacity-label'),true);tone(660);}},state.slotUpgrades>=6||state.coins<slotUpgradePrice(state));slotBuy.id='buy-slot-upgrade';capacity.append(slotText,slotBuy);$('room-actions').append(capacity);
        if(shopChoice===null||state.shopOffers[shopChoice]?.sold)shopChoice=state.shopOffers.findIndex(o=>!o.sold);if(shopChoice>=0&&state.shopOffers[shopChoice])selectShopOffer(shopChoice);
    }


    function renderEventChoices(event,finish){
        const area=$('room-actions'),choices=document.createElement('div');choices.className='event-decisions';
        const controls=document.createElement('div');controls.className='event-targets';area.append(controls,choices);
        const selected={};const selects={};
        const makeSelect=(key,label,items)=>{const wrap=document.createElement('label');wrap.textContent=label;const select=document.createElement('select');select.setAttribute('aria-label',label);select.dataset.eventTarget=key;const blank=document.createElement('option');blank.value='';blank.textContent='Bitte wählen';select.append(blank);items.forEach(([value,text])=>{const o=document.createElement('option');o.value=value;o.textContent=text;select.append(o);});select.addEventListener('change',()=>{selected[key]=select.value===''?undefined:key==='mutation'?select.value:Number(select.value);if(key==='chipId')refreshMutations();refresh();});wrap.append(select);controls.append(wrap);selects[key]=select;return select;};
        const targets=new Set(event.choices.map(c=>c.target));
        if(targets.has('chip')||targets.has('mutation'))makeSelect('chipId','Chip',state.chips.map(c=>[c.id,chipDisplayName(state,c)+(c.curse?' · '+c.curse.name:'')]));
        if(targets.has('relic'))makeSelect('relicId',event.id==='altar'?'Relic ersetzen (nur bei 4 nötig)':'Relic',state.relics.map(r=>[r.id,r.name]));
        if(targets.has('field'))makeSelect('fieldIndex','Radfeld',permanentWheel(state).map((f,i)=>[i,(i+1)+': '+f.number+' · '+{red:'ROT',black:'SCHWARZ',green:'GRÜN'}[f.color]]));
        if(targets.has('mutation'))makeSelect('mutation','Mutation',[]);
        function refreshMutations(){if(!selects.mutation)return;selects.mutation.replaceChildren();const blank=document.createElement('option');blank.value='';blank.textContent='Bitte wählen';selects.mutation.append(blank);(state.chips.find(c=>c.id===selected.chipId)?.mutations||[]).forEach(m=>{const o=document.createElement('option');o.value=m;o.textContent=m;selects.mutation.append(o);});selected.mutation=undefined;}
        function refresh(){choices.replaceChildren();for(const c of event.choices){const preview=resolveBuildEvent(structuredClone(state),c.id,selected,()=>0);const card=document.createElement('div');card.className='event-choice';const button=journeyButton(c.label,()=>finish(c.id,{...selected}),!preview.ok);card.append(button);const note=document.createElement('p');note.textContent=!preview.ok?preview.message:event.id==='brand'?CURSES[c.id].description:'Bereit';card.append(note);choices.append(card);}}
        refresh();area.append(journeyButton('OHNE HANDEL WEITER →',()=>finish('leave')));
    }

    function showRoom() {
        const room = currentRoom(state);
        $("room-eyebrow").textContent = "FLOOR " + state.floor + " · " + state.coins + " RUN-MÜNZEN";
        $("room-title").textContent = state.phase === "complete" ? "The House besiegt · Run gewonnen!" : room.name;
        $("room-actions").replaceChildren();
        const add = (label, action, disabled) => $("room-actions").append(journeyButton(label, action, disabled));
        const finish = (choice, options={}) => {
            const wasWorkshop=state.phase==='workshop';const result = resolveRoom(state, choice, Math.random, options);
            if (!result.ok) { $("room-feedback").textContent = result.message; return; }
            $("room-dialog").close(); render(); say(result.message);if(wasWorkshop&&WHEEL_ITEMS[choice]){openWorkbench(state.items.at(-1));return;} showJourney(); $("map-feedback").textContent = result.message;
        };
        $("room-dialog").classList.remove("shop-scene","workshop-scene");
        if (state.phase === "shop") {
            renderShop();
        } else if (state.phase === "workshop") {
            $('room-dialog').classList.add('workshop-scene');
            $('room-description').textContent='Ein Werkzeug aufs Haus. Optional: einen Chip prägen lassen. Ein Auftrag pro Werkstatt.';
            const benchButton=journeyButton('CHIP-WERKBANK · Vorschau & Prägung →',()=>feel.openBench());benchButton.id='open-chip-workbench';$('room-actions').append(benchButton);
            const sign=document.createElement('div');sign.className='workshop-room-wheel';wheelPrint(sign,state.wheel);$('room-actions').append(sign);
            workshopChoices(state).forEach(name => add(name + " — " + WHEEL_ITEMS[name].description, () => finish(name), state.items.length >= 2));
            add("Ohne Werkzeug weiter →", () => finish("leave"));
        } else if (state.phase === "event") {
            const event=EVENTS.find(event=>event.id===state.eventId)||EVENTS[0];
            $('room-title').textContent=event.name;$('room-description').textContent=event.text;
            if(event.choices){renderEventChoices(event,finish);}else{
            add(event.safeLabel+' · sicher +'+event.safe+' Münzen',()=>finish('safe'));
            add(event.riskLabel+' · '+Math.round(event.chance*100)+' % +'+event.reward+', sonst bis zu −'+event.loss+' Münzen',()=>finish('risk'));}
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
    const typeNames={chip:'CHIP',relic:'RELIC',item:'RAD-WERKZEUG',mutation:'MUTATION'};
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
        $('token-odds').textContent='Luck '+state.luck+' · '+RARITIES.map((name,index)=>name+' '+formatRate(rarityWeights(state.luck)[index])+' %').join(' · ')+'. Standard: 55 % Chip / 25 % Relic / 20 % Rad-Werkzeug. Luck verändert das Roulette nicht.';
        $('token-inventory').hidden=!!state.pendingToken;
        $('slot-lever').hidden=!!state.pendingToken;
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
            if(!state.tokens.length)$('token-inventory').textContent='Keine alten Tokens · Neue Spins starten direkt im Shop';
            prepareSlot(state.tokens.some(token=>token.id===selectedTokenId)?selectedTokenId:null);
        }
    }
    async function spinSlot(prepared=false) {
        if(tokenAnimating)return;
        if(!prepared){if(selectedTokenId===null)return;const result=beginToken(state,selectedTokenId);if(!result.ok){$('token-feedback').textContent=result.message;return;}}
        if(!state.pendingToken)return;
        selectedTokenId=null;tokenAnimating=true;render();
        $('close-tokens').disabled=true;$('slot-lever').disabled=true;
        $('slot-machine').classList.add('spinning');delete $('slot-machine').dataset.rarity;
        $('slot-status').textContent='DEIN GLÜCK WIRD GEDRUCKT';$('token-inventory').hidden=true;$('token-result').replaceChildren();
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
                    const animation=strip.animate([{transform:'translateY(0)'},{transform:'translateY(-'+count*height+'px)'}],{duration:650+index*250,easing:'cubic-bezier(.12,.68,.12,1)',fill:'forwards'});
                    await animation.finished;animation.cancel();
                }
                strip.replaceChildren(reelTile(final[index]));strip.style.transform='';column.classList.remove('rolling');tone(420+index*170);
            }));
        } finally {
            tokenAnimating=false;$('close-tokens').disabled=false;$('slot-machine').classList.remove('spinning');
            revealToken();renderTokenResult();
        }
    }
    $('slot-lever').addEventListener('click',()=>spinSlot());
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
        const needsTarget=offer.type==='mutation'||(offer.type==='chip'?chipLoad(state)>=chipCapacity(state)+(offer.mutations?.includes('Expanded')?1:0):offer.type==='item'?state.items.length>=2:state.relics.length>=4);
        let target=null;
        const finish=()=>{$('token-dialog').close();render();if(state.phase==='shop')showRoom();};
        const take=journeyButton('ÜBERNEHMEN →',()=>{const result=claimToken(state,target);if(result.ok)finish();else $('token-feedback').textContent=result.message;},needsTarget);
        take.id='claim-token';take.classList.add('purchase-button');
        if(needsTarget){
            const hint=document.createElement('p');hint.textContent=offer.type==='mutation'?'Zielchip wählen':'Inventar voll · Ersatz wählen';pane.append(hint);
            const pool=['chip','mutation'].includes(offer.type)?state.chips:offer.type==='item'?state.items:state.relics;
            pool.forEach(entry=>{
                const locked=offer.type==='mutation'?hasMutation(entry,offer.name):offer.type==='chip'&&hasMutation(entry,'Expanded')&&!offer.mutations?.includes('Expanded')&&chipLoad(state)-(entry.curse?.name==='Heavy'?1:0)>=chipCapacity(state);
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
        $("start-screen").close(); renderBoard(); resetResult(); render(); guide.newRun();say("Dein Run beginnt. Setze deinen ersten Chip.");
    }
    $("start-run").addEventListener("click",()=>{if(runStarted)$("restart-dialog").showModal();else startNewRun();});
    $("cancel-restart").addEventListener("click",()=>$("restart-dialog").close());
    $("confirm-restart").addEventListener("click",()=>{$("restart-dialog").close();startNewRun();});
    restoreSavedRun();renderBoard(); render();
    if(state.lastSpin){$("result").textContent=state.lastSpin.result.number+" · "+({red:"ROT",black:"SCHWARZ",green:"GRÜN"}[state.lastSpin.result.color]);}
    openMenu();
    new ResizeObserver(positionWheelNumbers).observe($("wheel"));
}
