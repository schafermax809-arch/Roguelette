const {test}=require('node:test');
const assert=require('node:assert/strict');
const g=require('./full-roster.fixture.js');
function equip(s,...names){s.relics=names.map((name,id)=>({id,name}));s.nextRelicId=names.length}
function spin(s,number,color='red',rng=()=>1){assert(g.startSpin(s));assert(g.resolveSpin(s,{number,color},rng))}
function readyReward(s,name){s.phase='won';s.rewardPending=true;s.rewards=[{type:'relic',name}]}
test('Empty and inert test relics do not change scoring',()=>{
 const context={result:{number:1,color:'red'},winners:1,bets:1,retriggerScore:100,families:new Set(['number'])};
 assert.equal(g.applyRelics([],context,100).score,100);
 const result=g.applyRelics([{id:0,name:'Test Relic'}],context,100);
 assert.equal(result.score,100);assert.equal(result.trace[0].triggered,false);
});
test('Blood Pact follows actual wheel color, including recolored even numbers',()=>{
 for(const [color,expected] of [['red',150],['black',100]]){
  const s=g.createState();equip(s,'Blood Pact');g.placeBet(s,0,'number',2);spin(s,2,color);assert.equal(s.spinScore,expected);
 }
});
test('Lucky Seven adds one winning chip valuation, with no Echo or Streak recursion',()=>{
 const s=g.createState();equip(s,'Lucky Seven');s.chips[5].mutations=['Polished','Echo'];g.placeBet(s,5,'number',7);
 let rolls=0;spin(s,7,'red',()=>{rolls++;return 0});
 assert.equal(rolls,1);assert.equal(s.chips[5].streak,1);
 assert.equal(s.lastSpin.chipScore,375);assert.equal(s.spinScore,562.5);
 assert.equal(s.relicTrace[0].after-s.relicTrace[0].before,187.5);
});
test('Lucky Seven includes every winning chip but no losing chip',()=>{
 const s=g.createState();equip(s,'Lucky Seven');g.placeBet(s,0,'number',7);g.placeBet(s,1,'outside','red');g.placeBet(s,2,'outside','even');
 spin(s,7);assert.equal(s.lastSpin.winners,2);assert.equal(s.spinScore,260);
 const t=g.createState();equip(t,'Lucky Seven');g.placeBet(t,0,'number',1);spin(t,7);
 assert.equal(t.spinScore,0);assert.equal(t.relicTrace[0].triggered,false);
});
test('Relic order changes additive-versus-multiplicative results',()=>{
 const values=[];
 for(const names of [['Blood Pact','Lucky Seven'],['Lucky Seven','Blood Pact']]){
  const s=g.createState();equip(s,...names);g.placeBet(s,0,'number',7);spin(s,7);values.push(s.spinScore);
  assert.deepEqual(s.relicTrace.map(r=>r.name),names);
 }
 assert.deepEqual(values,[250,300]);
});
test('Lone Wolf counts original winning chips, not Echo or Seven triggers',()=>{
 const s=g.createState();equip(s,'Lucky Seven','Lone Wolf');s.chips[0].mutations=['Echo'];g.placeBet(s,0,'number',7);g.placeBet(s,1,'outside','black');
 spin(s,7,'red',()=>0);assert.equal(s.spinScore,900);assert.equal(s.lastSpin.winners,1);
 const t=g.createState();equip(t,'Lone Wolf');g.placeBet(t,0,'number',7);g.placeBet(t,1,'number',7);spin(t,7);
 assert.equal(t.spinScore,200);assert.equal(t.relicTrace[0].triggered,false);
});
test('Full Coverage groups opposite outside bets together',()=>{
 const s=g.createState();equip(s,'Full Coverage');
 for(const [id,value] of [[0,'red'],[1,'black'],[2,'odd'],[3,'even']])g.placeBet(s,id,'outside',value);
 spin(s,7);assert.equal(s.lastSpin.families.length,2);assert.equal(s.relicTrace[0].triggered,false);
});
test('Full Coverage requires all four families and at least one winner',()=>{
 const s=g.createState();equip(s,'Full Coverage');g.placeBet(s,0,'number',2);g.placeBet(s,1,'outside','red');g.placeBet(s,2,'outside','even');g.placeBet(s,3,'outside','low');
 spin(s,7);assert.equal(s.lastSpin.chipScore,50);assert.equal(s.spinScore,75);assert(s.relicTrace[0].triggered);
 const t=g.createState();equip(t,'Full Coverage');g.placeBet(t,0,'number',2);g.placeBet(t,1,'outside','black');g.placeBet(t,2,'outside','even');g.placeBet(t,3,'outside','high');
 spin(t,7);assert.equal(t.lastSpin.families.length,4);assert.equal(t.spinScore,0);assert.equal(t.relicTrace[0].triggered,false);
});
test('Jackpot needs at least two placed chips and every placed chip must win',()=>{
 for(const [bets,expected] of [[[1],100],[[1,1],400],[[1,2],100]]){
  const s=g.createState();equip(s,'Jackpot');bets.forEach((value,id)=>g.placeBet(s,id,'number',value));spin(s,1);assert.equal(s.spinScore,expected);
 }
});
test('Zero penalty is applied after all relics and recorded separately',()=>{
 const s=g.createState();equip(s,'Blood Pact','Lucky Seven','Jackpot');g.placeBet(s,0,'number',0);g.placeBet(s,3,'number',0);spin(s,0,'green');
 assert.equal(s.lastSpin.chipScore,400);assert.equal(s.lastSpin.relicScore,800);assert.equal(s.spinScore,600);
 assert.deepEqual(s.relicTrace.map(r=>r.triggered),[false,false,true]);assert.equal(s.lastSpin.zeroMultiplier,.75);
});
test('Moving relics respects boundaries, IDs and game locks',()=>{
 const s=g.createState();equip(s,'Blood Pact','Lucky Seven','Lone Wolf');
 assert.equal(g.moveRelic(s,0,-1),false);assert.equal(g.moveRelic(s,2,1),false);assert.equal(g.moveRelic(s,99,1),false);assert.equal(g.moveRelic(s,0,2),false);
 assert(g.moveRelic(s,0,1));assert.deepEqual(s.relics.map(r=>r.name),['Lucky Seven','Blood Pact','Lone Wolf']);
 g.placeBet(s,0,'number',1);g.startSpin(s);const before=JSON.stringify(s.relics);
 assert.equal(g.moveRelic(s,0,-1),false);assert.equal(g.removeRelic(s,0),false);assert.equal(JSON.stringify(s.relics),before);
});
test('Four relic slots, duplicate rejection and explicit replacement preserve order',()=>{
 const s=g.createState();
 for(const name of Object.keys(g.RELIC_TYPES).slice(0,4)){readyReward(s,name);assert(g.claimReward(s,0).ok)}
 readyReward(s,'Jackpot');assert.equal(g.claimReward(s,0).ok,false);assert.equal(s.relics.length,4);
 assert(g.claimReward(s,0,s.relics[1].id).ok);assert.deepEqual(s.relics.map(r=>r.name),['Blood Pact','Jackpot','Lone Wolf','Full Coverage']);
 readyReward(s,'Jackpot');const before=JSON.stringify(s);assert.equal(g.claimReward(s,0,s.relics[0].id).ok,false);assert.equal(JSON.stringify(s),before);
 assert(g.removeRelic(s,s.relics[1].id));assert.equal(s.relics.length,3);assert.equal(g.removeRelic(s,999),false);
});
test('Relics persist across tables but clear on new run, and traces reset',()=>{
 const s=g.createState();equip(s,'Blood Pact');g.placeBet(s,0,'number',1);spin(s,1);assert(s.lastSpin);g.skipReward(s);assert(g.nextRound(s));assert(g.enterRoom(s,"table-2"));
 assert.equal(s.relics[0].name,'Blood Pact');assert.equal(s.lastSpin,null);assert.deepEqual(s.relicTrace,[]);assert.deepEqual(g.createState().relics,[]);
});
test('Moving relics never rewrites the previous spin history',()=>{
 const s=g.createState();equip(s,'Blood Pact','Lucky Seven');g.placeBet(s,0,'number',7);spin(s,7);
 const trace=JSON.stringify(s.relicTrace);const score=s.spinScore;assert(g.moveRelic(s,0,1));assert.equal(JSON.stringify(s.relicTrace),trace);assert.equal(s.spinScore,score);
});
test('Reward menu contains a fourth option and avoids owned relics',()=>{
 const s=g.createState();equip(s,'Blood Pact','Lucky Seven','Lone Wolf','Full Coverage');
 for(let round=1;round<=10;round++){s.round=round;const offers=g.tableRewards(s);assert.equal(offers.length,4);assert.equal(offers[3].type,'relic');assert(g.RELIC_TYPES[offers[3].name]);assert(!s.relics.some(r=>r.name===offers[3].name))}
});
