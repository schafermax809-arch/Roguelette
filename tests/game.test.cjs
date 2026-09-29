const {test} = require('node:test');
const assert = require('node:assert/strict');
const g = require('./full-roster.fixture.js');
function win(s,number=1,random=()=>1){
  while(s.phase === "map") { const room=g.FLOOR_MAP[s.mapStep+1][0]; assert(g.enterRoom(s,room.id)); if(s.phase === "shop") assert(g.resolveRoom(s,"leave").ok); }

  s.target=1;g.placeBet(s,s.chips[0].id,'number',number);g.startSpin(s);
  g.resolveSpin(s,s.wheel.find(f=>f.number===number),random);
  // Exercise the grant validator directly; live tables no longer create reward offers.
  s.rewardPending=true;s.rewards=g.tableRewards(s);
}
function item(s,name){const value={id:s.nextItemId++,name};s.items.push(value);return value.id}
test('Polished combines with chip bonuses and streak',()=>{
 const s=g.createState();s.chips[3].mutations.push('Polished');
 assert.equal(g.calculateBetScore({chip:s.chips[3],type:'number',value:1}),450);
 s.chips[5].mutations.push('Polished');s.chips[5].streak=2;
 assert.equal(g.calculateBetScore({chip:s.chips[5],type:'outside',value:'red'}),45);
});
test('Echo rolls once per winning chip and never increments streak twice',()=>{
 const s=g.createState();s.target=9999;const c=s.chips[5];c.mutations=['Polished','Echo'];
 g.placeBet(s,c.id,'outside','red');g.startSpin(s);let rolls=0;
 g.resolveSpin(s,{number:1,color:'red'},()=>{rolls++;return 0});
 assert.equal(rolls,1);assert.equal(c.streak,1);assert.equal(s.spinScore,75);assert(s.breakdown[0].echo);
 g.startSpin(s);g.resolveSpin(s,{number:2,color:'black'},()=>{throw Error('losers must not roll')});
 assert.equal(c.streak,0);assert.equal(s.spinScore,0);
});
test('Echo probability boundary and zero pipeline',()=>{
 const s=g.createState();s.target=9999;s.chips[3].mutations=['Polished','Echo'];
 g.placeBet(s,3,'number',0);g.startSpin(s);g.resolveSpin(s,{number:0,color:'green'},()=>0.249);
 assert.equal(s.spinScore,675);
 g.startSpin(s);g.resolveSpin(s,{number:0,color:'green'},()=>0.25);assert.equal(s.spinScore,337.5);
});
test('One reward per table, duplicate mutation rejection, and persistence',()=>{
 const s=g.createState();win(s);assert.equal(g.nextRound(s),false);
 assert(g.claimReward(s,0,0).ok);assert.equal(g.claimReward(s,0,1).ok,false);
 assert(g.nextRound(s));assert.deepEqual(s.chips[0].mutations,['Polished']);
 win(s);s.rewards=[{type:'mutation',name:'Polished'}];
 assert.equal(g.claimReward(s,0,0).ok,false);assert(s.rewardPending);
 assert(g.claimReward(s,0,1).ok);assert(g.nextRound(s));
 assert.equal(g.skipReward(s),false);
});
test('Lucky is additive, does not change wheel or scores and resets with run',()=>{
 const s=g.createState();const wheel=JSON.stringify(s.wheel);s.chips[0].mutations=['Lucky'];s.chips[1].mutations=['Lucky'];g.updateBuildStats(s);
 assert.equal(s.luck,2);assert.equal(g.calculateBetScore({chip:s.chips[0],type:'number',value:1}),100);
 assert.equal(JSON.stringify(s.wheel),wheel);assert.equal(g.createState().luck,0);
 g.removeChip(s,0);assert.equal(s.luck,1);
});
test('Expanded opens slots, recruits fill them, replacement protects capacity',()=>{
 const s=g.createState();win(s);s.rewards=[{type:'mutation',name:'Expanded'}];assert(g.claimReward(s,0,0).ok);
 assert.equal(g.chipCapacity(s),7);g.nextRound(s);win(s);s.rewards=[{type:'chip',name:'High Roller'}];
 assert(g.claimReward(s,0).ok);assert.equal(s.chips.length,7);assert.equal(s.chips[6].name,'High Roller');
 g.nextRound(s);win(s);s.rewards=[{type:'chip',name:'Basic'}];
 assert.equal(g.claimReward(s,0,0).ok,false);assert.equal(s.chips.length,7);
 assert(g.removeChip(s,0));assert.equal(s.chips.length,6);assert.equal(s.capacity,6);
 assert(g.claimReward(s,0,s.chips[0].id).ok);assert.equal(new Set(s.chips.map(c=>c.id)).size,6);
});
test('Expanded stacks per chip and removal never loses unrelated chips',()=>{
 const s=g.createState();s.chips[0].mutations=['Expanded'];s.chips[1].mutations=['Expanded'];g.updateBuildStats(s);
 assert.equal(s.capacity,8);assert(g.removeChip(s,0));assert.equal(s.capacity,7);assert.equal(s.chips.length,5);
 while(s.chips.length>1)assert(g.removeChip(s,s.chips[0].id));assert.equal(g.removeChip(s,s.chips[0].id),false);
});
test('Item rewards have two slots and require explicit replacement',()=>{
 const s=g.createState();item(s,'Duplicate');item(s,'Delete');win(s);s.rewards=[{type:'item',name:'Clone'}];
 assert.equal(g.claimReward(s,0).ok,false);assert.deepEqual(s.items.map(i=>i.name),['Duplicate','Delete']);
 assert(g.claimReward(s,0,s.items[1].id).ok);assert.deepEqual(s.items.map(i=>i.name),['Duplicate','Clone']);
});
test('Duplicate changes probability and copies are independent',()=>{
 const s=g.createState();const id=item(s,'Duplicate');assert(g.useWheelItem(s,id,1).ok);
 assert.equal(s.wheel.length,20);assert.equal(s.wheel.filter(f=>f.number===1).length,2);assert.equal(s.items.length,0);
 s.wheel[1].color='black';assert.equal(s.wheel[2].color,'red');assert.equal(g.useWheelItem(s,id,1).ok,false);
});
test('Delete returns orphaned number bets but preserves outside bets',()=>{
 const s=g.createState();g.placeBet(s,0,'number',1);g.placeBet(s,1,'outside','red');
 assert(g.useWheelItem(s,item(s,'Delete'),1).ok);assert.equal(s.placedBets.length,1);assert.equal(s.placedBets[0].type,'outside');
 s.wheel=s.wheel.slice(0,6);const id=item(s,'Delete');assert.equal(g.useWheelItem(s,id,0).ok,false);assert(s.items.some(i=>i.id===id));
});
test('Repaint respects zero and winning rules follow new color',()=>{
 const s=g.createState();const id=item(s,'Repaint');assert.equal(g.useWheelItem(s,id,0).ok,false);assert.equal(s.items.length,1);
 assert(g.useWheelItem(s,id,1).ok);assert.equal(s.wheel[1].color,'black');
 assert(g.checkWin({type:'outside',value:'black'},s.wheel[1]));assert(g.checkWin({type:'outside',value:'odd'},s.wheel[1]));
});
test('Rewrite accepts duplicates, preserves nonzero colors and normalizes zero',()=>{
 const s=g.createState();let id=item(s,'Rewrite');
 for(const number of [-1,19,NaN,1.1,Infinity])assert.equal(g.useWheelItem(s,id,1,{number}).ok,false);
 assert(g.useWheelItem(s,id,1,{number:2}).ok);assert.equal(s.wheel.filter(f=>f.number===2).length,2);assert.equal(s.wheel[1].color,'red');
 assert(g.useWheelItem(s,item(s,'Rewrite'),1,{number:0}).ok);assert.equal(s.wheel[1].color,'green');
 assert(g.useWheelItem(s,item(s,'Rewrite'),0,{number:8}).ok);assert.equal(s.wheel[0].color,'black');
});
test('Clone validates source and target and does not alias',()=>{
 const s=g.createState();const id=item(s,'Clone');
 assert.equal(g.useWheelItem(s,id,1,{targetIndex:1}).ok,false);
 assert.equal(g.useWheelItem(s,id,1,{targetIndex:99}).ok,false);
 assert(g.useWheelItem(s,id,1,{targetIndex:2}).ok);assert.deepEqual(s.wheel[1],s.wheel[2]);
 s.wheel[1].color='black';assert.equal(s.wheel[2].color,'red');assert.equal(s.wheel.length,19);
});
test('Mitosis doubles all copies and max size failures are atomic',()=>{
 for(const count of [1,2,5]){
  const s=g.createState();s.wheel.push(...Array.from({length:count-1},()=>({number:1,color:'red'})));
  assert(g.useWheelItem(s,item(s,'Mitosis'),1).ok);assert.equal(s.wheel.filter(f=>f.number===1).length,count*2);
 }
 const s=g.createState();s.wheel=Array.from({length:38},()=>({number:1,color:'red'}));
 const id=item(s,'Mitosis');const before=JSON.stringify(s);assert.equal(g.useWheelItem(s,id,0).ok,false);assert.equal(JSON.stringify(s),before);
});
test('Spinning locks wheel edits and chip removal',()=>{
 const s=g.createState();const id=item(s,'Duplicate');g.placeBet(s,0,'number',1);g.startSpin(s);
 assert.equal(g.useWheelItem(s,id,1).ok,false);assert.equal(g.removeChip(s,0),false);assert.equal(s.wheel.length,19);
});
test('Rewards progress through all mutation and wheel item types',()=>{
 const s=g.createState();const mutations=new Set(),items=new Set();
 for(let round=1;round<=12;round++){s.round=round;const offers=g.tableRewards(s);mutations.add(offers[0].name);items.add(offers[2].name)}
 assert.equal(mutations.size,4);assert.equal(items.size,6);
});
