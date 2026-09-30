const test=require('node:test'),assert=require('node:assert/strict'),g=require('../script.js'),feel=require('../feel.js');
test('Scoring events reflect actual chip, mutation, relic and zero results without awarding again',()=>{
 const s=g.createState(()=>0);s.chips=[g.createChip(g.CHIP_CATALOG.find(c=>c.name==='Crimson'),0)];s.chips[0].mutations=['Polished','Echo'];s.relics=[{id:0,name:'Blood Pact'}];
 g.placeBet(s,0,'outside','red');g.startSpin(s);g.resolveSpin(s,{number:7,color:'red'},()=>0);
 assert.equal(s.spinScore,135);const before=JSON.stringify(s),events=feel.scoringEvents(s);
 assert.deepEqual(events.filter(e=>e.kind==='chip').map(e=>e.label),['×1,5','×1,5','+45']);assert.equal(events.find(e=>e.kind==='relic').name,'Blood Pact');assert.equal(events.at(-1).value,135);assert.equal(JSON.stringify(s),before);
 const zero=g.createState(()=>0);g.placeBet(zero,0,'number',0);g.startSpin(zero);g.resolveSpin(zero,{number:0,color:'green'});assert(feel.scoringEvents(zero).some(e=>e.name==='Null-Regel'));assert.equal(feel.scoringEvents(zero).at(-1).value,75);
});
test('No-hit and large scores create finite, truthful event queues',()=>{
 const s=g.createState(()=>0);g.placeBet(s,0,'outside','red');g.startSpin(s);g.resolveSpin(s,{number:2,color:'black'});assert.equal(feel.scoringEvents(s).at(-1).value,0);assert.equal(feel.scoringEvents(s).filter(e=>e.kind==='chip').length,0);
 s.lastSpin.finalScore=1e9;assert.equal(feel.scoringEvents(s).at(-1).value,1e9);
});
test('Slot capacity purchase is immediate, persistent, bounded and never targets a chip',()=>{
 const s=g.createState(()=>0);s.phase='map';s.mapStep=1;s.currentRoom='table-2';s.visited=['entry','table-2'];g.enterRoom(s,'shop',()=>0);s.coins=1000;
 for(let i=0;i<6;i++){const price=g.slotUpgradePrice(s),coins=s.coins;assert(g.buySlotUpgrade(s).ok);assert.equal(s.coins,coins-price);assert.equal(s.capacity,7+i);}
 const snapshot=JSON.stringify(s);assert(!g.buySlotUpgrade(s).ok);assert.equal(JSON.stringify(s),snapshot);assert.equal(g.decodeRun(g.encodeRun(s)).state.slotUpgrades,6);
 const old=g.createState(()=>0);delete old.slotUpgrades;delete old.workshopServiced;assert(g.decodeRun(g.encodeRun(old)).ok);
});
test('Chip work is atomic, preview-only until confirmed, once per room and save compatible',()=>{
 const s=g.createState(()=>0),room=s.map.flat().find(r=>r.type==='workshop');s.phase='workshop';s.currentRoom=room.id;s.mapStep=s.map.findIndex(row=>row.includes(room));s.visited=[room.id];s.coins=20;
 const before=JSON.stringify(s);assert(g.previewChipWork(s,0,'Polished').ok);assert.equal(JSON.stringify(s),before);assert(!g.applyChipWork(s,99,'Polished').ok);assert.equal(JSON.stringify(s),before);
 assert(g.applyChipWork(s,0,'Polished').ok);assert.equal(s.coins,12);assert.deepEqual(s.chips[0].mutations,['Polished']);assert(!g.applyChipWork(s,0,'Echo').ok);
 const saved=g.decodeRun(g.encodeRun(s));assert(saved.ok);assert(!g.applyChipWork(saved.state,0,'Echo').ok);
});
